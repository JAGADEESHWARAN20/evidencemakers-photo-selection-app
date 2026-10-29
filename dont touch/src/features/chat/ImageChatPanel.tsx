/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { GalleryAsset } from '../../types/asset.ts';
import { Message } from '../../types/message.ts';
import { services } from '../../services/index.ts';
import { Send, MessageSquare, Sparkles, User, ShieldCheck, AlertCircle } from 'lucide-react';

interface ImageChatPanelProps {
  projectId: string;
  asset: GalleryAsset;
  activeRole: 'admin' | 'client';
  clientName: string;
  onMessageSent: () => void;
}

const QUICK_PROMPTS = [
  'Crop this image slightly tighter for album spread',
  'Please use this for the main leather album cover',
  'Please soften background glare / remove background object',
  'Convert to timeless black & white for the closing page',
];

export const ImageChatPanel: React.FC<ImageChatPanelProps> = ({
  projectId,
  asset,
  activeRole,
  clientName,
  onMessageSent,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    try {
      const list = await services.messageService.getMessages(projectId, asset.id);
      setMessages(list);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadMessages();
  }, [projectId, asset.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isSending) return;

    try {
      setIsSending(true);
      await services.messageService.sendMessage({
        projectId,
        assetId: asset.id,
        senderName: activeRole === 'admin' ? 'Evidence Makers Studio' : clientName,
        senderRole: activeRole,
        text,
      });
      setInputMessage('');
      await loadMessages();
      onMessageSent();
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#121212] border-l border-[#242424] font-sans">
      {/* Header */}
      <div className="p-4 border-b border-[#242424] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
            <h4 className="text-sm font-editorial font-semibold text-white">
              Photo Notes &amp; Retouch Chat
            </h4>
          </div>
          <span className="text-[11px] font-sans text-[#8C8C8C] mt-0.5 block">
            File: {asset.baseFilename}
          </span>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <MessageSquare className="w-8 h-8 text-[#8C8C8C] mb-2 opacity-40" />
            <p className="text-xs text-white font-medium">No notes on this photograph yet.</p>
            <p className="text-[11px] text-[#8C8C8C] mt-1 max-w-xs">
              Leave instructions for album cropping, retouching, or cover placement.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isAdmin = msg.senderRole === 'admin';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[11px] text-[#8C8C8C]">
                  {isAdmin ? (
                    <>
                      <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                      <span className="text-[#D4AF37] font-medium">{msg.senderName}</span>
                    </>
                  ) : (
                    <>
                      <User className="w-3 h-3 text-[#8C8C8C]" />
                      <span className="text-white font-medium">{msg.senderName}</span>
                    </>
                  )}
                  <span>·</span>
                  <span className="text-[10px] text-[#8C8C8C]">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div
                  className={`p-3 rounded-lg text-xs leading-relaxed max-w-[90%] ${
                    isAdmin
                      ? 'bg-[#181818] text-white border border-[#242424]'
                      : 'bg-[#D4AF37] text-black font-semibold shadow'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions */}
      <div className="px-3 pt-2 border-t border-[#1C1C1C] bg-[#0A0A0A]">
        <div className="text-[10px] text-[#8C8C8C] mb-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          <span>Quick notes:</span>
        </div>
        <div className="flex flex-wrap gap-1.5 pb-2">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-[10px] text-[#8C8C8C] hover:text-white bg-[#121212] hover:bg-[#181818] border border-[#242424] px-2 py-0.5 rounded transition-colors truncate max-w-[220px]"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Message Composer */}
      <div className="p-3 border-t border-[#27272A] bg-[#0A0A0A] space-y-2">
        {errorMessage && (
          <div className="flex items-center gap-1.5 p-2 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-md text-[11px] text-[#EF4444]">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span className="flex-1">{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-[#EF4444] hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={`Message as ${activeRole === 'admin' ? 'Studio' : clientName}...`}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-3 py-2 bg-[#121212] border border-[#242424] rounded-md text-xs text-white placeholder-[#8C8C8C] focus:outline-none focus:border-[#D4AF37]"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="p-2 text-black bg-[#D4AF37] hover:bg-[#C5A028] disabled:opacity-40 rounded-md transition-colors"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
