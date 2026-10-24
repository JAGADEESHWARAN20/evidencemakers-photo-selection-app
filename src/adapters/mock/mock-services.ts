/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project } from '../../types/project.ts';
import { GalleryAsset } from '../../types/asset.ts';
import { SelectionState, SelectionSubmissionRequest } from '../../types/selection.ts';
import { Message, SendMessagePayload } from '../../types/message.ts';
import { IProjectService, CreateProjectDTO, UpdateProjectDTO } from '../../services/project-service.ts';
import {
  IAssetService,
  PresignedUploadUrlRequest,
  PresignedUploadUrlResponse,
  RegisterAssetDTO,
} from '../../services/asset-service.ts';
import { ISelectionService } from '../../services/selection-service.ts';
import { IMessageService } from '../../services/message-service.ts';
import {
  INITIAL_MOCK_PROJECTS,
  INITIAL_MOCK_ASSETS,
  INITIAL_MOCK_MESSAGES,
} from './mock-data.ts';
import { evaluateSelectionQuota, validateFinalSubmission } from '../../lib/selection-rules.ts';

const STORAGE_KEYS = {
  PROJECTS: 'evidence_makers_projects',
  ASSETS: 'evidence_makers_assets',
  MESSAGES: 'evidence_makers_messages',
};

function loadStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // quota exceeded or disabled
  }
}

class MockDataStore {
  private static instance: MockDataStore;
  public projects: Project[];
  public assets: GalleryAsset[];
  public messages: Message[];

  private constructor() {
    this.projects = loadStorage(STORAGE_KEYS.PROJECTS, INITIAL_MOCK_PROJECTS);
    this.assets = loadStorage(STORAGE_KEYS.ASSETS, INITIAL_MOCK_ASSETS);
    this.messages = loadStorage(STORAGE_KEYS.MESSAGES, INITIAL_MOCK_MESSAGES);
  }

  public static getInstance(): MockDataStore {
    if (!MockDataStore.instance) {
      MockDataStore.instance = new MockDataStore();
    }
    return MockDataStore.instance;
  }

  public saveProjects(): void {
    saveStorage(STORAGE_KEYS.PROJECTS, this.projects);
  }

  public saveAssets(): void {
    saveStorage(STORAGE_KEYS.ASSETS, this.assets);
  }

  public saveMessages(): void {
    saveStorage(STORAGE_KEYS.MESSAGES, this.messages);
  }
}

export class MockProjectService implements IProjectService {
  private get store() {
    return MockDataStore.getInstance();
  }

  public async listProjects(): Promise<Project[]> {
    return [...this.store.projects];
  }

  public async getProjectById(projectId: string): Promise<Project | null> {
    const p = this.store.projects.find((proj) => proj.id === projectId);
    return p ? { ...p } : null;
  }

  public async getProjectByShareToken(token: string): Promise<Project | null> {
    const p = this.store.projects.find((proj) => proj.shareToken === token || proj.id === token);
    return p ? { ...p } : null;
  }

