'use client';

import React, { useEffect } from 'react';
import ErrorState from '@/components/ErrorState';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background-app">
      <ErrorState 
        title="Application Error"
        message="Wait! Something's not quite right. Our systems are feeling a bit dizzy. Let's try refreshing the page."
        onRetry={() => reset()}
      />
    </div>
  );
}
