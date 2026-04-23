'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MainLoadingScreen() {
  const [percent, setPercent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState("Initializing Core Modules...");

  useEffect(() => {
    // Show only once per tab session
    const hasBooted = sessionStorage.getItem('dbe_os_booted');
    if (hasBooted && process.env.NODE_ENV === 'production') return;

    setIsVisible(true);
    sessionStorage.setItem('dbe_os_booted', 'true');

    const totalDuration = 4500; 
    const interval = 20;
    const step = 100 / (totalDuration / interval);

    const timer = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsVisible(false), 1000);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    const statusUpdates = [
      { time: 500, text: "Authenticating community node..." },
      { time: 1500, text: "Decrypting academic repository..." },
      { time: 2500, text: "Syncing MatchForge signals..." },
      { time: 3500, text: "Finalizing OS Environment..." },
      { time: 4200, text: "Welcome home." },
    ];

    statusUpdates.forEach((update) => {
      setTimeout(() => setStatus(update.text), update.time);
    });

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key="main-boot-loader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 1.2, ease: [0.65, 0, 0.35, 1] } }}
        className="fixed inset-0 z-[10000] bg-[#020202] flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Subtle Static Background Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #29664c 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Brand Core */}
        <div className="relative w-80 h-80 flex items-center justify-center">
            <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-[0_0_40px_rgba(41,102,76,0.15)]">
                {/* Curved rays matching IIMB logo spirit */}
                {[...Array(14)].map((_, i) => {
                    const angle = (i * (180/13)) - 180;
                    const rad = angle * Math.PI / 180;
                    const x2 = 120 + 90 * Math.cos(rad);
                    const y2 = 120 + 90 * Math.sin(rad);
                    // Control points for the curve
                    const cx = 120 + 40 * Math.cos(rad + 0.2);
                    const cy = 120 + 40 * Math.sin(rad + 0.2);

                    return (
                        <motion.path
                            key={i}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: [0, 0.5, 0.3, 0.7] }}
                            transition={{ duration: 2.5, delay: i * 0.08, ease: "easeInOut" }}
                            d={`M 120 120 Q ${cx} ${cy} ${x2} ${y2}`}
                            stroke="#29664c"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            fill="none"
                        />
                    );
                })}
                
                {/* Central OS Orbitals */}
                <motion.circle 
                  cx="120" cy="120" r="50" 
                  className="fill-[#020202] stroke-[#29664c]/20 stroke-[1px]"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />

                <motion.circle 
                    cx="120" cy="120" r="42" 
                    className="fill-none stroke-white/5 stroke-[1px]"
                    style={{ strokeDasharray: "4 8" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
            </svg>

            {/* Typography */}
            <div className="absolute flex flex-col items-center justify-center pt-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                  className="space-y-0 text-center"
                >
                    <h1 className="text-white text-6xl font-black font-headline tracking-[-0.08em] leading-none mb-1">
                        DBE
                    </h1>
                    <div className="h-[2px] w-full bg-primary/20 rounded-full" />
                    <span className="text-primary text-[10px] font-black uppercase tracking-[0.6em] block mt-2 opacity-60">
                        OPERATING SYSTEM
                    </span>
                </motion.div>
            </div>
        </div>

        {/* Loading Indicator */}
        <div className="mt-24 flex flex-col items-center gap-6 w-80">
            {/* Progress Bar */}
            <div className="w-full h-[1px] bg-white/5 relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_15px_rgba(41,102,76,0.8)]"
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.3 }}
              />
              {/* Glow Tip */}
              <motion.div 
                className="absolute top-[-2px] h-1.5 w-1.5 bg-white rounded-full shadow-[0_0_10px_white]"
                animate={{ left: `${percent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Status Messages */}
            <motion.div 
                key={status}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-1"
            >
                <span className="text-[10px] font-bold text-white/50 lowercase font-mono tracking-widest italic">
                  {status}
                </span>
                <span className="text-[8px] text-white/20 font-mono">
                  {Math.round(percent)}% stability check
                </span>
            </motion.div>
        </div>

        {/* Premium Quote Footer */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 1.5 }}
            className="absolute bottom-16 flex flex-col items-center gap-6"
        >
            <div className="flex items-center gap-3">
              <div className="w-8 h-[1px] bg-white/10" />
              <span className="text-[10px] text-primary/40 font-black uppercase tracking-[0.4em]">Node-2024</span>
              <div className="w-8 h-[1px] bg-white/10" />
            </div>

            <p className="text-[12px] text-white/25 text-center font-medium max-w-sm leading-relaxed tracking-wide italic">
              "Built by the <span className="text-white/60 font-bold">IIMB Community</span>, 
              for the <span className="text-white/60 font-bold">IIMB Community</span>, 
              to the <span className="text-white/60 font-bold">IIMB Community</span>."
            </p>
        </motion.div>

        {/* Ambient Technical Overlays */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.15]">
          <div className="absolute top-10 left-10 text-[8px] font-mono text-white/20">DBE_OS_KRNL_V2.0.4</div>
          <div className="absolute bottom-10 right-10 text-[8px] font-mono text-white/20">MATCHFORGE_LOAD_OK</div>
          <motion.div 
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/2 left-10 w-[1px] h-20 bg-primary/30" 
          />
          <motion.div 
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, delay: 2 }}
            className="absolute top-1/2 right-10 w-[1px] h-20 bg-primary/30" 
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
