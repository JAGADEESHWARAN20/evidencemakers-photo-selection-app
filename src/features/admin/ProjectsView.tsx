/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, ChevronRight, FolderOpen, Plus } from 'lucide-react';
import { Project } from '../../types/project.ts';
import { GalleryAsset } from '../../types/asset.ts';

interface ProjectsViewProps {
  projects: Project[];
  assets: GalleryAsset[];
  onOpenProject: (project: Project) => void;
  onOpenNewProject: () => void;
}

const statusBadgeConfig: Record<Project['status'], { label: string; className: string; dotClassName: string }> = {
  draft: {
    label: 'Draft',
    className: 'border-zinc-700 bg-zinc-800/40 text-zinc-400',
    dotClassName: 'bg-zinc-400',
  },
  awaiting_selection: {
    label: 'Awaiting Selection',
    className: 'border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]',
    dotClassName: 'bg-[#D4AF37]',
  },
  selections_submitted: {
    label: 'Selections Submitted',
    className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    dotClassName: 'bg-emerald-400',
  },
  album_production: {
    label: 'In Production',
    className: 'border-sky-500/30 bg-sky-500/10 text-sky-400',
    dotClassName: 'bg-sky-400',
  },
  completed: {
    label: 'Delivered',
    className: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
    dotClassName: 'bg-purple-400',
  },
};

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  assets,
  onOpenProject,
  onOpenNewProject,
}) => (
  <div className="space-y-8 font-sans">
    <div className="flex flex-col gap-5 border-b border-[#27272A] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">Studio archive</p>
        <h1 className="mt-1 text-3xl font-editorial font-medium tracking-tight text-white sm:text-4xl">Projects</h1>
        <p className="mt-1.5 text-sm text-[#A1A1AA]">All client galleries and album workflows in one place.</p>
      </div>
      <button
        type="button"
        onClick={onOpenNewProject}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-black shadow-md transition-colors hover:bg-[#C5A028] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
      >
        <Plus className="h-4 w-4" />
        New project
      </button>
    </div>

    {projects.length === 0 ? (
      <div className="rounded-none border border-[#27272A] bg-[#121212] p-16 text-center">
        <FolderOpen className="mx-auto h-10 w-10 text-[#8C8C8C]/40" />
        <h2 className="mt-3 text-lg font-editorial text-white">No projects yet</h2>
        <p className="mt-1 text-sm text-[#8C8C8C]">Create your first client gallery to begin.</p>
      </div>
    ) : (
      <div className="overflow-hidden rounded-none border border-[#27272A] bg-[#121212]">
        {/* Table Column Headers (Desktop) */}
        <div className="hidden md:grid md:grid-cols-[minmax(0,1.8fr)_140px_minmax(180px,1.2fr)_160px_32px] items-center gap-6 border-b border-[#27272A] bg-[#0c0c0c] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#71717A]">
          <div>Project &amp; Client</div>
          <div>Date</div>
          <div>Selection Quota</div>
          <div className="text-center">Status</div>
          <div></div>
        </div>

        {projects.map((project) => {
          const projectAssets = assets.filter((asset) => asset.projectId === project.id);
          const selectedCount = projectAssets.filter((asset) => asset.isSelected).length;
          const selectionPercent = Math.min(100, Math.round((selectedCount / (project.selectionLimit || 1)) * 100));
          const status = statusBadgeConfig[project.status];

          return (
            <button
              key={project.id}
              type="button"
              onClick={() => onOpenProject(project)}
              className="group grid w-full grid-cols-1 gap-4 border-b border-[#27272A] p-5 text-left transition-colors last:border-b-0 hover:bg-[#181818] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D4AF37] md:grid-cols-[minmax(0,1.8fr)_140px_minmax(180px,1.2fr)_160px_32px] md:items-center md:gap-6 md:px-6 md:py-5"
            >
              <div className="min-w-0 pr-2">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono">
                  <span className="font-semibold tracking-wider text-[#D4AF37]">{project.id}</span>
                  <span className="text-[#4A4A4A]">·</span>
                  <span className="text-[#A1A1AA] truncate">{project.packageName}</span>
                </div>
                <h2 className="mt-1 text-lg font-editorial font-bold text-white transition-colors group-hover:text-[#D4AF37] truncate">
                  {project.clientName}
                </h2>
                <p className="mt-0.5 truncate text-xs text-[#A1A1AA]">{project.name}</p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-[#A1A1AA]">
                <Calendar className="h-3.5 w-3.5 shrink-0 text-[#71717A]" />
                <span className="truncate">{project.eventDate}</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#A1A1AA]">
                  <span>Curated</span>
                  <span className="font-semibold text-white">{selectedCount} / {project.selectionLimit}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#27272A]">
                  <div className="h-full rounded-full bg-[#D4AF37] transition-all duration-300" style={{ width: `${selectionPercent}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-start md:justify-center">
                <span className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold w-full max-w-[150px] ${status.className}`}>
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${status.dotClassName}`} />
                  <span className="truncate">{status.label}</span>
                </span>
              </div>

              <div className="hidden md:flex justify-end">
                <ChevronRight className="h-5 w-5 text-[#71717A] transition-transform group-hover:translate-x-0.5 group-hover:text-[#D4AF37]" />
              </div>
            </button>
          );
        })}
      </div>
    )}
  </div>
);
