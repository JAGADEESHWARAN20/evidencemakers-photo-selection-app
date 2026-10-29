/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Bespoke Studio Overview / Dashboard Icon
 * Architectural geometric view with glowing center lens node
 */
export const IconStudioOverview: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-all duration-300 ${className}`}
  >
    <rect
      x="3"
      y="3"
      width="8"
      height="8"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.6"
      className="transition-transform duration-300 group-hover:scale-95 origin-top-left"
    />
    <rect
      x="13"
      y="3"
      width="8"
      height="8"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.6"
      className="transition-transform duration-300 group-hover:scale-95 origin-top-right"
    />
    <rect
      x="3"
      y="13"
      width="8"
      height="8"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.6"
      className="transition-transform duration-300 group-hover:scale-95 origin-bottom-left"
    />
    <circle
      cx="17"
      cy="17"
      r="4"
      stroke="#D4AF37"
      strokeWidth="1.6"
      className="transition-transform duration-500 group-hover:rotate-90 origin-center"
    />
    <circle cx="17" cy="17" r="1.5" fill="#D4AF37" />
  </svg>
);

/**
 * Bespoke Folio / Projects Icon
 * Luxury heirloom album binding with opening spread flap
 */
export const IconProjectsFolio: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-all duration-300 ${className}`}
  >
    <path
      d="M4 19.5V5.5C4 4.4 4.9 3.5 6 3.5H19C19.6 3.5 20 3.9 20 4.5V18.5C20 19.1 19.6 19.5 19 19.5H6C4.9 19.5 4 18.6 4 17.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M4 17.5C4 16.4 4.9 15.5 6 15.5H20"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M10 3.5V11L12.5 9.5L15 11V3.5"
      stroke="#D4AF37"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform duration-300 group-hover:translate-y-0.5"
    />
  </svg>
);

/**
 * Bespoke Camera Aperture / RAW Asset Icon
 * Interlocking precision geometric aperture blades with rotation on hover
 */
export const IconRawAperture: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-all duration-300 group-hover:rotate-45 ${className}`}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M12 3L16.5 10.5"
      stroke="#D4AF37"
      strokeWidth="1.5"
      strokeLinecap="round"
      className="transition-all duration-300"
    />
    <path
      d="M19.8 7.5L16.5 15"
      stroke="#D4AF37"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M19.8 16.5L12 16.5"
      stroke="#D4AF37"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 21L7.5 13.5"
      stroke="#D4AF37"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M4.2 16.5L7.5 9"
      stroke="#D4AF37"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M4.2 7.5L12 7.5"
      stroke="#D4AF37"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Bespoke Album Selection / Panorama Spread Icon
 * Dual-page fine art heirloom book spread with crop framing
 */
export const IconAlbumSelection: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-all duration-300 ${className}`}
  >
    <rect
      x="2.5"
      y="5"
      width="19"
      height="14"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <line
      x1="12"
      y1="5"
      x2="12"
      y2="19"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="2 2"
    />
    {/* Highlighted selection spread */}
    <rect
      x="5"
      y="7.5"
      width="5"
      height="9"
      rx="1"
      stroke="#D4AF37"
      strokeWidth="1.4"
      className="transition-all duration-300 group-hover:stroke-width-2"
    />
    <path
      d="M14.5 10H18.5M14.5 13H17.5"
      stroke="#8C8C8C"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Bespoke Quick-Share Compass / Broadcast Icon
 */
