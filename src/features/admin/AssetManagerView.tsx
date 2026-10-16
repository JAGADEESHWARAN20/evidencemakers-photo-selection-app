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
  ArrowLeft,
  Download,
  Layers,
} from 'lucide-react';

interface AssetManagerViewProps {
  project: Project;
  assets: GalleryAsset[];
  onBack: () => void;
  onRefreshAssets: () => void;
}

export const AssetManagerView: React.FC<AssetManagerViewProps> = ({
  project,
  assets,
  onBack,
  onRefreshAssets,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'paired' | 'jpeg_only' | 'raw_only'>('all');
  const [selectedUploadFiles, setSelectedUploadFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressList, setUploadProgressList] = useState<UploadBatchItem[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const projectAssets = useMemo(() => {
    return assets.filter((a) => a.projectId === project.id);
  }, [assets, project.id]);

  const filteredAssets = useMemo(() => {
    if (filterMode === 'all') return projectAssets;
    return projectAssets.filter((a) => a.pairingStatus === filterMode);
  }, [projectAssets, filterMode]);

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
      window.open(res.downloadUrl, '_blank');
    } catch (err: any) {
      alert(`Download error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#242424] pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-[#8C8C8C] hover:text-white bg-[#121212] border border-[#242424] rounded-md transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-xs text-[#F5B82E] font-medium">{project.id}</span>
              <span className="text-[#333333]">·</span>
              <h1 className="text-2xl sm:text-3xl font-editorial font-medium text-white">
                RAW &amp; JPEG Asset Management
              </h1>
            </div>
            <p className="text-xs text-[#8C8C8C] mt-0.5">
              Project: <span className="text-white font-medium">{project.name}</span> · {project.clientName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-[#F5B82E] hover:bg-[#E2A622] rounded-md transition-colors"
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

      {/* Batch Staging & Pairing Engine Panel */}
      {selectedUploadFiles.length > 0 && stagedPairingSummary && (
        <div className="bg-[#121212] border border-[#F5B82E]/40 rounded-xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242424] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#F5B82E]" />
                <h3 className="text-lg font-editorial font-semibold text-white">
                  Batch Pairing Verification ({selectedUploadFiles.length} files selected)
                </h3>
              </div>
              <p className="text-xs text-[#8C8C8C] mt-1 font-sans">
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
                className="px-3 py-1.5 text-xs text-[#8C8C8C] hover:text-white"
              >
                Clear Batch
              </button>
              <button
                onClick={handleExecuteUpload}
                disabled={isUploading}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-[#F5B82E] hover:bg-[#E2A622] disabled:opacity-50 rounded-md transition-colors shadow-sm"
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
                    <span className="text-[11px] text-[#F5B82E] flex items-center gap-1 font-medium">
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
                    <span className="text-[11px] text-[#F5B82E] flex items-center gap-1 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" /> Duplicate
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-[#8C8C8C] space-y-0.5">
                  <div>JPEG: {group.jpegFile?.name || 'Missing preview'}</div>
                  <div>RAW: {group.rawFile?.name || 'None'}</div>
                </div>

                {group.warnings.length > 0 && (
                  <p className="text-[10px] text-[#F5B82E]/90 leading-tight">
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
        <div className="p-4 sm:p-5 border-b border-[#242424] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Project Assets</span>
            <span className="text-xs text-[#8C8C8C]">
              ({projectAssets.length} total photos registered)
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Assets' },
              { id: 'paired', label: 'Paired (RAW+JPEG)' },
              { id: 'jpeg_only', label: 'JPEG Only' },
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="bg-[#080808] border border-[#242424] rounded-lg overflow-hidden group hover:border-[#333333] transition-colors flex flex-col"
                >
                  {/* Photo Thumbnail */}
                  <div className="aspect-[4/3] bg-[#080808] relative overflow-hidden">
                    <img
                      src={asset.previewUrl}
                      alt={asset.baseFilename}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {asset.isSelected && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#F5B82E] text-black text-[10px] font-bold rounded uppercase tracking-wider">
                        Album Pick
                      </div>
                    )}
                  </div>

                  {/* Metadata Card Footer */}
                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white truncate">
                          {asset.baseFilename}
                        </span>
                        <span className="text-[10px] text-[#8C8C8C]">
                          {asset.rawExtension || 'JPEG'}
                        </span>
                      </div>

                      <div className="text-[11px] text-[#8C8C8C] mt-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span>Status:</span>
                          <span
                            className={
                              asset.pairingStatus === 'paired'
                                ? 'text-[#F5B82E] font-medium'
                                : 'text-white'
                            }
                          >
                            {asset.pairingStatus === 'paired' ? 'RAW Paired' : 'JPEG Only'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>RAW File:</span>
                          <span className="truncate max-w-[120px] text-white">
                            {asset.rawFilename || '—'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>RAW Size:</span>
                          <span className="tabular-nums">{asset.rawFileSizeFormatted}</span>
                        </div>
                      </div>
                    </div>

                    {asset.rawFilename && (
                      <button
                        onClick={() => handleDownloadRaw(asset)}
                        className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-medium text-[#8C8C8C] hover:text-white bg-[#121212] hover:bg-[#181818] border border-[#242424] rounded transition-colors"
                        title="Authorized short-lived presigned RAW download"
                      >
                        <Download className="w-3 h-3 text-[#F5B82E]" />
                        <span>Download RAW ({asset.rawExtension})</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
