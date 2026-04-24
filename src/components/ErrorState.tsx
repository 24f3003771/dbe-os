'use client';

import React from 'react';
import Link from 'next/link';

interface ErrorStateProps {
  title?: string;
  message?: string;
  showHome?: boolean;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Oops! Something went wrong",
  message = "It looks like our bot took a little spill. Don't worry, we're helping it back up!",
  showHome = true,
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-in fade-in duration-700">
      <div className="relative w-64 h-64 mb-8">
        {/* Animated SVG Bot */}
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl overflow-visible">
          <defs>
            <linearGradient id="botGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-secondary)" />
              <stop offset="100%" stopColor="var(--color-secondary-dim)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background decorative circles */}
          <circle cx="100" cy="100" r="80" fill="var(--color-surface-container-highest)" opacity="0.4" />
          
          {/* Bot Body */}
          <g className="animate-bounce-subtle">
            {/* Legs (Broken/Sitting) */}
            <rect x="70" y="150" width="15" height="12" rx="4" fill="var(--color-secondary-dim)" transform="rotate(25 70 150)" />
            <rect x="115" y="150" width="15" height="12" rx="4" fill="var(--color-secondary-dim)" transform="rotate(-25 115 150)" />
            
            {/* Main Body */}
            <rect x="60" y="80" width="80" height="75" rx="15" fill="url(#botGradient)" />
            
            {/* Screen Area */}
            <rect x="68" y="88" width="64" height="45" rx="8" fill="#1e1e1e" />
            
            {/* Eyes (Broken / X) */}
            <g className="stroke-primary-fixed stroke-[4]" strokeLinecap="round" filter="url(#glow)">
              {/* Left X eye */}
              <line x1="82" y1="102" x2="94" y2="114" />
              <line x1="94" y1="102" x2="82" y2="114" />
              
              {/* Right X eye */}
              <line x1="106" y1="102" x2="118" y2="114" />
              <line x1="118" y1="102" x2="106" y2="114" />
            </g>
            
            {/* Antennas */}
            <path d="M90,80 L80,55" stroke="var(--color-secondary)" strokeWidth="5" strokeLinecap="round" />
            <circle cx="80" cy="55" r="6" fill="var(--color-primary)" className="animate-pulse" filter="url(#glow)" />
            
            <path d="M110,80 L125,60" stroke="var(--color-secondary)" strokeWidth="5" strokeLinecap="round" />
            <circle cx="125" cy="60" r="6" fill="var(--color-primary-dim)" />
            
            {/* Arms */}
            <g transform="translate(50, 110) rotate(-45)">
               <rect width="18" height="12" rx="5" fill="var(--color-secondary)" />
            </g>
            <g transform="translate(132, 115) rotate(50)">
               <rect width="18" height="12" rx="5" fill="var(--color-secondary-dim)" />
            </g>
          </g>
          
          {/* Scattered Gears/Debris */}
          <circle cx="45" cy="170" r="8" fill="var(--color-primary)" opacity="0.7" className="animate-spin-slow origin-[45px_170px]" />
          <path d="M155,165 L165,175 M165,165 L155,175" stroke="var(--color-outline)" strokeWidth="3" opacity="0.5" />
        </svg>

        {/* Floating Sparks/Dots */}
        <div className="absolute top-0 right-0 w-4 h-4 bg-primary rounded-full blur-sm animate-ping opacity-50" />
        <div className="absolute bottom-10 left-0 w-3 h-3 bg-secondary rounded-full blur-sm animate-pulse opacity-50" />
      </div>

      <h1 className="text-4xl font-headline font-bold mb-4 text-secondary">
        {title}
      </h1>
      <p className="max-w-md mx-auto text-lg text-on-surface-variant mb-8 leading-relaxed">
        {message}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-8 py-3 bg-primary text-on-primary rounded-2xl font-semibold hover-lift shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            Try Again
          </button>
        )}
        {showHome && (
          <Link
            href="/"
            className="px-8 py-3 bg-surface-container-high text-on-surface rounded-2xl font-semibold border border-outline/10 hover-lift shadow-sm transition-all active:scale-95"
          >
            Go to Dashboard
          </Link>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ErrorState;
