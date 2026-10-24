/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Project } from './types/project.ts';
import { GalleryAsset } from './types/asset.ts';
import { Message } from './types/message.ts';
import { services } from './services/index.ts';
import { GalleryPreloader } from './components/preloader/GalleryPreloader.tsx';
import { Header, NavView } from './components/layout/Header.tsx';
import { DashboardView } from './features/admin/DashboardView.tsx';
import { ProjectsView } from './features/admin/ProjectsView.tsx';
import { AssetManagerView } from './features/admin/AssetManagerView.tsx';
import { SelectionReviewView } from './features/admin/SelectionReviewView.tsx';
import { ProjectCreateModal } from './features/admin/ProjectCreateModal.tsx';
import { ClientPortalView } from './features/client/ClientPortalView.tsx';
import { PhotoLightbox } from './features/client/PhotoLightbox.tsx';
import { ProjectChatDrawer } from './features/chat/ProjectChatDrawer.tsx';
import { ApiDocsModal } from './features/docs/ApiDocsModal.tsx';
import { CreateProjectDTO } from './services/project-service.ts';
import { BrandLogo } from './components/brand/BrandLogo.tsx';
import { ArrowLeft, Shield, AlertCircle, CheckCircle2, X } from 'lucide-react';

const getInitialPortalToken = () => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const qToken = params.get('portal') || params.get('share');
  if (qToken) return qToken;
  const match = window.location.pathname.match(/\/portal\/([^/]+)/);
  if (match) return match[1];
  return null;
};

