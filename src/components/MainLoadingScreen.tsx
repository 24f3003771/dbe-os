'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie, { LottieRefType } from 'lottie-react';
import tomatoAnimation from '@/data/tomato.json';

const theme = {
  emerald: '#29664c',
  tomato: '#FF4D4D',
  white: '#FFFFFF'
};

export default function MainLoadingScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [phase, setPhase] = useState('bouncing-tomatoes'); // bouncing-tomatoes -> splash -> end
  const lottieRef = useRef<LottieRefType>(null);

  useEffect(() => {
    // Show only once per session
    const hasBooted = sessionStorage.getItem('dbe_os_booted_v6');
    if (hasBooted && process.env.NODE_ENV === 'production') return;

    setIsVisible(true);
    sessionStorage.setItem('dbe_os_booted_v6', 'true');

    // Timing for phases
    const timer1 = setTimeout(() => setPhase('splash'), 2500);
    const timer2 = setTimeout(() => setIsVisible(false), 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="relative w-full h-64 flex items-center justify-center">
          
          {/* Phase 1: Bouncing Tomatoes */}
          {phase === 'bouncing-tomatoes' && (
            <div className="flex gap-4">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ y: 0 }}
                  animate={{ 
                    y: [0, -30, 0],
                  }}
                  transition={{ 
                    duration: 0.6, 
                    repeat: Infinity, 
                    delay: i * 0.15,
                    ease: "easeInOut"
                  }}
                  className="w-16 h-16"
                >
                  <Lottie 
                    animationData={tomatoAnimation} 
                    loop={true}
                    autoplay={true}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Phase 2: Tomato Splash Effect */}
          {phase === 'splash' && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 2.5, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-64 h-64"
            >
              <Lottie 
                lottieRef={lottieRef}
                animationData={tomatoAnimation} 
                loop={false}
                autoplay={true}
                onComplete={() => {
                  // Optional: stay on the splash for a moment
                }}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <span className="text-2xl font-black text-white drop-shadow-lg uppercase tracking-tighter">
                  DBE - OS
                </span>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* The New Quote */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-20 flex flex-col items-center gap-4"
        >
           <p className="text-sm font-bold text-stone-600 max-w-sm text-center leading-relaxed">
              "Platform by <span className="text-red-500 uppercase">BBA DBE community</span> 
              for <span className="text-red-500 uppercase">BBA DBE community !!</span>"
           </p>
           <div className="flex items-center gap-1.5 px-4 py-1.5 bg-red-50 rounded-full border border-red-100 shadow-sm">
              <span className="text-sm">🍅</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-red-500">IIMB Tomato Engine</span>
           </div>
        </motion.div>

        {/* Global Progress Line */}
        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-stone-50 overflow-hidden">
           <motion.div 
             className="h-full bg-red-500"
             initial={{ width: "0%" }}
             animate={{ width: "100%" }}
             transition={{ duration: 4.5, ease: "linear" }}
           />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
