import React from 'react';
import ErrorState from '@/components/ErrorState';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background-app">
      <ErrorState 
        title="404 - Page Not Found"
        message="Oops! It seems this page has wandered off into the digital void. Our bot is looking for it, but for now, let's head back."
      />
    </div>
  );
}
