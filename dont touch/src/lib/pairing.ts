/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const RAW_EXTENSIONS = ['CR2', 'CR3', 'NEF', 'ARW', 'DNG'] as const;
export const JPEG_EXTENSIONS = ['JPG', 'JPEG'] as const;

export interface FileItem {
  name: string;
  size?: number;
}

export interface PairedAssetGroup {
  baseFilename: string;
  jpegFile?: FileItem;
  rawFile?: FileItem;
  rawExtension?: string;
  status: 'paired' | 'jpeg_only' | 'raw_only' | 'duplicate';
  warnings: string[];
}

/**
 * Extracts base filename without the final file extension.
 * e.g., "_DSC4821.CR3" -> "_DSC4821"
 * e.g., "EM_Wedding_2026.final.jpg" -> "EM_Wedding_2026.final"
 */
export function extractBaseFilename(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex <= 0) return filename.trim();
  return filename.substring(0, lastDotIndex).trim();
}

/**
 * Returns uppercase extension without leading dot.
 */
export function getExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex < 0 || lastDotIndex === filename.length - 1) return '';
  return filename.substring(lastDotIndex + 1).toUpperCase().trim();
}

export function isRawExtension(ext: string): boolean {
  return RAW_EXTENSIONS.includes(ext as (typeof RAW_EXTENSIONS)[number]);
}

export function isJpegExtension(ext: string): boolean {
  return JPEG_EXTENSIONS.includes(ext as (typeof JPEG_EXTENSIONS)[number]);
}

/**
 * Groups a batch of uploaded files into paired RAW+JPEG assets.
 * Matches on exact or normalized base filename (case-insensitive).
 */
export function groupAndPairFiles(files: FileItem[]): PairedAssetGroup[] {
  const groupsMap = new Map<string, {
    baseKey: string;
    displayBase: string;
    jpegs: FileItem[];
    raws: FileItem[];
  }>();

  for (const file of files) {
    const ext = getExtension(file.name);
    const baseName = extractBaseFilename(file.name);
    const normalizedKey = baseName.toLowerCase();

    if (!groupsMap.has(normalizedKey)) {
      groupsMap.set(normalizedKey, {
        baseKey: normalizedKey,
        displayBase: baseName,
        jpegs: [],
        raws: [],
      });
    }

    const group = groupsMap.get(normalizedKey)!;

    if (isJpegExtension(ext)) {
      group.jpegs.push(file);
    } else if (isRawExtension(ext)) {
      group.raws.push(file);
    }
  }

  const result: PairedAssetGroup[] = [];

  for (const group of groupsMap.values()) {
    const warnings: string[] = [];
    let status: PairedAssetGroup['status'] = 'paired';

    if (group.jpegs.length > 1) {
      warnings.push(`Multiple JPEG files (${group.jpegs.length}) found for base "${group.displayBase}"`);
      status = 'duplicate';
    }
    if (group.raws.length > 1) {
      warnings.push(`Multiple RAW files (${group.raws.length}) found for base "${group.displayBase}"`);
      status = 'duplicate';
    }

    if (status !== 'duplicate') {
      if (group.jpegs.length === 1 && group.raws.length === 1) {
        status = 'paired';
      } else if (group.jpegs.length === 1 && group.raws.length === 0) {
        status = 'jpeg_only';
        warnings.push('No matching RAW file uploaded. JPEG preview only.');
      } else if (group.jpegs.length === 0 && group.raws.length === 1) {
        status = 'raw_only';
        warnings.push('No matching JPEG preview. RAW files require a paired JPEG preview for client viewing.');
      }
    }

    const rawFile = group.raws[0];
    const rawExtension = rawFile ? getExtension(rawFile.name) : undefined;

    result.push({
      baseFilename: group.displayBase,
      jpegFile: group.jpegs[0],
      rawFile,
      rawExtension,
      status,
      warnings,
    });
  }

  // Sort alphabetically by baseFilename
  return result.sort((a, b) => a.baseFilename.localeCompare(b.baseFilename, undefined, { numeric: true }));
}
