'use client';

import Image from 'next/image';

interface TomatoSplashProps {
  className?: string;
  size?: string;
}

export default function TomatoSplash({ className = '', size = 'w-12 h-12' }: TomatoSplashProps) {
  return (
    <div 
      className={`relative flex items-center justify-center ${size} ${className}`}
    >
      <Image 
        src="/logo.png" 
        alt="DBE OS Logo" 
        width={64} 
        height={64} 
        className="object-contain select-none mix-blend-multiply"
        priority
      />
      <div className="absolute inset-0 bg-red-500/5 blur-xl rounded-full animate-pulse"></div>
    </div>
  );
}
