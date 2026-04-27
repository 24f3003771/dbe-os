'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie, { LottieRefType } from 'lottie-react';
import tomatoAnimation from '@/data/tomato.json';

export default function MainLoadingScreen() {
  // Initialize to true to avoid flash if not booted
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState('bouncing'); // bouncing -> splash -> end
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    // Show only once per session
    const hasBooted = sessionStorage.getItem('dbe_os_booted_v10');
    if (hasBooted && process.env.NODE_ENV === 'production') {
      setIsVisible(false);
      return;
    }

    // Solid State Machine Timeline
    const triggerSplash = setTimeout(() => setPhase('splash'), 3000);
    const startExit = setTimeout(() => setIsVisible(false), 6000);

    sessionStorage.setItem('dbe_os_booted_v10', 'true');

    return () => {
      clearTimeout(triggerSplash);
      clearTimeout(startExit);
    };
  }, []);

  // During SSR or if already booted, don't show the initial white screen if possible
  // However, isVisible being true initially is safer to prevent dashboard flash.
  if (!isVisible) return null;

  const charVariants = {
    hidden: { opacity: 0, scale: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: 3.2 + (i * 0.08), 
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    })
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Main Stage */}
          <div className="relative w-full h-[500px] flex items-center justify-center">
            
            {/* Phase 1: Small Bouncing Tomatoes + Subtle Heading */}
            {phase === 'bouncing' && (
              <motion.div 
                key="bouncing-stage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center gap-12"
              >
                <div className="flex flex-col items-center gap-4">
                  <h1 className="text-xl font-black text-stone-200 uppercase tracking-[0.6em] animate-pulse">DBE - OS</h1>
                  <div className="h-0.5 w-12 bg-red-500/20 rounded-full" />
                </div>

                <div className="flex gap-10">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -40, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                      className="w-14 h-14"
                    >
                      <Lottie animationData={tomatoAnimation} loop={true} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Phase 2: The Giant Splash & Final Reveal */}
            {phase === 'splash' && (
              <div className="relative flex items-center justify-center">
                <motion.div 
                  initial={{ scale: 0.1, opacity: 0 }}
                  animate={{ scale: 3.2, opacity: 1 }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                  className="w-64 h-64"
                >
                  <Lottie 
                    animationData={tomatoAnimation} 
                    loop={false}
                    autoplay={true}
                  />
                </motion.div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-nowrap whitespace-nowrap">
                   {"DBE - OS".split("").map((char, i) => (
                      <motion.span
                        key={i}
                        custom={i}
                        variants={charVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)] uppercase tracking-tighter"
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                   ))}
                </div>
              </div>
            )}
          </div>

          {/* Quote Section - Visible from start */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute bottom-24 flex flex-col items-center gap-6"
          >
             <div className="text-center space-y-2">
                <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.5em] opacity-80">Platform by BBA DBE Community</p>
                <h2 className="text-sm md:text-base font-bold text-stone-600 italic">
                   "Built by the community, for the community !!"
                </h2>
             </div>
             
             <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-2 px-5 py-2 bg-red-50/80 rounded-2xl border border-red-100 shadow-sm"
             >
                <span className="text-lg">🍅</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Tomato Engine v2.0</span>
             </motion.div>
          </motion.div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 inset-x-0 h-2 bg-stone-50 overflow-hidden">
             <motion.div 
               className="h-full bg-gradient-to-r from-red-400 to-red-600"
               initial={{ width: "0%" }}
               animate={{ width: "100%" }}
               transition={{ duration: 6, ease: "linear" }}
             />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
