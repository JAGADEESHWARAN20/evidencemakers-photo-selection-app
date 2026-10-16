/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Project } from '../../types/project.ts';
import { GalleryAsset } from '../../types/asset.ts';
import { Search, ChevronDown, Check, SlidersHorizontal } from 'lucide-react';
import { Popover } from '../../components/common/Popover.tsx';
import { SharePlatformPopover } from '../../components/project/SharePlatformPopover.tsx';
import {
  IconRawAperture,
  IconAlbumSelection,
  IconShareCompass,
  IconMonogramKey,
  IconPlusProject,
  IconProjectsFolio,
} from '../../components/icons/BespokeIcons.tsx';

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
  onOpenNewProject,
  onOpenAssetManager,
  onOpenSelectionReview,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isStatusPopoverOpen, setIsStatusPopoverOpen] = useState(false);
  const [sharePopoverProjectId, setSharePopoverProjectId] = useState<string | null>(null);

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
    <div className="space-y-10 font-sans selection:bg-[#F5B82E]/30">
      {/* Studio Header & Stats Row */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-[#242424] pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-editorial font-medium tracking-tight text-white">
              Studio Workspace
            </h1>
            <p className="text-sm text-[#8C8C8C] mt-1.5 font-sans leading-relaxed">
              High-resolution photo proofing, RAW digital negatives pairing &amp; heirloom album curation
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenNewProject}
              className="group inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-[#F5B82E] hover:bg-[#E2A622] rounded-xl transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <IconPlusProject size={15} />
              <span>Create Project</span>
            </button>
          </div>
        </div>

        {/* 4-Column KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#111111] border border-[#242424] rounded-xl p-5 sm:p-6 space-y-2">
            <span className="text-xs text-[#8C8C8C] tracking-wider uppercase font-medium">
              Total Projects
            </span>
            <div className="text-3xl font-editorial font-semibold text-white tabular-nums">
              {totalProjects}
            </div>
            <span className="text-xs text-[#8C8C8C] block">Active studio records</span>
          </div>

          <div className="bg-[#111111] border border-[#242424] rounded-xl p-5 sm:p-6 space-y-2">
            <span className="text-xs text-[#8C8C8C] tracking-wider uppercase font-medium">
              Awaiting Selection
            </span>
            <div className="text-3xl font-editorial font-semibold text-[#F5B82E] tabular-nums">
              {awaitingSelection}
            </div>
            <span className="text-xs text-[#8C8C8C] block">Direct links active</span>
          </div>

          <div className="bg-[#111111] border border-[#242424] rounded-xl p-5 sm:p-6 space-y-2">
            <span className="text-xs text-[#8C8C8C] tracking-wider uppercase font-medium">
              Submitted Albums
            </span>
            <div className="text-3xl font-editorial font-semibold text-white tabular-nums">
              {submittedSelections + inProduction}
            </div>
            <span className="text-xs text-[#8C8C8C] block">Ready for layout &amp; print</span>
          </div>

          <div className="bg-[#111111] border border-[#242424] rounded-xl p-5 sm:p-6 space-y-2">
            <span className="text-xs text-[#8C8C8C] tracking-wider uppercase font-medium">
              Paired RAW Masters
            </span>
            <div className="text-3xl font-editorial font-semibold text-white tabular-nums">
              {pairedAssetsCount}
              <span className="text-xs font-sans text-[#8C8C8C] font-normal ml-1">
                / {totalAssetsCount}
              </span>
            </div>
            <span className="text-xs text-[#8C8C8C] block font-mono">CR2 · CR3 · NEF · ARW</span>
          </div>
        </div>
      </div>

      {/* Projects Management Section */}
      <div className="bg-[#111111] border border-[#242424] rounded-2xl overflow-hidden shadow-xl">
        {/* Controls Bar */}
        <div className="p-5 sm:p-6 border-b border-[#242424] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8C8C8C] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by project ID, client name or event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#080808] border border-[#262626] rounded-xl text-xs sm:text-sm text-white placeholder-[#8C8C8C] focus:outline-none focus:border-[#F5B82E] transition-colors font-sans"
            />
          </div>

          {/* Mobile Status Popover */}
          <div className="md:hidden relative">
            <button
              type="button"
              onClick={() => setIsStatusPopoverOpen(!isStatusPopoverOpen)}
              className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-[#080808] border border-[#262626] rounded-xl text-xs font-medium text-white transition-colors min-h-[42px]"
              aria-label="Filter projects by status"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#F5B82E]" />
                <span className="truncate">
                  Status: {[
                    { id: 'all', label: 'All Projects' },
                    { id: 'awaiting_selection', label: 'Awaiting Selection' },
                    { id: 'selections_submitted', label: 'Submitted' },
                    { id: 'album_production', label: 'In Production' },
                  ].find((t) => t.id === statusFilter)?.label || 'All'}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#8C8C8C] transition-transform ${isStatusPopoverOpen ? 'rotate-180 text-white' : ''}`} />
            </button>

            <Popover
              isOpen={isStatusPopoverOpen}
              onClose={() => setIsStatusPopoverOpen(false)}
              align="right"
              className="w-64 p-2 bg-[#121212] border border-[#2D2D2D] rounded-xl shadow-2xl"
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
                      ? 'bg-[#181818] text-[#F5B82E] font-medium'
                      : 'text-[#8C8C8C] hover:text-white hover:bg-[#181818]/60'
                  }`}
                >
                  <span>{tab.label}</span>
                  {statusFilter === tab.id && <Check className="w-3.5 h-3.5 text-[#F5B82E]" />}
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
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors min-h-[36px] ${
                  statusFilter === tab.id
                    ? 'bg-[#242424] text-white shadow-sm font-semibold'
                    : 'text-[#8C8C8C] hover:text-white hover:bg-[#181818]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project List: Restructured Data Hierarchy & Responsive Flexbox (NO Client Portal CTA) */}
        <div className="divide-y divide-[#1C1C1C]">
          {filteredProjects.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <IconProjectsFolio size={36} className="text-[#8C8C8C]/40 mx-auto" />
              <h3 className="text-lg font-editorial text-white font-medium">No projects found</h3>
              <p className="text-xs sm:text-sm text-[#8C8C8C] max-w-sm mx-auto">
                No photography projects match your search criteria.
              </p>
              <button
                onClick={onOpenNewProject}
                className="mt-2 px-4 py-2 text-xs font-medium text-black bg-[#F5B82E] hover:bg-[#E2A622] rounded-lg transition-colors font-sans"
              >
                Create Project
              </button>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const projectAssets = assets.filter((a) => a.projectId === project.id);
              const selectedCount = projectAssets.filter((a) => a.isSelected).length;

              return (
                <div
                  key={project.id}
                  className="p-6 sm:p-7 hover:bg-[#151515]/80 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 font-sans"
                >
                  {/* Left: Restructured Data Hierarchy with generous padding & breathing room */}
                  <div className="space-y-3 min-w-0 flex-1">
                    {/* 1. Project ID: Prominently displayed at the top */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs text-[#F5B82E] font-bold tracking-widest uppercase bg-[#F5B82E]/10 border border-[#F5B82E]/30 px-2.5 py-1 rounded-md">
                        {project.id}
                      </span>
                      <span className="text-[#444444] font-mono">·</span>
                      <span className="text-xs text-[#8C8C8C] font-mono">
                        Event Date: {project.eventDate}
                      </span>
                    </div>

                    {/* 2. Client Name: Strong readable heading weight */}
                    <div>
                      <h2 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-tight leading-snug">
                        {project.clientName}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#8C8C8C] mt-0.5 font-editorial italic">
                        {project.name}
                      </p>
                    </div>

                    {/* 3. Project Type: Styled UI badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#1C1C1C] text-[#F5B82E] border border-[#333333] tracking-wide">
                        {project.packageName}
                      </span>
                      {project.isPinProtected && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#141414] text-[#A3A3A3] border border-[#262626]">
                          <IconMonogramKey size={13} />
                          <span>PIN: {project.sharePin || 'Secured'}</span>
                        </span>
                      )}
                    </div>

                    {/* 4. Simplified Quota Tracker: ONLY the raw selection indicator, NO surrounding explanatory clutter */}
                    <div className="pt-2">
                      <span className="font-mono text-xs sm:text-sm font-semibold text-[#F5B82E] bg-[#0E0E0E] border border-[#262626] px-3.5 py-1.5 rounded-lg tabular-nums inline-block shadow-inner">
                        {selectedCount} / {project.selectionLimit} selected
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions (RAW/JPEG Management, Review Selections, Quick Share Popover) - NO Client Portal CTA! */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      onClick={() => onOpenAssetManager(project)}
                      className="group inline-flex items-center gap-2 px-4 py-2.5 text-xs text-[#A3A3A3] hover:text-white bg-[#121212] hover:bg-[#1C1C1C] border border-[#262626] hover:border-[#383838] rounded-xl transition-all min-h-[42px]"
                      title="Manage RAW and JPEG photo manifests"
                    >
                      <IconRawAperture size={16} />
                      <span>RAW &amp; JPEG ({projectAssets.length})</span>
                    </button>

                    <button
                      onClick={() => onOpenSelectionReview(project)}
                      className="group inline-flex items-center gap-2 px-4 py-2.5 text-xs text-white bg-[#222222] hover:bg-[#2C2C2C] border border-[#333333] rounded-xl transition-all font-medium min-h-[42px]"
                    >
                      <IconAlbumSelection size={16} />
                      <span>Review Selections</span>
                    </button>

                    {/* Share Button: Directly triggers Platform Quick-Share Popover */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSharePopoverProjectId(
                            sharePopoverProjectId === project.id ? null : project.id
                          );
                        }}
                        className="group inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-[#F5B82E] hover:bg-[#E2A622] rounded-xl transition-all shadow-md min-h-[42px]"
                        title="Share direct client link via WhatsApp, Socials or Email"
                      >
                        <IconShareCompass size={16} />
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
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
