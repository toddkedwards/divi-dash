'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import app from '@/lib/firebase';
import { getFirestore, doc, getDoc, setDoc, deleteField, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { getFcmToken } from '@/lib/firebase';
import { useToast } from '@/components/ToastProvider';
import LoadingSpinner from '@/components/LoadingSpinner';
import { loadUserSettings, saveUserSettings } from '@/lib/firestore';

export type UserSettings = {
  notificationsEnabled: boolean;
  calendarDefaultView: 'month' | 'day';
  landingPage: string;
  theme: 'system' | 'light' | 'dark';
};

const defaultSettings: UserSettings = {
  notificationsEnabled: false,
  calendarDefaultView: 'month',
  landingPage: 'dashboard',
  theme: 'system',
};

interface UserSettingsContextType {
  settings: UserSettings;
  setSettings: (settings: UserSettings) => void;
  updateSetting: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void;
  loading: boolean;
  syncing: boolean;
  syncError: string | null;
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export function UserSettingsProvider({ children, userId }: { children: ReactNode; userId?: string }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const { toast } = useToast();
  const [wasSyncing, setWasSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSync, setPendingSync] = useState(false);
  // TODO: Replace with real Pro check
  const isProUser = true;

  // Track online/offline status (client only)
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
    if (!isOnline || !userId || !isProUser) return;
    try {
      setSyncing(true);
      setSyncError(null);
      await saveUserSettings(settings);
      setPendingSync(false);
    } catch (e: any) {
      setSyncError('Failed to sync to cloud');
      setPendingSync(true);
    } finally {
      setSyncing(false);
    }
  };

  // Load from localStorage and Firestore (client only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    async function fetchSettings() {
      setLoading(true);
      const local = localStorage.getItem('userSettings');
      if (local) {
        setSettings({ ...defaultSettings, ...JSON.parse(local) });
      }
      if (userId && isProUser && isOnline) {
        try {
          setSyncing(true);
          setSyncError(null);
          const cloudSettings = await loadUserSettings();
          if (cloudSettings) {
            setSettings({ ...defaultSettings, ...cloudSettings });
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
    fetchSettings();
  }, [userId, isProUser, isOnline]);

  // Save to localStorage and Firestore (client only)
  useEffect(() => {
    if (typeof window === 'undefined' || loading) return;
    // Always save to localStorage
    localStorage.setItem('userSettings', JSON.stringify(settings));
    // If online and Pro user, sync to cloud
    if (isOnline && userId && isProUser) {
      syncToCloud();
    } else if (userId && isProUser) {
      setPendingSync(true);
    }
  }, [settings, userId, isProUser, loading, isOnline]);

  useEffect(() => {
    if (typeof window === 'undefined' || !userId) return;
    const db = getFirestore(app);
    if (settings.notificationsEnabled) {
      getFcmToken().then(token => {
        if (token) {
          const ref = doc(db, 'users', userId, 'fcmTokens', token);
          setDoc(ref, { created: Date.now() }, { merge: true });
          toast({ title: 'Success', description: 'Push notifications enabled!', variant: 'success' });
        } else {
          toast({ title: 'Error', description: 'Failed to get push notification token. Please allow notifications in your browser.', variant: 'destructive' });
        }
      }).catch(() => {
        toast({ title: 'Error', description: 'Failed to get push notification token. Please allow notifications in your browser.', variant: 'destructive' });
      });
    } else {
      // Remove all tokens for this user
      (async () => {
        const tokensCol = collection(db, 'users', userId, 'fcmTokens');
        const tokensSnap = await getDocs(tokensCol);
        await Promise.all(tokensSnap.docs.map(docSnap => deleteDoc(docSnap.ref)));
        toast({ title: 'Info', description: 'Push notifications disabled and tokens removed.', variant: 'default' });
      })();
    }
  }, [settings.notificationsEnabled, userId]);

  // Toast notifications for sync events
  useEffect(() => {
    if (syncError) {
      toast({ title: 'Sync Error', description: syncError, variant: 'destructive' });
    }
  }, [syncError, toast]);
  useEffect(() => {
    if (wasSyncing && !syncing && !syncError) {
      toast({ title: 'Cloud Sync', description: 'Settings synced successfully!', variant: 'success' });
    }
    setWasSyncing(syncing);
  }, [syncing, syncError, toast]);

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const contextValue = useMemo(() => ({
    settings,
    setSettings,
    updateSetting,
    loading,
    syncing,
    syncError,
  }), [settings, loading, syncing, syncError]);

  if (typeof window === 'undefined') {
    // SSR/SSG: Don't render children, just a fallback
    return null;
  }

  return (
    loading ? <LoadingSpinner size="md" /> :
    <UserSettingsContext.Provider value={contextValue}>
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings() {
  const ctx = useContext(UserSettingsContext);
  if (!ctx) throw new Error('useUserSettings must be used within UserSettingsProvider');
  return ctx;
} 