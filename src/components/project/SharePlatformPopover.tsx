/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project } from '../../types/project.ts';
import { Popover } from '../common/Popover.tsx';
import {
  IconShareWhatsApp,
  IconShareFacebook,
  IconShareInstagram,
  IconShareEmail,
  IconCopyLink,
  IconMonogramKey,
} from '../icons/BespokeIcons.tsx';
import { Check } from 'lucide-react';

interface SharePlatformPopoverProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  align?: 'left' | 'right' | 'center';
}

export const SharePlatformPopover: React.FC<SharePlatformPopoverProps> = ({
  project,
  isOpen,
  onClose,
  align = 'right',
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const portalUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?portal=${project.shareToken}`
    : `https://evidencemakers.studio/?portal=${project.shareToken}`;

  const shareText = `Evidence Makers Studio: Private Photo Proofing Gallery for ${project.clientName}. Direct access link: ${portalUrl}${
    project.sharePin ? ` · Access PIN: ${project.sharePin}` : ''
  }`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleFacebook = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(portalUrl)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleInstagram = (e: React.MouseEvent) => {
    e.stopPropagation();
    const instaCaption = `✨ Private Wedding & Event Proofing Gallery for ${project.clientName}\nCurated by Evidence Makers Studio\n\nLink: ${portalUrl}\nAccess PIN: ${project.sharePin || 'None'}`;
    handleCopy(instaCaption, 'instagram');
  };

  const handleEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    const mailto = `mailto:${encodeURIComponent(project.clientEmail || '')}?subject=${encodeURIComponent(
      `Private Photo Proofing Gallery · ${project.name}`
    )}&body=${encodeURIComponent(
      `Dear ${project.clientName},\n\nYour signature photography collection is ready for viewing and album selection in your private client portal.\n\nDirect Gallery Link:\n${portalUrl}\n\nAccess PIN:\n${project.sharePin || 'None'}\n\nBest regards,\nEvidence Makers Studio`
    )}`;
    window.location.href = mailto;
    onClose();
  };

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      align={align}
      className="w-72 sm:w-80 p-3 bg-[#111111] border border-[#2D2D2D] rounded-xl shadow-2xl font-sans"
    >
      <div className="space-y-3">
        {/* Header summary */}
        <div className="border-b border-[#242424] pb-2.5 px-1 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-widest text-[#F5B82E] font-semibold">
            Quick Share Gallery
          </span>
          {project.sharePin && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#8C8C8C] bg-[#080808] border border-[#242424] px-1.5 py-0.5 rounded">
              <IconMonogramKey size={12} />
              <span>PIN: {project.sharePin}</span>
            </span>
          )}
        </div>

        {/* Platform actions */}
        <div className="space-y-1">
          {/* WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-[#E5E5E5] hover:text-white hover:bg-[#181818] transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] group-hover:scale-105 transition-transform">
                <IconShareWhatsApp size={15} />
              </div>
              <span className="font-medium">Share via WhatsApp</span>
            </div>
            <span className="text-[10px] text-[#8C8C8C] group-hover:text-white">Direct</span>
          </button>

          {/* Facebook */}
          <button
            type="button"
            onClick={handleFacebook}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-[#E5E5E5] hover:text-white hover:bg-[#181818] transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#1877F2]/15 border border-[#1877F2]/30 flex items-center justify-center text-[#1877F2] group-hover:scale-105 transition-transform">
                <IconShareFacebook size={15} />
              </div>
              <span className="font-medium">Post to Facebook</span>
            </div>
            <span className="text-[10px] text-[#8C8C8C] group-hover:text-white">Social</span>
          </button>

          {/* Instagram */}
          <button
            type="button"
            onClick={handleInstagram}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-[#E5E5E5] hover:text-white hover:bg-[#181818] transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#E4405F]/15 border border-[#E4405F]/30 flex items-center justify-center text-[#E4405F] group-hover:scale-105 transition-transform">
                <IconShareInstagram size={15} />
              </div>
              <span className="font-medium">Copy for Instagram Stories</span>
            </div>
            {copiedType === 'instagram' ? (
              <span className="text-[10px] text-[#F5B82E] font-medium flex items-center gap-1">
                <Check className="w-3 h-3 text-[#F5B82E]" />
                Copied
              </span>
            ) : (
              <span className="text-[10px] text-[#8C8C8C]">Story/DM</span>
            )}
          </button>

          {/* Email */}
          <button
            type="button"
            onClick={handleEmail}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-[#E5E5E5] hover:text-white hover:bg-[#181818] transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#F5B82E]/15 border border-[#F5B82E]/30 flex items-center justify-center text-[#F5B82E] group-hover:scale-105 transition-transform">
                <IconShareEmail size={15} />
              </div>
              <span className="font-medium">Email Client Invitation</span>
            </div>
            <span className="text-[10px] text-[#8C8C8C]">Direct</span>
          </button>
        </div>

        {/* Direct Link Copy Button */}
        <div className="pt-2 border-t border-[#242424]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy(portalUrl, 'direct_link');
            }}
            className="w-full py-2.5 px-3 bg-[#080808] hover:bg-[#161616] border border-[#2D2D2D] hover:border-[#F5B82E] rounded-lg text-xs text-white font-medium flex items-center justify-center gap-2 transition-all shadow-inner"
          >
            {copiedType === 'direct_link' ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#F5B82E]" />
                <span className="text-[#F5B82E] font-semibold">Direct Share Link Copied!</span>
              </>
            ) : (
              <>
                <IconCopyLink size={15} />
                <span>Copy Direct Portal URL</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Popover>
  );
};
