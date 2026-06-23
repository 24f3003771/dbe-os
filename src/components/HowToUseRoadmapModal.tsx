"use client";

import React, { useState, useEffect } from 'react';

export default function HowToUseRoadmapModal({ 
  isOpen, 
  onClose,
  showDontShowAgain = false
}: { 
  isOpen: boolean;
  onClose: () => void;
  showDontShowAgain?: boolean;
}) {
  const [dontShow, setDontShow] = useState(false);

  // Load initial preference
  useEffect(() => {
    if (showDontShowAgain) {
      const pref = localStorage.getItem('hideRoadmapHowTo');
      if (pref === 'true') {
        setDontShow(true);
      }
    }
  }, [showDontShowAgain]);

  const handleClose = () => {
    if (showDontShowAgain && dontShow) {
      localStorage.setItem('hideRoadmapHowTo', 'true');
    }
    onClose();
  };

  if (!isOpen) return null;

  const steps = [
    { icon: '🛣️', title: 'Follow the Path', desc: 'The roadmap flows top → bottom. Each stop on the left timeline is a major skill area.' },
    { icon: '🧭', title: 'Jump via Sidebar', desc: 'Click any section in the sidebar to jump directly to it.' },
    { icon: '📝', title: 'Click Topics for Notes', desc: 'Every topic chip is clickable and pops up a quick study guide.' },
    { icon: '📚', title: 'Go Deep, Not Wide', desc: 'One well-learned section beats five half-understood ones.' },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 animate-in fade-in duration-200" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-xl border border-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden pointer-events-auto animate-in zoom-in-95 duration-200" style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.5) inset' }}>
          <div className="px-6 py-5 border-b border-slate-200/50 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Career Guides</p>
              <h2 className="text-lg font-black text-slate-800">How to Use This Roadmap</h2>
            </div>
            <button onClick={handleClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors flex-shrink-0" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
          <div className="p-6 flex flex-col gap-4">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{step.icon}</span>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{step.title}</h3>
                  <p className="text-slate-500 text-xs mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}

            {showDontShowAgain && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="dontShowAgain" 
                  checked={dontShow}
                  onChange={(e) => setDontShow(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <label htmlFor="dontShowAgain" className="text-sm text-slate-600 cursor-pointer">
                  Don't show this again
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
