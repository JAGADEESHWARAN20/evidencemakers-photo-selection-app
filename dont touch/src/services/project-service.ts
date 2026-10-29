/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project } from '../types/project.ts';

export interface CreateProjectDTO {
  name: string;
  clientName: string;
  clientEmail: string;
  eventDate: string;
  packageName: string;
  selectionLimit: number;
  packageInstructions: string;
  clientNotes?: string;
  isPinProtected?: boolean;
  sharePin?: string;
}

export interface UpdateProjectDTO extends Partial<CreateProjectDTO> {
  status?: Project['status'];
}

export interface IProjectService {
  listProjects(): Promise<Project[]>;
  getProjectById(projectId: string): Promise<Project | null>;
  getProjectByShareToken(token: string): Promise<Project | null>;
  createProject(dto: CreateProjectDTO): Promise<Project>;
  updateProject(projectId: string, dto: UpdateProjectDTO): Promise<Project>;
  regenerateShareLink(projectId: string): Promise<{ shareToken: string; shareUrl: string }>;
}
