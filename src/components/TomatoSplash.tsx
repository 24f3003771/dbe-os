'use client';

import React from 'react';

interface TomatoSplashProps {
  className?: string;
  size?: string;
}

export default function TomatoSplash({ className = '', size = 'w-10 h-10' }: TomatoSplashProps) {
  return (
    <div 
      className={`relative flex items-center justify-center ${size} ${className}`}
    >
      <span className="text-2xl select-none">🍅</span>
      <div className="absolute inset-0 bg-red-500/5 blur-lg rounded-full animate-pulse"></div>
    </div>
  );
}