export default function App() {
  const initialPortalToken = getInitialPortalToken();
  const [isInitialized, setIsInitialized] = useState(() => !initialPortalToken);
  const [currentView, setCurrentView] = useState<NavView>(() =>
    initialPortalToken ? 'client_portal' : 'dashboard'
  );
  const [activeRole, setActiveRole] = useState<'admin' | 'client'>(() =>
    initialPortalToken ? 'client' : 'admin'
  );

  // Application Data States
  const [projects, setProjects] = useState<Project[]>([]);
  const [assets, setAssets] = useState<GalleryAsset[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectSwitching, setIsProjectSwitching] = useState(false);

  // Modals & Panels
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isApiDocsModalOpen, setIsApiDocsModalOpen] = useState(false);
  const [isProjectChatOpen, setIsProjectChatOpen] = useState(false);
  const [lightboxAsset, setLightboxAsset] = useState<GalleryAsset | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'error' | 'success' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Fetch initial data & route triage
  const refreshData = async () => {
    try {
      const pList = await services.projectService.listProjects();
      setProjects(pList);

      const portalToken = getInitialPortalToken();

      let targetProject: Project | null = null;
      if (portalToken) {
        targetProject =
          pList.find(
            (p) =>
              p.shareToken.toLowerCase() === portalToken.toLowerCase() ||
              p.id.toLowerCase() === portalToken.toLowerCase()
          ) || pList[0];
        setActiveRole('client');
        setCurrentView('client_portal');
      } else if (selectedProject) {
        targetProject = pList.find((p) => p.id === selectedProject.id) || pList[0];
      } else {
        targetProject = pList[0] || null;
      }

      setSelectedProject(targetProject);

      if (targetProject) {
        const aList = await services.assetService.getAssetsByProject(targetProject.id);
        setAssets(aList);
        const mList = await services.messageService.getMessages(targetProject.id);
        setMessages(mList);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleProjectSelect = async (p: Project) => {
    if (p.id === selectedProject?.id) return;
    setIsProjectSwitching(true);
    setSelectedProject(p);
    try {
      const [aList, mList] = await Promise.all([
        services.assetService.getAssetsByProject(p.id),
        services.messageService.getMessages(p.id),
      ]);
      setAssets(aList);
      setMessages(mList);
    } finally {
      setIsProjectSwitching(false);
    }
  };

  const handleCreateProject = async (dto: CreateProjectDTO) => {
    const created = await services.projectService.createProject(dto);
    await refreshData();
    setSelectedProject(created);
    return created;
  };

  const handleOpenClientPortal = (p: Project) => {
    handleProjectSelect(p);
    setActiveRole('client');
    setCurrentView('client_portal');
    try {
      window.history.pushState(null, '', `?portal=${p.shareToken}`);
    } catch {
      // ignore
    }
  };

  const handleExitClientPortal = () => {
    setActiveRole('admin');
    setCurrentView('dashboard');
    try {
      window.history.pushState(null, '', window.location.pathname.replace(/\/portal\/.*/, '') || '/');
    } catch {
      // ignore
    }
  };

  const handleOpenAssetManager = (p: Project) => {
    handleProjectSelect(p);
    setCurrentView('assets');
  };

  const handleOpenSelectionReview = (p: Project) => {
    handleProjectSelect(p);
    setCurrentView('selection_review');
  };

  // Normalized Set of selected asset IDs for active project (single source of truth)
  const selectedAssetIds = React.useMemo(() => {
    const set = new Set<string>();
    if (!selectedProject) return set;
    assets.forEach((a) => {
      if (a.projectId === selectedProject.id && a.isSelected) {
        set.add(a.id);
      }
    });
    return set;
  }, [assets, selectedProject?.id]);

  const handleToggleSelection = async (assetId: string) => {
    if (!selectedProject) return;
    const target = assets.find((a) => a.id === assetId);
    if (!target) return;

    const willSelect = !selectedAssetIds.has(assetId);

    // Optimistic state update for instant UI feedback without race conditions
    setAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, isSelected: willSelect } : a))
    );

    if (lightboxAsset && lightboxAsset.id === assetId) {
      setLightboxAsset((prev) => (prev ? { ...prev, isSelected: willSelect } : null));
    }

    try {
      await services.selectionService.toggleAssetSelection(
        selectedProject.id,
        assetId,
        willSelect
      );
      // Synchronize canonical storage state
      const freshAssets = await services.assetService.getAssetsByProject(selectedProject.id);
      setAssets(freshAssets);
    } catch (err: any) {
      // Revert optimistic update on failure
      setAssets((prev) =>
        prev.map((a) => (a.id === assetId ? { ...a, isSelected: !willSelect } : a))
      );
      if (lightboxAsset && lightboxAsset.id === assetId) {
        setLightboxAsset((prev) => (prev ? { ...prev, isSelected: !willSelect } : null));
      }
      showToast(err.message || 'Unable to update photo selection', 'error');
    }
  };

  const isClientPortalMode = activeRole === 'client' || currentView === 'client_portal';

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans selection:bg-[#D4AF37]/30">
      {/* 1. Branded Preloader Initialization (Only on initial load) */}
      {!isInitialized && (
        <GalleryPreloader onComplete={() => setIsInitialized(true)} />
      )}

      {/* 2. Decoupled Routing: Standalone Client Portal vs. Studio Admin Workspace */}
      {isClientPortalMode ? (
        /* Standalone Minimalist Client Portal Shell (Completely Decoupled) */
        <div className="min-h-screen flex flex-col justify-between bg-[#0A0A0A]">
          {/* Standalone Client Workspace with Generous Padding */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10">
            {selectedProject ? (
              <ClientPortalView
                project={selectedProject}
                assets={assets}
                messages={messages}
                onOpenPhotoDetail={(asset) => setLightboxAsset(asset)}
                onOpenProjectChat={() => setIsProjectChatOpen(true)}
                onRefreshProject={refreshData}
                onBackToStudio={handleExitClientPortal}
                onToggleSelection={handleToggleSelection}
              />
            ) : (
              <div className="p-16 text-center text-[#A1A1AA] bg-[#121212] border border-[#27272A] rounded-2xl">
                <Shield className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                <h3 className="text-lg font-editorial text-white">Project Not Found</h3>
                <p className="text-xs text-[#A1A1AA] mt-1">Please verify the direct client share link.</p>
                <button
                  onClick={handleExitClientPortal}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-black bg-[#D4AF37] hover:bg-[#C5A028] rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </main>

          {/* Minimalist Client Footer (Strictly photography focused, no admin noise) */}
          <footer className="border-t border-[#27272A] py-8 text-center text-xs text-[#A1A1AA] font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-[#A1A1AA]">
                &copy; {new Date().getFullYear()} Evidence Makers Studio. All photographs copyright protected.
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-medium">
                Heirloom Album Proofing Architecture
              </span>
            </div>
          </footer>
        </div>
      ) : (
        /* Studio Admin Dashboard Workspace */
        <>
          <Header
            currentView={currentView}
            onNavigate={(view) => {
              setCurrentView(view);
            }}
            onOpenNewProject={() => setIsNewProjectModalOpen(true)}
            onOpenApiDocs={() => setIsApiDocsModalOpen(true)}
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={handleProjectSelect}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
            {currentView === 'dashboard' ? (
              <DashboardView
                projects={projects}
                assets={assets}
                onOpenProject={(p) => {
                  handleProjectSelect(p);
                  setCurrentView('assets');
                }}
                onOpenClientPortal={handleOpenClientPortal}
                onOpenNewProject={() => setIsNewProjectModalOpen(true)}
                onOpenAssetManager={handleOpenAssetManager}
                onOpenSelectionReview={handleOpenSelectionReview}
              />
            ) : currentView === 'projects' ? (
              <ProjectsView
                projects={projects}
                assets={assets}
                onOpenProject={(project) => {
                  handleProjectSelect(project);
                  setCurrentView('assets');
                }}
                onOpenNewProject={() => setIsNewProjectModalOpen(true)}
              />
            ) : currentView === 'assets' && selectedProject ? (
              <AssetManagerView
                project={selectedProject}
                assets={assets}
                projects={projects}
                onSelectProject={handleProjectSelect}
                onOpenSelectionReview={() => setCurrentView('selection_review')}
                onRefreshAssets={refreshData}
                isProjectSwitching={isProjectSwitching}
                onToggleSelection={handleToggleSelection}
              />
            ) : currentView === 'selection_review' && selectedProject ? (
              <SelectionReviewView
                project={selectedProject}
                projects={projects}
                assets={assets}
                onSelectProject={handleProjectSelect}
                onOpenAssets={() => setCurrentView('assets')}
                onOpenPhotoDetail={(asset) => setLightboxAsset(asset)}
                onOpenClientPortal={handleOpenClientPortal}
                isProjectSwitching={isProjectSwitching}
                onToggleSelection={handleToggleSelection}
              />
            ) : (
              <div className="p-16 text-center text-[#A1A1AA] bg-[#121212] border border-[#27272A] rounded-2xl">
                <p>Loading project workspace...</p>
              </div>
            )}
          </main>

          <footer className="border-t border-[#27272A] py-8 text-center text-xs text-[#A1A1AA] font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span>&copy; {new Date().getFullYear()} Evidence Makers Studio. All rights reserved.</span>
              <span className="text-[11px] text-[#A1A1AA]/80">
                Professional Wedding &amp; Event Photography Proofing Architecture
              </span>
            </div>
          </footer>
        </>
      )}

      {/* 4. Global Modals & Lightbox Overlays */}
      <ProjectCreateModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      {lightboxAsset && selectedProject && (
        <PhotoLightbox
          asset={lightboxAsset}
          assets={assets.filter((a) => a.projectId === selectedProject.id)}
          projectId={selectedProject.id}
          clientName={selectedProject.clientName}
          activeRole={activeRole}
          isSelectionLocked={selectedProject.status === 'selections_submitted'}
          onToggleSelection={handleToggleSelection}
          onClose={() => setLightboxAsset(null)}
          onNavigate={(newAsset) => setLightboxAsset(newAsset)}
          onMessageSent={refreshData}
        />
      )}

      {selectedProject && (
        <ProjectChatDrawer
          isOpen={isProjectChatOpen}
          onClose={() => setIsProjectChatOpen(false)}
          project={selectedProject}
          activeRole={activeRole}
          clientName={selectedProject.clientName}
          onMessageSent={refreshData}
        />
      )}

      <ApiDocsModal
        isOpen={isApiDocsModalOpen}
        onClose={() => setIsApiDocsModalOpen(false)}
      />

      {/* Floating System Notification Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#121212]/95 backdrop-blur-md border border-[#27272A] shadow-2xl text-xs text-white transition-all animate-in slide-in-from-bottom-3 duration-200"
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
          ) : toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
          ) : (
            <Shield className="w-4 h-4 text-[#D4AF37] shrink-0" />
          )}
          <span className="font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-[#A1A1AA] hover:text-white transition-colors"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
