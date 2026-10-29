/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MessageRole = 'admin' | 'client';

export interface Message {
  id: string;
  projectId: string;
  assetId?: string; // Optional: if present, this is an image-level contextual message
  senderName: string;
  senderRole: MessageRole;
  text: string;
  createdAt: string; // ISO format
  isRead?: boolean;
}

export interface SendMessagePayload {
  projectId: string;
  assetId?: string;
  senderName: string;
  senderRole: MessageRole;
  text: string;
}
