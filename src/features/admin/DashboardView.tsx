/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { Project } from '../../types/project.ts';
import { GalleryAsset } from '../../types/asset.ts';
import { Search, ChevronDown, ChevronLeft, ChevronRight, Check, SlidersHorizontal, Calendar } from 'lucide-react';
import { Popover } from '../../components/common/Popover.tsx';
import { SharePlatformPopover } from '../../components/project/SharePlatformPopover.tsx';
import { IconShareCompass, IconPlusProject, IconProjectsFolio } from '../../components/icons/BespokeIcons.tsx';

interface DashboardViewProps {
  projects: Project[];
  assets: GalleryAsset[];
  onOpenProject?: (project: Project) => void;
  onOpenNewProject: () => void;
  onOpenAssetManager: (project: Project) => void;
  onOpenSelectionReview: (project: Project) => void;
  onOpenClientPortal?: (project: Project) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  assets,
  onOpenProject,
  onOpenNewProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isStatusPopoverOpen, setIsStatusPopoverOpen] = useState(false);
  const [sharePopoverProjectId, setSharePopoverProjectId] = useState<string | null>(null);
  const projectCarouselRef = useRef<HTMLDivElement>(null);

  const scrollProjects = (direction: 'left' | 'right') => {
    const carousel = projectCarouselRef.current;
    if (!carousel) return;

    carousel.scrollBy({
      left: (direction === 'left' ? -1 : 1) * Math.max(280, carousel.clientWidth * 0.82),
      behavior: 'smooth',
    });
  };

  // Compute metrics
  const totalProjects = projects.length;
  const awaitingSelection = projects.filter((p) => p.status === 'awaiting_selection').length;
  const submittedSelections = projects.filter((p) => p.status === 'selections_submitted').length;
  const inProduction = projects.filter((p) => p.status === 'album_production').length;
  const totalAssetsCount = assets.length;
  const pairedAssetsCount = assets.filter((a) => a.pairingStatus === 'paired').length;

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  return (
    <div className="space-y-10 font-sans selection:bg-[#D4AF37]/30">
      {/* Studio Header & Stats Row */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-[#27272A] pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-editorial font-medium tracking-tight text-white">
              Studio Workspace
            </h1>
            <p className="text-sm text-[#A1A1AA] mt-1.5 font-sans leading-relaxed">
              High-resolution photo proofing, RAW digital negatives pairing &amp; heirloom album curation
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenNewProject}
              className="group inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-[#D4AF37] hover:bg-[#C5A028] rounded-xl transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              <IconPlusProject size={15} />
              <span>Create Project</span>
            </button>
          </div>
        </div>

        {/* 4-Column KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#121212] border border-[#27272A] rounded-xl p-5 sm:p-6 space-y-2">
            <span className="text-xs text-[#A1A1AA] tracking-wider uppercase font-medium">
              Total Projects
            </span>
            <div className="text-3xl font-editorial font-semibold text-white tabular-nums">
              {totalProjects}
            </div>
            <span className="text-xs text-[#A1A1AA] block">Active studio records</span>
          </div>

          <div className="bg-[#121212] border border-[#27272A] rounded-xl p-5 sm:p-6 space-y-2">
            <span className="text-xs text-[#A1A1AA] tracking-wider uppercase font-medium">
              Awaiting Selection
            </span>
            <div className="text-3xl font-editorial font-semibold text-[#D4AF37] tabular-nums">
              {awaitingSelection}
            </div>
            <span className="text-xs text-[#A1A1AA] block">Direct links active</span>
          </div>

          <div className="bg-[#121212] border border-[#27272A] rounded-xl p-5 sm:p-6 space-y-2">
            <span className="text-xs text-[#A1A1AA] tracking-wider uppercase font-medium">
              Submitted Albums
            </span>
            <div className="text-3xl font-editorial font-semibold text-white tabular-nums">
              {submittedSelections + inProduction}
            </div>
            <span className="text-xs text-[#A1A1AA] block">Ready for layout &amp; print</span>
          </div>

          <div className="bg-[#121212] border border-[#27272A] rounded-xl p-5 sm:p-6 space-y-2">
            <span className="text-xs text-[#A1A1AA] tracking-wider uppercase font-medium">
              Paired RAW Masters
            </span>
            <div className="text-3xl font-editorial font-semibold text-white tabular-nums">
              {pairedAssetsCount}
              <span className="text-xs font-sans text-[#A1A1AA] font-normal ml-1">
                / {totalAssetsCount}
              </span>
            </div>
            <span className="text-xs text-[#A1A1AA] block font-mono">CR2 · CR3 · NEF · ARW</span>
          </div>
        </div>
      </div>

      {/* Projects Management Section */}
      <div className="bg-[#121212] border border-[#27272A] rounded-2xl overflow-hidden shadow-xl">
        {/* Controls Bar */}
        <div className="p-5 sm:p-6 border-b border-[#27272A] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by project ID, client name or event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0A0A0A] border border-[#27272A] rounded-xl text-xs sm:text-sm text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors font-sans"
            />
          </div>

          {/* Mobile Status Popover */}
          <div className="md:hidden relative">
            <button
              type="button"
              onClick={() => setIsStatusPopoverOpen(!isStatusPopoverOpen)}
              className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-[#0A0A0A] border border-[#27272A] rounded-xl text-xs font-medium text-white transition-colors min-h-[42px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              aria-label="Filter projects by status"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="truncate">
                  Status: {[
                    { id: 'all', label: 'All Projects' },
                    { id: 'awaiting_selection', label: 'Awaiting Selection' },
                    { id: 'selections_submitted', label: 'Submitted' },
                    { id: 'album_production', label: 'In Production' },
                  ].find((t) => t.id === statusFilter)?.label || 'All'}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#A1A1AA] transition-transform ${isStatusPopoverOpen ? 'rotate-180 text-white' : ''}`} />
            </button>

            <Popover
              isOpen={isStatusPopoverOpen}
              onClose={() => setIsStatusPopoverOpen(false)}
              align="right"
              className="w-64 p-2 bg-[#121212] border border-[#27272A] rounded-xl shadow-2xl"
            >
              {[
                { id: 'all', label: 'All Projects' },
                { id: 'awaiting_selection', label: 'Awaiting Selection' },
                { id: 'selections_submitted', label: 'Submitted' },
                { id: 'album_production', label: 'In Production' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setStatusFilter(tab.id);
                    setIsStatusPopoverOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors min-h-[38px] ${
                    statusFilter === tab.id
                      ? 'bg-[#181818] text-[#D4AF37] font-medium'
                      : 'text-[#A1A1AA] hover:text-white hover:bg-[#181818]/60'
                  }`}
                >
                  <span>{tab.label}</span>
                  {statusFilter === tab.id && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                </button>
              ))}
            </Popover>
          </div>

          {/* Desktop Filter Pills */}
          <div className="hidden md:flex items-center gap-2">
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'awaiting_selection', label: 'Awaiting Selection' },
              { id: 'selections_submitted', label: 'Submitted' },
              { id: 'album_production', label: 'In Production' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors min-h-[36px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                  statusFilter === tab.id
                    ? 'bg-[#27272A] text-white shadow-sm font-semibold border border-[#3F3F46]'
                    : 'text-[#A1A1AA] hover:text-white hover:bg-[#181818] border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project carousel */}
        <div className="relative">
          {filteredProjects.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <IconProjectsFolio size={36} className="text-[#8C8C8C]/40 mx-auto" />
              <h3 className="text-lg font-editorial text-white font-medium">No projects found</h3>
              <p className="text-xs sm:text-sm text-[#8C8C8C] max-w-sm mx-auto">
                No photography projects match your search criteria.
              </p>
              <button
                onClick={onOpenNewProject}
                className="mt-2 px-4 py-2 text-xs font-medium text-black bg-[#D4AF37] hover:bg-[#C5A028] rounded-lg transition-colors font-sans focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                Create Project
              </button>
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => scrollProjects('left')}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#27272A] bg-[#121212] text-[#A1A1AA] transition-colors hover:border-[#D4AF37]/50 hover:text-[#D4AF37] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                  aria-label="Previous projects"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollProjects('right')}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#27272A] bg-[#121212] text-[#A1A1AA] transition-colors hover:border-[#D4AF37]/50 hover:text-[#D4AF37] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                  aria-label="Next projects"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div
                ref={projectCarouselRef}
                className="flex snap-x snap-mandatory gap-5 overflow-x-auto overflow-y-hidden scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                aria-label="Projects carousel"
              >
            {filteredProjects.map((project) => {
              const projectAssets = assets.filter((a) => a.projectId === project.id);
              const selectedCount = projectAssets.filter((a) => a.isSelected).length;
              const quotaLimit = project.selectionLimit || 1;
              const quotaPercent = Math.min(100, Math.round((selectedCount / quotaLimit) * 100));

              const statusBadgeConfig: Record<
                Project['status'],
                { label: string; color: string; dotColor: string }
              > = {
                draft: {
                  label: 'Draft',
                  color: 'text-zinc-400 bg-zinc-800/40 border-zinc-700',
                  dotColor: 'bg-zinc-400',
                },
                awaiting_selection: {
                  label: 'Awaiting Selection',
                  color: 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/30',
                  dotColor: 'bg-[#D4AF37] animate-pulse',
                },
                selections_submitted: {
                  label: 'Selections Submitted',
                  color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
                  dotColor: 'bg-emerald-400',
                },
                album_production: {
                  label: 'In Production',
                  color: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
                  dotColor: 'bg-sky-400',
                },
                completed: {
                  label: 'Delivered',
                  color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
                  dotColor: 'bg-purple-400',
                },
              };
              const activeStatusBadge = statusBadgeConfig[project.status] || statusBadgeConfig.awaiting_selection;

              return (
                <article
                  key={project.id}
                  onClick={() => onOpenProject?.(project)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') onOpenProject?.(project);
                  }}
                  role="button"
                  tabIndex={0}
                  className="group relative aspect-[4/3] basis-full shrink-0 snap-start cursor-pointer overflow-hidden rounded-2xl border border-[#27272A] bg-[#121212] p-4 font-sans transition-colors hover:bg-[#151515] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] sm:basis-[calc((100%-1.25rem)/2)] sm:p-5"
                >
                  <div className="absolute inset-x-4 top-3 flex justify-center sm:inset-x-5">
                    <div className="flex items-center gap-1.5 text-[10px] text-[#A1A1AA] font-mono sm:text-xs">
                      <Calendar className="h-3 w-3 text-[#71717A]" />
                      <span>Event Date: {project.eventDate}</span>
                    </div>
                  </div>

                  <div className="flex h-full flex-col pt-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="text-lg font-editorial font-bold leading-snug tracking-tight text-white transition-colors group-hover:text-[#D4AF37] sm:text-xl">
                          {project.clientName}
                        </h2>
                        <div className="mt-1 flex items-center gap-2 text-[10px] font-mono sm:text-xs">
                          <span className="font-semibold tracking-wider text-[#D4AF37]">{project.id}</span>
                          <span className="text-[#4A4A4A]">·</span>
                          <span className="font-semibold text-[#EDEDED]">{project.packageName}</span>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${activeStatusBadge.color}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${activeStatusBadge.dotColor}`} />
                          <span>{activeStatusBadge.label}</span>
                        </span>

                        {/* Share Button: Directly triggers Platform Quick-Share Popover */}
                        <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSharePopoverProjectId(
                            sharePopoverProjectId === project.id ? null : project.id
                          );
                        }}
                        className="inline-flex min-h-[32px] items-center gap-1.5 rounded-xl bg-[#D4AF37] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-black shadow-md transition-all hover:bg-[#C5A028] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] sm:px-3"
                        title="Share direct client link via WhatsApp, Socials or Email"
                      >
                        <IconShareCompass size={15} />
                        <span>Share Link</span>
                      </button>

                      {sharePopoverProjectId === project.id && (
                        <SharePlatformPopover
                          project={project}
                          isOpen={true}
                          onClose={() => setSharePopoverProjectId(null)}
                          align="right"
                        />
                      )}
                        </div>
                      </div>
                    </div>

                    {projectAssets.length > 0 && (
                      <div className="mt-auto flex items-center -space-x-2 pb-2">
                        {projectAssets.slice(0, 3).map((asset, idx) => (
                          <div
                            key={asset.id}
                            className="relative h-8 w-8 overflow-hidden rounded-lg border-2 border-[#1E1E22] bg-[#0A0A0A] shadow-md sm:h-10 sm:w-10"
                            style={{ zIndex: 3 - idx }}
                          >
                            <img
                              src={asset.thumbnailUrl || asset.previewUrl}
                              alt={asset.baseFilename}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="w-full border-t border-[#27272A] pt-2">
                      <div className="mb-1 flex items-center justify-end text-[10px] font-mono text-[#A1A1AA]">
                        <span className="font-semibold text-[#D4AF37]">{quotaPercent}% selected</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#181818] p-0.5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C5A028] transition-all duration-500"
                          style={{ width: `${quotaPercent}%` }}
                        />
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-[#A1A1AA]">
                        <span>Total: {projectAssets.length} images</span>
                        <span className="font-semibold text-[#EDEDED]">Selected: {selectedCount} images</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
