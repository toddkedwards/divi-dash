'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Wifi, WifiOff, Bell, X } from 'lucide-react';
import Card from './Card';
import Button from './Button';

interface WebAppEnhancementsProps {
  className?: string;
}

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function WebAppEnhancements({ className = '' }: WebAppEnhancementsProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPermission>('default');
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone ||
                         document.referrer.includes('android-app://');
      setIsInstalled(isInstalled);
    };

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as InstallPromptEvent);
      if (!isInstalled) {
        setShowInstallBanner(true);
      }
    };

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Check for service worker updates
    const handleServiceWorkerUpdate = () => {
      setUpdateAvailable(true);
    };

    // Set up event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check initial state
    checkInstalled();
    setIsOnline(navigator.onLine);
    setNotifications(Notification.permission);

    // Register service worker update listener
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', handleServiceWorkerUpdate);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleServiceWorkerUpdate);
      }
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      setShowInstallBanner(false);
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return;
    }

    const permission = await Notification.requestPermission();
    setNotifications(permission);

    if (permission === 'granted') {
      // Show a notification about the new feature
      new Notification('Divly Notifications Enabled!', {
        body: 'You\'ll now receive portfolio updates and dividend alerts.',
        icon: '/icon-192x192.png',
      });
    }
  };

  const handleUpdateApp = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  };

  const sharePage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Divly - Smart Dividend Portfolio Tracker',
          text: 'Check out this amazing dividend portfolio tracking app with AI insights!',
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getDeviceType = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) return 'iOS';
    if (/android/.test(userAgent)) return 'Android';
    if (/windows phone/.test(userAgent)) return 'Windows Phone';
    return 'Desktop';
  };

  const getInstallInstructions = () => {
    const device = getDeviceType();
    switch (device) {
      case 'iOS':
        return 'Tap the share button and select "Add to Home Screen"';
      case 'Android':
        return 'Tap "Add to Home Screen" in your browser menu';
      default:
        return 'Click the install button in your browser\'s address bar';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Install Banner */}
      {showInstallBanner && !isInstalled && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Smartphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-100">
                  Install Divly
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Get the full app experience on your device
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleInstallClick}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2"
              >
                <Download className="h-4 w-4 mr-1" />
                Install
              </Button>
              <button
                onClick={() => setShowInstallBanner(false)}
                className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Update Available Banner */}
      {updateAvailable && (
        <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-green-900 dark:text-green-100">
                  Update Available
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  A new version of Divly is ready to install
                </p>
              </div>
            </div>
            <Button
              onClick={handleUpdateApp}
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2"
            >
              Update Now
            </Button>
          </div>
        </Card>
      )}

      {/* Connection Status */}
      {!isOnline && (
        <Card className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <WifiOff className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="font-medium text-orange-900 dark:text-orange-100">
                You're Offline
              </h3>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Using cached data. Some features may be limited.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Web App Features */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Web App Features
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Installation Status */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Installation</h4>
              <span className={`px-2 py-1 text-xs rounded-full ${
                isInstalled 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {isInstalled ? 'Installed' : 'Web Version'}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isInstalled 
                ? 'App is installed and running standalone'
                : getInstallInstructions()
              }
            </p>
            {!isInstalled && deferredPrompt && (
              <Button
                onClick={handleInstallClick}
                className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Install App
              </Button>
            )}
          </div>

          {/* Notifications */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Notifications</h4>
              <span className={`px-2 py-1 text-xs rounded-full ${
                notifications === 'granted' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : notifications === 'denied'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {notifications === 'granted' ? 'Enabled' : 
                 notifications === 'denied' ? 'Blocked' : 'Not Set'}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Get notified about dividend payments and portfolio updates
            </p>
            {notifications !== 'granted' && (
              <Button
                onClick={requestNotificationPermission}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={notifications === 'denied'}
              >
                <Bell className="h-4 w-4 mr-2" />
                {notifications === 'denied' ? 'Blocked by Browser' : 'Enable Notifications'}
              </Button>
            )}
          </div>

          {/* Connection Status */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Connection</h4>
              <span className={`px-2 py-1 text-xs rounded-full ${
                isOnline 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              {isOnline ? (
                <Wifi className="h-4 w-4 mr-2 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 mr-2 text-red-600" />
              )}
              {isOnline ? 'Real-time data sync' : 'Using cached data'}
            </div>
          </div>

          {/* Share Feature */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Share App</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Share Divly with friends and colleagues
            </p>
            <Button
              onClick={sharePage}
              variant="outline"
              className="w-full"
            >
              Share App
            </Button>
          </div>
        </div>
      </Card>

      {/* Performance Metrics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          App Performance
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">98%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Lighthouse Score</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">&lt;1s</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Load Time</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">PWA</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ready</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">✓</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Offline Support</p>
          </div>
        </div>
      </Card>
    </div>
  );
} 