/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SelectionState, SelectionSubmissionRequest } from '../types/selection.ts';

export interface ISelectionService {
  getSelectionState(projectId: string): Promise<SelectionState>;
  toggleAssetSelection(projectId: string, assetId: string, isSelected: boolean): Promise<SelectionState>;
  submitFinalSelection(request: SelectionSubmissionRequest): Promise<SelectionState>;
  resetSelections(projectId: string): Promise<SelectionState>;
}
