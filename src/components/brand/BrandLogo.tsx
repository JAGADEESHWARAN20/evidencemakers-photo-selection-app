/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'mark-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  variant = 'horizontal',
  size = 'md',
}) => {
  const [imgError, setImgError] = useState(false);

  const dimensions = {
    sm: { height: 'h-7', imgHeight: 28 },
    md: { height: 'h-9', imgHeight: 36 },
    lg: { height: 'h-14', imgHeight: 56 },
    xl: { height: 'h-24', imgHeight: 96 },
  }[size];

  // Primary official brand logo asset from public folder
  const logoSrc = '/logo-evidencemakers.png';

  if (!imgError) {
    if (variant === 'vertical') {
      return (
        <div className={`flex flex-col items-center justify-center text-center ${className}`}>
          <img
            src={logoSrc}
            alt="Evidence Makers Studio"
            onError={() => setImgError(true)}
            className={`${dimensions.height} w-auto object-contain select-none`}
            loading="eager"
          />
        </div>
      );
    }

    if (variant === 'mark-only') {
      return (
        <div className={`inline-flex items-center overflow-hidden ${className}`}>
          <img
            src={logoSrc}
            alt="Evidence Makers Mark"
            onError={() => setImgError(true)}
            className={`${dimensions.height} w-auto object-contain select-none`}
            style={{ clipPath: 'inset(0 0 35% 0)' }} // crops to top emblem
          />
        </div>
      );
    }

    // Default horizontal lockup
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <img
          src={logoSrc}
          alt="Evidence Makers"
          onError={() => setImgError(true)}
          className={`${dimensions.height} w-auto object-contain select-none`}
          loading="eager"
        />
      </div>
    );
  }

  // Resilient vector fallback matching the brand colors & typography
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={dimensions.imgHeight}
        height={dimensions.imgHeight}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M 50 8 A 42 42 0 1 0 88 65 L 78 58 A 32 32 0 1 1 50 18 Z"
          fill="#D4AF37"
        />
        <path
          d="M 45 4 C 65 4, 82 15, 88 28 C 78 20, 62 14, 45 14 Z"
          fill="#E5C158"
        />
      </svg>
      {variant !== 'mark-only' && (
        <div className="flex flex-col leading-none">
          <span className="font-editorial text-lg tracking-[0.16em] text-white font-semibold uppercase">
            Evidence Makers
          </span>
          <span className="text-[9px] tracking-[0.24em] text-[#A1A1AA] uppercase font-sans mt-0.5">
            Studio Proofing
          </span>
        </div>
      )}
    </div>
  );
};
