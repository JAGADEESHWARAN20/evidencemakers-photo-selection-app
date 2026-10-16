/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { GalleryAsset } from '../../types/asset.ts';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  RotateCcw,
  Sparkles,
  MessageSquare,
  X,
  LayoutGrid,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

interface SwipeCuratorDeckProps {
  assets: GalleryAsset[];
  projectId: string;
  selectionLimit: number;
  isSelectionLocked: boolean;
  onToggleSelection: (asset: GalleryAsset, e: React.MouseEvent) => void;
  onOpenDetail: (asset: GalleryAsset) => void;
  onSwitchToGrid?: () => void;
}

interface SwipeHistoryItem {
  index: number;
  assetId: string;
  previousSelected: boolean;
  action: 'select' | 'pass';
}

export const SwipeCuratorDeck: React.FC<SwipeCuratorDeckProps> = ({
  assets,
  selectionLimit,
  isSelectionLocked,
  onToggleSelection,
  onOpenDetail,
  onSwitchToGrid,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [history, setHistory] = useState<SwipeHistoryItem[]>([]);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const selectedCount = assets.filter((a) => a.isSelected).length;
  const currentAsset = assets[currentIndex];
  const nextAsset = assets[currentIndex + 1];
  const thirdAsset = assets[currentIndex + 2];

  // Motion values for swipe drag physics
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-18, 18]);
  const opacitySelectBadge = useTransform(x, [35, 110], [0, 1]);
  const opacityPassBadge = useTransform(x, [-35, -110], [0, 1]);

  // Touch event tracking for native mobile gesture fallback
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Detect predominantly horizontal swipe (minimum 45px)
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX > 0) {
        handleSwipeRightSelect();
      } else {
        handleSwipeLeftPass();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleNext = () => {
    if (currentIndex < assets.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrevious = () => {
    if (isFinished) {
      setIsFinished(false);
      return;
    }
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSwipeRightSelect = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentAsset || isFinished) return;

    const wasSelected = currentAsset.isSelected;
    if (!wasSelected && !isSelectionLocked) {
      onToggleSelection(currentAsset, { stopPropagation: () => {} } as any);
    }

    setHistory((prev) => [
      ...prev,
      {
        index: currentIndex,
        assetId: currentAsset.id,
        previousSelected: wasSelected,
        action: 'select',
      },
    ]);

    setSwipeDirection('right');
    setTimeout(() => {
      setSwipeDirection(null);
      x.set(0);
      handleNext();
    }, 220);
  };

  const handleSwipeLeftPass = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentAsset || isFinished) return;

    setHistory((prev) => [
      ...prev,
      {
        index: currentIndex,
        assetId: currentAsset.id,
        previousSelected: currentAsset.isSelected,
        action: 'pass',
      },
    ]);

    setSwipeDirection('left');
    setTimeout(() => {
      setSwipeDirection(null);
      x.set(0);
      handleNext();
    }, 220);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastAction = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));

    const targetAsset = assets.find((a) => a.id === lastAction.assetId);
    if (targetAsset && targetAsset.isSelected !== lastAction.previousSelected && !isSelectionLocked) {
      onToggleSelection(targetAsset, { stopPropagation: () => {} } as any);
    }

    setIsFinished(false);
    setCurrentIndex(lastAction.index);
    x.set(0);
  };

  // Keyboard navigation for desktop users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((document.activeElement?.tagName || '').toLowerCase())) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSwipeRightSelect();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSwipeLeftPass();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (currentAsset) {
          onToggleSelection(currentAsset, { stopPropagation: () => {} } as any);
        }
      } else if (e.key === 'x' || e.key === 'X' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleSwipeLeftPass();
      } else if (e.key === 'z' || e.key === 'Z' || e.key === 'u' || e.key === 'U' || e.key === 'Backspace') {
        e.preventDefault();
        handleUndo();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        if (currentAsset) onOpenDetail(currentAsset);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentAsset, history, isFinished, isSelectionLocked, onToggleSelection]);

  if (!currentAsset || assets.length === 0) {
    return (
      <div className="p-12 sm:p-16 text-center text-[#8C8C8C] bg-[#101010] border border-[#242424] rounded-2xl space-y-4">
        <Sparkles className="w-10 h-10 text-[#F5B82E] mx-auto opacity-70" />
        <h3 className="text-xl font-editorial text-white">No photographs in this collection</h3>
        <p className="text-xs sm:text-sm text-[#8C8C8C] max-w-sm mx-auto">
          Try switching to another folder or clearing active filters to view photos.
        </p>
        {onSwitchToGrid && (
          <button
            type="button"
            onClick={onSwitchToGrid}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-black bg-[#F5B82E] hover:bg-[#E2A622] rounded-xl transition-all"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Return to Gallery Grid</span>
          </button>
        )}
      </div>
    );
  }

  // Completion Screen when deck is fully reviewed
  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto p-8 sm:p-12 bg-[#121212] border border-[#F5B82E]/40 rounded-3xl text-center space-y-6 shadow-2xl animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-[#F5B82E]/10 border border-[#F5B82E]/30 flex items-center justify-center mx-auto text-[#F5B82E]">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl font-editorial font-bold text-white">
            Collection Curation Complete
          </h3>
          <p className="text-sm text-[#8C8C8C] max-w-md mx-auto">
            You've reviewed all <strong className="text-white">{assets.length}</strong> photographs in this folder using the swipe curator.
          </p>
        </div>

        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-[#181818] border border-[#2A2A2A]">
          <span className="text-xs text-[#8C8C8C] uppercase tracking-wider font-semibold">Album Status:</span>
          <span className="text-lg font-editorial font-bold text-[#F5B82E] tabular-nums">
            {selectedCount} / {selectionLimit} selected
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] border border-[#333333] text-xs font-medium text-white transition-all"
          >
            <RotateCcw className="w-4 h-4 text-[#F5B82E]" />
            <span>Undo Last Action</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentIndex(0);
              setIsFinished(false);
              x.set(0);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1C1C] hover:bg-[#252525] border border-[#333333] text-xs font-medium text-white transition-all"
          >
            <span>Review Deck Again</span>
          </button>

          {onSwitchToGrid && (
            <button
              type="button"
              onClick={onSwitchToGrid}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F5B82E] hover:bg-[#E2A622] text-black font-semibold text-xs transition-all shadow-lg"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>View Full Gallery Grid</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  const progressPercent = Math.min(100, Math.round(((currentIndex + 1) / assets.length) * 100));

  return (
    <div className="space-y-6 font-sans select-none pb-8">
      {/* Top Deck Info & Quick Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-1 sm:px-2">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181818] border border-[#282828] text-xs text-[#E5E5E5] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#F5B82E] animate-pulse" />
            <span className="font-semibold tracking-wide">Swipe Curator</span>
            <span className="text-[10px] text-[#F5B82E] font-mono px-1.5 py-0.2 bg-[#F5B82E]/10 rounded">
              Mobile &amp; Desktop
            </span>
          </div>

          <span className="text-xs text-[#8C8C8C] font-mono">
            Photo <strong className="text-white text-sm">{currentIndex + 1}</strong> of {assets.length}
          </span>

          <button
            type="button"
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="text-[11px] text-[#8C8C8C] hover:text-[#F5B82E] flex items-center gap-1 transition-colors underline decoration-dotted"
            title="View keyboard and touch shortcuts"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">How to swipe</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="hidden md:flex items-center gap-2 text-xs text-[#8C8C8C]">
            <span className="px-2 py-0.5 rounded bg-[#1A1A1A] border border-[#2A2A2A] text-[11px] font-mono">
              &larr; Swipe Left to Pass
            </span>
            <span className="px-2 py-0.5 rounded bg-[#F5B82E]/10 border border-[#F5B82E]/20 text-[#F5B82E] text-[11px] font-mono font-medium">
              Swipe Right to Select &rarr;
            </span>
          </div>
          <span className="font-mono text-[#F5B82E] font-semibold bg-[#121212] border border-[#262626] px-3 py-1 rounded-md shadow-inner">
            {selectedCount} / {selectionLimit} selected
          </span>
        </div>
      </div>

      {/* Helpful Shortcuts & Instructions Popout */}
      {showShortcuts && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 bg-[#141414] border border-[#282828] rounded-xl text-xs text-[#A3A3A3] grid grid-cols-2 sm:grid-cols-4 gap-3 shadow-lg"
        >
          <div>
            <strong className="text-[#F5B82E] block font-mono">Swipe Right / &rarr;</strong>
            <span>Select &amp; keep for album</span>
          </div>
          <div>
            <strong className="text-white block font-mono">Swipe Left / &larr; / X</strong>
            <span>Pass &amp; skip to next photo</span>
          </div>
          <div>
            <strong className="text-white block font-mono">Space / Click Check</strong>
            <span>Toggle selection directly</span>
          </div>
          <div>
            <strong className="text-white block font-mono">Z / U / Backspace</strong>
            <span>Undo last swipe action</span>
          </div>
        </motion.div>
      )}

      {/* Main Swipeable 3D Deck Stage */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-2xl mx-auto h-[480px] sm:h-[580px] flex items-center justify-center touch-pan-y perspective-[1000px]"
      >
        {/* Layer 3: Third card in stack depth */}
        {thirdAsset && (
          <div className="absolute inset-0 z-0 scale-[0.88] translate-y-7 rounded-2xl overflow-hidden bg-[#0A0A0A] border border-[#1A1A1A] pointer-events-none opacity-25 shadow-2xl transition-all duration-300">
            <img
              src={thirdAsset.previewUrl}
              alt=""
              className="w-full h-full object-cover blur-[2px]"
            />
          </div>
        )}

        {/* Layer 2: Second card in stack depth */}
        {nextAsset && (
          <div className="absolute inset-0 z-10 scale-[0.94] translate-y-3.5 rounded-2xl overflow-hidden bg-[#111111] border border-[#242424] pointer-events-none opacity-55 shadow-2xl transition-all duration-300">
            <img
              src={nextAsset.previewUrl}
              alt=""
              className="w-full h-full object-cover blur-[0.8px]"
            />
          </div>
        )}

        {/* Layer 1: Top Interactive Active Card (Touch drag on mobile, Mouse drag on desktop) */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentAsset.id}
            style={{ x, rotate }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={(_, info) => {
              if (info.offset.x > 60 || info.velocity.x > 200) {
                handleSwipeRightSelect();
              } else if (info.offset.x < -60 || info.velocity.x < -200) {
                handleSwipeLeftPass();
              }
            }}
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              x: swipeDirection === 'right' ? 480 : swipeDirection === 'left' ? -480 : 0,
            }}
            exit={{
              scale: 0.88,
              opacity: 0,
              x: swipeDirection === 'right' ? 540 : -540,
              rotate: swipeDirection === 'right' ? 20 : -20,
              transition: { duration: 0.22, ease: 'easeOut' },
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className={`relative z-20 w-full h-full bg-[#121212] border-2 rounded-2xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing ${
              currentAsset.isSelected
                ? 'border-[#F5B82E] ring-4 ring-[#F5B82E]/25 shadow-[#F5B82E]/15'
                : 'border-[#292929] hover:border-[#383838]'
            }`}
          >
            {/* Visual Drag Stamp: SELECT FOR ALBUM (Gold, Left Top) - appears dynamically on swipe right */}
            <motion.div
              style={{ opacity: opacitySelectBadge }}
              className="absolute top-6 left-6 z-30 px-4 py-2 border-2 border-[#F5B82E] bg-black/90 backdrop-blur-md rounded-xl text-[#F5B82E] font-bold text-xs sm:text-sm tracking-widest uppercase transform -rotate-12 shadow-2xl pointer-events-none flex items-center gap-2"
            >
              <Check className="w-5 h-5 stroke-[3.5]" />
              <span>SELECT FOR ALBUM</span>
            </motion.div>

            {/* Visual Drag Stamp: PASS / NEXT (Muted Silver, Right Top) - appears dynamically on swipe left */}
            <motion.div
              style={{ opacity: opacityPassBadge }}
              className="absolute top-6 right-6 z-30 px-4 py-2 border-2 border-white/60 bg-black/90 backdrop-blur-md rounded-xl text-white font-bold text-xs sm:text-sm tracking-widest uppercase transform rotate-12 shadow-2xl pointer-events-none flex items-center gap-2"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
              <span>PASS / NEXT</span>
            </motion.div>

            {/* High-Resolution Photo Image Container */}
            <div className="w-full h-[calc(100%-84px)] bg-[#080808] relative overflow-hidden flex items-center justify-center">
              <img
                src={currentAsset.previewUrl}
                alt={currentAsset.baseFilename}
                referrerPolicy="no-referrer"
                draggable={false}
                className="w-full h-full object-cover select-none pointer-events-none"
              />

              {/* Direct Corner Toggle Button */}
              <button
                type="button"
                onClick={(e) => onToggleSelection(currentAsset, e)}
                disabled={isSelectionLocked}
                className={`absolute top-4 right-4 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95 ${
                  currentAsset.isSelected
                    ? 'bg-[#F5B82E] text-black scale-105 shadow-[#F5B82E]/40'
                    : 'bg-black/75 hover:bg-black text-white/80 hover:text-white border border-white/20 backdrop-blur-md'
                }`}
                aria-label="Toggle photo selection for album"
                title="Toggle selection directly"
              >
                <Check
                  className={`w-6 h-6 ${currentAsset.isSelected ? 'stroke-[3.5] text-black' : 'opacity-70'}`}
                />
              </button>

              {/* Fullscreen Magnify Lightbox Trigger */}
              <button
                type="button"
                onClick={() => onOpenDetail(currentAsset)}
                className="absolute bottom-4 right-4 z-20 p-2.5 rounded-xl bg-black/75 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-all hover:scale-105 shadow-lg flex items-center gap-1.5 text-xs"
                title="View full-resolution lightbox & retouch notes"
              >
                <Maximize2 className="w-4 h-4 text-[#F5B82E]" />
                <span className="hidden sm:inline font-medium">Inspect</span>
              </button>

              {/* Mobile Swipe Gesture Hint Overlay */}
              <div className="sm:hidden absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md text-[11px] text-[#D4D4D4] pointer-events-none border border-white/10 flex items-center gap-1.5 shadow-lg">
                <span className="text-[#A3A3A3]">&larr; Swipe left to pass</span>
                <span className="text-[#333333]">&middot;</span>
                <span className="text-[#F5B82E] font-medium">Swipe right to select &rarr;</span>
              </div>
            </div>

            {/* Bottom Card Editorial Metadata Bar */}
            <div className="h-[84px] px-5 sm:px-7 bg-[#111111] flex items-center justify-between border-t border-[#222222]">
              <div className="space-y-1">
                <span className="font-mono text-sm sm:text-base font-semibold text-white block tracking-wide">
                  {currentAsset.baseFilename}
                </span>
                <span className="text-[11px] text-[#8C8C8C] uppercase tracking-wider block font-medium">
                  {currentAsset.category.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {currentAsset.commentCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#1C1C1C] border border-[#2E2E2E] text-[#F5B82E] text-xs font-medium">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{currentAsset.commentCount}</span>
                  </span>
                )}
                {currentAsset.isSelected && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F5B82E] bg-[#F5B82E]/10 border border-[#F5B82E]/30 px-3 py-1 rounded-lg">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>In Album</span>
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Ergonomic Tactile Action Controller (Works on Mobile Touch and Desktop Mouse) */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-between gap-3 pt-3">
        {/* Undo Button */}
        <button
          type="button"
          onClick={handleUndo}
          disabled={history.length === 0}
          className="flex-none p-3 rounded-xl bg-[#141414] hover:bg-[#1E1E1E] disabled:opacity-30 border border-[#262626] text-[#A3A3A3] hover:text-white transition-all min-h-[50px] min-w-[50px] flex items-center justify-center shadow-md active:scale-95"
          title={`Undo last swipe action (${history.length} in history) [Z / U]`}
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Swipe Left Button (Pass / Skip) */}
        <button
          type="button"
          onClick={() => handleSwipeLeftPass()}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#181818] hover:bg-[#222222] border border-[#2D2D2D] hover:border-[#404040] text-xs font-semibold text-[#A3A3A3] hover:text-white transition-all min-h-[50px] active:scale-95 shadow-md"
          title="Swipe card left to pass without selecting (Left Arrow / X)"
        >
          <ArrowLeft className="w-4 h-4 text-[#8C8C8C]" />
          <span>Swipe Left (Pass)</span>
        </button>

        {/* Swipe Right Button (Select for Album - Luminous Gold CTA) */}
        <button
          type="button"
          onClick={() => handleSwipeRightSelect()}
          disabled={isSelectionLocked}
          className={`flex-[1.4] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all min-h-[50px] active:scale-95 shadow-xl ${
            currentAsset.isSelected
              ? 'bg-[#181818] border-2 border-[#F5B82E] text-[#F5B82E]'
              : 'bg-[#F5B82E] hover:bg-[#E2A622] text-black shadow-[#F5B82E]/25 hover:scale-[1.02]'
          }`}
          title="Swipe card right to select photo for album (Right Arrow / Space)"
        >
          <span>Swipe Right (Select)</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Linear Deck Progress Indicator */}
      <div className="w-full max-w-xl mx-auto space-y-1.5 pt-2">
        <div className="w-full bg-[#161616] h-2 rounded-full overflow-hidden border border-[#242424]">
          <div
            className="bg-[#F5B82E] h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#8C8C8C]">
          <span>Progress in this folder</span>
          <span className="font-mono text-[#F5B82E]">{progressPercent}%</span>
        </div>
      </div>

      {/* Horizontally Scrollable / Swipeable Mini Filmstrip Reel */}
      <div className="w-full max-w-2xl mx-auto pt-2">
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 scroll-smooth no-scrollbar touch-pan-x">
          {assets.map((item, idx) => {
            const isCurrent = idx === currentIndex && !isFinished;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsFinished(false);
                  x.set(0);
                }}
                className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border transition-all ${
                  isCurrent
                    ? 'border-[#F5B82E] ring-2 ring-[#F5B82E]/50 scale-105 shadow-lg'
                    : 'border-[#262626] opacity-55 hover:opacity-100 hover:scale-[1.02]'
                }`}
              >
                <img
                  src={item.previewUrl}
                  alt={item.baseFilename}
                  className="w-full h-full object-cover"
                />
                {item.isSelected && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-[#F5B82E] rounded-full flex items-center justify-center text-black shadow">
                    <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                  </div>
                )}
                <span className="absolute bottom-1 left-1 px-1 py-0.2 bg-black/70 rounded text-[9px] font-mono text-white/90">
                  {idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
