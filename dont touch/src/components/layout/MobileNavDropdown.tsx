/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { NavView } from './Header.tsx';
import { Code2, X } from 'lucide-react';
import { BrandLogo } from '../brand/BrandLogo.tsx';
import { ThemeToggle } from '../../context/ThemeContext.tsx';
import {
  IconStudioOverview,
  IconProjectsFolio,
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
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="brand-mobile-overlay fixed inset-0 z-50 flex flex-col justify-start font-sans md:hidden animate-in fade-in duration-150"
    >
      <div className="brand-mobile-panel space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Top Header of Mobile Menu with Single Primary Brand Logo */}
        <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
          <BrandLogo variant="horizontal" size="sm" />
          <button
            type="button"
            onClick={onClose}
          className="brand-icon-button"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
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
                aria-current={isActive ? 'page' : undefined}
                className="brand-mobile-nav-link group"
              >
                <div className={`shrink-0 ${isActive ? 'text-[#D4AF37]' : 'text-[#A1A1AA] group-hover:text-white'}`}>
                  {item.icon}
                </div>
                <span className="text-sm tracking-wide">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Theme Preference Selector */}
        <div className="pt-4 border-t border-[#27272A] flex items-center justify-between">
          <span className="text-xs font-medium text-[#A1A1AA]">Appearance Theme</span>
          <ThemeToggle variant="segmented" />
        </div>

        {/* Actions Strip */}
        <div className="pt-4 border-t border-[#27272A] space-y-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenNewProject();
            }}
            className="brand-button brand-button--primary w-full"
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
            className="brand-button brand-button--quiet w-full"
          >
            <Code2 className="w-4 h-4 text-[#D4AF37]" />
            <span>API Integration Specifications</span>
          </button>
        </div>
      </div>

      {/* Dimmed backdrop area (clickable to dismiss) */}
      <div className="flex-1" onClick={onClose} aria-hidden="true" />
    </div>
  );
};
