/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Check, Copy, Server, Shield, Database, UploadCloud, MessageSquare } from 'lucide-react';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const requestTemplate = `### Evidence Makers — Production Backend Integration Questionnaire

Please provide the following backend specifications to wire the Evidence Makers application:

1. Existing Backend Architecture:
   - Framework (e.g., Express/Node.js, NestJS, FastAPI, Django, Go, Next.js API)
   - Base URL / Host
   - Database engine & schema

2. Authentication & Authorization:
   - Admin authentication scheme (Bearer JWT / Session Cookie)
   - Client shared-link token format (UUID v4 / signed JWT / query param vs path)
   - PIN verification endpoint and rate limiting

3. Project Endpoints:
   - POST /api/projects (Create project & package rules)
   - GET /api/projects (List projects with quota status)
   - GET /api/projects/:projectId (Retrieve project details)
   - PATCH /api/projects/:projectId (Update project rules/status)

4. Upload & Storage Strategy:
   - Object storage provider (AWS S3, Google Cloud Storage, Cloudflare R2)
   - Presigned upload URL generation endpoint (e.g. POST /api/projects/:id/upload-url)
   - Max file size constraints for RAW (.CR2, .CR3, .NEF, .ARW, .DNG)
   - Asset registration endpoint (POST /api/projects/:id/assets)

5. Selection & Quota Rules:
   - PATCH /api/projects/:id/selections (Selection toggle & batch update)
   - POST /api/projects/:id/submit-selections (Final album submission lock)
   - Can clients edit selections after submission?

6. Picture-Chat & Real-Time Feedback:
   - GET /api/projects/:id/messages (Filtered by optional assetId)
   - POST /api/projects/:id/messages (Send project or photo note)
   - Real-time updates (WebSocket, Server-Sent Events, or polling interval)

7. Environment Configuration:
   - Required environment variable names (.env)
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(requestTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto font-sans"
    >
      <div className="bg-[#121212] border border-[#242424] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#242424] pb-4">
          <div>
            <h2 id="api-modal-title" className="text-2xl font-editorial font-semibold text-white">
              Backend Integration Architecture (Phase 4 Ready)
            </h2>
            <p className="text-xs text-[#8C8C8C] mt-0.5">
              Type-safe interfaces, service adapters &amp; storage boundary prepared for live API injection
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8C8C8C] hover:text-white rounded-md transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview banner */}
        <div className="p-4 bg-[#080808] border border-[#F5B82E]/30 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#F5B82E] uppercase tracking-wider">
            <Server className="w-4 h-4" />
            <span>Clean Architecture &amp; Service Layer Established</span>
          </div>
          <p className="text-xs text-white/90 leading-relaxed">
            The frontend application structure, admin dashboard, RAW/JPEG pairing engine, package-guided client proofing portal, and contextual picture-chat are completely operational using isolated, persistent service adapters in <code className="text-[#F5B82E]">src/services/</code>.
          </p>
        </div>

        {/* Integration checklist */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Integration Layer Boundaries:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#080808] border border-[#242424] rounded-md space-y-1">
              <div className="flex items-center gap-1.5 text-white font-medium">
                <Database className="w-3.5 h-3.5 text-[#F5B82E]" />
                <span>Project &amp; Selection Services</span>
              </div>
              <p className="text-[#8C8C8C] text-[11px]">
                Implemented via <code className="text-white">IProjectService</code> and <code className="text-white">ISelectionService</code>.
              </p>
            </div>

            <div className="p-3 bg-[#080808] border border-[#242424] rounded-md space-y-1">
              <div className="flex items-center gap-1.5 text-white font-medium">
                <UploadCloud className="w-3.5 h-3.5 text-[#F5B82E]" />
                <span>Direct Storage Adapter</span>
              </div>
              <p className="text-[#8C8C8C] text-[11px]">
                Presigned direct-to-object-storage uploads prevent heavy RAW camera files from bogging down your API.
              </p>
            </div>

            <div className="p-3 bg-[#080808] border border-[#242424] rounded-md space-y-1">
              <div className="flex items-center gap-1.5 text-white font-medium">
                <MessageSquare className="w-3.5 h-3.5 text-[#F5B82E]" />
                <span>Picture-Chat Interface</span>
              </div>
              <p className="text-[#8C8C8C] text-[11px]">
                Separates project-level conversation from photo-level retouch notes via <code className="text-white">IMessageService</code>.
              </p>
            </div>

            <div className="p-3 bg-[#080808] border border-[#242424] rounded-md space-y-1">
              <div className="flex items-center gap-1.5 text-white font-medium">
                <Shield className="w-3.5 h-3.5 text-[#F5B82E]" />
                <span>Security &amp; PIN Gateway</span>
              </div>
              <p className="text-[#8C8C8C] text-[11px]">
                Token-based shared links with optional client PIN verification.
              </p>
            </div>
          </div>
        </div>

        {/* Copy Questionnaire */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8C8C8C] uppercase tracking-wider">
              Integration Questionnaire for Your Backend:
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-xs text-[#F5B82E] hover:underline"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Questionnaire'}</span>
            </button>
          </div>
          <pre className="p-3 bg-[#080808] border border-[#242424] rounded-md text-[11px] font-sans text-[#8C8C8C] max-h-48 overflow-y-auto whitespace-pre-wrap">
            {requestTemplate}
          </pre>
        </div>

        <div className="flex justify-end pt-3 border-t border-[#242424]">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-[#F5B82E] hover:bg-[#E2A622] rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
