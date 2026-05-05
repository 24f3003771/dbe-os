'use client';

import Image from 'next/image';

interface TomatoSplashProps {
  className?: string;
  size?: string;
}

export default function TomatoSplash({ className = '', size = 'w-10 h-10' }: TomatoSplashProps) {
  return (
    <div 
      className={`relative flex items-center justify-center ${size} ${className}`}
    >
      <Image 
        src="/logo.png" 
        alt="DBE OS Logo" 
        width={40} 
        height={40} 
        className="object-contain select-none mix-blend-multiply"
        priority
      />
      <div className="absolute inset-0 bg-red-500/5 blur-lg rounded-full animate-pulse"></div>
    </div>
  );
}
