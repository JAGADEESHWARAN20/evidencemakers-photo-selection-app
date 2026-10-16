/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GalleryAsset } from '../types/asset.ts';

export interface PresignedUploadUrlRequest {
  projectId: string;
  filename: string;
  fileSize: number;
  contentType: string;
  isRaw: boolean;
}

export interface PresignedUploadUrlResponse {
  uploadUrl: string;
  storageKey: string;
  headers?: Record<string, string>;
  expiresInSeconds: number;
}

export interface RegisterAssetDTO {
  projectId: string;
  baseFilename: string;
  jpegFilename: string;
  rawFilename?: string;
  previewUrl: string;
  rawStorageRef?: string;
  category?: GalleryAsset['category'];
  fileSizeBytes?: number;
  rawFileSizeBytes?: number;
}

export interface IAssetService {
  getAssetsByProject(projectId: string): Promise<GalleryAsset[]>;
  requestPresignedUpload(dto: PresignedUploadUrlRequest): Promise<PresignedUploadUrlResponse>;
  registerAsset(dto: RegisterAssetDTO): Promise<GalleryAsset>;
  getRawDownloadUrl(assetId: string): Promise<{ downloadUrl: string; filename: string; expiresIn: number }>;
  batchRegisterAssets(projectId: string, assets: RegisterAssetDTO[]): Promise<GalleryAsset[]>;
}
