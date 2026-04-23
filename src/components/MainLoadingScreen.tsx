'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const theme = {
  emerald: '#29664c',
  tomato: '#FF4D4D',
  white: '#FFFFFF'
};

const dots = [
  { color: theme.emerald, initialX: -60 },
  { color: theme.tomato, initialX: -20 },
  { color: theme.emerald, initialX: 20 },
  { color: theme.tomato, initialX: 60 },
];

export default function MainLoadingScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [phase, setPhase] = useState('sync-bounce'); // sync-bounce -> rotate -> merge -> reveal

  useEffect(() => {
    // Show only once per session
    const hasBooted = sessionStorage.getItem('dbe_os_booted_v5');
    if (hasBooted && process.env.NODE_ENV === 'production') return;

    setIsVisible(true);
    sessionStorage.setItem('dbe_os_booted_v5', 'true');

    // High-Precision Timing for Symmetry
    const timer1 = setTimeout(() => setPhase('rotate'), 1800);
    const timer2 = setTimeout(() => setPhase('merge'), 3200);
    const timer3 = setTimeout(() => setPhase('reveal'), 3600);
    const timer4 = setTimeout(() => setIsVisible(false), 5500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="relative w-full h-48 flex items-center justify-center">
          
          {/* Phase 1: Perfectly Symmetrical Bounce */}
          {phase === 'sync-bounce' && (
            <div className="flex gap-6">
              {dots.map((dot, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -40, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 0.6, 
                    repeat: Infinity, 
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                  className="w-5 h-5 rounded-full shadow-lg"
                  style={{ backgroundColor: dot.color }}
                />
              ))}
            </div>
          )}

          {/* Phase 2: Symmetrical Rotation */}
          {phase === 'rotate' && (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="relative w-20 h-20"
            >
              {[0, 90, 180, 270].map((angle, i) => (
                <div 
                  key={i}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ 
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-35px)` 
                  }}
                >
                   <div 
                    className="w-5 h-5 rounded-full shadow-md"
                    style={{ backgroundColor: dots[i].color }}
                  />
                </div>
              ))}
            </motion.div>
          )}

          {/* Phase 3: Symmetrical Merge */}
          {phase === 'merge' && (
            <motion.div 
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: [0.5, 1.5, 0], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.4 }}
              className="w-12 h-12 bg-primary rounded-full"
            />
          )}

          {/* Phase 4: Symmetrical Logo Reveal */}
          {phase === 'reveal' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="relative flex items-center justify-center">
                {/* Modern Tomato-Inspired "DB" Logo */}
                <svg viewBox="0 0 100 100" className="w-24 h-24">
                   {/* Tomato base shape (Emerald Outer) */}
                   <motion.path 
                     d="M 50 15 C 30 15 15 30 15 50 C 15 70 30 85 50 85 C 70 85 85 70 85 50 C 85 30 70 15 50 15"
                     fill="#29664c10"
                     stroke="#29664c"
                     strokeWidth="2"
                     initial={{ pathLength: 0 }}
                     animate={{ pathLength: 1 }}
                     transition={{ duration: 1 }}
                   />
                   {/* Tomato "Leaf" top in Red */}
                   <motion.path 
                     d="M 50 15 L 50 5 M 40 10 L 60 10"
                     stroke="#FF4D4D"
                     strokeWidth="4"
                     strokeLinecap="round"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.5 }}
                   />
                   {/* Centered Typography */}
                   <text x="50" y="58" textAnchor="middle" fill="#1A1A1A" className="text-2xl font-black font-headline tracking-tighter" style={{ fontSize: '28px' }}>DB</text>
                </svg>
              </div>

              <div className="text-center">
                <h1 className="text-4xl font-black font-headline tracking-tighter text-[#1A1A1A]">
                  DBE OS
                </h1>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <div className="h-1 w-8 bg-primary rounded-full" />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-300">Edition V2</span>
                  <div className="h-1 w-8 bg-red-400 rounded-full" />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* The Quote with Tomato Icon */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-16 flex flex-col items-center gap-6"
        >
           <p className="text-xs font-bold text-stone-400 max-w-xs text-center leading-relaxed italic">
              "Built by the <span className="text-primary">IIMB community</span>, 
              for the <span className="text-red-400">IIMB community</span>."
           </p>
           <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 rounded-full border border-red-100">
              <span className="text-xs">🍅</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-red-500">IIMB Tomato Engine</span>
           </div>
        </motion.div>

        {/* Global Progress Line */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-stone-50 overflow-hidden">
           <motion.div 
             className="h-full bg-primary"
             animate={{ width: phase === 'reveal' ? '100%' : '50%' }}
             transition={{ duration: 5 }}
           />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
