'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const dots = [
  { color: '#29664c', x: -45 },
  { color: '#3d8c6b', x: -15 },
  { color: '#52b38a', x: 15 },
  { color: '#29664c', x: 45 },
];

export default function MainLoadingScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [phase, setPhase] = useState('dance'); // dance -> orbit -> collide -> logo

  useEffect(() => {
    // Show only once per session
    const hasBooted = sessionStorage.getItem('dbe_os_booted_v3');
    if (hasBooted && process.env.NODE_ENV === 'production') return;

    setIsVisible(true);
    sessionStorage.setItem('dbe_os_booted_v3', 'true');

    // Progression
    setTimeout(() => setPhase('orbit'), 1800);
    setTimeout(() => setPhase('collide'), 2800);
    setTimeout(() => setPhase('logo'), 3200);
    setTimeout(() => setIsVisible(false), 5000);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        exit={{ opacity: 0, y: -20 }}
        className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center"
      >
        <div className="relative w-full h-40 flex items-center justify-center">
          
          {/* Phase: Dance & Orbit */}
          <AnimatePresence>
            {(phase === 'dance' || phase === 'orbit') && (
              <div className="relative">
                {dots.map((dot, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: dot.x, y: 0 }}
                    animate={phase === 'dance' ? {
                      y: [0, -25, 0],
                    } : {
                      x: [dot.x, 30 * Math.cos(i * Math.PI / 2 + Date.now() / 200)],
                      y: [0, 30 * Math.sin(i * Math.PI / 2 + Date.now() / 200)],
                    }}
                    transition={phase === 'dance' ? {
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    } : {
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute w-5 h-5 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-sm"
                    style={{ backgroundColor: dot.color }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Phase: Collide (The "Pop") */}
          {phase === 'collide' && (
            <motion.div 
              initial={{ scale: 1.5 }}
              animate={{ scale: 0 }}
              transition={{ duration: 0.4, ease: "backIn" }}
              className="w-10 h-10 bg-primary rounded-full"
            />
          )}

          {/* Phase: Logo Reveal */}
          {phase === 'logo' && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-4">
                <motion.div 
                   animate={{ rotate: [0, -10, 10, 0] }}
                   transition={{ delay: 0.5, duration: 0.5 }}
                   className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center font-black text-white text-xl shadow-2xl shadow-primary/30"
                >
                  DB
                </motion.div>
                <div className="flex flex-col">
                  <h1 className="text-4xl font-black font-headline tracking-tighter text-[#1A1A1A]">
                    DBE OS
                  </h1>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">IIM Bangalore</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Friendly Quote */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-16 text-center px-10"
        >
           <p className="text-sm font-medium text-stone-400 max-w-xs leading-relaxed italic">
              "Built by the <span className="text-[#1A1A1A] font-bold">IIMB Community</span>, 
              for the <span className="text-[#1A1A1A] font-bold">IIMB Community</span>."
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
                <div className="h-0.5 w-8 bg-stone-100" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <div className="h-0.5 w-8 bg-stone-100" />
            </div>
        </motion.div>

        {/* Top Status Bar Decoration */}
        <div className="absolute top-0 inset-x-0 h-1 flex">
           <div className="flex-1 bg-[#29664c]" />
           <div className="flex-1 bg-[#3d8c6b]" />
           <div className="flex-1 bg-[#52b38a]" />
           <div className="flex-1 bg-[#29664c]" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
