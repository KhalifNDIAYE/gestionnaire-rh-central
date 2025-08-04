import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface LiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  className?: string;
}

export const LiveRegion = ({ 
  message, 
  politeness = 'polite', 
  atomic = true,
  className 
}: LiveRegionProps) => {
  const [displayMessage, setDisplayMessage] = useState('');

  useEffect(() => {
    if (message) {
      // Clear first to ensure screen readers pick up the change
      setDisplayMessage('');
      // Use timeout to ensure the clear happens before the new message
      const timeout = setTimeout(() => {
        setDisplayMessage(message);
      }, 10);
      
      return () => clearTimeout(timeout);
    }
  }, [message]);

  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      className={cn("sr-only", className)}
      role={politeness === 'assertive' ? 'alert' : 'status'}
    >
      {displayMessage}
    </div>
  );
};

// Hook for managing live region announcements
export const useLiveRegion = () => {
  const [message, setMessage] = useState('');

  const announce = (newMessage: string) => {
    setMessage(newMessage);
    // Clear after announcement to prepare for next one
    setTimeout(() => setMessage(''), 1000);
  };

  return { message, announce };
};