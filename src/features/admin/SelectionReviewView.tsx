/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Project } from '../../types/project.ts';
import { GalleryAsset } from '../../types/asset.ts';
import { Message } from '../../types/message.ts';
import { services } from '../../services/index.ts';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MessageSquare,
  Download,
  Camera,
  ExternalLink,
  BookOpen,
  SlidersHorizontal,
  ChevronDown,
  Check,
  Copy,
} from 'lucide-react';
import { Popover } from '../../components/common/Popover.tsx';
import { SharePlatformPopover } from '../../components/project/SharePlatformPopover.tsx';
import { IconShareCompass } from '../../components/icons/BespokeIcons.tsx';

interface SelectionReviewViewProps {
  project: Project;
  assets: GalleryAsset[];
  messages: Message[];
  onBack: () => void;
  onOpenPhotoDetail: (asset: GalleryAsset) => void;
  onOpenClientPortal: (project: Project) => void;
}

export const SelectionReviewView: React.FC<SelectionReviewViewProps> = ({
  project,
  assets,
  messages,
  onBack,
  onOpenPhotoDetail,
  onOpenClientPortal,
}) => {
  const [filterMode, setFilterMode] = useState<'selected' | 'all' | 'unselected' | 'commented'>('selected');
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyShareLink = () => {
    const url = `${window.location.origin}/?portal=${project.shareToken}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const projectAssets = useMemo(() => {
    return assets.filter((a) => a.projectId === project.id);
  }, [assets, project.id]);

  const selectedAssets = useMemo(() => {
    return projectAssets.filter((a) => a.isSelected);
  }, [projectAssets]);

  const commentedAssets = useMemo(() => {
    const commentedAssetIds = new Set(
      messages.filter((m) => m.projectId === project.id && m.assetId).map((m) => m.assetId!)
    );
    return projectAssets.filter((a) => commentedAssetIds.has(a.id) || a.commentCount > 0);
  }, [projectAssets, messages, project.id]);

  const displayedAssets = useMemo(() => {
    switch (filterMode) {
      case 'selected':
        return selectedAssets;
      case 'unselected':
        return projectAssets.filter((a) => !a.isSelected);
      case 'commented':
        return commentedAssets;
      default:
        return projectAssets;
    }
  }, [filterMode, selectedAssets, projectAssets, commentedAssets]);

  const progressPercent = Math.min(
    100,
    Math.round((selectedAssets.length / project.selectionLimit) * 100)
  );

  const [downloadFeedback, setDownloadFeedback] = useState<string | null>(null);

  const handleDownloadRaw = async (asset: GalleryAsset, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await services.assetService.getRawDownloadUrl(asset.id);
      const link = document.createElement('a');
      link.href = res.downloadUrl;
      link.download = asset.rawFilename || `${asset.baseFilename}.cr3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadFeedback(`Downloading RAW camera master for ${asset.baseFilename}`);
      setTimeout(() => setDownloadFeedback(null), 3000);
    } catch (err: any) {
      setDownloadFeedback(`Download failed: ${err.message || 'Unable to download asset'}`);
      setTimeout(() => setDownloadFeedback(null), 3500);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {downloadFeedback && (
        <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl text-xs text-[#D4AF37] flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>{downloadFeedback}</span>
          </div>
          <button
            onClick={() => setDownloadFeedback(null)}
            className="text-white hover:text-[#D4AF37] text-xs font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#27272A] pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-[#A1A1AA] hover:text-white bg-[#121212] border border-[#27272A] rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-xs text-[#D4AF37] font-medium">{project.id}</span>
              <span className="text-[#333333]">·</span>
              <h1 className="text-2xl sm:text-3xl font-editorial font-medium text-white">
                Album Selection &amp; Production Review
              </h1>
            </div>
            <p className="text-xs text-[#A1A1AA] mt-0.5 font-sans">
              Client: <span className="text-white font-medium">{project.clientName}</span> · Package: {project.packageName}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsCopied(!isCopied)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-[#D4AF37] hover:bg-[#C5A028] rounded-xl transition-all shadow-md min-h-[38px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            <IconShareCompass size={16} />
            <span>Share Gallery Link</span>
          </button>

          {isCopied && (
            <SharePlatformPopover
              project={project}
              isOpen={true}
              onClose={() => setIsCopied(false)}
              align="right"
            />
          )}
        </div>
      </div>

      {/* Quota Progress & Submission Status Banner */}
      <div className="bg-[#121212] border border-[#27272A] rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        {/* Metric 1: Selection Progress */}
        <div className="space-y-2">
          <span className="text-xs text-[#A1A1AA] font-medium uppercase tracking-wider">
            Selection Status
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-editorial font-semibold text-[#D4AF37] tabular-nums">
              {selectedAssets.length}
            </span>
            <span className="text-base text-[#A1A1AA] font-sans">
              / {project.selectionLimit} images
            </span>
          </div>
          {/* Progress track */}
          <div className="w-full bg-[#0A0A0A] h-1.5 rounded-full overflow-hidden border border-[#27272A]">
            <div
              className="bg-gradient-to-r from-[#D4AF37] to-[#C5A028] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-[#A1A1AA] block">
            {project.selectionLimit - selectedAssets.length <= 0
              ? 'Package quota fulfilled'
              : `${project.selectionLimit - selectedAssets.length} images remaining in package`}
          </span>
        </div>

        {/* Metric 2: Submission State */}
        <div className="space-y-2">
          <span className="text-xs text-[#8C8C8C] font-medium uppercase tracking-wider">
            Client Submission
          </span>
          <div>
            {project.status === 'selections_submitted' || project.status === 'album_production' ? (
              <div className="flex items-center gap-2 text-white text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Submitted on {project.submissionDate ? new Date(project.submissionDate).toLocaleDateString() : 'Recent'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[#D4AF37] text-sm font-medium">
                <Clock className="w-4 h-4" />
                <span>Client Still Selecting (Draft)</span>
              </div>
            )}
          </div>
          <p className="text-xs text-[#8C8C8C] leading-relaxed">
            {project.finalClientNote ? (
              <span className="italic text-white">"{project.finalClientNote}"</span>
            ) : (
              'No final submission note attached yet.'
            )}
          </p>
        </div>

        {/* Metric 3: Production Handoff */}
        <div className="space-y-2">
          <span className="text-xs text-[#8C8C8C] font-medium uppercase tracking-wider">
            Album Production Workflow
          </span>
          <div className="flex items-center gap-2 text-sm text-white">
            <BookOpen className="w-4 h-4 text-[#D4AF37]" />
            <span>Ready for Flush-Mount Layout</span>
          </div>
          <p className="text-xs text-[#8C8C8C]">
            Selected images are linked directly with their uncompressed RAW digital negatives for color grading.
          </p>
        </div>
      </div>

      {/* Filter Tabs Bar (Responsive Popover on Mobile, Tabs on Desktop) */}
      <div className="flex items-center justify-between gap-4 border-b border-[#242424] pb-3 font-sans">
        {/* Mobile Filter Popover */}
        <div className="sm:hidden relative w-full">
          <button
            type="button"
            onClick={() => setIsFilterPopoverOpen(!isFilterPopoverOpen)}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-[#121212] border border-[#242424] rounded-md text-xs font-medium text-white transition-colors min-h-[40px]"
            aria-label="Filter album review photos"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="truncate">
                {[
                  { id: 'selected', label: `Selected (${selectedAssets.length})` },
                  { id: 'commented', label: `Has Comments (${commentedAssets.length})` },
                  { id: 'all', label: `All Photos (${projectAssets.length})` },
                  { id: 'unselected', label: `Unselected (${projectAssets.length - selectedAssets.length})` },
                ].find((t) => t.id === filterMode)?.label || 'Filter Photos'}
              </span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-[#8C8C8C] transition-transform ${isFilterPopoverOpen ? 'rotate-180 text-white' : ''}`} />
          </button>

          <Popover
            isOpen={isFilterPopoverOpen}
            onClose={() => setIsFilterPopoverOpen(false)}
            align="left"
            className="w-full sm:w-64 p-1.5"
          >
            {[
              { id: 'selected', label: `Selected for Album (${selectedAssets.length})` },
              { id: 'commented', label: `Has Comments (${commentedAssets.length})` },
              { id: 'all', label: `All Gallery Photos (${projectAssets.length})` },
              { id: 'unselected', label: `Unselected (${projectAssets.length - selectedAssets.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setFilterMode(tab.id as any);
                  setIsFilterPopoverOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md transition-colors min-h-[38px] ${
                  filterMode === tab.id
                    ? 'bg-[#181818] text-[#D4AF37] font-medium'
                    : 'text-[#8C8C8C] hover:text-white hover:bg-[#181818]/60'
                }`}
              >
                <span>{tab.label}</span>
                {filterMode === tab.id && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
              </button>
            ))}
          </Popover>
        </div>

        {/* Desktop Filter Tabs */}
        <div className="hidden sm:flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'selected', label: `Selected for Album (${selectedAssets.length})` },
            { id: 'commented', label: `Has Comments (${commentedAssets.length})` },
            { id: 'all', label: `All Gallery Photos (${projectAssets.length})` },
            { id: 'unselected', label: `Unselected (${projectAssets.length - selectedAssets.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterMode(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                filterMode === tab.id
                  ? 'bg-[#242424] text-white shadow-sm'
                  : 'text-[#8C8C8C] hover:text-white hover:bg-[#181818]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Reviewed Assets */}
      {displayedAssets.length === 0 ? (
        <div className="p-16 text-center text-[#8C8C8C] bg-[#121212] border border-[#242424] rounded-xl font-sans">
          <Camera className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm font-editorial text-white">No photographs in this filter category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 font-sans">
          {displayedAssets.map((asset) => {
            const assetComments = messages.filter(
              (m) => m.projectId === project.id && m.assetId === asset.id
            );

            return (
              <div
                key={asset.id}
                onClick={() => onOpenPhotoDetail(asset)}
                className="bg-[#121212] border border-[#242424] hover:border-[#D4AF37]/50 rounded-lg overflow-hidden transition-all cursor-pointer group flex flex-col justify-between"
              >
                {/* Photo frame */}
                <div className="aspect-[4/3] bg-[#080808] relative overflow-hidden">
                  <img
                    src={asset.previewUrl}
                    alt={asset.baseFilename}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                    {asset.isSelected ? (
                      <span className="px-2 py-0.5 bg-[#D4AF37] text-black text-[10px] font-bold rounded uppercase tracking-wider shadow">
                        Selected for Album
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-black/80 backdrop-blur-xs text-[#8C8C8C] text-[10px] rounded uppercase">
                        Unselected
                      </span>
                    )}

                    {assetComments.length > 0 && (
                      <span className="px-2 py-0.5 bg-black/80 backdrop-blur-xs text-[#D4AF37] text-[10px] font-medium rounded flex items-center gap-1 shadow">
                        <MessageSquare className="w-3 h-3" />
                        {assetComments.length}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer details */}
                <div className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white truncate">
                      {asset.baseFilename}
                    </span>
                    <span className="text-[10px] text-[#8C8C8C]">
                      {asset.rawExtension ? `RAW: ${asset.rawExtension}` : 'JPEG'}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#8C8C8C] space-y-0.5">
                    {asset.exif && (
                      <div className="truncate text-[#8C8C8C]">
                        {asset.exif.lens} · {asset.exif.aperture} · ISO {asset.exif.iso}
                      </div>
                    )}
                  </div>

                  {assetComments.length > 0 && (
                    <div className="p-2 bg-[#080808] border border-[#242424] rounded text-[11px] text-[#8C8C8C] line-clamp-2">
                      <span className="text-[#D4AF37] font-medium mr-1">
                        {assetComments[assetComments.length - 1].senderName}:
                      </span>
                      <span className="text-white">
                        {assetComments[assetComments.length - 1].text}
                      </span>
                    </div>
                  )}

                  {asset.rawFilename && (
                    <button
                      onClick={(e) => handleDownloadRaw(asset, e)}
                      className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-1 text-[11px] text-[#8C8C8C] hover:text-white bg-[#080808] hover:bg-[#181818] border border-[#242424] rounded transition-colors"
                      title="Download full uncompressed RAW file for editing"
                    >
                      <Download className="w-3 h-3 text-[#D4AF37]" />
                      <span>Download RAW Negative</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
