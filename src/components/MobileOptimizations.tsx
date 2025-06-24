"use client";
import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface MobileOptimizationsProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void>;
  refreshThreshold?: number;
}

export default function MobileOptimizations({ 
  children, 
  onRefresh,
  refreshThreshold = 80
}: MobileOptimizationsProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, refreshThreshold], [0, 1]);
  const rotate = useTransform(y, [0, refreshThreshold], [0, 180]);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Handle pull-to-refresh
  const handlePanEnd = async (event: any, info: PanInfo) => {
    if (info.offset.y > refreshThreshold && onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        y.set(0);
      }
    } else {
      y.set(0);
    }
  };

  // Handle PWA installation
  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallBanner(false);
      }
      setInstallPrompt(null);
    }
  };

  // Haptic feedback for touch interactions
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[type]);
    }
  };

  // Add viewport height CSS variable for mobile browsers
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  return (
    <div className="relative h-full overflow-hidden">
      {/* Offline Banner */}
      {!isOnline && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 bg-red-500 text-white px-4 py-2 z-50 flex items-center justify-center gap-2"
        >
          <WifiOff size={16} />
          <span className="text-sm font-medium">You're offline</span>
        </motion.div>
      )}

      {/* Install App Banner */}
      {showInstallBanner && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 bg-green-600 text-white px-4 py-3 z-50 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold text-sm">D</span>
            </div>
            <div>
              <p className="text-sm font-medium">Install Divi Dash</p>
              <p className="text-xs opacity-90">Add to home screen for quick access</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstall}
              className="bg-white text-green-600 px-3 py-1 rounded-md text-sm font-medium"
            >
              Install
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}

      {/* Pull-to-refresh indicator */}
      {onRefresh && (
        <motion.div
          style={{ opacity }}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg border"
        >
          <motion.div style={{ rotate }}>
            <RefreshCw 
              size={20} 
              className={`text-green-600 ${isRefreshing ? 'animate-spin' : ''}`} 
            />
          </motion.div>
        </motion.div>
      )}

      {/* Main content with pull-to-refresh */}
      <motion.div
        ref={containerRef}
        style={{ y }}
        drag="y"
        dragDirectionLock
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.2, bottom: 0 }}
        onPanEnd={handlePanEnd}
        onDragStart={() => triggerHaptic('light')}
        className="h-full"
      >
        {children}
      </motion.div>

      {/* Touch feedback styles */}
      <style jsx global>{`
        .touch-feedback:active {
          transform: scale(0.98);
          transition: transform 0.1s ease-in-out;
        }
        
        .touch-haptic {
          user-select: none;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
        }
        
        /* iOS specific optimizations */
        @supports (-webkit-touch-callout: none) {
          .ios-safe-area {
            padding-bottom: env(safe-area-inset-bottom);
          }
        }
        
        /* Mobile viewport height fix */
        .mobile-vh {
          height: calc(var(--vh, 1vh) * 100);
        }
        
        /* Smooth scrolling for mobile */
        .mobile-scroll {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
        
        /* Prevent zoom on input focus (iOS) */
        input[type="text"],
        input[type="email"],
        input[type="number"],
        input[type="password"],
        textarea,
        select {
          font-size: 16px !important;
        }
        
        /* Custom scrollbar for mobile */
        .mobile-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .mobile-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .mobile-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
} 