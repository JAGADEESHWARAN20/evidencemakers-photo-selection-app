/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BrandLogo } from '../brand/BrandLogo.tsx';

interface GalleryPreloaderProps {
  onComplete: () => void;
  statusText?: string;
  autoSkip?: boolean;
}

const LOADING_STAGES = [
  { label: 'Initializing Evidence Makers studio session', progress: 20 },
  { label: 'Retrieving project configuration & package rules', progress: 45 },
  { label: 'Pairing RAW masters with high-resolution JPEG previews', progress: 75 },
  { label: 'Synchronizing client selections & contextual comments', progress: 95 },
  { label: 'Gallery ready', progress: 100 },
];

export const GalleryPreloader: React.FC<GalleryPreloaderProps> = ({
  onComplete,
  statusText,
  autoSkip = false,
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(autoSkip ? 100 : 15);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1' || autoSkip) {
        onComplete();
        return;
      }
    }

    let timer: NodeJS.Timeout;

    const advanceStage = (stageIdx: number) => {
      if (stageIdx >= LOADING_STAGES.length) {
        setProgress(100);
        setIsFadingOut(true);
        setTimeout(() => {
          onComplete();
        }, 160);
        return;
      }

      setCurrentStageIndex(stageIdx);
      setProgress(LOADING_STAGES[stageIdx].progress);

      const delay = stageIdx === 0 ? 120 : stageIdx === 1 ? 160 : stageIdx === 2 ? 180 : 140;
      timer = setTimeout(() => {
        advanceStage(stageIdx + 1);
      }, delay);
    };

    timer = setTimeout(() => {
      advanceStage(0);
    }, 80);

    return () => clearTimeout(timer);
  }, [autoSkip, onComplete]);

  const handleRetry = () => {
    setHasError(false);
    setCurrentStageIndex(0);
    setProgress(20);
  };

  const currentLabel = statusText || LOADING_STAGES[currentStageIndex]?.label || 'Preparing your gallery';

  return (
    <div
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Evidence Makers Gallery Initialization"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0A0A] px-6 transition-opacity duration-150 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center w-full max-w-sm">
        {/* Transparent Evidence Makers Logo centered on primary background */}
        <BrandLogo variant="vertical" size="xl" className="mb-8" />

        {/* Slim 2px linear progress track directly beneath logo */}
        <div className="w-full bg-[#181818] h-[2px] rounded-full overflow-hidden relative border border-[#27272A]">
          <div
            className="h-full bg-[#D4AF37] transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress percentage and genuine status label in Sora */}
        <div className="flex items-center justify-between w-full mt-3 text-xs font-sans">
          <span className="text-[#A1A1AA] tracking-wide truncate pr-2">
            {currentLabel}
          </span>
          <span className="text-[#D4AF37] font-sans tabular-nums font-semibold shrink-0">
            {progress}%
          </span>
        </div>

        {hasError && (
          <div className="mt-6 flex flex-col items-center gap-2">
            <span className="text-xs text-[#A1A1AA]">Failed to initialize gallery cache.</span>
            <button
              onClick={handleRetry}
              className="px-3 py-1.5 text-xs text-white bg-[#181818] hover:bg-[#202020] border border-[#27272A] rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              Retry Initialization
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
