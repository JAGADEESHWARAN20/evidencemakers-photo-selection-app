/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SelectionState {
  projectId: string;
  selectedAssetIds: string[];
  limit: number;
  remaining: number;
  isLocked: boolean; // Once final submission is confirmed
  submittedAt?: string;
  clientSubmissionNote?: string;
  status: 'draft' | 'submitting' | 'submitted' | 'failed';
}

export interface SelectionSubmissionRequest {
  projectId: string;
  selectedAssetIds: string[];
  clientNote?: string;
}
