/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryAsset } from '../../types/asset.ts';
import { ImageChatPanel } from '../chat/ImageChatPanel.tsx';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  MessageSquare,
  Camera,
} from 'lucide-react';

interface PhotoLightboxProps {
  asset: GalleryAsset;
  assets: GalleryAsset[];
  projectId: string;
  clientName: string;
  activeRole: 'admin' | 'client';
  isSelectionLocked: boolean;
  onToggleSelection: (assetId: string) => void;
  onClose: () => void;
  onNavigate: (newAsset: GalleryAsset) => void;
  onMessageSent: () => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  asset,
  assets,
  projectId,
  clientName,
  activeRole,
  isSelectionLocked,
  onToggleSelection,
  onClose,
  onNavigate,
  onMessageSent,
}) => {
  const [showChat, setShowChat] = useState(false);
  const [showExif, setShowExif] = useState(false);
  const [direction, setDirection] = useState<number>(0);

  // Detect screen size on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setShowChat(true);
    }
  }, []);

  const currentIndex = assets.findIndex((a) => a.id === asset.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < assets.length - 1;

  const goToPrevious = () => {
    if (hasPrevious) {
      setDirection(-1);
      onNavigate(assets[currentIndex - 1]);
    }
  };

  const goToNext = () => {
    if (hasNext) {
      setDirection(1);
      onNavigate(assets[currentIndex + 1]);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === ' ' && !['input', 'textarea'].includes((document.activeElement?.tagName || '').toLowerCase())) {
        e.preventDefault();
        onToggleSelection(asset.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, assets, asset.id, onClose, onToggleSelection]);

  // Touch swipe fallback
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

    // Horizontal swipe threshold
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0 && hasNext) {
        goToNext();
      } else if (deltaX > 0 && hasPrevious) {
        goToPrevious();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 320 : dir < 0 ? -320 : 0,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 350, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -320 : 320,
      opacity: 0,
      scale: 0.96,
      transition: {
        x: { type: 'spring' as const, stiffness: 350, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo viewer: ${asset.baseFilename}`}
      className="fixed inset-0 z-50 flex bg-[#0A0A0A]/98 backdrop-blur-md overflow-hidden font-sans select-none"
    >
      {/* Main Image Stage */}
      <div className="flex-1 flex flex-col h-full relative min-w-0">
        {/* Top Control Bar */}
        <div className="h-14 sm:h-16 border-b border-[#27272A] px-3 sm:px-6 flex items-center justify-between bg-[#0A0A0A] shrink-0 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 font-sans">
            <span className="text-xs sm:text-sm font-semibold text-white tracking-wider truncate max-w-[100px] sm:max-w-[200px]">
              {asset.baseFilename}
            </span>
            <span className="text-[#333333]">·</span>
            <span className="text-xs text-[#A1A1AA] tabular-nums whitespace-nowrap">
              {currentIndex + 1}/{assets.length}
            </span>
            {asset.rawExtension && (
              <span className="hidden sm:inline text-[10px] text-[#D4AF37] border border-[#D4AF37]/30 px-1.5 py-0.5 rounded">
                RAW {asset.rawExtension}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 font-sans shrink-0">
            {/* Selection Action Button */}
            <button
              onClick={() => onToggleSelection(asset.id)}
              disabled={isSelectionLocked}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors min-h-[36px] sm:min-h-[40px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                asset.isSelected
                  ? 'bg-[#D4AF37] hover:bg-[#C5A028] text-black font-semibold shadow'
                  : 'bg-[#121212] hover:bg-[#181818] text-[#A1A1AA] hover:text-white border border-[#27272A]'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${asset.isSelected ? 'stroke-[3]' : 'opacity-40'}`} />
              <span className="hidden sm:inline">
                {asset.isSelected ? 'Selected for Album' : 'Select for Album'}
              </span>
              <span className="sm:hidden">
                {asset.isSelected ? 'Selected' : 'Select'}
              </span>
            </button>

            {/* Toggle Info / EXIF button */}
            {asset.exif && (
              <button
                onClick={() => setShowExif(!showExif)}
                className={`p-2 rounded-lg transition-colors min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                  showExif ? 'text-[#D4AF37] bg-[#181818]' : 'text-[#A1A1AA] hover:text-white'
                }`}
                title="Camera &amp; EXIF data"
                aria-label="Camera and EXIF details"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}

            {/* Toggle Chat Panel button */}
            <button
              onClick={() => setShowChat(!showChat)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors min-h-[36px] sm:min-h-[40px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                showChat ? 'text-[#D4AF37] bg-[#181818]' : 'text-[#A1A1AA] hover:text-white bg-[#121212] border border-[#27272A]'
              }`}
              title="Toggle picture chat notes"
              aria-label="Toggle photo notes chat"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs">Notes</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-[#A1A1AA] hover:text-white bg-[#121212] hover:bg-[#181818] border border-[#27272A] rounded-lg transition-colors min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center ml-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              aria-label="Close viewer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Center Swipeable Stage */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex-1 relative flex items-center justify-center p-2 sm:p-4 overflow-hidden touch-pan-y"
        >
          {/* Previous Arrow Button */}
          {hasPrevious && (
            <button
              onClick={goToPrevious}
              className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/75 hover:bg-black text-white hover:text-[#D4AF37] transition-all min-w-[46px] min-h-[46px] items-center justify-center border border-white/10 hover:border-[#D4AF37]/40 shadow-xl"
              aria-label="Previous photograph"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Swipeable Framer Motion Image Container */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <AnimatePresence custom={direction} mode="popLayout">
              <motion.div
                key={asset.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.65}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60 && hasNext) {
                    goToNext();
                  } else if (info.offset.x > 60 && hasPrevious) {
                    goToPrevious();
                  }
                }}
                className="relative max-h-full max-w-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
              >
                <img
                  src={asset.previewUrl}
                  alt={asset.baseFilename}
                  referrerPolicy="no-referrer"
                  draggable={false}
                  className="max-h-[calc(100vh-140px)] sm:max-h-[calc(100vh-150px)] max-w-full object-contain shadow-2xl rounded-sm select-none"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next Arrow Button */}
          {hasNext && (
            <button
              onClick={goToNext}
              className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/75 hover:bg-black text-white hover:text-[#D4AF37] transition-all min-w-[46px] min-h-[46px] items-center justify-center border border-white/10 hover:border-[#D4AF37]/40 shadow-xl"
              aria-label="Next photograph"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Floating Mobile Touch Swipe Cue */}
          <div className="sm:hidden absolute bottom-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-[11px] text-[#A3A3A3] border border-white/10 pointer-events-none shadow-lg">
            <ChevronLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Swipe photo to navigate</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </div>
        </div>

        {/* Optional EXIF Drawer */}
        {showExif && asset.exif && (
          <div className="bg-[#121212] border-t border-[#242424] px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-[#8C8C8C] font-sans overflow-x-auto">
            <div className="flex items-center gap-3 sm:gap-4 whitespace-nowrap">
              <span>Body: <strong className="text-white font-normal">{asset.exif.camera || 'Canon EOS'}</strong></span>
              <span>Lens: <strong className="text-white font-normal">{asset.exif.lens}</strong></span>
              <span>Aperture: <strong className="text-[#D4AF37] font-normal">{asset.exif.aperture}</strong></span>
              <span>Shutter: <strong className="text-white font-normal">{asset.exif.shutterSpeed}</strong></span>
              <span>ISO: <strong className="text-white font-normal">{asset.exif.iso}</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Side Contextual Picture-Chat Panel */}
      {showChat && (
        <div className="hidden md:block w-80 lg:w-96 h-full shrink-0 border-l border-[#242424]">
          <ImageChatPanel
            asset={asset}
            projectId={projectId}
            activeRole={activeRole}
            clientName={clientName}
            onMessageSent={onMessageSent}
          />
        </div>
      )}
    </div>
  );
};
