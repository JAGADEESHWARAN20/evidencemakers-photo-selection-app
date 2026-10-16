/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IStorageAdapter {
  /**
   * Uploads a file directly to object storage via presigned PUT/POST.
   * This prevents large RAW camera files from bogging down the application API server.
   */
  uploadDirect(
    uploadUrl: string,
    file: File | Blob,
    headers?: Record<string, string>,
    onProgress?: (percentage: number) => void
  ): Promise<boolean>;

  /**
   * Generates a temporary object URL for browser preview of local uploads.
   */
  createPreviewUrl(file: File): string;
}

export class DirectStorageAdapter implements IStorageAdapter {
  public async uploadDirect(
    uploadUrl: string,
    file: File | Blob,
    headers?: Record<string, string>,
    onProgress?: (percentage: number) => void
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);

      if (headers) {
        Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
      }

      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable && onProgress) {
          const pct = Math.round((evt.loaded / evt.total) * 100);
          onProgress(pct);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          if (onProgress) onProgress(100);
          resolve(true);
        } else {
          reject(new Error(`Direct storage upload failed with HTTP ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during storage upload.'));
      xhr.send(file);
    });
  }

  public createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }
}
