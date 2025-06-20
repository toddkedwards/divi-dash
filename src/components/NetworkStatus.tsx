import React, { useEffect, useState } from 'react';
import { useToast } from './ToastProvider';

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: 'Back Online',
        description: 'Your connection has been restored.',
        variant: 'success'
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: 'You\'re Offline',
        description: 'Changes will sync when you\'re back online.',
        variant: 'destructive'
      });
    };

    // Set initial state
    setIsOnline(navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  return (
    <div 
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
        isOnline 
          ? 'bg-green-100/10 text-green-500 dark:bg-green-900/20 dark:text-green-400' 
          : 'bg-red-100/10 text-red-500 dark:bg-red-900/20 dark:text-red-400'
      }`}
    >
      <div className="relative flex items-center group">
        <div 
          className={`w-2 h-2 rounded-full mr-2 transition-colors duration-300 ${
            isOnline ? 'bg-green-500 dark:bg-green-400' : 'bg-red-500 dark:bg-red-400'
          }`} 
        />
        <span>{isOnline ? 'Online' : 'Offline'}</span>
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
          {isOnline ? 'Connected to the internet' : 'No internet connection'}
        </div>
      </div>
    </div>
  );
} 