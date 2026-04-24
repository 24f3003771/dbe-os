'use client';

import React from 'react';
import ErrorState from './ErrorState';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';

const OfflineOverlay: React.FC = () => {
  const isOffline = useOfflineStatus();

  if (!isOffline) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-surface/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-surface-container border border-outline/10 p-4 rounded-[2.5rem] max-w-2xl w-full shadow-2xl relative overflow-hidden">
        {/* Themed decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-primary to-secondary opacity-50" />
        
        <ErrorState 
          title="Internet Connection Lost"
          message="Oops! It looks like your internet connection went on a break. Our bot is standing by to reconnect as soon as you're back online."
          showHome={false}
        />
        
        <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-on-surface-variant animate-pulse">
           <div className="w-2 h-2 rounded-full bg-secondary" />
           Waiting for connection...
        </div>
      </div>
    </div>
  );
};

export default OfflineOverlay;
