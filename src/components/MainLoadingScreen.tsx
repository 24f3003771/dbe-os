'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie, { LottieRefType } from 'lottie-react';
import tomatoAnimation from '@/data/tomato.json';

export default function MainLoadingScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [phase, setPhase] = useState('loading'); // loading -> bouncing -> splash -> end
  const lottieRef = useRef<LottieRefType>(null);

  useEffect(() => {
    // Show only once per session
    const hasBooted = sessionStorage.getItem('dbe_os_booted_v9');
    if (hasBooted && process.env.NODE_ENV === 'production') return;

    setIsVisible(true);
    sessionStorage.setItem('dbe_os_booted_v9', 'true');

    // Solid State Machine Timeline
    const startBouncing = setTimeout(() => setPhase('bouncing'), 100);
    const triggerSplash = setTimeout(() => setPhase('splash'), 2400);
    const startExit = setTimeout(() => setIsVisible(false), 5600);

    return () => {
      clearTimeout(startBouncing);
      clearTimeout(triggerSplash);
      clearTimeout(startExit);
    };
  }, []);

  if (!isVisible) return null;

  const charVariants = {
    hidden: { opacity: 0, scale: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: 2.6 + (i * 0.08), // Strictly timed after splash starts (2.4s)
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
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Main Stage */}
          <div className="relative w-full h-[500px] flex items-center justify-center">
            
            {/* Phase 1: Small Tomatoes */}
            {phase === 'bouncing' && (
              <motion.div 
                key="bouncing-stage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex gap-10"
              >
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -50, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                    className="w-14 h-14"
                  >
                    <Lottie animationData={tomatoAnimation} loop={true} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Phase 2: The Giant Splash & Reveal */}
            {phase === 'splash' && (
              <div className="relative flex items-center justify-center">
                {/* Big Tomato Splash */}
                <motion.div 
                  initial={{ scale: 0.1, opacity: 0 }}
                  animate={{ scale: 3, opacity: 1 }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                  className="w-64 h-64"
                >
                  <Lottie 
                    animationData={tomatoAnimation} 
                    loop={false}
                    autoplay={true}
                  />
                </motion.div>

                {/* DBE - OS Handwriting Style */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-nowrap whitespace-nowrap">
                   {"DBE - OS".split("").map((char, i) => (
                      <motion.span
                        key={i}
                        custom={i}
                        variants={charVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-5xl md:text-6xl font-black text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] uppercase tracking-tighter"
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                   ))}
                </div>
              </div>
            )}
          </div>

          {/* Fixed Quote Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: phase === 'splash' ? 1 : 0 }}
            transition={{ delay: 3.2, duration: 0.8 }}
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
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center gap-2 px-5 py-2 bg-red-50/80 rounded-2xl border border-red-100 shadow-sm"
             >
                <span className="text-lg">🍅</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Tomato Engine v2.0</span>
             </motion.div>
          </motion.div>

          {/* Precise Progress Bar */}
          <div className="absolute bottom-0 inset-x-0 h-2 bg-stone-50 overflow-hidden">
             <motion.div 
               className="h-full bg-gradient-to-r from-red-400 to-red-600"
               initial={{ width: "0%" }}
               animate={{ width: "100%" }}
               transition={{ duration: 5.6, ease: "linear" }}
             />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
