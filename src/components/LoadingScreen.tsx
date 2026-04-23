'use client';

import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import sandyAnimation from '../../public/sandy_brand.json';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingScreen({ 
  message = "Loading DBE OS...", 
  fullScreen = true 
}: LoadingScreenProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`flex flex-col items-center justify-center bg-surface/80 backdrop-blur-md z-[9999] transition-all duration-500 animate-in fade-in ${
      fullScreen ? 'fixed inset-0 w-screen h-screen' : 'w-full h-full min-h-[400px]'
    }`}>
      <div className="w-64 h-64 relative">
        <Lottie 
          animationData={sandyAnimation} 
          loop={true} 
          className="w-full h-full"
        />
        {/* Subtle shadow glow */}
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
      </div>
      
      {message && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-primary font-headline font-bold text-lg tracking-tight animate-pulse text-center">
            {message}
          </p>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/20 animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"></span>
          </div>
        </div>
      )}
    </div>
  );
}
