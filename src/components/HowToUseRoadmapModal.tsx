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
        <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden pointer-events-auto animate-in zoom-in-95 duration-200 flex flex-col" style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)' }}>
          <div className="pt-8 pb-4 px-6 text-center shrink-0">
            <h2 className="text-[20px] leading-tight font-bold text-slate-900 mb-1">How to Use This Roadmap</h2>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">Follow the path from top to bottom. Click on any topic to view resources and mark your progress.</p>
          </div>
          <div className="px-6 pb-6 flex flex-col gap-4 overflow-y-auto">
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
              <div className="mt-2 pt-4 border-t border-slate-100 flex items-center justify-center gap-2">
                <input 
                  type="checkbox" 
                  id="dontShowAgain" 
                  checked={dontShow}
                  onChange={(e) => setDontShow(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 border-slate-300"
                />
                <label htmlFor="dontShowAgain" className="text-sm font-semibold text-slate-500 cursor-pointer select-none">
                  Don't show this again
                </label>
              </div>
            )}
          </div>
          
          <div className="p-4 flex flex-col gap-2 shrink-0 bg-white/50 border-t border-slate-100">
            <button 
              onClick={handleClose} 
              className="w-full py-3.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-[15px] transition-colors shadow-sm"
            >
              Start Journey
            </button>
            <button 
              onClick={handleClose} 
              className="w-full py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[15px] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
