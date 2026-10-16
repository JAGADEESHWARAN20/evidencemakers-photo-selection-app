/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../../types/project.ts';
import { Message } from '../../types/message.ts';
import { services } from '../../services/index.ts';
import { X, Send, ShieldCheck, User, MessageCircle } from 'lucide-react';

interface ProjectChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  activeRole: 'admin' | 'client';
  clientName: string;
  onMessageSent: () => void;
}

export const ProjectChatDrawer: React.FC<ProjectChatDrawerProps> = ({
  isOpen,
  onClose,
  project,
  activeRole,
  clientName,
  onMessageSent,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    try {
      const list = await services.messageService.getMessages(project.id);
      setMessages(list);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen, project.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || isSending) return;

    try {
      setIsSending(true);
      await services.messageService.sendMessage({
        projectId: project.id,
        senderName: activeRole === 'admin' ? 'Evidence Makers Studio' : clientName,
        senderRole: activeRole,
        text,
      });
      setInputText('');
      await loadMessages();
      onMessageSent();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-chat-title"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs font-sans"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#121212] border-l border-[#242424] h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#242424] flex items-center justify-between bg-[#080808]">
          <div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#F5B82E]" />
              <h3 id="project-chat-title" className="text-lg font-editorial font-semibold text-white">
                Studio &amp; Client Communication
              </h3>
            </div>
            <p className="text-xs text-[#8C8C8C] mt-0.5">
              General project conversation for {project.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8C8C8C] hover:text-white rounded-md transition-colors"
            aria-label="Close conversation drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#8C8C8C]">
              <MessageCircle className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm font-editorial text-white">No messages yet</p>
              <p className="text-xs text-[#8C8C8C] mt-1 max-w-xs font-sans">
                Ask questions about album specifications, delivery timelines, or selection guidelines.
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
                        <ShieldCheck className="w-3.5 h-3.5 text-[#F5B82E]" />
                        <span className="text-[#F5B82E] font-medium">{msg.senderName}</span>
                      </>
                    ) : (
                      <>
                        <User className="w-3.5 h-3.5 text-[#8C8C8C]" />
                        <span className="text-white font-medium">{msg.senderName}</span>
                      </>
                    )}
                    <span>·</span>
                    <span className="text-[10px] text-[#8C8C8C]">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`p-3.5 rounded-lg text-xs leading-relaxed max-w-[85%] ${
                      isAdmin
                        ? 'bg-[#181818] text-white border border-[#242424]'
                        : 'bg-[#F5B82E] text-black font-semibold shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={endRef} />
        </div>

        {/* Composer Form */}
        <div className="p-4 border-t border-[#242424] bg-[#080808]">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Send message as ${activeRole === 'admin' ? 'Studio' : clientName}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-[#121212] border border-[#242424] rounded-md text-xs text-white placeholder-[#8C8C8C] focus:outline-none focus:border-[#F5B82E]"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="px-3.5 py-2.5 text-black bg-[#F5B82E] hover:bg-[#E2A622] disabled:opacity-40 rounded-md transition-colors font-sans"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
