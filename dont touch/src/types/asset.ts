/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RawExtension = 'CR2' | 'CR3' | 'NEF' | 'ARW' | 'DNG';
export type JpegExtension = 'JPG' | 'JPEG';

export type PairingStatus = 'paired' | 'jpeg_only' | 'raw_only' | 'duplicate';

export interface ExifData {
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
  captureTime?: string;
}

export interface GalleryAsset {
  id: string;
  projectId: string;
  baseFilename: string; // e.g. "EM_WEDDING_4891"
  jpegFilename: string; // e.g. "EM_WEDDING_4891.JPG"
  rawFilename?: string; // e.g. "EM_WEDDING_4891.CR3"
  rawExtension?: RawExtension;
  previewUrl: string; // Fast loading preview
  thumbnailUrl?: string;
  rawStorageRef?: string; // Private object storage key
  rawDownloadUrl?: string; // Short-lived presigned URL
  rawFileSizeFormatted?: string; // e.g. "42.8 MB"
  rawFileSizeBytes?: number;
  jpegFileSizeBytes?: number;
  pairingStatus: PairingStatus;
  category: 'getting_ready' | 'ceremony' | 'portraits' | 'reception' | 'details';
  isSelected: boolean;
  selectedAt?: string;
  exif?: ExifData;
  commentCount: number;
  width?: number;
  height?: number;
}

export interface UploadBatchItem {
  id: string;
  file: File;
  name: string;
  size: number;
  extension: string;
  isRaw: boolean;
  isJpeg: boolean;
  baseName: string;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  progress: number;
  errorMessage?: string;
  pairedWithId?: string;
}
