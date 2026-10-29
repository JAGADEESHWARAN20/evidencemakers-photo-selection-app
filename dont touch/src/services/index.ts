/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IProjectService } from './project-service.ts';
import { IAssetService } from './asset-service.ts';
import { ISelectionService } from './selection-service.ts';
import { IMessageService } from './message-service.ts';
import { IStorageAdapter, DirectStorageAdapter } from './storage-adapter.ts';
import {
  MockProjectService,
  MockAssetService,
  MockSelectionService,
  MockMessageService,
} from '../adapters/mock/mock-services.ts';

/**
 * Service Registry:
 * Central access point for all business domain operations.
 * Currently backed by verified, persistent mock adapters until the user
 * supplies their production API endpoints, database schema, and storage specs.
 */
class ServiceRegistry {
  public projectService: IProjectService;
  public assetService: IAssetService;
  public selectionService: ISelectionService;
  public messageService: IMessageService;
  public storageAdapter: IStorageAdapter;

  constructor() {
    this.projectService = new MockProjectService();
    this.assetService = new MockAssetService();
    this.selectionService = new MockSelectionService();
    this.messageService = new MockMessageService();
    this.storageAdapter = new DirectStorageAdapter();
  }

  /**
   * Hook to swap service implementations when real API configuration is injected.
   */
  public configureProduction(services: {
    projectService?: IProjectService;
    assetService?: IAssetService;
    selectionService?: ISelectionService;
    messageService?: IMessageService;
    storageAdapter?: IStorageAdapter;
  }) {
    if (services.projectService) this.projectService = services.projectService;
    if (services.assetService) this.assetService = services.assetService;
    if (services.selectionService) this.selectionService = services.selectionService;
    if (services.messageService) this.messageService = services.messageService;
    if (services.storageAdapter) this.storageAdapter = services.storageAdapter;
  }
}

export const services = new ServiceRegistry();
