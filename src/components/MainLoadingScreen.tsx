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
    const hasBooted = sessionStorage.getItem('dbe_os_booted_v4');
    if (hasBooted && process.env.NODE_ENV === 'production') return;

    setIsVisible(true);
    sessionStorage.setItem('dbe_os_booted_v4', 'true');

    // Smooth Sequential Progression
    const timer1 = setTimeout(() => setPhase('orbit'), 2000);
    const timer2 = setTimeout(() => setPhase('collide'), 3600);
    const timer3 = setTimeout(() => setPhase('logo'), 4100);
    const timer4 = setTimeout(() => setIsVisible(false), 6500);

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
        exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center"
      >
        <div className="relative w-full h-64 flex items-center justify-center">
          
          {/* Phase: Dance & Orbit */}
          <AnimatePresence>
            {(phase === 'dance' || phase === 'orbit') && (
              <div className="relative">
                {dots.map((dot, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: dot.x, y: 0, scale: 0 }}
                    animate={phase === 'dance' ? {
                      x: dot.x,
                      y: [0, -35, 0],
                      scale: 1,
                    } : {
                      x: [dot.x, 40 * Math.cos(i * Math.PI / 2 + Date.now() / 250)],
                      y: [0, 40 * Math.sin(i * Math.PI / 2 + Date.now() / 250)],
                      scale: 1.2,
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={phase === 'dance' ? {
                      duration: 0.7,
                      repeat: Infinity,
                      delay: i * 0.12,
                      ease: [0.45, 0, 0.55, 1]
                    } : {
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute w-6 h-6 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_8px_20px_rgba(41,102,76,0.2)]"
                    style={{ backgroundColor: dot.color }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Phase: Collide (Liquid Merge) */}
          {phase === 'collide' && (
            <motion.div 
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ 
                scale: [1, 2.5, 0],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: 0.6, ease: "circIn" }}
              className="w-12 h-12 bg-primary rounded-full blur-sm"
            />
          )}

          {/* Phase: Proper Logo Reveal */}
          {phase === 'logo' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ type: "spring", damping: 15, stiffness: 100 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Custom Stylized "DB" Logo */}
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_20px_40px_rgba(41,102,76,0.15)]">
                    <defs>
                        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#29664c" />
                            <stop offset="100%" stopColor="#4ade80" />
                        </linearGradient>
                    </defs>
                    {/* The "D" and "B" connection */}
                    <motion.path 
                        d="M 30 20 L 30 80 M 30 20 C 60 20 60 50 30 50 C 60 50 60 80 30 80"
                        fill="none"
                        stroke="url(#logoGrad)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                    {/* Abstract Circle Enclosure */}
                    <motion.circle 
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke="#29664c"
                        strokeWidth="1"
                        strokeDasharray="10 5"
                        opacity="0.2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                </svg>
              </div>

              <div className="text-center space-y-1">
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-5xl font-black font-headline tracking-[-0.05em] text-[#1A1A1A]"
                >
                  DBE OS
                </motion.h1>
                <motion.div 
                   initial={{ scaleX: 0 }}
                   animate={{ scaleX: 1 }}
                   transition={{ delay: 0.8, duration: 1 }}
                   className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
                />
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-[10px] font-black uppercase tracking-[0.5em] text-primary pt-2"
                >
                  IIM Bangalore Community
                </motion.p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Global Footer Quote */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-16 text-center px-10"
        >
           <p className="text-sm font-medium text-stone-400 max-w-sm leading-relaxed italic">
              "Built by the <span className="text-[#1A1A1A] font-extrabold px-1">IIMB community</span>,<br/> 
              for the <span className="text-[#1A1A1A] font-extrabold px-1">IIMB community</span>."
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
                <div className="h-[1px] w-12 bg-stone-100" />
                <div className="w-2 h-2 rounded-full border-2 border-primary" />
                <div className="h-[1px] w-12 bg-stone-100" />
            </div>
        </motion.div>

        {/* Technical Side-Markers */}
        <div className="absolute inset-y-0 left-8 flex flex-col justify-center gap-32 opacity-20 pointer-events-none">
            <div className="w-[1px] h-20 bg-primary" />
            <div className="w-[1px] h-20 bg-primary" />
        </div>
        <div className="absolute inset-y-0 right-8 flex flex-col justify-center gap-32 opacity-20 pointer-events-none">
            <div className="w-[1px] h-20 bg-primary" />
            <div className="w-[1px] h-20 bg-primary" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
