import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { auth } from "./firebase";
import app from "./firebase";

// Initialize Firestore only on the client side
const db = typeof window !== 'undefined' && app ? getFirestore(app) : null;

// User Settings
export async function saveUserSettings(settings: any) {
  if (!db || !auth?.currentUser) return;
  try {
    const ref = doc(db, "users", auth.currentUser.uid, "settings", "preferences");
    await setDoc(ref, settings);
  } catch (error) {
    console.warn('Failed to save user settings:', error);
  }
}

export async function loadUserSettings() {
  if (!db || !auth?.currentUser) return null;
  try {
    const ref = doc(db, "users", auth.currentUser.uid, "settings", "preferences");
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.warn('Failed to load user settings:', error);
    return null;
  }
}

// Portfolio
export async function savePortfolio(holdings: any[]) {
  if (!db || !auth?.currentUser) return;
  try {
    const ref = doc(db, "users", auth.currentUser.uid, "portfolio", "data");
    await setDoc(ref, { holdings });
  } catch (error) {
    console.warn('Failed to save portfolio:', error);
  }
}

export async function loadPortfolio() {
  if (!db || !auth?.currentUser) return null;
  try {
    const ref = doc(db, "users", auth.currentUser.uid, "portfolio", "data");
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data().holdings : null;
  } catch (error) {
    console.warn('Failed to load portfolio:', error);
    return null;
  }
}

// Watchlist
export async function saveWatchlist(watchlist: any[]) {
  if (!db || !auth?.currentUser) return;
  try {
    const ref = doc(db, "users", auth.currentUser.uid, "watchlist", "data");
    await setDoc(ref, { watchlist });
  } catch (error) {
    console.warn('Failed to save watchlist:', error);
  }
}

export async function loadWatchlist() {
  if (!db || !auth?.currentUser) return null;
  try {
    const ref = doc(db, "users", auth.currentUser.uid, "watchlist", "data");
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data().watchlist : null;
  } catch (error) {
    console.warn('Failed to load watchlist:', error);
    return null;
  }
}

// Dividends
export async function saveDividends(dividends: any[]) {
  if (!db || !auth?.currentUser) return;
  try {
    const ref = doc(db, "users", auth.currentUser.uid, "dividends", "data");
    await setDoc(ref, { dividends });
  } catch (error) {
    console.warn('Failed to save dividends:', error);
  }
}

export async function loadDividends() {
  if (!db || !auth?.currentUser) return null;
  try {
    const ref = doc(db, "users", auth.currentUser.uid, "dividends", "data");
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data().dividends : null;
  } catch (error) {
    console.warn('Failed to load dividends:', error);
    return null;
  }
}

// Multi-portfolio support
export async function savePortfolios(portfolios: any[]) {
  if (!db || !auth?.currentUser) return;
  try {
    const ref = doc(db, "users", auth.currentUser.uid, "portfolios", "data");
    await setDoc(ref, { portfolios });
  } catch (error) {
    console.warn('Failed to save portfolios:', error);
    throw error; // Re-throw to let the caller handle it
  }
}

export async function loadPortfolios() {
  if (!db || !auth?.currentUser) return null;
  try {
    const ref = doc(db, "users", auth.currentUser.uid, "portfolios", "data");
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data().portfolios : null;
  } catch (error) {
    console.warn('Failed to load portfolios:', error);
    return null;
  }
} 