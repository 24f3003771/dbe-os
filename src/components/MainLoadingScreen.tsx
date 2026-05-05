'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from './Skeleton';

export default function MainLoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const hasBooted = sessionStorage.getItem('dbe_os_booted_v11');
    if (hasBooted && process.env.NODE_ENV === 'production') {
      setIsVisible(false);
      return;
    }

    const startExit = setTimeout(() => setIsVisible(false), 2500);
    sessionStorage.setItem('dbe_os_booted_v11', 'true');

    return () => clearTimeout(startExit);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
          className="fixed inset-0 z-[10000] bg-background flex flex-col overflow-hidden"
        >
          {/* Skeleton Header */}
          <div className="w-full border-b border-white/5 py-4 px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton variant="circular" className="w-10 h-10" />
              <Skeleton className="w-32 h-6" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="w-24 h-8 rounded-full" />
              <Skeleton variant="circular" className="w-8 h-8" />
            </div>
          </div>

          {/* Skeleton Main Content */}
          <div className="flex-1 max-w-7xl mx-auto w-full p-8 space-y-12">
            <div className="space-y-4">
              <Skeleton className="w-1/4 h-10" />
              <Skeleton className="w-1/2 h-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-surface/30 rounded-3xl p-8 border border-white/5 space-y-6">
                  <Skeleton variant="circular" className="w-14 h-14" />
                  <div className="space-y-3">
                    <Skeleton className="w-3/4 h-6" />
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-2/3 h-4" />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <Skeleton className="w-48 h-8" />
                <Skeleton className="w-24 h-4" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-surface/30 rounded-3xl h-64 border border-white/5 p-8">
                  <Skeleton className="w-full h-full rounded-2xl" />
                </div>
                <div className="bg-surface/30 rounded-3xl h-64 border border-white/5 p-8">
                  <Skeleton className="w-full h-full rounded-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
              <img src="/icon.png" alt="Logo" className="w-6 h-6 rounded-lg" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">DBE OS Platform</span>
            </div>
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em]">Optimizing Academic Performance</p>
          </div>
          
          <motion.div 
            className="absolute bottom-0 inset-x-0 h-1 bg-primary/20"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2.5, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
