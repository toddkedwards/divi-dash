"use client";

import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, Wifi, WifiOff, Eye, EyeOff, Share2, Download } from 'lucide-react';

interface WebAPIStatus {
  wakeLock: boolean;
  screenShare: boolean;
  payments: boolean;
  bluetooth: boolean;
  fileSystem: boolean;
}

export default function AdvancedWebAPIs() {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [apiSupport, setApiSupport] = useState<WebAPIStatus>({
    wakeLock: false,
    screenShare: false,
    payments: false,
    bluetooth: false,
    fileSystem: false
  });

  // Check API support on mount
  useEffect(() => {
    setApiSupport({
      wakeLock: 'wakeLock' in navigator,
      screenShare: 'share' in navigator,
      payments: 'PaymentRequest' in window,
      bluetooth: 'bluetooth' in navigator,
      fileSystem: typeof (window as any).showSaveFilePicker === 'function'
    });

    // Online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    // Page visibility detection
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Screen Wake Lock API
  const toggleWakeLock = async () => {
    if (!apiSupport.wakeLock) {
      alert('Wake Lock API is not supported in this browser');
      return;
    }

    try {
      if (wakeLock) {
        await wakeLock.release();
        setWakeLock(null);
      } else {
        const lock = await navigator.wakeLock.request('screen');
        setWakeLock(lock);
        
        lock.addEventListener('release', () => {
          setWakeLock(null);
        });
      }
    } catch (error) {
      console.error('Failed to toggle wake lock:', error);
    }
  };

  // Web Share API
  const sharePortfolio = async () => {
    if (!apiSupport.screenShare) {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Portfolio link copied to clipboard!');
      } catch (error) {
        alert('Sharing not supported in this browser');
      }
      return;
    }

    try {
      await navigator.share({
        title: 'My Divly Portfolio',
        text: 'Check out my dividend portfolio performance on Divly!',
        url: window.location.href
      });
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  // File System Access API for data export
  const exportPortfolioData = async () => {
    if (!apiSupport.fileSystem) {
      // Fallback to download
      const data = {
        portfolio: 'Sample portfolio data',
        exportDate: new Date().toISOString(),
        holdings: [
          { symbol: 'AAPL', shares: 100, avgPrice: 150 },
          { symbol: 'MSFT', shares: 50, avgPrice: 280 }
        ]
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'divly-portfolio-export.json';
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    try {
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: 'divly-portfolio-export.json',
        types: [{
          description: 'JSON files',
          accept: { 'application/json': ['.json'] }
        }]
      });

      const writable = await fileHandle.createWritable();
      const data = {
        portfolio: 'Portfolio data',
        exportDate: new Date().toISOString(),
        // Add actual portfolio data here
      };
      
      await writable.write(JSON.stringify(data, null, 2));
      await writable.close();
    } catch (error) {
      console.error('Failed to save file:', error);
    }
  };

  // Payment Request API (placeholder for subscription management)
  const handleSubscription = async () => {
    if (!apiSupport.payments) {
      // Redirect to Stripe Checkout as fallback
      window.location.href = '/upgrade';
      return;
    }

    try {
      const request = new PaymentRequest(
        [{
          supportedMethods: 'basic-card',
          data: {
            supportedNetworks: ['visa', 'mastercard']
          }
        }],
        {
          total: {
            label: 'Divly Pro Subscription',
            amount: { currency: 'USD', value: '4.99' }
          }
        }
      );

      const canMakePayment = await request.canMakePayment();
      if (canMakePayment) {
        const response = await request.show();
        // Process payment response
        console.log('Payment response:', response);
        await response.complete('success');
      }
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-5 w-5 text-green-600" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-600" />
          )}
          <span className="text-sm font-medium">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isVisible ? (
            <Eye className="h-5 w-5 text-blue-600" />
          ) : (
            <EyeOff className="h-5 w-5 text-gray-400" />
          )}
          <span className="text-sm font-medium">
            {isVisible ? 'Visible' : 'Hidden'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Monitor className="h-5 w-5 text-purple-600" />
          <span className="text-sm font-medium">
            {wakeLock ? 'Screen Locked' : 'Screen Unlocked'}
          </span>
        </div>
      </div>

      {/* Web API Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Wake Lock Control */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Screen Wake Lock
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Prevent screen from sleeping during analysis
          </p>
          <button
            onClick={toggleWakeLock}
            disabled={!apiSupport.wakeLock}
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              wakeLock
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            } disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            {wakeLock ? 'Release Wake Lock' : 'Acquire Wake Lock'}
          </button>
          {!apiSupport.wakeLock && (
            <p className="text-xs text-gray-500 mt-2">Not supported in this browser</p>
          )}
        </div>

        {/* Share Portfolio */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share Portfolio
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Share your portfolio performance
          </p>
          <button
            onClick={sharePortfolio}
            className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Share Now
          </button>
        </div>

        {/* Export Data */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Export portfolio data to file
          </p>
          <button
            onClick={exportPortfolioData}
            className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Export JSON
          </button>
        </div>

        {/* Subscription Management */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Quick Subscribe
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Upgrade using Web Payments API
          </p>
          <button
            onClick={handleSubscription}
            className="w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Upgrade to Pro
          </button>
          {!apiSupport.payments && (
            <p className="text-xs text-gray-500 mt-2">Will redirect to Stripe</p>
          )}
        </div>
      </div>

      {/* API Support Status */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-3">Web API Support</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          <div className={`flex items-center gap-2 ${apiSupport.wakeLock ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-2 h-2 rounded-full ${apiSupport.wakeLock ? 'bg-green-600' : 'bg-red-600'}`} />
            Wake Lock
          </div>
          <div className={`flex items-center gap-2 ${apiSupport.screenShare ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-2 h-2 rounded-full ${apiSupport.screenShare ? 'bg-green-600' : 'bg-red-600'}`} />
            Web Share
          </div>
          <div className={`flex items-center gap-2 ${apiSupport.payments ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-2 h-2 rounded-full ${apiSupport.payments ? 'bg-green-600' : 'bg-red-600'}`} />
            Payments
          </div>
          <div className={`flex items-center gap-2 ${apiSupport.bluetooth ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-2 h-2 rounded-full ${apiSupport.bluetooth ? 'bg-green-600' : 'bg-red-600'}`} />
            Bluetooth
          </div>
          <div className={`flex items-center gap-2 ${apiSupport.fileSystem ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-2 h-2 rounded-full ${apiSupport.fileSystem ? 'bg-green-600' : 'bg-red-600'}`} />
            File System
          </div>
        </div>
      </div>
    </div>
  );
} 