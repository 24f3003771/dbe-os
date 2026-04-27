'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie, { LottieRefType } from 'lottie-react';
import tomatoAnimation from '@/data/tomato.json';

export default function MainLoadingScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [phase, setPhase] = useState('bouncing'); // bouncing -> impact -> splash -> finish
  const lottieRef = useRef<LottieRefType>(null);

  useEffect(() => {
    // Show only once per session
    const hasBooted = sessionStorage.getItem('dbe_os_booted_v8');
    if (hasBooted && process.env.NODE_ENV === 'production') return;

    setIsVisible(true);
    sessionStorage.setItem('dbe_os_booted_v8', 'true');

    // Precision Timeline
    const t1 = setTimeout(() => setPhase('impact'), 2200); // Small merge into big
    const t2 = setTimeout(() => setPhase('splash'), 2600); // Big one splashes
    const t3 = setTimeout(() => setIsVisible(false), 5800); // Fade to dashboard

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // "Written Way" Text Reveal Variant
  const textContainer = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const textChild = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="relative w-full h-96 flex items-center justify-center">
            
            {/* Phase 1: Small Bouncing Tomatoes */}
            <AnimatePresence>
              {phase === 'bouncing' && (
                <motion.div 
                  key="group"
                  exit={{ scale: 0, opacity: 0, transition: { duration: 0.4, ease: "backIn" } }}
                  className="flex gap-8 items-center"
                >
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -40, 0] }}
                      transition={{ 
                        duration: 0.6, 
                        repeat: Infinity, 
                        delay: i * 0.1,
                        ease: "easeInOut"
                      }}
                      className="w-12 h-12"
                    >
                      <Lottie animationData={tomatoAnimation} loop={true} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Phase 2: Big Tomato Impact Fly-In */}
            <AnimatePresence>
              {phase === 'impact' && (
                <motion.div 
                  key="big-tomato"
                  initial={{ scale: 4, opacity: 0, z: 500 }}
                  animate={{ scale: 1.2, opacity: 1, z: 0 }}
                  exit={{ scale: 2.5, opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.4, ease: "circIn" }}
                  className="w-48 h-48"
                >
                  <Lottie animationData={tomatoAnimation} loop={false} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Phase 3: The Splash & Written Text */}
            <AnimatePresence>
              {phase === 'splash' && (
                <div className="relative w-full flex items-center justify-center">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 2.8, opacity: 1 }}
                    className="w-64 h-64"
                  >
                    <Lottie 
                      lottieRef={lottieRef}
                      animationData={tomatoAnimation} 
                      loop={false}
                    />
                  </motion.div>

                  {/* Written Style Reveal */}
                  <motion.div
                    variants={textContainer}
                    initial="hidden"
                    animate="visible"
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    {"DBE - OS".split("").map((char, index) => (
                      <motion.span
                        key={index}
                        variants={textChild}
                        className="text-5xl font-black text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] uppercase tracking-tighter"
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Quote Reveal */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'splash' ? 1 : 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="absolute bottom-20 flex flex-col items-center gap-6"
          >
             <div className="flex flex-col items-center">
                <motion.p 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
                  className="text-xs font-black text-stone-300 uppercase tracking-[0.4em] mb-2 whitespace-nowrap overflow-hidden"
                >
                  BBA DBE Community Platform
                </motion.p>
                <p className="text-sm font-bold text-stone-500 text-center italic">
                   "By the community, for the community !!"
                </p>
             </div>
             
             <div className="flex items-center gap-2 px-4 py-1.5 bg-red-50/50 rounded-full border border-red-100 shadow-sm">
                <span className="text-sm">🍅</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Tomato Engine v2.0</span>
             </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-stone-50">
             <motion.div 
               className="h-full bg-red-500"
               initial={{ width: "0%" }}
               animate={{ width: "100%" }}
               transition={{ duration: 5.8, ease: "linear" }}
             />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
