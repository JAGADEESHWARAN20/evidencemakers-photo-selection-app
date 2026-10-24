/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Project } from '../../types/project.ts';
import { GalleryAsset } from '../../types/asset.ts';
import { services } from '../../services/index.ts';
import {
  CheckCircle2,
  Clock,
  Camera,
  BookOpen,
  SlidersHorizontal,
  ChevronDown,
  Check,
  Images,
  Download,
} from 'lucide-react';
import { Popover } from '../../components/common/Popover.tsx';
import { SharePlatformPopover } from '../../components/project/SharePlatformPopover.tsx';
import { IconShareCompass } from '../../components/icons/BespokeIcons.tsx';

interface SelectionReviewViewProps {
  project: Project;
  projects: Project[];
  assets: GalleryAsset[];
  onSelectProject: (project: Project) => void;
  onOpenAssets: () => void;
  onOpenPhotoDetail: (asset: GalleryAsset) => void;
  onOpenClientPortal: (project: Project) => void;
  isProjectSwitching: boolean;
  onToggleSelection?: (assetId: string) => void;
}

export const SelectionReviewView: React.FC<SelectionReviewViewProps> = ({
  project,
  projects,
  assets,
  onSelectProject,
  onOpenAssets,
  onOpenPhotoDetail,
  onOpenClientPortal,
  isProjectSwitching,
  onToggleSelection,
}) => {
  const [filterMode, setFilterMode] = useState<'selected' | 'all' | 'unselected'>('selected');
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isBulkDownloading, setIsBulkDownloading] = useState(false);
  const [downloadStatusMessage, setDownloadStatusMessage] = useState<string | null>(null);

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

  const displayedAssets = useMemo(() => {
    switch (filterMode) {
      case 'selected':
        return selectedAssets;
      case 'unselected':
        return projectAssets.filter((a) => !a.isSelected);
      default:
        return projectAssets;
    }
  }, [filterMode, selectedAssets, projectAssets]);

  const progressPercent = Math.min(
    100,
    Math.round((selectedAssets.length / project.selectionLimit) * 100)
  );

  const handleBulkJpegDownload = async () => {
    if (selectedAssets.length === 0) return;
    setIsBulkDownloading(true);
    try {
      for (const asset of selectedAssets) {
        const res = await services.assetService.getJpegDownloadUrl(asset.id);
        const link = document.createElement('a');
        link.href = res.downloadUrl;
        link.download = res.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setDownloadStatusMessage(`Started download for ${selectedAssets.length} selected images.`);
    } catch (err: any) {
      setDownloadStatusMessage(`Download error: ${err.message || 'Unable to download images'}`);
    } finally {
      setIsBulkDownloading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#27272A] pb-6">
        <div className="min-w-0">
          <label htmlFor="album-project-switcher" className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
            Project workspace
          </label>
          <select
            id="album-project-switcher"
            value={project.id}
            onChange={(event) => {
              const nextProject = projects.find((candidate) => candidate.id === event.target.value);
              if (nextProject) onSelectProject(nextProject);
            }}
            className="max-w-full rounded-lg border border-[#27272A] bg-[#121212] px-3 py-2 text-sm font-medium text-white outline-none transition-colors focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
          >
            {projects.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.id} — {candidate.clientName}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-[#A1A1AA]">{project.name} · {project.clientName}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-[#27272A] bg-[#121212] p-1">
            <button
              type="button"
              onClick={onOpenAssets}
              className="rounded-md px-3 py-1.5 text-xs font-medium text-[#A1A1AA] transition-colors hover:text-white"
            >
              Images
            </button>
            <button type="button" className="rounded-md bg-[#242424] px-3 py-1.5 text-xs font-medium text-white">
              Album selections
            </button>
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
      </div>

      {isProjectSwitching ? (
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-[#242424] sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse bg-[#121212] p-3">
              <div className="aspect-[4/3] rounded-md bg-[#242424]" />
              <div className="mt-2 h-3 w-2/3 rounded bg-[#242424]" />
            </div>
          ))}
        </div>
      ) : (
        <>
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

      {/* Filter Tabs Bar (Responsive Popover on Mobile, Tabs on Desktop) & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#242424] pb-4 font-sans">
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
            { id: 'all', label: `All Gallery Photos (${projectAssets.length})` },
            { id: 'unselected', label: `Unselected (${projectAssets.length - selectedAssets.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterMode(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors min-h-[36px] ${
                filterMode === tab.id
                  ? 'bg-[#242424] text-white shadow-sm'
                  : 'text-[#8C8C8C] hover:text-white hover:bg-[#181818]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Download Selected JPEGs action */}
        <button
          type="button"
          onClick={handleBulkJpegDownload}
          disabled={isBulkDownloading || selectedAssets.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3.5 py-2 text-xs font-semibold text-[#D4AF37] transition-colors hover:bg-[#D4AF37]/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Images className="h-4 w-4" />
          {isBulkDownloading ? 'Preparing downloads…' : `Download selected JPEGs (${selectedAssets.length})`}
        </button>
      </div>

      {downloadStatusMessage && (
        <div className="p-3 text-xs bg-[#121212] border border-[#27272A] rounded-lg text-white">
          {downloadStatusMessage}
        </div>
      )}

      {/* Uniform Responsive Grid of reviewed assets */}
      {displayedAssets.length === 0 ? (
        <div className="p-16 text-center text-[#8C8C8C] bg-[#121212] border border-[#242424] rounded-xl font-sans">
          <Camera className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm font-editorial text-white">No photographs in this filter category</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 font-sans">
          {displayedAssets.map((asset) => {
            const isSelected = asset.isSelected;
            return (
              <div
                key={asset.id}
                className={`group relative overflow-hidden rounded-lg border transition-all duration-200 bg-[#080808] ${
                  isSelected
                    ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]'
                    : 'border-[#242424] hover:border-[#3f3f46]'
                }`}
              >
                <div
                  className="aspect-[4/3] bg-[#080808] relative overflow-hidden cursor-pointer"
                  onClick={() => onOpenPhotoDetail(asset)}
                >
                  <img
                    src={asset.previewUrl}
                    alt={asset.baseFilename}
                    referrerPolicy="no-referrer"
                    className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                      isSelected ? 'brightness-105' : ''
                    }`}
                  />

                  {/* Selection Indicator & Toggle Button */}
                  {onToggleSelection && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSelection(asset.id);
                      }}
                      aria-label={isSelected ? `Deselect ${asset.jpegFilename}` : `Select ${asset.jpegFilename}`}
                      className={`absolute left-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-md border transition-all duration-150 ${
                        isSelected
                          ? 'border-[#D4AF37] bg-[#D4AF37] text-black shadow-md'
                          : 'border-white/40 bg-black/60 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 hover:border-white'
                      }`}
                    >
                      <Check className={`h-4 w-4 stroke-[2.5] ${isSelected ? 'text-black' : 'text-white'}`} />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between px-3 py-2 border-t border-[#1e1e1e] bg-[#0c0c0c]">
                  <p className="truncate text-[11px] font-mono text-[#A1A1AA]">{asset.jpegFilename}</p>
                  {isSelected && (
                    <span className="ml-2 flex-shrink-0 text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider">
                      Selected
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
        </>
      )}
    </div>
  );
};
