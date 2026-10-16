/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BrandLogo } from '../../components/brand/BrandLogo.tsx';

interface ClientOnboardingSequenceProps {
  clientName: string;
  projectName: string;
  packageName: string;
  eventDate?: string;
  packageInstructions?: string;
  onComplete: () => void;
}

export const ClientOnboardingSequence: React.FC<ClientOnboardingSequenceProps> = ({
  clientName,
  projectName,
  packageName,
  eventDate,
  packageInstructions,
  onComplete,
}) => {
  const [phase, setPhase] = useState<'preloader' | 'reveal'>('preloader');
  const [progress, setProgress] = useState(12);

  // Phase 1: Clean Minimalist Preloader
  useEffect(() => {
    if (phase !== 'preloader') return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase('reveal'), 250);
          return 100;
        }
        const jump = Math.floor(Math.random() * 22) + 14;
        return Math.min(100, prev + jump);
      });
    }, 120);

    return () => clearInterval(interval);
  }, [phase]);

  // Phase 2: Blur Text Reveal with Framer Motion and smooth transition
  useEffect(() => {
    if (phase !== 'reveal') return;

    // Auto-advance after cinematic reveal completes
    const autoTimer = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => clearTimeout(autoTimer);
  }, [phase, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#080808] flex items-center justify-center p-6 select-none font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === 'preloader' ? (
          <motion.div
            key="preloader"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.4 } }}
            className="w-full max-w-sm flex flex-col items-center text-center space-y-6"
          >
            <div className="mb-3">
              <BrandLogo variant="horizontal" size="md" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#8C8C8C] font-medium">
                Evidence Makers Studio
              </span>
              <p className="text-sm font-editorial text-white">
                Preparing your curated proofing collection...
              </p>
            </div>

            {/* Editorial Linear Progress Bar */}
            <div className="w-full max-w-[240px] space-y-2">
              <div className="w-full bg-[#1A1A1A] h-1 rounded-full overflow-hidden border border-[#242424]">
                <motion.div
                  className="bg-[#D4AF37] h-full"
                  initial={{ width: '12%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#8C8C8C] font-mono">
                <span>PORTAL_SECURITY_VERIFIED</span>
                <span>{progress}%</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(14px)', transition: { duration: 0.5 } }}
            className="w-full max-w-3xl flex flex-col items-center text-center space-y-8"
          >
            {/* Top brand tagline with blur-in */}
            <motion.div
              initial={{ opacity: 0, filter: 'blur(12px)', y: -10 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121212] border border-[#242424] text-[11px] uppercase tracking-[0.25em] text-[#D4AF37] font-medium"
            >
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Private Proofing Collection</span>
            </motion.div>

            {/* Core Blur Text Reveal: Client's Name */}
            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, filter: 'blur(24px)', y: 24, scale: 0.97 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-6xl md:text-7xl font-editorial font-medium text-white tracking-tight leading-tight"
              >
                {clientName}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, filter: 'blur(14px)', y: 12 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm sm:text-base text-[#8C8C8C] font-editorial italic"
              >
                {projectName} {eventDate ? `· ${eventDate}` : ''}
              </motion.div>
            </div>

            {/* Package & Curator Details with subtle stagger */}
            <motion.div
              initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl text-center space-y-2 text-xs sm:text-sm text-[#A3A3A3] font-sans leading-relaxed"
            >
              <p className="text-white font-medium">
                {packageName}
              </p>
              <p className="text-xs text-[#8C8C8C]">
                {packageInstructions || 'Select your signature photographs for the custom handcrafted album.'}
              </p>
            </motion.div>

            {/* Action CTA to Enter Gallery immediately */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.95 }}
              className="pt-2"
            >
              <button
                type="button"
                onClick={onComplete}
                className="group inline-flex items-center gap-2.5 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-black bg-[#D4AF37] hover:bg-[#C5A028] rounded-full transition-all shadow-xl hover:shadow-[#D4AF37]/20 hover:scale-105 active:scale-95"
              >
                <span>Enter Gallery Grid</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
