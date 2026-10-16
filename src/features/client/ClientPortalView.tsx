/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../../types/project.ts';
import { GalleryAsset } from '../../types/asset.ts';
import { Message } from '../../types/message.ts';
import { services } from '../../services/index.ts';
import { evaluateSelectionQuota } from '../../lib/selection-rules.ts';
import {
  Check,
  MessageSquare,
  AlertCircle,
  MessageCircle,
  Folder,
  FolderOpen,
  X,
  ShieldCheck,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';
import { GalleryFilterPopover } from '../../components/gallery/GalleryFilterPopover.tsx';
import { BrandLogo } from '../../components/brand/BrandLogo.tsx';
import { ClientOnboardingSequence } from './ClientOnboardingSequence.tsx';
import { SwipeCuratorDeck } from './SwipeCuratorDeck.tsx';
import {
  IconMonogramKey,
  IconAlbumSelection,
  IconProjectsFolio,
  IconRawAperture,
} from '../../components/icons/BespokeIcons.tsx';

interface ClientPortalViewProps {
  project: Project;
  assets: GalleryAsset[];
  messages: Message[];
  onOpenPhotoDetail: (asset: GalleryAsset) => void;
  onOpenProjectChat: () => void;
  onRefreshProject: () => void;
  onBackToStudio?: () => void;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  project,
  assets,
  messages,
  onOpenPhotoDetail,
  onOpenProjectChat,
  onRefreshProject,
}) => {
  // Authentication & Onboarding State Machine
  const [portalState, setPortalState] = useState<'pin_gate' | 'onboarding' | 'unlocked'>(() => {
    return project.isPinProtected ? 'pin_gate' : 'unlocked';
  });

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  // Gallery Filters, Active Folder & Swipe Curator Mode
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectionFilter, setSelectionFilter] = useState<'all' | 'selected' | 'unselected' | 'commented'>('all');
  const [curatorMode, setCuratorMode] = useState<'grid' | 'swipe'>('grid');

  // Submission Dialog State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submissionNote, setSubmissionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quotaToast, setQuotaToast] = useState<string | null>(null);

  // Project-specific assets
  const projectAssets = useMemo(() => {
    return assets.filter((a) => a.projectId === project.id);
  }, [assets, project.id]);

  const selectedAssets = useMemo(() => {
    return projectAssets.filter((a) => a.isSelected);
  }, [projectAssets]);

  const isLocked = project.status === 'selections_submitted' || project.status === 'album_production';
  const remainingCount = Math.max(0, project.selectionLimit - selectedAssets.length);
  const progressPercent = Math.min(100, Math.round((selectedAssets.length / project.selectionLimit) * 100));

  // Category counts for Project Folders
  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: projectAssets.length,
      ceremony: 0,
      portraits: 0,
      reception: 0,
      details: 0,
      getting_ready: 0,
    };
    projectAssets.forEach((a) => {
      if (counts[a.category] !== undefined) {
        counts[a.category]++;
      }
    });
    return counts;
  }, [projectAssets]);

  // Project folders metadata list with bespoke icons
  const projectFolders = useMemo(() => [
    { id: 'all', label: 'All Photographs', count: folderCounts.all, icon: <IconProjectsFolio size={16} /> },
    { id: 'ceremony', label: 'Ceremony', count: folderCounts.ceremony, icon: <IconAlbumSelection size={16} /> },
    { id: 'portraits', label: 'Portraits & Couple', count: folderCounts.portraits, icon: <IconRawAperture size={16} /> },
    { id: 'reception', label: 'Reception & Speeches', count: folderCounts.reception, icon: <Folder size={16} /> },
    { id: 'details', label: 'Heirloom Details', count: folderCounts.details, icon: <Folder size={16} /> },
    { id: 'getting_ready', label: 'Getting Ready', count: folderCounts.getting_ready, icon: <Folder size={16} /> },
  ], [folderCounts]);

  // Filtered Assets
  const displayedAssets = useMemo(() => {
    return projectAssets.filter((a) => {
      if (activeCategory !== 'all' && a.category !== activeCategory) return false;
      if (selectionFilter === 'selected' && !a.isSelected) return false;
      if (selectionFilter === 'unselected' && a.isSelected) return false;
      if (selectionFilter === 'commented') {
        const hasAssetMsg = messages.some((m) => m.projectId === project.id && m.assetId === a.id);
        if (!hasAssetMsg && a.commentCount === 0) return false;
      }
      return true;
    });
  }, [projectAssets, activeCategory, selectionFilter, messages, project.id]);

  // Handle PIN unlock
  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (project.sharePin && pinInput.trim() !== project.sharePin.trim()) {
      setPinError('Invalid access PIN. Please enter the secure code provided by Evidence Makers.');
      return;
    }
    setPinError(null);
    setPortalState('onboarding');
  };

  // Toggle selection on a photo card
  const handleToggle = async (asset: GalleryAsset, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked) {
      setQuotaToast('Selections have been submitted and this collection is locked for production.');
      setTimeout(() => setQuotaToast(null), 3500);
      return;
    }

    const isSelecting = !asset.isSelected;
    const quotaCheck = evaluateSelectionQuota(
      selectedAssets.length,
      project.selectionLimit,
      isSelecting,
      isLocked
    );

    if (!quotaCheck.canSelect) {
      setQuotaToast(quotaCheck.reason || 'Cannot select photo.');
      setTimeout(() => setQuotaToast(null), 4000);
      return;
    }

    try {
      await services.selectionService.toggleAssetSelection(project.id, asset.id, isSelecting);
      onRefreshProject();
    } catch (err: any) {
      setQuotaToast(err.message);
      setTimeout(() => setQuotaToast(null), 4000);
    }
  };

  // Submit Final Album Selections
  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);
      await services.selectionService.submitFinalSelection({
        projectId: project.id,
        selectedAssetIds: selectedAssets.map((a) => a.id),
        clientNote: submissionNote.trim() || undefined,
      });
      setIsSubmitModalOpen(false);
      onRefreshProject();
    } catch (err: any) {
      setQuotaToast(err.message);
      setTimeout(() => setQuotaToast(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. PIN Lock Screen View: Single Primary Global Logo, No duplicate logos, No studio admin buttons
  if (portalState === 'pin_gate') {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 font-sans selection:bg-[#F5B82E]/30">
        <div className="w-full max-w-md bg-[#111111] border border-[#242424] rounded-2xl p-8 sm:p-10 text-center space-y-8 shadow-2xl animate-in fade-in duration-300">
          {/* Single Primary Global Brand Wordmark */}
          <div className="flex flex-col items-center space-y-3">
            <BrandLogo variant="horizontal" size="md" />
            <div className="w-10 h-10 bg-[#F5B82E]/10 border border-[#F5B82E]/25 rounded-full flex items-center justify-center text-[#F5B82E] mt-1 shadow-inner">
              <IconMonogramKey size={20} />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#F5B82E] font-medium block">
              Private Client Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-editorial font-medium text-white tracking-tight">
              {project.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#8C8C8C] leading-relaxed max-w-xs mx-auto">
              Please enter your 4-digit access code to view the high-resolution proofing gallery.
            </p>
          </div>

          {pinError && (
            <div className="p-3.5 bg-[#1C1212] border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{pinError}</span>
            </div>
          )}

          <form onSubmit={handleUnlockPin} className="space-y-6">
            <div className="flex flex-col items-center space-y-2">
              <input
                type="text"
                autoFocus
                maxLength={6}
                placeholder="••••"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-48 text-center text-2xl font-mono tracking-[0.3em] py-3.5 px-4 bg-[#080808] border border-[#292929] rounded-xl text-[#F5B82E] focus:outline-none focus:border-[#F5B82E] focus:ring-1 focus:ring-[#F5B82E] transition-all shadow-inner"
              />
              <span className="text-[11px] text-[#8C8C8C]">
                (Demo PIN: <strong className="text-white font-mono">{project.sharePin || '4892'}</strong>)
              </span>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3.5 px-6 text-xs font-semibold uppercase tracking-widest text-black bg-[#F5B82E] hover:bg-[#E2A622] rounded-xl transition-all shadow-lg hover:shadow-[#F5B82E]/20 hover:scale-[1.01] active:scale-[0.99]"
              >
                Unlock Private Gallery
              </button>
            </div>
          </form>

          <div className="pt-3 border-t border-[#1C1C1C] flex items-center justify-center gap-2 text-[11px] text-[#8C8C8C]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F5B82E]" />
            <span>Encrypted End-to-End Client Session</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Cinematic Onboarding Sequence (Preloader + Framer Motion Blur Text Reveal)
  if (portalState === 'onboarding') {
    return (
      <ClientOnboardingSequence
        clientName={project.clientName}
        projectName={project.name}
        packageName={project.packageName}
        eventDate={project.eventDate}
        packageInstructions={project.packageInstructions}
        onComplete={() => setPortalState('unlocked')}
      />
    );
  }

  // 3. Unlocked Standalone Client Portal View (Strictly Minimalist, Photography-Centered)
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8 sm:space-y-10 font-sans selection:bg-[#F5B82E]/30"
    >
      {/* Standalone Client Top Bar: Single Primary Global Logo */}
      <div className="flex items-center justify-between pb-6 border-b border-[#242424]">
        <BrandLogo variant="horizontal" size="sm" />
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#F5B82E] font-medium">
          <span>{project.packageName}</span>
          <span className="text-[#333333]">·</span>
          <span className="text-[#8C8C8C]">{project.eventDate}</span>
        </div>
      </div>

      {/* Editorial Client Hero Banner */}
      <div className="space-y-3 pt-2">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-editorial font-bold tracking-tight text-white leading-tight">
          {project.clientName}
        </h1>

        <p className="text-sm sm:text-base text-[#8C8C8C] leading-relaxed max-w-3xl font-sans">
          {project.packageInstructions || 'Select your signature photographs for the handcrafted heirloom album.'}
        </p>
      </div>

      {/* Responsive Flexbox Selection Guidance Bar (Generous Padding & Breathing Room) */}
      <div className="sticky top-4 z-30 bg-[#0E0E0E]/95 backdrop-blur-md border border-[#242424] rounded-2xl p-6 sm:p-7 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-6 sm:gap-8">
          {/* Left Block: Raw Quota Counter & Linear Meter */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 flex-1 min-w-[280px]">
            <div className="space-y-1 shrink-0">
              <span className="text-[11px] uppercase tracking-wider text-[#8C8C8C] font-semibold block">
                Album Selections
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-editorial font-bold text-[#F5B82E] tabular-nums">
                  {selectedAssets.length}
                </span>
                <span className="text-sm text-[#8C8C8C] font-sans">
                  / {project.selectionLimit} selected
                </span>
              </div>
            </div>

            {/* Linear Progress Bar */}
            <div className="flex-1 min-w-[200px] max-w-md space-y-2">
              <div className="w-full bg-[#181818] h-2.5 rounded-full overflow-hidden border border-[#262626]">
                <div
                  className="bg-[#F5B82E] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[#8C8C8C]">
                <span>
                  {remainingCount === 0
                    ? 'Quota fulfilled'
                    : `${remainingCount} remaining`}
                </span>
                <span className="font-mono text-[11px] text-[#F5B82E]">{progressPercent}%</span>
              </div>
            </div>
          </div>

          {/* Right Block: Action Buttons with generous spacing */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Quick Switch to Swipe Deck / Grid Mode */}
            <button
              type="button"
              onClick={() => setCuratorMode(curatorMode === 'swipe' ? 'grid' : 'swipe')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all min-h-[44px] shadow-sm ${
                curatorMode === 'swipe'
                  ? 'bg-[#F5B82E] text-black shadow-lg shadow-[#F5B82E]/20'
                  : 'bg-[#181818] hover:bg-[#222222] text-[#E5E5E5] border border-[#2E2E2E] hover:border-[#404040]'
              }`}
              title={curatorMode === 'swipe' ? 'Switch to gallery grid view' : 'Switch to Swipe Deck: drag card right to select, left to pass'}
            >
              <Sparkles className={`w-4 h-4 ${curatorMode === 'swipe' ? 'text-black' : 'text-[#F5B82E]'}`} />
              <span>{curatorMode === 'swipe' ? 'Gallery Grid' : 'Swipe Curator'}</span>
              <span
                className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-mono ${
                  curatorMode === 'swipe' ? 'bg-black/15 text-black font-bold' : 'bg-[#282828] text-[#F5B82E]'
                }`}
              >
                Deck
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenProjectChat}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs text-[#8C8C8C] hover:text-white bg-[#141414] hover:bg-[#1C1C1C] border border-[#242424] rounded-xl transition-colors min-h-[44px]"
              title="Open conversation with your studio photographer"
            >
              <MessageCircle className="w-4 h-4 text-[#F5B82E]" />
              <span className="font-medium">Studio Chat</span>
            </button>

            {!isLocked ? (
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                disabled={selectedAssets.length === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-[#F5B82E] hover:bg-[#E2A622] disabled:opacity-40 rounded-xl transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] min-h-[44px]"
              >
                <span>Submit Selections ({selectedAssets.length})</span>
              </button>
            ) : (
              <div className="px-4 py-2.5 bg-[#141414] border border-[#242424] rounded-xl text-xs text-white font-medium flex items-center gap-2 min-h-[44px]">
                <Check className="w-4 h-4 text-[#F5B82E]" />
                <span>Album Locked in Production</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quota Toast Alert */}
      {quotaToast && (
        <div className="p-4 bg-[#141414] border border-[#F5B82E]/50 rounded-xl text-xs sm:text-sm text-[#F5B82E] flex items-center gap-3 transition-all shadow-lg animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#F5B82E]" />
          <span>{quotaToast}</span>
        </div>
      )}

      {/* Project Folders Navigation (Minimalist, Responsive Flexbox with Bespoke SVGs) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.2em] text-[#8C8C8C] font-semibold">
            Project Folders &amp; Collections
          </span>
          <span className="text-xs text-[#8C8C8C]">
            {projectAssets.length} master photographs
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 py-1">
          {projectFolders.map((folder) => {
            const isActive = activeCategory === folder.id;
            return (
              <button
                key={folder.id}
                type="button"
                onClick={() => setActiveCategory(folder.id)}
                className={`group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium transition-all min-h-[42px] ${
                  isActive
                    ? 'bg-[#F5B82E] text-black shadow-lg font-semibold'
                    : 'bg-[#121212] hover:bg-[#181818] border border-[#242424] text-[#8C8C8C] hover:text-white'
                }`}
              >
                <div className={`transition-transform ${isActive ? 'text-black' : 'text-[#8C8C8C] group-hover:text-white'}`}>
                  {isActive ? <FolderOpen className="w-4 h-4" /> : folder.icon}
                </div>
                <span>{folder.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    isActive ? 'bg-black/15 text-black' : 'bg-[#1C1C1C] text-[#8C8C8C]'
                  }`}
                >
                  {folder.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Options & Mobile Popover */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#242424] pb-4">
        {/* Mobile View: Gallery Filter Popover */}
        <div className="sm:hidden flex items-center justify-between gap-2 w-full">
          <GalleryFilterPopover
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            selectionFilter={selectionFilter}
            onSelectSelectionFilter={setSelectionFilter}
            selectedCount={selectedAssets.length}
            totalCount={projectAssets.length}
          />

          {(activeCategory !== 'all' || selectionFilter !== 'all') && (
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectionFilter('all');
              }}
              className="text-xs text-[#F5B82E] hover:underline px-3 py-2 flex items-center gap-1.5 bg-[#121212] border border-[#242424] rounded-lg min-h-[40px]"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Desktop View: Selection Filter Pills */}
        <div className="hidden sm:flex flex-wrap items-center gap-2.5">
          <span className="text-xs text-[#8C8C8C] font-medium mr-1">Filter by:</span>
          {[
            { id: 'all', label: `All In Folder (${displayedAssets.length})` },
            { id: 'selected', label: `Selected (${selectedAssets.length})` },
            { id: 'unselected', label: 'Unselected' },
            { id: 'commented', label: 'With Retouch Notes' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectionFilter(filter.id as any)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors min-h-[36px] ${
                selectionFilter === filter.id
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-[#8C8C8C] hover:text-white bg-[#121212] border border-[#242424] hover:border-[#333333]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* View Mode Toggle: Grid vs Swipe Curator Deck */}
        <div className="flex items-center gap-1 p-1 bg-[#121212] border border-[#262626] rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setCuratorMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all min-h-[32px] ${
              curatorMode === 'grid'
                ? 'bg-[#222222] text-white font-semibold shadow-sm'
                : 'text-[#8C8C8C] hover:text-white'
            }`}
            title="Standard gallery grid view"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Gallery Grid</span>
            <span className="sm:hidden">Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setCuratorMode('swipe')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all min-h-[32px] ${
              curatorMode === 'swipe'
                ? 'bg-[#F5B82E] text-black font-bold shadow-md'
                : 'text-[#8C8C8C] hover:text-[#F5B82E]'
            }`}
            title="Swipeable Curator Mode: drag card right to select, left to pass"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Swipe Deck</span>
            <span
              className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-mono ${
                curatorMode === 'swipe' ? 'bg-black/15 text-black' : 'bg-[#1C1C1C] text-[#F5B82E]'
              }`}
            >
              Swipeable
            </span>
          </button>
        </div>
      </div>

      {/* Swipe Curator Deck Mode vs Standard Responsive Grid */}
      {curatorMode === 'swipe' ? (
        <SwipeCuratorDeck
          assets={displayedAssets}
          projectId={project.id}
          selectionLimit={project.selectionLimit}
          isSelectionLocked={isLocked}
          onToggleSelection={handleToggle}
          onOpenDetail={onOpenPhotoDetail}
          onSwitchToGrid={() => setCuratorMode('grid')}
        />
      ) : displayedAssets.length === 0 ? (
        <div className="p-16 sm:p-20 text-center text-[#8C8C8C] bg-[#101010] border border-[#242424] rounded-2xl space-y-3">
          <FolderOpen className="w-10 h-10 text-[#8C8C8C]/50 mx-auto" />
          <p className="text-lg font-editorial text-white font-medium">No photographs found</p>
          <p className="text-xs sm:text-sm text-[#8C8C8C] max-w-sm mx-auto">
            Try selecting a different project folder or clearing active selection filters.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSelectionFilter('all');
            }}
            className="mt-2 px-4 py-2 text-xs text-[#F5B82E] bg-[#1A1A1A] hover:bg-[#222222] border border-[#292929] rounded-lg transition-colors"
          >
            Show All Photographs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayedAssets.map((asset) => {
            const assetComments = messages.filter(
              (m) => m.projectId === project.id && m.assetId === asset.id
            );

            return (
              <div
                key={asset.id}
                onClick={() => onOpenPhotoDetail(asset)}
                className={`group relative bg-[#121212] border rounded-xl overflow-hidden transition-all duration-300 cursor-pointer shadow-md hover:shadow-2xl hover:border-[#383838] ${
                  asset.isSelected
                    ? 'border-[#F5B82E] ring-2 ring-[#F5B82E]/40 shadow-xl'
                    : 'border-[#242424]'
                }`}
              >
                {/* Photo Image Aspect Container */}
                <div className="aspect-[4/3] bg-[#080808] relative overflow-hidden">
                  <img
                    src={asset.previewUrl}
                    alt={asset.baseFilename}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient Hover Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Top-Right Touch Selection Indicator Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggle(asset, e)}
                    disabled={isLocked}
                    className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      asset.isSelected
                        ? 'bg-[#F5B82E] text-black shadow-lg scale-105'
                        : 'bg-black/60 hover:bg-black/80 text-white/80 hover:text-white backdrop-blur-sm border border-white/20'
                    }`}
                    aria-label={asset.isSelected ? 'Deselect photo' : 'Select photo for album'}
                  >
                    <Check
                      className={`w-4 h-4 ${asset.isSelected ? 'stroke-[3] text-black' : 'opacity-80'}`}
                    />
                  </button>

                  {/* Bottom-left comment notes indicator */}
                  {assetComments.length > 0 && (
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-sm text-[#F5B82E] text-[11px] font-medium rounded-md flex items-center gap-1.5 shadow">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{assetComments.length}</span>
                    </div>
                  )}
                </div>

                {/* Card Minimalist Caption Footer */}
                <div className="p-3.5 flex items-center justify-between text-xs text-[#8C8C8C] font-sans">
                  <span className="text-[11px] font-mono truncate max-w-[150px] font-medium text-white">
                    {asset.baseFilename}
                  </span>
                  <span className="text-[10px] capitalize text-[#8C8C8C] uppercase tracking-wider">
                    {asset.category.replace('_', ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Final Submission Confirmation Dialog */}
      {isSubmitModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="submit-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 font-sans animate-in fade-in"
        >
          <div className="bg-[#121212] border border-[#242424] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="border-b border-[#242424] pb-4 space-y-1">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#F5B82E] font-medium block">
                Signature Proofing Finalization
              </span>
              <h3 id="submit-dialog-title" className="text-2xl font-editorial font-medium text-white">
                Submit Heirloom Album Selections
              </h3>
              <p className="text-xs text-[#8C8C8C] font-sans pt-1">
                You have curated <strong className="text-[#F5B82E]">{selectedAssets.length}</strong> of your{' '}
                <strong className="text-white">{project.selectionLimit}</strong> package images.
              </p>
            </div>

            <div className="p-4 bg-[#080808] border border-[#242424] rounded-xl text-xs text-white/90 space-y-2 leading-relaxed">
              <p>
                Upon submission, Evidence Makers studio artisans will initiate high-resolution RAW color grading, retouching requests, and layout composition for the master album.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-white uppercase tracking-wider font-sans">
                Album Cover Note or Special Instructions
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Please feature the outdoor twilight portraits on the front cover and first double spread..."
                value={submissionNote}
                onChange={(e) => setSubmissionNote(e.target.value)}
                className="w-full px-4 py-3 bg-[#080808] border border-[#242424] rounded-xl text-xs text-white placeholder-[#8C8C8C] focus:outline-none focus:border-[#F5B82E] transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-[#242424]">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                disabled={isSubmitting}
                className="px-4 py-2.5 text-xs text-[#8C8C8C] hover:text-white transition-colors min-h-[40px]"
              >
                Continue Reviewing
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-[#F5B82E] hover:bg-[#E2A622] disabled:opacity-50 rounded-xl transition-all shadow-md min-h-[40px]"
              >
                {isSubmitting ? 'Submitting to Studio...' : 'Confirm & Finalize Selections'}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
