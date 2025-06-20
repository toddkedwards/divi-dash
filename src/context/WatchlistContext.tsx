import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { loadWatchlist, saveWatchlist } from '@/lib/firestore';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/components/ToastProvider';

interface WatchlistContextType {
  watchlist: string[];
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  syncing: boolean;
  syncError: string | null;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const { toast } = useToast();
  const [wasSyncing, setWasSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSync, setPendingSync] = useState(false);
  const isProUser = true;

  // Track online/offline status
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      if (pendingSync) {
        syncToCloud();
      }
    };
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingSync]);

  // Sync to cloud when online
  const syncToCloud = async () => {
    if (!isOnline || !user || !isProUser) return;
    
    try {
      setSyncing(true);
      setSyncError(null);
      await saveWatchlist(watchlist);
      setPendingSync(false);
    } catch (e: any) {
      setSyncError('Failed to sync to cloud');
      setPendingSync(true);
    } finally {
      setSyncing(false);
    }
  };

  // Save to localStorage and Firestore
  useEffect(() => {
    if (loading || typeof window === 'undefined') return;
    
    // Always save to localStorage
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    
    // If online and Pro user, sync to cloud
    if (isOnline && user && isProUser) {
      syncToCloud();
    } else if (user && isProUser) {
      setPendingSync(true);
    }
  }, [watchlist, user, isProUser, loading, isOnline]);

  // Load from localStorage and Firestore
  useEffect(() => {
    async function fetchWatchlist() {
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      setLoading(true);
      const local = localStorage.getItem('watchlist');
      if (local) {
        setWatchlist(JSON.parse(local));
      }
      
      if (user && isProUser && isOnline) {
        try {
          setSyncing(true);
          setSyncError(null);
          const cloudWatchlist = await loadWatchlist();
          if (cloudWatchlist) {
            setWatchlist(cloudWatchlist);
          }
        } catch (e: any) {
          setSyncError('Failed to load from cloud');
        } finally {
          setSyncing(false);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    fetchWatchlist();
  }, [user, isProUser, isOnline]);

  // Toast notifications for sync events
  useEffect(() => {
    if (syncError) {
      toast({ title: 'Sync Error', description: syncError, variant: 'destructive' });
    }
  }, [syncError, toast]);

  useEffect(() => {
    if (wasSyncing && !syncing && !syncError) {
      toast({ title: 'Cloud Sync', description: 'Watchlist synced successfully!', variant: 'success' });
    }
    setWasSyncing(syncing);
  }, [syncing, syncError, toast]);

  const addToWatchlist = (symbol: string) => {
    setWatchlist((prev) => (prev.includes(symbol) ? prev : [...prev, symbol]));
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist((prev) => prev.filter((s) => s !== symbol));
  };

  const contextValue = useMemo(() => ({
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    syncing,
    syncError,
  }), [watchlist, syncing, syncError]);

  if (loading) return <LoadingSpinner size="md" />;

  return (
    <WatchlistContext.Provider value={contextValue}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error('useWatchlist must be used within a WatchlistProvider');
  return context;
}; 