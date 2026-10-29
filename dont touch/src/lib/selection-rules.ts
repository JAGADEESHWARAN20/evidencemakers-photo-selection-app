/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface QuotaCheckResult {
  canSelect: boolean;
  selectedCount: number;
  limit: number;
  remaining: number;
  isAtLimit: boolean;
  isOverLimit: boolean;
  reason?: string;
}

export function evaluateSelectionQuota(
  currentSelectedCount: number,
  limit: number,
  isTogglingOn: boolean,
  isSubmissionLocked: boolean = false
): QuotaCheckResult {
  if (isSubmissionLocked) {
    return {
      canSelect: false,
      selectedCount: currentSelectedCount,
      limit,
      remaining: Math.max(0, limit - currentSelectedCount),
      isAtLimit: currentSelectedCount >= limit,
      isOverLimit: currentSelectedCount > limit,
      reason: 'Selections have already been submitted and the gallery is locked for album production.',
    };
  }

  if (!isTogglingOn) {
    // Deselecting is always permitted
    const nextCount = Math.max(0, currentSelectedCount - 1);
    return {
      canSelect: true,
      selectedCount: nextCount,
      limit,
      remaining: Math.max(0, limit - nextCount),
      isAtLimit: nextCount >= limit,
      isOverLimit: nextCount > limit,
    };
  }

  // Toggling on
  if (currentSelectedCount >= limit) {
    return {
      canSelect: false,
      selectedCount: currentSelectedCount,
      limit,
      remaining: 0,
      isAtLimit: true,
      isOverLimit: currentSelectedCount > limit,
      reason: `Package limit reached (${limit} photos). To select this image, please deselect another photo first.`,
    };
  }

  const nextCount = currentSelectedCount + 1;
  return {
    canSelect: true,
    selectedCount: nextCount,
    limit,
    remaining: Math.max(0, limit - nextCount),
    isAtLimit: nextCount === limit,
    isOverLimit: nextCount > limit,
  };
}

export function validateFinalSubmission(
  selectedCount: number,
  limit: number,
  minRequiredThreshold: number = 1
): { isValid: boolean; error?: string } {
  if (selectedCount < minRequiredThreshold) {
    return {
      isValid: false,
      error: `Please select at least ${minRequiredThreshold} photo before submitting your album selection.`,
    };
  }

  if (selectedCount > limit) {
    return {
      isValid: false,
      error: `You have selected ${selectedCount} photos, which exceeds your package limit of ${limit}. Please reduce by ${selectedCount - limit} photos.`,
    };
  }

  return { isValid: true };
}

export function toggleSelectionInSet(selectedIds: Set<string>, assetId: string): Set<string> {
  const nextSet = new Set(selectedIds);
  if (nextSet.has(assetId)) {
    nextSet.delete(assetId);
  } else {
    nextSet.add(assetId);
  }
  return nextSet;
}

export function filterAssetsBySelection<T extends { id: string }>(
  assets: T[],
  selectedIds: Set<string>,
  filter: 'all' | 'selected' | 'unselected'
): T[] {
  switch (filter) {
    case 'selected':
      return assets.filter((asset) => selectedIds.has(asset.id));
    case 'unselected':
      return assets.filter((asset) => !selectedIds.has(asset.id));
    default:
      return assets;
  }
}

