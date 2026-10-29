/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'right' | 'center';
}

export const Popover: React.FC<PopoverProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
  align = 'right',
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideAction = (event: MouseEvent | TouchEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideAction);
    document.addEventListener('touchstart', handleOutsideAction);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideAction);
      document.removeEventListener('touchstart', handleOutsideAction);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const alignmentClass = {
    left: 'left-0 origin-top-left',
    right: 'right-0 origin-top-right',
    center: 'left-1/2 -translate-x-1/2 origin-top',
  }[align];

  return (
    <div
      ref={popoverRef}
      role="menu"
      tabIndex={-1}
      className={`absolute z-50 mt-2 bg-[#121212] border border-[#27272A] rounded-xl shadow-2xl overflow-hidden focus:outline-none transition-all duration-150 animate-in fade-in-0 zoom-in-95 max-w-[calc(100vw-1.5rem)] ${alignmentClass} ${className}`}
    >
      {children}
    </div>
  );
};
