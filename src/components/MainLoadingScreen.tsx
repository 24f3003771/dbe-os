'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie, { LottieRefType } from 'lottie-react';
import tomatoAnimation from '@/data/tomato.json';

export default function MainLoadingScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [phase, setPhase] = useState('bouncing'); // bouncing -> merging -> splash -> end
  const lottieRef = useRef<LottieRefType>(null);

  useEffect(() => {
    // Show only once per session
    const hasBooted = sessionStorage.getItem('dbe_os_booted_v7');
    if (hasBooted && process.env.NODE_ENV === 'production') return;

    setIsVisible(true);
    sessionStorage.setItem('dbe_os_booted_v7', 'true');

    // Smooth Sequential Timing
    const mergeTimer = setTimeout(() => setPhase('merging'), 2000);
    const splashTimer = setTimeout(() => setPhase('splash'), 2600);
    const endTimer = setTimeout(() => setIsVisible(false), 5500);

    return () => {
      clearTimeout(mergeTimer);
      clearTimeout(splashTimer);
      clearTimeout(endTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div 
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } 
          }}
          className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="relative w-full h-80 flex items-center justify-center">
            
            {/* Phase 1 & 2: Bouncing and Merging */}
            <AnimatePresence>
              {(phase === 'bouncing' || phase === 'merging') && (
                <motion.div 
                  key="tomatoes-group"
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.4 } }}
                  className="flex gap-6 items-center"
                >
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 0, opacity: 0, scale: 0 }}
                      animate={{ 
                        y: phase === 'merging' ? 0 : [0, -40, 0],
                        x: phase === 'merging' ? (1.5 - i) * 80 : 0, // Move towards center
                        opacity: 1,
                        scale: phase === 'merging' ? 0 : 1,
                      }}
                      transition={{ 
                        y: {
                          duration: 0.8, 
                          repeat: phase === 'merging' ? 0 : Infinity, 
                          delay: i * 0.1,
                          ease: "easeInOut"
                        },
                        x: { duration: 0.6, ease: "circIn" },
                        scale: { duration: 0.4, delay: phase === 'merging' ? 0.2 : i * 0.1 },
                        opacity: { duration: 0.3, delay: i * 0.05 }
                      }}
                      className="w-14 h-14"
                    >
                      <Lottie 
                        animationData={tomatoAnimation} 
                        loop={true}
                        autoplay={true}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Phase 3: The Big Splash */}
            <AnimatePresence>
              {phase === 'splash' && (
                <motion.div 
                  key="splash-container"
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: 1.8, opacity: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    mass: 1
                  }}
                  className="relative w-96 h-96 flex items-center justify-center"
                >
                  <Lottie 
                    lottieRef={lottieRef}
                    animationData={tomatoAnimation} 
                    loop={false}
                    autoplay={true}
                    style={{ width: '100%', height: '100%' }}
                  />
                  
                  {/* Synced Text Reveal */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-4xl font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] uppercase tracking-tighter">
                        DBE - OS
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Persistent but animated Quote */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
            className="absolute bottom-24 flex flex-col items-center gap-5"
          >
             <div className="space-y-1">
                <p className="text-sm font-bold text-stone-400 text-center uppercase tracking-[0.2em] opacity-60">Platform by</p>
                <p className="text-lg font-black text-stone-800 max-w-sm text-center leading-tight uppercase tracking-tight">
                   BBA DBE <span className="text-red-500">Community</span> 
                </p>
                <p className="text-sm font-bold text-stone-400 text-center uppercase tracking-[0.2em] opacity-60">for the community !!</p>
             </div>
             
             <motion.div 
               animate={{ scale: [1, 1.05, 1] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="flex items-center gap-2 px-5 py-2 bg-red-50 rounded-2xl border border-red-100/50 shadow-sm"
             >
                <span className="text-base">🍅</span>
                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-red-500/80">IIMB Tomato Engine</span>
             </motion.div>
          </motion.div>

          {/* Smooth Global Progress */}
          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-stone-100 overflow-hidden">
             <motion.div 
               className="h-full bg-gradient-to-r from-red-400 to-red-600"
               initial={{ width: "0%" }}
               animate={{ width: "100%" }}
               transition={{ duration: 5.5, ease: "easeInOut" }}
             />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
