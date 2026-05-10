'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/lib/firebase/error-emitter';

// This is a client component that will listen for the permission error events
// and throw an uncaught exception, which Next.js will display in its
// development error overlay. This is for development-time debugging only.

export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: Error) => {
      // Throwing the error here will cause it to be caught by Next.js's
      // development error overlay, showing the rich, contextual error.
      // This is intentional for a better debugging experience.
      throw error;
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  return null; // This component does not render anything.
}
