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

export class MockProjectService implements IProjectService {
  private projects: Project[] = loadStorage(STORAGE_KEYS.PROJECTS, INITIAL_MOCK_PROJECTS);

  public async listProjects(): Promise<Project[]> {
    return [...this.projects];
  }

  public async getProjectById(projectId: string): Promise<Project | null> {
    const p = this.projects.find((proj) => proj.id === projectId);
    return p ? { ...p } : null;
  }

  public async getProjectByShareToken(token: string): Promise<Project | null> {
    const p = this.projects.find((proj) => proj.shareToken === token || proj.id === token);
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

    this.projects.unshift(newProject);
    saveStorage(STORAGE_KEYS.PROJECTS, this.projects);
    return { ...newProject };
  }

  public async updateProject(projectId: string, dto: UpdateProjectDTO): Promise<Project> {
    const index = this.projects.findIndex((p) => p.id === projectId);
    if (index === -1) throw new Error(`Project ${projectId} not found.`);

    const existing = this.projects[index];
    const updated: Project = {
      ...existing,
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    this.projects[index] = updated;
    saveStorage(STORAGE_KEYS.PROJECTS, this.projects);
    return { ...updated };
  }

  public async regenerateShareLink(projectId: string): Promise<{ shareToken: string; shareUrl: string }> {
    const index = this.projects.findIndex((p) => p.id === projectId);
    if (index === -1) throw new Error(`Project ${projectId} not found.`);

    const newToken = `token_${projectId.toLowerCase().replace('-', '_')}_${Date.now().toString(36)}`;
    this.projects[index].shareToken = newToken;
    this.projects[index].updatedAt = new Date().toISOString();
    saveStorage(STORAGE_KEYS.PROJECTS, this.projects);

    const shareUrl = `${window.location.origin}/portal/${newToken}`;
    return { shareToken: newToken, shareUrl };
  }
}

export class MockAssetService implements IAssetService {
  private assets: GalleryAsset[] = loadStorage(STORAGE_KEYS.ASSETS, INITIAL_MOCK_ASSETS);

  public async getAssetsByProject(projectId: string): Promise<GalleryAsset[]> {
    return this.assets.filter((a) => a.projectId === projectId);
  }

  public async requestPresignedUpload(dto: PresignedUploadUrlRequest): Promise<PresignedUploadUrlResponse> {
    const extension = dto.filename.split('.').pop()?.toUpperCase() || 'DAT';
    const folder = dto.isRaw ? 'raw' : 'previews';
    const storageKey = `vault/${dto.projectId}/${folder}/${dto.filename}`;
    // Mock direct-to-object-storage presigned upload URL
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

    this.assets.push(newAsset);
    saveStorage(STORAGE_KEYS.ASSETS, this.assets);
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
    const asset = this.assets.find((a) => a.id === assetId);
    if (!asset || !asset.rawFilename) {
      throw new Error(`Asset ${assetId} does not have a linked RAW master file.`);
    }

    // In a real environment, this returns a short-lived presigned AWS S3 / Cloud Storage GET URL
    return {
      downloadUrl: asset.previewUrl, // safe fallback for browser download demonstration
      filename: asset.rawFilename,
      expiresIn: 900, // 15 mins
    };
  }
}

export class MockSelectionService implements ISelectionService {
  private assets: GalleryAsset[] = loadStorage(STORAGE_KEYS.ASSETS, INITIAL_MOCK_ASSETS);
  private projects: Project[] = loadStorage(STORAGE_KEYS.PROJECTS, INITIAL_MOCK_PROJECTS);

  public async getSelectionState(projectId: string): Promise<SelectionState> {
    const project = this.projects.find((p) => p.id === projectId);
    const limit = project ? project.selectionLimit : 60;
    const isLocked = project?.status === 'selections_submitted' || project?.status === 'album_production';

    const projectAssets = this.assets.filter((a) => a.projectId === projectId);
    const selectedIds = projectAssets.filter((a) => a.isSelected).map((a) => a.id);

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
    const project = this.projects.find((p) => p.id === projectId);
    const limit = project ? project.selectionLimit : 60;
    const isLocked = project?.status === 'selections_submitted' || project?.status === 'album_production';

    const projectAssets = this.assets.filter((a) => a.projectId === projectId);
    const currentSelectedCount = projectAssets.filter((a) => a.isSelected).length;

    // Check quota logic
    const quota = evaluateSelectionQuota(currentSelectedCount, limit, isSelected, isLocked);
    if (!quota.canSelect) {
      throw new Error(quota.reason || 'Cannot update selection.');
    }

    // Update in-memory & storage
    const assetIndex = this.assets.findIndex((a) => a.id === assetId && a.projectId === projectId);
    if (assetIndex !== -1) {
      this.assets[assetIndex].isSelected = isSelected;
      this.assets[assetIndex].selectedAt = isSelected ? new Date().toISOString() : undefined;
      saveStorage(STORAGE_KEYS.ASSETS, this.assets);
    }

    return this.getSelectionState(projectId);
  }

  public async submitFinalSelection(request: SelectionSubmissionRequest): Promise<SelectionState> {
    const projectIndex = this.projects.findIndex((p) => p.id === request.projectId);
    if (projectIndex === -1) throw new Error(`Project ${request.projectId} not found.`);

    const project = this.projects[projectIndex];
    const validation = validateFinalSubmission(request.selectedAssetIds.length, project.selectionLimit);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Update project status to selections_submitted
    const now = new Date().toISOString();
    project.status = 'selections_submitted';
    project.submissionDate = now;
    project.finalClientNote = request.clientNote;
    project.updatedAt = now;
    this.projects[projectIndex] = project;
    saveStorage(STORAGE_KEYS.PROJECTS, this.projects);

    return {
      projectId: request.projectId,
      selectedAssetIds: request.selectedAssetIds,
      limit: project.selectionLimit,
      remaining: Math.max(0, project.selectionLimit - request.selectedAssetIds.length),
      isLocked: true,
      submittedAt: now,
      clientSubmissionNote: request.clientNote,
      status: 'submitted',
    };
  }

  public async resetSelections(projectId: string): Promise<SelectionState> {
    this.assets.forEach((a) => {
      if (a.projectId === projectId) a.isSelected = false;
    });
    saveStorage(STORAGE_KEYS.ASSETS, this.assets);
    return this.getSelectionState(projectId);
  }
}

export class MockMessageService implements IMessageService {
  private messages: Message[] = loadStorage(STORAGE_KEYS.MESSAGES, INITIAL_MOCK_MESSAGES);
  private listeners: Array<(msg: Message) => void> = [];

  public async getMessages(projectId: string, assetId?: string): Promise<Message[]> {
    return this.messages.filter((m) => {
      if (m.projectId !== projectId) return false;
      if (assetId) {
        return m.assetId === assetId;
      }
      // Project-level thread: either no assetId, or all messages
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

    this.messages.push(newMsg);
    saveStorage(STORAGE_KEYS.MESSAGES, this.messages);

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