  public async createProject(dto: CreateProjectDTO): Promise<Project> {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const newId = `EM-${new Date().getFullYear()}-${randomNum}`;
    const token = `token_${newId.toLowerCase().replace('-', '_')}_${Date.now().toString(36)}`;

    const newProject: Project = {
      id: newId,
      name: dto.name,
      clientName: dto.clientName,
      clientEmail: dto.clientEmail,
      eventDate: dto.eventDate,
      packageName: dto.packageName,
      selectionLimit: dto.selectionLimit,
      packageInstructions: dto.packageInstructions,
      clientNotes: dto.clientNotes,
      shareToken: token,
      sharePin: dto.sharePin,
      isPinProtected: !!dto.isPinProtected,
      status: 'awaiting_selection',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.store.projects.unshift(newProject);
    this.store.saveProjects();
    return { ...newProject };
  }

  public async updateProject(projectId: string, dto: UpdateProjectDTO): Promise<Project> {
    const index = this.store.projects.findIndex((p) => p.id === projectId);
    if (index === -1) throw new Error(`Project ${projectId} not found.`);

    const existing = this.store.projects[index];
    const updated: Project = {
      ...existing,
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    this.store.projects[index] = updated;
    this.store.saveProjects();
    return { ...updated };
  }

  public async regenerateShareLink(projectId: string): Promise<{ shareToken: string; shareUrl: string }> {
    const index = this.store.projects.findIndex((p) => p.id === projectId);
    if (index === -1) throw new Error(`Project ${projectId} not found.`);

    const newToken = `token_${projectId.toLowerCase().replace('-', '_')}_${Date.now().toString(36)}`;
    this.store.projects[index].shareToken = newToken;
    this.store.projects[index].updatedAt = new Date().toISOString();
    this.store.saveProjects();

    const shareUrl = `${window.location.origin}/portal/${newToken}`;
    return { shareToken: newToken, shareUrl };
  }
}

export class MockAssetService implements IAssetService {
  private get store() {
    return MockDataStore.getInstance();
  }

  public async getAssetsByProject(projectId: string): Promise<GalleryAsset[]> {
    return this.store.assets.filter((a) => a.projectId === projectId);
  }

  public async requestPresignedUpload(dto: PresignedUploadUrlRequest): Promise<PresignedUploadUrlResponse> {
    const folder = dto.isRaw ? 'raw' : 'previews';
    const storageKey = `vault/${dto.projectId}/${folder}/${dto.filename}`;
    const uploadUrl = `https://storage.googleapis.com/evidence-makers-vault/${storageKey}?mock_signature=true`;

    return {
      uploadUrl,
      storageKey,
      headers: {
        'Content-Type': dto.contentType,
        'x-goog-meta-project': dto.projectId,
      },
      expiresInSeconds: 3600,
    };
  }

  public async registerAsset(dto: RegisterAssetDTO): Promise<GalleryAsset> {
    const id = `asset-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const isRaw = !!dto.rawFilename;
    const rawExt = isRaw ? (dto.rawFilename?.split('.').pop()?.toUpperCase() as any) : undefined;

    const newAsset: GalleryAsset = {
      id,
      projectId: dto.projectId,
      baseFilename: dto.baseFilename,
      jpegFilename: dto.jpegFilename,
      rawFilename: dto.rawFilename,
      rawExtension: rawExt,
      previewUrl: dto.previewUrl,
      rawStorageRef: dto.rawStorageRef,
      rawDownloadUrl: dto.rawFilename ? `https://vault.evidencemakers.internal/download/${dto.rawFilename}?token=exp_mock` : undefined,
      rawFileSizeFormatted: dto.rawFileSizeBytes ? `${(dto.rawFileSizeBytes / (1024 * 1024)).toFixed(1)} MB` : (isRaw ? '45.0 MB' : 'None (JPEG Only)'),
      rawFileSizeBytes: dto.rawFileSizeBytes || (isRaw ? 47000000 : 0),
      jpegFileSizeBytes: dto.fileSizeBytes || 6500000,
      pairingStatus: isRaw ? 'paired' : 'jpeg_only',
      category: dto.category || 'ceremony',
      isSelected: false,
      commentCount: 0,
      exif: {
        camera: 'Canon EOS R5',
        lens: 'RF 50mm f/1.2L USM',
        aperture: 'f/1.4',
        shutterSpeed: '1/1000s',
        iso: 100,
      },
      width: 3000,
      height: 2000,
    };

    this.store.assets.push(newAsset);
    this.store.saveAssets();
    return { ...newAsset };
  }

  public async batchRegisterAssets(projectId: string, list: RegisterAssetDTO[]): Promise<GalleryAsset[]> {
    const results: GalleryAsset[] = [];
    for (const item of list) {
      const created = await this.registerAsset({ ...item, projectId });
      results.push(created);
    }
    return results;
  }

  public async getRawDownloadUrl(assetId: string): Promise<{ downloadUrl: string; filename: string; expiresIn: number }> {
    const asset = this.store.assets.find((a) => a.id === assetId);
    if (!asset || !asset.rawFilename) {
      throw new Error(`Asset ${assetId} does not have a linked RAW master file.`);
    }

    return {
      downloadUrl: asset.previewUrl,
      filename: asset.rawFilename,
      expiresIn: 900,
    };
  }

  public async getJpegDownloadUrl(assetId: string): Promise<{ downloadUrl: string; filename: string; expiresIn: number }> {
    const asset = this.store.assets.find((a) => a.id === assetId);
    if (!asset) {
      throw new Error('Asset not found.');
    }

    return {
      downloadUrl: asset.previewUrl,
      filename: asset.jpegFilename,
      expiresIn: 900,
    };
  }
}

export class MockSelectionService implements ISelectionService {
  private get store() {
    return MockDataStore.getInstance();
  }

  public async getSelectionState(projectId: string): Promise<SelectionState> {
    const project = this.store.projects.find((p) => p.id === projectId);
    const limit = project ? project.selectionLimit : 60;
    const isLocked = project?.status === 'selections_submitted' || project?.status === 'album_production';

    const projectAssets = this.store.assets.filter((a) => a.projectId === projectId);
    const selectedSet = new Set<string>();
    projectAssets.forEach((a) => {
      if (a.isSelected) selectedSet.add(a.id);
    });
    const selectedIds = Array.from(selectedSet);

    return {
      projectId,
      selectedAssetIds: selectedIds,
      limit,
      remaining: Math.max(0, limit - selectedIds.length),
      isLocked,
      submittedAt: project?.submissionDate,
      clientSubmissionNote: project?.finalClientNote,
      status: isLocked ? 'submitted' : 'draft',
    };
  }

