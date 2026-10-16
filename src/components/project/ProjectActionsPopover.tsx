/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project } from '../../types/project.ts';
import { Popover } from '../common/Popover.tsx';
import {
  MoreVertical,
  Copy,
  Check,
  Camera,
  Layers,
  ExternalLink,
  Shield,
  X,
} from 'lucide-react';

interface ProjectActionsPopoverProps {
  project: Project;
  assetCount: number;
  onOpenAssetManager: () => void;
  onOpenSelectionReview: () => void;
  onOpenClientPortal: () => void;
}

export const ProjectActionsPopover: React.FC<ProjectActionsPopoverProps> = ({
  project,
  assetCount,
  onOpenAssetManager,
  onOpenSelectionReview,
  onOpenClientPortal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/portal/${project.shareToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setIsOpen(false);
    }, 1200);
  };

  return (
    <div className="relative inline-block text-left font-sans">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen)}
        }
        className="p-2 text-[#8C8C8C] hover:text-white bg-[#080808] hover:bg-[#181818] border border-[#242424] hover:border-[#333333] rounded-lg transition-colors flex items-center justify-center min-w-[44px] min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B82E]"
        aria-label="More project actions"
        aria-expanded={isOpen}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {/* Desktop Popover */}
      <div className="hidden sm:block">
        <Popover
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          align="right"
          className="w-56 p-1.5"
        >
          <div className="px-3 py-1.5 border-b border-[#242424] text-[11px] font-medium text-white truncate">
            {project.name}
          </div>

          <div className="py-1 space-y-0.5">
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#8C8C8C] hover:text-white hover:bg-[#181818] rounded-md transition-colors text-left min-h-[40px]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#F5B82E] shrink-0" />
                  <span className="text-[#F5B82E] font-medium">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#8C8C8C] shrink-0" />
                  <span>Copy Client Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenAssetManager();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#8C8C8C] hover:text-white hover:bg-[#181818] rounded-md transition-colors text-left min-h-[40px]"
            >
              <Camera className="w-4 h-4 text-[#8C8C8C] shrink-0" />
              <span>Manage RAW/JPEG ({assetCount})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenSelectionReview();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#8C8C8C] hover:text-white hover:bg-[#181818] rounded-md transition-colors text-left min-h-[40px]"
            >
              <Layers className="w-4 h-4 text-[#8C8C8C] shrink-0" />
              <span>Review Album Selections</span>
            </button>

          </div>

          {project.isPinProtected && (
            <div className="pt-1.5 border-t border-[#242424] px-3 py-1 flex items-center justify-between text-[10px] text-[#8C8C8C]">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-[#F5B82E]" /> PIN Protected
              </span>
              <span className="font-sans font-medium text-white">{project.sharePin}</span>
            </div>
          )}
        </Popover>
      </div>

      {/* Mobile Bottom Action Sheet */}
      {isOpen && (
        <div className="sm:hidden fixed inset-0 z-50 flex flex-col justify-end font-sans">
          <div
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            aria-hidden="true"
          />

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#121212] border-t border-[#242424] rounded-t-2xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200"
          >
            <div className="flex items-center justify-between border-b border-[#242424] pb-3">
              <div className="min-w-0 pr-3">
                <span className="text-[10px] text-[#8C8C8C] uppercase tracking-wider block">
                  Project Actions
                </span>
                <span className="text-sm font-semibold text-white truncate block mt-0.5">
                  {project.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-[#8C8C8C] hover:text-white bg-[#181818] border border-[#242424] rounded-lg min-w-[36px] min-h-[36px] flex items-center justify-center shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3.5 py-3 text-xs text-left text-white bg-[#181818] hover:bg-[#242424] border border-[#242424] rounded-lg transition-colors min-h-[46px]"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#F5B82E] shrink-0" />
                    <span className="text-[#F5B82E] font-medium">Client Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#8C8C8C] shrink-0" />
                    <span>Copy Client Share Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenAssetManager();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-3 text-xs text-left text-white bg-[#181818] hover:bg-[#242424] border border-[#242424] rounded-lg transition-colors min-h-[46px]"
              >
                <Camera className="w-4 h-4 text-[#8C8C8C] shrink-0" />
                <span>Manage RAW &amp; JPEG Assets ({assetCount})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenSelectionReview();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-3 text-xs text-left text-white bg-[#181818] hover:bg-[#242424] border border-[#242424] rounded-lg transition-colors min-h-[46px]"
              >
                <Layers className="w-4 h-4 text-[#8C8C8C] shrink-0" />
                <span>Review Album Selections</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenClientPortal();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-3 text-xs text-left font-semibold text-black bg-[#F5B82E] hover:bg-[#E2A622] rounded-lg transition-colors min-h-[46px]"
              >
                <ExternalLink className="w-4 h-4 text-black shrink-0" />
                <span>Open Client Proofing Portal</span>
              </button>
            </div>

            {project.isPinProtected && (
              <div className="pt-2 border-t border-[#242424] flex items-center justify-between text-xs text-[#8C8C8C]">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#F5B82E]" /> Client PIN:
                </span>
                <span className="font-mono text-sm font-semibold text-white bg-[#080808] px-2.5 py-1 rounded border border-[#242424]">
                  {project.sharePin}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
