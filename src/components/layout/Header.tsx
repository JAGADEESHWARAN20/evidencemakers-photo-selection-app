/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrandLogo } from '../brand/BrandLogo.tsx';
import { Project } from '../../types/project.ts';
import { MobileNavDropdown } from './MobileNavDropdown.tsx';
import { Menu, Plus } from 'lucide-react';
import {
  IconStudioOverview,
  IconProjectsFolio,
} from '../icons/BespokeIcons.tsx';

export type NavView = 'dashboard' | 'projects' | 'assets' | 'selection_review' | 'client_portal';

interface HeaderProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  onOpenNewProject: () => void;
  onOpenApiDocs: () => void;
  projects?: Project[];
  selectedProject?: Project | null;
  onSelectProject?: (project: Project) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenNewProject,
  onOpenApiDocs,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#27272A] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Single Primary Global Brand Wordmark */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => onNavigate('dashboard')}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded p-1 text-left shrink-0 transition-opacity hover:opacity-90"
              aria-label="Evidence Makers Studio Home"
            >
              <BrandLogo variant="horizontal" size="md" />
            </button>
          </div>

          {/* Zone 2: Studio Admin Navigation (Clean labels + Bespoke Animated SVGs, NO subtext, NO active project selector) */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-2 lg:gap-3 text-xs lg:text-sm font-medium tracking-wide"
          >
            <button
              onClick={() => onNavigate('dashboard')}
              className={`group inline-flex items-center gap-2.5 px-3.5 py-2 rounded-lg whitespace-nowrap shrink-0 border transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-[#181818] text-[#D4AF37] border-[#27272A]'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#121212] border-transparent'
              }`}
            >
              <IconStudioOverview size={17} className={currentView === 'dashboard' ? 'text-[#D4AF37]' : 'text-[#A1A1AA] group-hover:text-white'} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('projects')}
              className={`group inline-flex items-center gap-2.5 px-3.5 py-2 rounded-lg whitespace-nowrap shrink-0 border transition-colors ${
                currentView === 'projects'
                  ? 'bg-[#181818] text-[#D4AF37] border-[#27272A]'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#121212] border-transparent'
              }`}
            >
              <IconProjectsFolio size={17} className={currentView === 'projects' ? 'text-[#D4AF37]' : 'text-[#A1A1AA] group-hover:text-white'} />
              <span>Projects</span>
            </button>

          </nav>

          {/* Zone 3: Actions + Mobile Hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Desktop API Docs trigger */}
            <button
              onClick={onOpenApiDocs}
              className="hidden sm:inline-flex items-center px-3.5 py-2 text-xs font-medium text-[#A1A1AA] hover:text-white bg-[#121212] hover:bg-[#181818] border border-[#27272A] rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[40px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              title="View production backend integration specifications"
            >
              API Integration
            </button>

            {/* Mobile Navigation Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2.5 text-[#A1A1AA] hover:text-white bg-[#121212] hover:bg-[#181818] border border-[#27272A] rounded-lg transition-colors flex items-center justify-center min-w-[44px] min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              aria-label="Open mobile navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Dropdown Drawer */}
      <MobileNavDropdown
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentView={currentView}
        onNavigate={onNavigate}
        onOpenNewProject={onOpenNewProject}
        onOpenApiDocs={onOpenApiDocs}
      />
    </>
  );
};
