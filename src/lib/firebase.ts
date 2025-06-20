import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// Firebase configuration with fallbacks for build time
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:demo',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if we have valid configuration
let app: any = null;
let auth: any = null;

try {
  if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'demo-api-key') {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
  } else if (typeof window !== 'undefined') {
    // Only show warning in browser, not during build
    console.warn('Firebase not initialized: Missing valid API key');
  }
} catch (error) {
  if (typeof window !== 'undefined') {
    console.error('Firebase initialization error:', error);
  }
}

// Export auth with null check
export { auth };
export { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut };

export const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export async function getFcmToken() {
  if (typeof window === 'undefined') return null;
  if (!(await isSupported())) return null;
  
  try {
    const messaging = getMessaging(app);
    const registration = await navigator.serviceWorker?.ready;
    if (!registration) return null;
    
    const token = await getToken(messaging, { 
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration 
    });
    return token;
  } catch (err) {
    console.error('Error getting FCM token:', err);
    return null;
  }
}

export { getMessaging, onMessage };

export default app; 