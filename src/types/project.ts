/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string; // e.g. "EM-2026-089"
  name: string; // e.g. "Arjun & Priya Wedding"
  clientName: string; // e.g. "Arjun & Priya Sharma"
  clientEmail: string;
  eventDate: string; // "2026-09-18"
  packageName: string; // "Gold Album"
  selectionLimit: number; // e.g. 60
  packageInstructions: string;
  clientNotes?: string;
  shareToken: string;
  sharePin?: string;
  isPinProtected: boolean;
  status: 'draft' | 'awaiting_selection' | 'selections_submitted' | 'album_production' | 'completed';
  createdAt: string;
  updatedAt: string;
  submissionDate?: string;
  finalClientNote?: string;
}

export interface PackagePreset {
  id: string;
  name: string;
  selectionLimit: number;
  description: string;
}

export const PACKAGE_PRESETS: PackagePreset[] = [
  {
    id: 'silver',
    name: 'Silver Collection',
    selectionLimit: 40,
    description: '40 curated master images for fine-art flush mount album',
  },
  {
    id: 'gold',
    name: 'Gold Album',
    selectionLimit: 60,
    description: '60 signature spreads for panoramic leather-bound heirloom album',
  },
  {
    id: 'platinum',
    name: 'Platinum Master',
    selectionLimit: 100,
    description: '100 grand highlights with dual companion parent albums',
  },
  {
    id: 'bespoke',
    name: 'Bespoke Custom',
    selectionLimit: 80,
    description: 'Custom tailored selection according to bespoke contract',
  },
];