  public async toggleAssetSelection(projectId: string, assetId: string, isSelected: boolean): Promise<SelectionState> {
    const project = this.store.projects.find((p) => p.id === projectId);
    const limit = project ? project.selectionLimit : 60;
    const isLocked = project?.status === 'selections_submitted' || project?.status === 'album_production';

    // Normalized Set of selected asset IDs for this project
    const projectAssets = this.store.assets.filter((a) => a.projectId === projectId);
    const selectedSet = new Set<string>();
    projectAssets.forEach((a) => {
      if (a.isSelected) selectedSet.add(a.id);
    });

    const isCurrentlySelected = selectedSet.has(assetId);
    if (isSelected === isCurrentlySelected) {
      // Already in requested state, return canonical state
      return this.getSelectionState(projectId);
    }

    // Check quota logic
    const quota = evaluateSelectionQuota(selectedSet.size, limit, isSelected, isLocked);
    if (!quota.canSelect) {
      throw new Error(quota.reason || 'Cannot update selection.');
    }

    if (isSelected) {
      selectedSet.add(assetId);
    } else {
      selectedSet.delete(assetId);
    }

    // Update the asset model in the unified store
    const targetAsset = this.store.assets.find((a) => a.id === assetId && a.projectId === projectId);
    if (targetAsset) {
      targetAsset.isSelected = isSelected;
      targetAsset.selectedAt = isSelected ? new Date().toISOString() : undefined;
      this.store.saveAssets();
    }

    return this.getSelectionState(projectId);
  }

  public async submitFinalSelection(request: SelectionSubmissionRequest): Promise<SelectionState> {
    const projectIndex = this.store.projects.findIndex((p) => p.id === request.projectId);
    if (projectIndex === -1) throw new Error(`Project ${request.projectId} not found.`);

    const project = this.store.projects[projectIndex];
    const uniqueSelectedIds = Array.from(new Set(request.selectedAssetIds));
    const validation = validateFinalSubmission(uniqueSelectedIds.length, project.selectionLimit);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const now = new Date().toISOString();
    project.status = 'selections_submitted';
    project.submissionDate = now;
    project.finalClientNote = request.clientNote;
    project.updatedAt = now;
    this.store.projects[projectIndex] = project;
    this.store.saveProjects();

    return {
      projectId: request.projectId,
      selectedAssetIds: uniqueSelectedIds,
      limit: project.selectionLimit,
      remaining: Math.max(0, project.selectionLimit - uniqueSelectedIds.length),
      isLocked: true,
      submittedAt: now,
      clientSubmissionNote: request.clientNote,
      status: 'submitted',
    };
  }

  public async resetSelections(projectId: string): Promise<SelectionState> {
    this.store.assets.forEach((a) => {
      if (a.projectId === projectId) {
        a.isSelected = false;
        a.selectedAt = undefined;
      }
    });
    this.store.saveAssets();
    return this.getSelectionState(projectId);
  }
}

export class MockMessageService implements IMessageService {
  private get store() {
    return MockDataStore.getInstance();
  }
  private listeners: Array<(msg: Message) => void> = [];

  public async getMessages(projectId: string, assetId?: string): Promise<Message[]> {
    return this.store.messages.filter((m) => {
      if (m.projectId !== projectId) return false;
      if (assetId) {
        return m.assetId === assetId;
      }
      return !m.assetId;
    });
  }

  public async sendMessage(payload: SendMessagePayload): Promise<Message> {
    const newMsg: Message = {
      id: `msg-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      projectId: payload.projectId,
      assetId: payload.assetId,
      senderName: payload.senderName,
      senderRole: payload.senderRole,
      text: payload.text.trim(),
      createdAt: new Date().toISOString(),
    };

    this.store.messages.push(newMsg);
    this.store.saveMessages();

    // Increment comment count on asset in store if assetId present
    if (payload.assetId) {
      const asset = this.store.assets.find((a) => a.id === payload.assetId);
      if (asset) {
        asset.commentCount = (asset.commentCount || 0) + 1;
        this.store.saveAssets();
      }
    }

    // Notify subscribers
    this.listeners.forEach((fn) => fn(newMsg));
    return { ...newMsg };
  }

  public subscribeToMessages(
    projectId: string,
    assetId: string | undefined,
    callback: (message: Message) => void
  ): () => void {
    const handler = (msg: Message) => {
      if (msg.projectId === projectId && msg.assetId === assetId) {
        callback(msg);
      }
    };
    this.listeners.push(handler);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== handler);
    };
  }
}
