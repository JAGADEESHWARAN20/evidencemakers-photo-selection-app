/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { NavView } from './Header.tsx';
import { Code2, X } from 'lucide-react';
import { BrandLogo } from '../brand/BrandLogo.tsx';
import {
  IconStudioOverview,
  IconProjectsFolio,
  IconRawAperture,
  IconAlbumSelection,
  IconPlusProject,
} from '../icons/BespokeIcons.tsx';

interface MobileNavDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  onOpenNewProject: () => void;
  onOpenApiDocs: () => void;
}

export const MobileNavDropdown: React.FC<MobileNavDropdownProps> = ({
  isOpen,
  onClose,
  currentView,
  onNavigate,
  onOpenNewProject,
  onOpenApiDocs,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Clean navigation items without descriptive subtext
  const navItems: Array<{ id: NavView; label: string; icon: React.ReactNode }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <IconStudioOverview size={20} />,
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <IconProjectsFolio size={20} />,
    },
    {
      id: 'assets',
      label: 'RAW & Assets',
      icon: <IconRawAperture size={20} />,
    },
    {
      id: 'selection_review',
      label: 'Album Selections',
      icon: <IconAlbumSelection size={20} />,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 flex flex-col justify-start bg-black/80 backdrop-blur-md font-sans md:hidden animate-in fade-in duration-150"
    >
      <div className="bg-[#080808] border-b border-[#242424] shadow-2xl p-5 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Top Header of Mobile Menu with Single Primary Brand Logo */}
        <div className="flex items-center justify-between border-b border-[#242424] pb-4">
          <BrandLogo variant="horizontal" size="sm" />
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#8C8C8C] hover:text-white bg-[#121212] border border-[#242424] rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B82E]"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links (Clean labels, bespoke SVGs, NO subtext) */}
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`group w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-left transition-all min-h-[50px] ${
                  isActive
                    ? 'bg-[#181818] border border-[#F5B82E]/40 text-[#F5B82E] font-semibold'
                    : 'hover:bg-[#121212] border border-transparent text-[#8C8C8C] hover:text-white font-medium'
                }`}
              >
                <div className={`shrink-0 ${isActive ? 'text-[#F5B82E]' : 'text-[#8C8C8C] group-hover:text-white'}`}>
                  {item.icon}
                </div>
                <span className="text-sm tracking-wide">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Actions Strip */}
        <div className="pt-4 border-t border-[#242424] space-y-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenNewProject();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold uppercase tracking-wider text-black bg-[#F5B82E] hover:bg-[#E2A622] rounded-xl transition-all shadow-md min-h-[46px]"
          >
            <IconPlusProject size={15} />
            <span>Create New Project</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenApiDocs();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-medium text-[#8C8C8C] hover:text-white bg-[#121212] hover:bg-[#181818] border border-[#242424] rounded-xl transition-colors min-h-[42px]"
          >
            <Code2 className="w-4 h-4 text-[#F5B82E]" />
            <span>API Integration Specifications</span>
          </button>
        </div>
      </div>

      {/* Dimmed backdrop area (clickable to dismiss) */}
      <div className="flex-1" onClick={onClose} aria-hidden="true" />
    </div>
  );
};
