"use client";
import React, { useState, useEffect } from 'react';
import { Smartphone, Wifi, WifiOff, Activity, Shield, Check, AlertTriangle, Download } from 'lucide-react';
import { usePerformanceMonitor } from '../lib/performanceMonitor';

interface PWAInstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAStatusProps {
  className?: string;
  showDetailed?: boolean;
}

export default function PWAStatus({ className = '', showDetailed = false }: PWAStatusProps) {
  const [mounted, setMounted] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [performanceScore, setPerformanceScore] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const { getPerformanceSummary } = usePerformanceMonitor();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check if app is installed
    const checkInstallation = () => {
      // Check if running in standalone mode (installed PWA)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone);
    };

    // Check online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Check notification permission
    const checkNotificationPermission = () => {
      if ('Notification' in window) {
        setNotificationPermission(Notification.permission);
      }
    };

    // Update performance metrics
    const updatePerformanceMetrics = () => {
      const summary = getPerformanceSummary();
      setPerformanceScore(summary.performanceScore);
    };

    // Initial checks
    checkInstallation();
    updateOnlineStatus();
    checkNotificationPermission();
    updatePerformanceMetrics();

    // Event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // PWA install prompt listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as PWAInstallPrompt);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // App installed listener
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };
    
    window.addEventListener('appinstalled', handleAppInstalled);

    // Performance metrics update interval
    const metricsInterval = setInterval(updatePerformanceMetrics, 10000);

    // Service worker update detection
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setLastUpdate(new Date());
      });
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearInterval(metricsInterval);
    };
  }, [mounted, getPerformanceSummary]);

  // Don't render anything until mounted on client side
  if (!mounted) {
    return null;
  }

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const result = await installPrompt.userChoice;
      
      if (result.outcome === 'accepted') {
        setInstallPrompt(null);
      }
    } catch (error) {
      console.error('Install prompt failed:', error);
    }
  };

  const handleNotificationRequest = async () => {
    if (!('Notification' in window)) return;

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    } catch (error) {
      console.error('Notification permission request failed:', error);
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getConnectionQuality = () => {
    if (!isOnline) return { text: 'Offline', color: 'text-red-500', icon: WifiOff };
    
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const effectiveType = connection.effectiveType;
      
      switch (effectiveType) {
        case '4g':
          return { text: 'Excellent', color: 'text-green-500', icon: Wifi };
        case '3g':
          return { text: 'Good', color: 'text-yellow-500', icon: Wifi };
        case '2g':
          return { text: 'Poor', color: 'text-red-500', icon: Wifi };
        default:
          return { text: 'Unknown', color: 'text-gray-500', icon: Wifi };
      }
    }
    
    return { text: 'Online', color: 'text-green-500', icon: Wifi };
  };

  const connection = getConnectionQuality();

  if (!showDetailed) {
    // Compact view
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className={`flex items-center space-x-1 ${connection.color}`}>
          <connection.icon className="w-4 h-4" />
          <span className="text-xs">{connection.text}</span>
        </div>
        
        {performanceScore > 0 && (
          <div className={`flex items-center space-x-1 ${getPerformanceColor(performanceScore)}`}>
            <Activity className="w-4 h-4" />
            <span className="text-xs">{performanceScore}/100</span>
          </div>
        )}
        
        {isInstalled && (
          <div className="flex items-center space-x-1 text-green-500">
            <Smartphone className="w-4 h-4" />
            <span className="text-xs">Installed</span>
          </div>
        )}
        
        {installPrompt && (
          <button
            onClick={handleInstallClick}
            className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-xs">Install</span>
          </button>
        )}
      </div>
    );
  }

  // Detailed view
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Shield className="w-5 h-5 mr-2" />
        PWA Status
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Installation Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5" />
            <span className="font-medium">Installation</span>
          </div>
          <div className="flex items-center space-x-2">
            {isInstalled ? (
              <span className="flex items-center space-x-1 text-green-500">
                <Check className="w-4 h-4" />
                <span className="text-sm">Installed</span>
              </span>
            ) : installPrompt ? (
              <button
                onClick={handleInstallClick}
                className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Install</span>
              </button>
            ) : (
              <span className="text-gray-500 text-sm">Web App</span>
            )}
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center space-x-2">
            <connection.icon className="w-5 h-5" />
            <span className="font-medium">Connection</span>
          </div>
          <span className={`text-sm ${connection.color}`}>
            {connection.text}
          </span>
        </div>

        {/* Performance Score */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span className="font-medium">Performance</span>
          </div>
          <span className={`text-sm font-semibold ${getPerformanceColor(performanceScore)}`}>
            {performanceScore}/100
          </span>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Notifications</span>
          </div>
          <div className="flex items-center space-x-2">
            {notificationPermission === 'granted' ? (
              <span className="flex items-center space-x-1 text-green-500">
                <Check className="w-4 h-4" />
                <span className="text-sm">Enabled</span>
              </span>
            ) : notificationPermission === 'denied' ? (
              <span className="text-red-500 text-sm">Denied</span>
            ) : (
              <button
                onClick={handleNotificationRequest}
                className="text-blue-500 hover:text-blue-600 transition-colors text-sm"
              >
                Enable
              </button>
            )}
          </div>
        </div>

        {/* Last Update */}
        {lastUpdate && (
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span className="font-medium">Last Update</span>
            </div>
            <span className="text-sm text-gray-500">
              {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        )}

        {/* Service Worker Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Service Worker</span>
          </div>
          <span className={`text-sm ${
            'serviceWorker' in navigator ? 'text-green-500' : 'text-red-500'
          }`}>
            {'serviceWorker' in navigator ? 'Active' : 'Unavailable'}
          </span>
        </div>
      </div>

      {/* Performance Details */}
      {performanceScore > 0 && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h4 className="font-medium mb-2">Performance Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Overall Score:</span>
              <span className={getPerformanceColor(performanceScore)}>
                {performanceScore}/100
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Metrics updated every 10 seconds based on Core Web Vitals
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 