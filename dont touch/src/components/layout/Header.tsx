/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrandLogo } from '../brand/BrandLogo.tsx';
import { Project } from '../../types/project.ts';
import { MobileNavDropdown } from './MobileNavDropdown.tsx';
import { ThemeToggle } from '../../context/ThemeContext.tsx';
import { Menu } from 'lucide-react';
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
      <header className="brand-header sticky top-0 z-40 w-full">
        <div className="brand-header__inner max-w-7xl mx-auto flex items-center justify-between">
          {/* Zone 1: Single Primary Global Brand Wordmark */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => onNavigate('dashboard')}
              className="brand-logo-button text-left shrink-0"
              aria-label="Evidence Makers Studio Home"
            >
              <BrandLogo variant="horizontal" size="md" />
            </button>
          </div>

          {/* Zone 2: Studio Admin Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1 text-sm font-medium"
          >
            <button
              onClick={() => onNavigate('dashboard')}
              aria-current={currentView === 'dashboard' ? 'page' : undefined}
              className="brand-nav-link group"
            >

              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('projects')}
              aria-current={currentView === 'projects' ? 'page' : undefined}
              className="brand-nav-link group"
            >

              <span>Projects</span>
            </button>
          </nav>

          {/* Zone 3: Theme Toggle + Actions + Mobile Hamburger */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Global Dark / Light Theme Switcher */}
            <ThemeToggle variant="segmented" className="hidden md:inline-flex" />

            {/* Desktop API Docs trigger */}
            <button
              onClick={onOpenApiDocs}
              className="brand-button brand-button--quiet hidden lg:inline-flex"
              title="View production backend integration specifications"
            >
              API Integration
            </button>

            {/* Mobile Navigation Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="brand-icon-button md:hidden"
              aria-label="Open mobile navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="w-5 h-5" />
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
