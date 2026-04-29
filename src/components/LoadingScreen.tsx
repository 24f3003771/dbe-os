'use client';

import React, { useEffect, useState } from 'react';
import Skeleton, { CardSkeleton, ListSkeleton } from './Skeleton';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  type?: 'default' | 'card' | 'list' | 'grid';
}

export default function LoadingScreen({ 
  message = "Loading...", 
  fullScreen = true,
  type = 'default'
}: LoadingScreenProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-[9999] transition-all duration-500 ${
      fullScreen ? 'fixed inset-0 w-screen h-screen px-6' : 'w-full h-full min-h-[400px] p-6'
    }`}>
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {type === 'default' && (
          <div className="flex flex-col items-center gap-6">
            <Skeleton variant="circular" className="w-24 h-24" />
            <div className="space-y-3 w-full max-w-xs flex flex-col items-center">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            {message && (
              <p className="text-primary/60 font-medium text-sm tracking-widest uppercase animate-pulse">
                {message}
              </p>
            )}
          </div>
        )}

        {type === 'card' && <CardSkeleton />}
        
        {type === 'list' && <ListSkeleton items={5} />}

        {type === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        )}
      </div>
    </div>
  );
}
