/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useMemo } from 'react';
import { Project } from '../../types/project.ts';
import { GalleryAsset, UploadBatchItem } from '../../types/asset.ts';
import { groupAndPairFiles, getExtension, isRawExtension, isJpegExtension, extractBaseFilename } from '../../lib/pairing.ts';
import { services } from '../../services/index.ts';
import {
  UploadCloud,
  FileCheck,
  AlertTriangle,
  FileImage,
  HardDrive,
  Download,
  Layers,
  MoreVertical,
  Search,
  Images,
} from 'lucide-react';

interface AssetManagerViewProps {
  project: Project;
  projects: Project[];
  assets: GalleryAsset[];
  onSelectProject: (project: Project) => void;
  onOpenSelectionReview: () => void;
  onRefreshAssets: () => void;
  isProjectSwitching: boolean;
}

export const AssetManagerView: React.FC<AssetManagerViewProps> = ({
  project,
  projects,
  assets,
  onSelectProject,
  onOpenSelectionReview,
  onRefreshAssets,
  isProjectSwitching,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'selected' | 'unselected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openDownloadMenuAssetId, setOpenDownloadMenuAssetId] = useState<string | null>(null);
  const [isBulkDownloading, setIsBulkDownloading] = useState(false);
  const [selectedUploadFiles, setSelectedUploadFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressList, setUploadProgressList] = useState<UploadBatchItem[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const projectAssets = useMemo(() => {
    return assets.filter((a) => a.projectId === project.id);
  }, [assets, project.id]);

  const filteredAssets = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return projectAssets.filter((asset) => {
      const matchesFilter =
        filterMode === 'all' ||
        (filterMode === 'selected' && asset.isSelected) ||
        (filterMode === 'unselected' && !asset.isSelected);
      const matchesSearch =
        !normalizedQuery ||
        asset.jpegFilename.toLowerCase().includes(normalizedQuery) ||
        asset.baseFilename.toLowerCase().includes(normalizedQuery);
      return matchesFilter && matchesSearch;
    });
  }, [projectAssets, filterMode, searchQuery]);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const fileList = Array.from(e.target.files);
    setSelectedUploadFiles(fileList);

    const items: UploadBatchItem[] = fileList.map((f, i) => {
      const ext = getExtension(f.name);
      return {
        id: `batch-${i}-${Date.now()}`,
        file: f,
        name: f.name,
        size: f.size,
        extension: ext,
        isRaw: isRawExtension(ext),
        isJpeg: isJpegExtension(ext),
        baseName: extractBaseFilename(f.name),
        status: 'pending',
        progress: 0,
      };
    });

    setUploadProgressList(items);
    setStatusMessage(`Staged ${fileList.length} files for RAW/JPEG pairing verification.`);
  };

  const stagedPairingSummary = useMemo(() => {
    if (selectedUploadFiles.length === 0) return null;
    return groupAndPairFiles(selectedUploadFiles.map((f) => ({ name: f.name, size: f.size })));
  }, [selectedUploadFiles]);

  const handleExecuteUpload = async () => {
    if (uploadProgressList.length === 0) return;
    setIsUploading(true);
    setStatusMessage('Initiating direct-to-object-storage presigned upload sequence...');

    try {
      for (let i = 0; i < uploadProgressList.length; i++) {
        const item = uploadProgressList[i];
        item.status = 'uploading';
        setUploadProgressList([...uploadProgressList]);

        await services.assetService.requestPresignedUpload({
          projectId: project.id,
          filename: item.name,
          fileSize: item.size,
          contentType: item.isRaw ? 'application/octet-stream' : 'image/jpeg',
          isRaw: item.isRaw,
        });

        item.progress = 60;
        setUploadProgressList([...uploadProgressList]);
        await new Promise((r) => setTimeout(r, 60));

        item.progress = 100;
        item.status = 'completed';
        setUploadProgressList([...uploadProgressList]);
      }

      if (stagedPairingSummary) {
        for (const pair of stagedPairingSummary) {
          const matchingJpegFile = selectedUploadFiles.find(
            (f) => extractBaseFilename(f.name).toLowerCase() === pair.baseFilename.toLowerCase() && isJpegExtension(getExtension(f.name))
          );
          const matchingRawFile = selectedUploadFiles.find(
            (f) => extractBaseFilename(f.name).toLowerCase() === pair.baseFilename.toLowerCase() && isRawExtension(getExtension(f.name))
          );

          const previewUrl = matchingJpegFile
            ? services.storageAdapter.createPreviewUrl(matchingJpegFile)
            : 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85';

          await services.assetService.registerAsset({
            projectId: project.id,
            baseFilename: pair.baseFilename,
            jpegFilename: matchingJpegFile?.name || `${pair.baseFilename}.JPG`,
            rawFilename: matchingRawFile?.name,
            previewUrl,
            rawStorageRef: matchingRawFile ? `vault/${project.id}/raw/${matchingRawFile.name}` : undefined,
            fileSizeBytes: matchingJpegFile?.size,
            rawFileSizeBytes: matchingRawFile?.size,
          });
        }
      }

      setStatusMessage('All assets successfully uploaded, paired, and added to the gallery manifest!');
      setSelectedUploadFiles([]);
      setUploadProgressList([]);
      onRefreshAssets();
    } catch (err: any) {
      setStatusMessage(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadRaw = async (asset: GalleryAsset) => {
    try {
      const res = await services.assetService.getRawDownloadUrl(asset.id);
      const link = document.createElement('a');
      link.href = res.downloadUrl;
      link.download = asset.rawFilename || `${asset.baseFilename}.cr3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setStatusMessage(`Initiated direct RAW camera master download for: ${asset.baseFilename}`);
    } catch (err: any) {
      setStatusMessage(`Download error: ${err.message || 'Unable to download asset'}`);
    }
  };

  const handleDownloadJpeg = async (asset: GalleryAsset) => {
    try {
      const res = await services.assetService.getJpegDownloadUrl(asset.id);
      const link = document.createElement('a');
      link.href = res.downloadUrl;
      link.download = res.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setStatusMessage(`Started JPEG download for ${res.filename}.`);
    } catch (err: any) {
      setStatusMessage(`JPEG download error: ${err.message || 'Unable to download asset'}`);
    } finally {
      setOpenDownloadMenuAssetId(null);
    }
  };

  const handleBulkJpegDownload = async () => {
    const selectedAssets = projectAssets.filter((asset) => asset.isSelected);
    if (selectedAssets.length === 0) return;

    setIsBulkDownloading(true);
    try {
      for (const asset of selectedAssets) {
        const res = await services.assetService.getJpegDownloadUrl(asset.id);
        const link = document.createElement('a');
        link.href = res.downloadUrl;
        link.download = res.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setStatusMessage(`Started ${selectedAssets.length} selected JPEG downloads.`);
    } catch (err: any) {
      setStatusMessage(`Bulk JPEG download error: ${err.message || 'Unable to download images'}`);
    } finally {
      setIsBulkDownloading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Project workspace controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#27272A] pb-6">
        <div className="min-w-0">
          <label htmlFor="project-switcher" className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
            Project workspace
          </label>
          <select
            id="project-switcher"
            value={project.id}
            onChange={(event) => {
              const nextProject = projects.find((candidate) => candidate.id === event.target.value);
              if (nextProject) onSelectProject(nextProject);
            }}
            className="max-w-full rounded-lg border border-[#27272A] bg-[#121212] px-3 py-2 text-sm font-medium text-white outline-none transition-colors focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
          >
            {projects.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.id} — {candidate.clientName}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-[#A1A1AA]">{project.name} · {project.clientName}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-[#27272A] bg-[#121212] p-1">
            <button type="button" className="rounded-md bg-[#242424] px-3 py-1.5 text-xs font-medium text-white">
              Images
            </button>
            <button
              type="button"
              onClick={onOpenSelectionReview}
              className="rounded-md px-3 py-1.5 text-xs font-medium text-[#A1A1AA] transition-colors hover:text-white"
            >
              Album selections
            </button>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-[#D4AF37] hover:bg-[#C5A028] rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
          >
            <UploadCloud className="w-4 h-4" />
            Select RAW &amp; JPEG Batch
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFilesSelected}
            multiple
            accept=".cr2,.cr3,.nef,.arw,.dng,.jpg,.jpeg,image/jpeg"
            className="hidden"
          />
        </div>
      </div>

      {isProjectSwitching ? (
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-[#242424] sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse bg-[#121212] p-3">
              <div className="aspect-[4/3] rounded-md bg-[#242424]" />
              <div className="mt-2 h-3 w-2/3 rounded bg-[#242424]" />
            </div>
          ))}
        </div>
      ) : (
        <>
      {/* Batch Staging & Pairing Engine Panel */}
      {selectedUploadFiles.length > 0 && stagedPairingSummary && (
        <div className="bg-[#121212] border border-[#D4AF37]/40 rounded-xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272A] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-lg font-editorial font-semibold text-white">
                  Batch Pairing Verification ({selectedUploadFiles.length} files selected)
                </h3>
              </div>
              <p className="text-xs text-[#A1A1AA] mt-1 font-sans">
                Automated matching engine pairing RAW camera masters (.CR2, .CR3, .NEF, .ARW, .DNG) with web JPEG previews.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedUploadFiles([]);
                  setUploadProgressList([]);
                }}
                disabled={isUploading}
                className="px-3 py-1.5 text-xs text-[#A1A1AA] hover:text-white"
              >
                Clear Batch
              </button>
              <button
                onClick={handleExecuteUpload}
                disabled={isUploading}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-[#D4AF37] hover:bg-[#C5A028] disabled:opacity-50 rounded-md transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                {isUploading ? 'Uploading to Storage...' : 'Start Presigned Direct Upload'}
              </button>
            </div>
          </div>

          {/* Staged Pairs Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
            {stagedPairingSummary.map((group, idx) => (
              <div
                key={idx}
                className="bg-[#080808] border border-[#242424] rounded-lg p-3 space-y-2 text-xs font-sans"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white truncate max-w-[180px]">
                    {group.baseFilename}
                  </span>
                  {group.status === 'paired' && (
                    <span className="text-[11px] text-[#D4AF37] flex items-center gap-1 font-medium">
                      <FileCheck className="w-3.5 h-3.5" /> Paired
                    </span>
                  )}
                  {group.status === 'jpeg_only' && (
                    <span className="text-[11px] text-white flex items-center gap-1 font-medium">
                      <FileImage className="w-3.5 h-3.5" /> JPEG Only
                    </span>
                  )}
                  {group.status === 'raw_only' && (
                    <span className="text-[11px] text-[#8C8C8C] flex items-center gap-1 font-medium">
                      <HardDrive className="w-3.5 h-3.5" /> RAW Only
                    </span>
                  )}
                  {group.status === 'duplicate' && (
                    <span className="text-[11px] text-[#D4AF37] flex items-center gap-1 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" /> Duplicate
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-[#8C8C8C] space-y-0.5">
                  <div>JPEG: {group.jpegFile?.name || 'Missing preview'}</div>
                  <div>RAW: {group.rawFile?.name || 'None'}</div>
                </div>

                {group.warnings.length > 0 && (
                  <p className="text-[10px] text-[#D4AF37]/90 leading-tight">
                    {group.warnings[0]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {statusMessage && (
            <p className="text-xs text-white bg-[#080808] p-2.5 rounded border border-[#242424]">
              {statusMessage}
            </p>
          )}
        </div>
      )}

      {/* Asset Repository Overview */}
      <div className="bg-[#121212] border border-[#242424] rounded-lg overflow-hidden font-sans">
        {/* Filter Strip */}
        <div className="border-b border-[#242424] p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search filename"
                className="w-full rounded-lg border border-[#27272A] bg-[#080808] py-2 pl-9 pr-3 text-xs text-white outline-none placeholder:text-[#71717A] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>

            <button
              type="button"
              onClick={handleBulkJpegDownload}
              disabled={isBulkDownloading || !projectAssets.some((asset) => asset.isSelected)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3 py-2 text-xs font-semibold text-[#D4AF37] transition-colors hover:bg-[#D4AF37]/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Images className="h-4 w-4" />
              {isBulkDownloading ? 'Preparing downloads…' : `Download selected JPEGs (${projectAssets.filter((asset) => asset.isSelected).length})`}
            </button>
          </div>

          <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: `All (${projectAssets.length})` },
              { id: 'selected', label: `Selected (${projectAssets.filter((asset) => asset.isSelected).length})` },
              { id: 'unselected', label: `Unselected (${projectAssets.filter((asset) => !asset.isSelected).length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterMode(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors min-h-[36px] ${
                  filterMode === tab.id
                    ? 'bg-[#242424] text-white shadow-sm'
                    : 'text-[#8C8C8C] hover:text-white hover:bg-[#181818]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Assets Grid */}
        <div className="p-5">
          {filteredAssets.length === 0 ? (
            <div className="p-12 text-center text-[#8C8C8C]">
              <FileImage className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No assets match the selected filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="group overflow-hidden rounded-lg border border-[#242424] bg-[#080808] transition-colors hover:border-[#333333]"
                >
                  <div className="aspect-[4/3] bg-[#080808] relative overflow-hidden">
                    <img
                      src={asset.previewUrl}
                      alt={asset.baseFilename}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute right-2 top-2">
                      <button
                        type="button"
                        onClick={() => setOpenDownloadMenuAssetId((current) => current === asset.id ? null : asset.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-black"
                        aria-label={`Download options for ${asset.jpegFilename}`}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {openDownloadMenuAssetId === asset.id && (
                        <div className="absolute right-0 top-10 z-10 w-40 rounded-lg border border-[#27272A] bg-[#121212] p-1 shadow-xl">
                          <button
                            type="button"
                            onClick={() => handleDownloadJpeg(asset)}
                            className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-white transition-colors hover:bg-[#242424]"
                          >
                            <Download className="h-3.5 w-3.5 text-[#D4AF37]" />
                            Download JPEG
                          </button>
                          {asset.rawFilename && (
                            <button
                              type="button"
                              onClick={() => handleDownloadRaw(asset)}
                              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-white transition-colors hover:bg-[#242424]"
                            >
                              <Download className="h-3.5 w-3.5 text-[#D4AF37]" />
                              Download RAW
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="truncate px-2.5 py-2 text-[11px] font-mono text-[#A1A1AA]">{asset.jpegFilename}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
};
