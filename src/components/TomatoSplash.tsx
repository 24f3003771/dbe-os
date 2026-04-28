'use client';

import React, { useRef } from 'react';
import Lottie from 'lottie-react';
import tomatoAnimation from '@/data/tomato.json';

interface TomatoSplashProps {
  className?: string;
  size?: string;
}

export default function TomatoSplash({ className = '', size = 'w-10 h-10' }: TomatoSplashProps) {
  const lottieRef = useRef<any>(null);

  const handleMouseEnter = () => {
    if (lottieRef.current) {
      lottieRef.current.goToAndPlay(0);
    }
  };

  return (
    <div 
      className={`relative flex items-center justify-center cursor-pointer ${size} ${className}`}
      onMouseEnter={handleMouseEnter}
    >
      <Lottie 
        lottieRef={lottieRef} 
        animationData={tomatoAnimation} 
        loop={false} 
        autoplay={false} 
      />
    </div>
  );
}
