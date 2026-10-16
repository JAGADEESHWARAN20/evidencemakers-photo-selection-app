/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Project, PACKAGE_PRESETS } from '../../types/project.ts';
import { CreateProjectDTO } from '../../services/project-service.ts';
import { X, Shield, Check } from 'lucide-react';

interface ProjectCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateProjectDTO) => Promise<Project>;
}

export const ProjectCreateModal: React.FC<ProjectCreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPackage, setSelectedPackage] = useState(PACKAGE_PRESETS[1]); // Gold Album default
  const [customQuota, setCustomQuota] = useState(60);
  const [instructions, setInstructions] = useState(
    'Please select your favorite photographs for the heirloom album layout. You can attach contextual notes to individual photos.'
  );
  const [clientNotes, setClientNotes] = useState('');
  const [isPinProtected, setIsPinProtected] = useState(true);
  const [sharePin, setSharePin] = useState(Math.floor(1000 + Math.random() * 9000).toString());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePackageSelect = (pkg: (typeof PACKAGE_PRESETS)[0]) => {
    setSelectedPackage(pkg);
    setCustomQuota(pkg.selectionLimit);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter a project name (e.g. Arjun Wedding).');
      return;
    }
    if (!clientName.trim()) {
      setErrorMessage('Please enter the client name.');
      return;
    }
    if (!clientEmail.trim() || !clientEmail.includes('@')) {
      setErrorMessage('Please enter a valid client email address.');
      return;
    }
    if (customQuota < 1) {
      setErrorMessage('Selection quota must be at least 1 photo.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        name: name.trim(),
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        eventDate,
        packageName: selectedPackage.name,
        selectionLimit: customQuota,
        packageInstructions: instructions.trim(),
        clientNotes: clientNotes.trim() || undefined,
        isPinProtected,
        sharePin: isPinProtected ? sharePin : undefined,
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto font-sans"
    >
      <div className="bg-[#121212] border border-[#242424] rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#242424] pb-4">
          <div>
            <h2 id="create-project-title" className="text-2xl font-editorial font-semibold text-white">
              Create New Photography Project
            </h2>
            <p className="text-xs text-[#8C8C8C] mt-0.5">
              Configure package limits, private client access link &amp; album instructions
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8C8C8C] hover:text-white rounded-md transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 bg-[#181818] border border-[#F5B82E]/50 rounded-md text-xs text-[#F5B82E]">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Project & Client Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-[#8C8C8C] uppercase tracking-wider mb-1.5">
                Project Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Arjun & Priya Wedding"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#080808] border border-[#242424] rounded-md text-sm text-white placeholder-[#8C8C8C] focus:outline-none focus:border-[#F5B82E] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8C8C8C] uppercase tracking-wider mb-1.5">
                Client Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Arjun & Priya Sharma"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#080808] border border-[#242424] rounded-md text-sm text-white placeholder-[#8C8C8C] focus:outline-none focus:border-[#F5B82E] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8C8C8C] uppercase tracking-wider mb-1.5">
                Client Email *
              </label>
              <input
                type="email"
                required
                placeholder="client@example.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#080808] border border-[#242424] rounded-md text-sm text-white placeholder-[#8C8C8C] focus:outline-none focus:border-[#F5B82E] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8C8C8C] uppercase tracking-wider mb-1.5">
                Event Date
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#080808] border border-[#242424] rounded-md text-sm text-white focus:outline-none focus:border-[#F5B82E] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#8C8C8C] uppercase tracking-wider mb-1.5">
                Selection Limit (Quota) *
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={customQuota}
                onChange={(e) => setCustomQuota(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-[#080808] border border-[#242424] rounded-md text-sm text-white focus:outline-none focus:border-[#F5B82E] transition-colors"
              />
            </div>
          </div>

          {/* Photography Package Selector */}
          <div>
            <label className="block text-xs font-medium text-[#8C8C8C] uppercase tracking-wider mb-2">
              Photography Package
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {PACKAGE_PRESETS.map((pkg) => (
                <button
                  type="button"
                  key={pkg.id}
                  onClick={() => handlePackageSelect(pkg)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedPackage.id === pkg.id
                      ? 'border-[#F5B82E] bg-[#F5B82E]/10 text-white'
                      : 'border-[#242424] bg-[#080808] text-[#8C8C8C] hover:border-[#333333]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-editorial text-sm font-semibold text-white">
                      {pkg.name}
                    </span>
                    {selectedPackage.id === pkg.id && (
                      <Check className="w-4 h-4 text-[#F5B82E]" />
                    )}
                  </div>
                  <span className="text-[11px] text-[#8C8C8C] block mt-1">
                    {pkg.selectionLimit} images limit
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Album Instructions & Internal Studio Notes */}
          <div>
            <label className="block text-xs font-medium text-[#8C8C8C] uppercase tracking-wider mb-1.5">
              Package Instructions for Client
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#080808] border border-[#242424] rounded-md text-xs text-white focus:outline-none focus:border-[#F5B82E] transition-colors"
            />
          </div>

          {/* Security & Access Protection */}
          <div className="p-4 bg-[#080808] border border-[#242424] rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#F5B82E]" />
                <span className="text-xs font-medium text-white">
                  Client PIN Access Protection
                </span>
              </div>
              <input
                type="checkbox"
                checked={isPinProtected}
                onChange={(e) => setIsPinProtected(e.target.checked)}
                className="w-4 h-4 rounded text-[#F5B82E] focus:ring-[#F5B82E] accent-[#F5B82E] cursor-pointer"
              />
            </div>

            {isPinProtected && (
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs text-[#8C8C8C]">4-Digit Access PIN:</span>
                <input
                  type="text"
                  maxLength={6}
                  value={sharePin}
                  onChange={(e) => setSharePin(e.target.value)}
                  className="w-24 px-2 py-1 text-center font-sans font-medium text-sm bg-[#121212] border border-[#242424] rounded text-[#F5B82E]"
                />
                <button
                  type="button"
                  onClick={() => setSharePin(Math.floor(1000 + Math.random() * 9000).toString())}
                  className="text-[11px] text-[#8C8C8C] hover:text-white underline"
                >
                  Regenerate
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#242424]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs text-[#8C8C8C] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-[#F5B82E] hover:bg-[#E2A622] disabled:opacity-50 rounded-md transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create & Generate Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
