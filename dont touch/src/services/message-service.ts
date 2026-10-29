/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Message, SendMessagePayload } from '../types/message.ts';

export interface IMessageService {
  getMessages(projectId: string, assetId?: string): Promise<Message[]>;
  sendMessage(payload: SendMessagePayload): Promise<Message>;
  subscribeToMessages?(
    projectId: string,
    assetId: string | undefined,
    callback: (message: Message) => void
  ): () => void;
}
