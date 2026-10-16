/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project } from '../../types/project.ts';
import { Popover } from '../common/Popover.tsx';
import { ChevronDown, Check, Plus, FolderHeart } from 'lucide-react';

interface ProjectSelectorPopoverProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project) => void;
  onOpenNewProject: () => void;
  compactOnMobile?: boolean;
  align?: 'left' | 'right' | 'center';
}

export const ProjectSelectorPopover: React.FC<ProjectSelectorPopoverProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  onOpenNewProject,
  compactOnMobile = false,
  align = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!selectedProject && projects.length === 0) return null;

  return (
    <div className="relative inline-block text-left font-sans">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-[#121212] hover:bg-[#181818] border border-[#242424] hover:border-[#333333] rounded-lg transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] min-h-[40px]"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Switch active project"
      >
        <FolderHeart className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
        <div className="flex flex-col min-w-0">
          <span className="text-[9px] sm:text-[10px] text-[#8C8C8C] uppercase tracking-wider font-sans leading-none">
            Active Project
          </span>
          <span className="text-xs font-semibold text-white truncate max-w-[110px] sm:max-w-[180px] mt-0.5">
            {selectedProject?.name || 'Select Project'}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#8C8C8C] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {/* Popover Dropdown */}
      <Popover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        align={align}
        className="w-[calc(100vw-2rem)] sm:w-80 p-2"
      >
        <div className="px-3 py-2 border-b border-[#242424]">
          <span className="text-[11px] font-semibold text-white uppercase tracking-wider block">
            Studio Projects
          </span>
          <span className="text-[10px] text-[#8C8C8C]">
            Select a project to manage assets and proofs
          </span>
        </div>

        <div className="max-h-60 overflow-y-auto py-1 divide-y divide-[#1C1C1C]">
          {projects.map((project) => {
            const isSelected = selectedProject?.id === project.id;
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => {
                  onSelectProject(project);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2.5 text-left flex items-start justify-between gap-2 transition-colors rounded-md min-h-[44px] ${
                  isSelected
                    ? 'bg-[#181818] text-white'
                    : 'hover:bg-[#181818]/60 text-[#8C8C8C] hover:text-white'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-sans font-medium text-[#D4AF37]">
                      {project.id}
                    </span>
                    <span className="text-[#333333]">·</span>
                    <span className="text-xs font-medium text-white truncate">
                      {project.name}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#8C8C8C] mt-0.5 truncate">
                    {project.clientName} · {project.packageName}
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-[#242424]">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onOpenNewProject();
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-black bg-[#D4AF37] hover:bg-[#C5A028] rounded-md transition-colors min-h-[40px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Project</span>
          </button>
        </div>
      </Popover>
    </div>
  );
};
