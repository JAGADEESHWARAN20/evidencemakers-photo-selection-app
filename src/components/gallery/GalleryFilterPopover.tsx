/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Popover } from '../common/Popover.tsx';
import { SlidersHorizontal, Check, ChevronDown } from 'lucide-react';

interface GalleryFilterPopoverProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  selectionFilter: 'all' | 'selected' | 'unselected' | 'commented';
  onSelectSelectionFilter: (filter: 'all' | 'selected' | 'unselected' | 'commented') => void;
  selectedCount: number;
  totalCount: number;
}

export const GalleryFilterPopover: React.FC<GalleryFilterPopoverProps> = ({
  activeCategory,
  onSelectCategory,
  selectionFilter,
  onSelectSelectionFilter,
  selectedCount,
  totalCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'ceremony', label: 'Ceremony' },
    { id: 'portraits', label: 'Portraits' },
    { id: 'reception', label: 'Reception' },
    { id: 'details', label: 'Details' },
    { id: 'getting_ready', label: 'Getting Ready' },
  ];

  const selectionFilters: Array<{
    id: 'all' | 'selected' | 'unselected' | 'commented';
    label: string;
  }> = [
    { id: 'all', label: `Show All (${totalCount})` },
    { id: 'selected', label: `Selected for Album (${selectedCount})` },
    { id: 'unselected', label: 'Unselected Only' },
    { id: 'commented', label: 'With Retouch Notes' },
  ];

  const activeCategoryLabel = categories.find((c) => c.id === activeCategory)?.label || 'All Photos';

  return (
    <div className="relative inline-block text-left font-sans">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-[#121212] hover:bg-[#181818] border border-[#242424] hover:border-[#333333] rounded-lg text-xs font-medium text-white transition-colors min-h-[44px]"
        aria-expanded={isOpen}
        aria-label="Filter photos popover"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-[#F5B82E]" />
        <span className="truncate max-w-[130px]">{activeCategoryLabel}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#8C8C8C] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      <Popover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        align="left"
        className="w-72 p-3 space-y-3"
      >
        {/* Category Section */}
        <div>
          <span className="text-[10px] font-semibold text-[#8C8C8C] uppercase tracking-wider block mb-1.5">
            Event Section / Category
          </span>
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onSelectCategory(cat.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md transition-colors min-h-[36px] ${
                  activeCategory === cat.id
                    ? 'bg-[#181818] text-[#F5B82E] font-medium'
                    : 'text-[#8C8C8C] hover:text-white hover:bg-[#181818]/50'
                }`}
              >
                <span>{cat.label}</span>
                {activeCategory === cat.id && <Check className="w-3.5 h-3.5 text-[#F5B82E]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Selection Status Section */}
        <div className="pt-2 border-t border-[#242424]">
          <span className="text-[10px] font-semibold text-[#8C8C8C] uppercase tracking-wider block mb-1.5">
            Selection Status
          </span>
          <div className="space-y-1">
            {selectionFilters.map((sf) => (
              <button
                key={sf.id}
                type="button"
                onClick={() => {
                  onSelectSelectionFilter(sf.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md transition-colors min-h-[36px] ${
                  selectionFilter === sf.id
                    ? 'bg-[#F5B82E] text-black font-semibold'
                    : 'text-[#8C8C8C] hover:text-white hover:bg-[#181818]/50'
                }`}
              >
                <span>{sf.label}</span>
                {selectionFilter === sf.id && <Check className="w-3.5 h-3.5 text-black" />}
              </button>
            ))}
          </div>
        </div>
      </Popover>
    </div>
  );
};