export const IconShareCompass: React.FC<IconProps> = ({ className = '', size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-300 group-hover:scale-110 ${className}`}
  >
    <circle cx="18" cy="5" r="3" stroke="#D4AF37" strokeWidth="1.6" />
    <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="18" cy="19" r="3" stroke="#D4AF37" strokeWidth="1.6" />
    <line
      x1="8.6"
      y1="10.7"
      x2="15.4"
      y2="6.3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="8.6"
      y1="13.3"
      x2="15.4"
      y2="17.7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Bespoke Key / Monogram Lock Icon
 */
export const IconMonogramKey: React.FC<IconProps> = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-300 ${className}`}
  >
    <circle cx="7.5" cy="15.5" r="4.5" stroke="#D4AF37" strokeWidth="1.6" />
    <circle cx="7.5" cy="15.5" r="1.5" fill="#D4AF37" />
    <path
      d="M10.8 12.2L19.5 3.5M16 4.5L18.5 7M18 6.5L20.5 9"
      stroke="#D4AF37"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Bespoke New Project Crosshair Icon
 */
export const IconPlusProject: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-300 group-hover:rotate-90 ${className}`}
  >
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * Bespoke WhatsApp Sharing SVG
 */
export const IconShareWhatsApp: React.FC<IconProps> = ({ className = '', size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.37 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 6.46 17.5 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.3C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.04 3.67C16.58 3.67 20.28 7.37 20.28 11.91C20.28 16.45 16.58 20.15 12.04 20.15ZM16.57 14.39C16.32 14.26 15.1 13.66 14.87 13.58C14.65 13.5 14.48 13.46 14.32 13.71C14.15 13.96 13.68 14.51 13.54 14.67C13.4 14.83 13.26 14.85 13.01 14.73C12.76 14.6 11.96 14.34 11.02 13.5C10.28 12.84 9.79 12.03 9.65 11.78C9.51 11.53 9.63 11.4 9.76 11.27C9.87 11.16 10.01 10.98 10.14 10.83C10.27 10.68 10.31 10.57 10.39 10.4C10.47 10.23 10.43 10.09 10.37 9.96C10.31 9.83 9.81 8.61 9.61 8.11C9.41 7.62 9.21 7.69 9.06 7.68C8.92 7.67 8.75 7.67 8.58 7.67C8.42 7.67 8.15 7.73 7.92 7.98C7.69 8.23 7.05 8.83 7.05 10.05C7.05 11.27 7.94 12.44 8.06 12.61C8.19 12.77 9.82 15.28 12.31 16.36C12.9 16.62 13.36 16.77 13.72 16.88C14.31 17.07 14.85 17.04 15.28 16.98C15.76 16.91 16.76 16.37 16.97 15.78C17.18 15.19 17.18 14.69 17.12 14.59C17.06 14.49 16.82 14.42 16.57 14.39Z" />
  </svg>
);

/**
 * Bespoke Facebook Sharing SVG
 */
export const IconShareFacebook: React.FC<IconProps> = ({ className = '', size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H7.5V12H10V9.5C10 7.02 11.54 5.5 13.75 5.5C14.81 5.5 15.75 5.6 15.75 5.6V8H14.5C13.26 8 12.87 8.77 12.87 9.56V12H15.63L15.19 15H12.87V21.8C17.42 20.87 22 16.84 22 12Z" />
  </svg>
);

/**
 * Bespoke Instagram Sharing SVG
 */
export const IconShareInstagram: React.FC<IconProps> = ({ className = '', size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
  </svg>
);

/**
 * Bespoke Email / Envelope SVG
 */
export const IconShareEmail: React.FC<IconProps> = ({ className = '', size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M3 7L12 13L21 7"
      stroke="#D4AF37"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Bespoke Copy Direct Link SVG
 */
export const IconCopyLink: React.FC<IconProps> = ({ className = '', size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M10 13C10.45 13.57 11.04 14.03 11.71 14.33C12.38 14.63 13.12 14.77 13.86 14.73C14.6 14.69 15.32 14.47 15.95 14.1C16.58 13.73 17.11 13.22 17.5 12.6L19.5 9.4C20.21 8.24 20.28 6.78 19.69 5.56C19.1 4.34 17.92 3.5 16.6 3.34C15.28 3.18 13.98 3.73 13.17 4.79L12 6.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M14 11C13.55 10.43 12.96 9.97 12.29 9.67C11.62 9.37 10.88 9.23 10.14 9.27C9.4 9.31 8.68 9.53 8.05 9.9C7.42 10.27 6.89 10.78 6.5 11.4L4.5 14.6C3.79 15.76 3.72 17.22 4.31 18.44C4.9 19.66 6.08 20.5 7.4 20.66C8.72 20.82 10.02 20.27 10.83 19.21L12 17.5"
      stroke="#D4AF37"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);
