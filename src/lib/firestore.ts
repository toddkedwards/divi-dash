import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { auth } from "./firebase";

// Initialize Firestore only on the client side
const db = typeof window !== 'undefined' ? getFirestore() : null;

// User Settings
export async function saveUserSettings(settings: any) {
  if (!db || !auth.currentUser) return;
  const ref = doc(db, "users", auth.currentUser.uid, "settings", "preferences");
  await setDoc(ref, settings);
}

export async function loadUserSettings() {
  if (!db || !auth.currentUser) return null;
  const ref = doc(db, "users", auth.currentUser.uid, "settings", "preferences");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// Portfolio
export async function savePortfolio(holdings: any[]) {
  if (!db || !auth.currentUser) return;
  const ref = doc(db, "users", auth.currentUser.uid, "portfolio", "data");
  await setDoc(ref, { holdings });
}

export async function loadPortfolio() {
  if (!db || !auth.currentUser) return null;
  const ref = doc(db, "users", auth.currentUser.uid, "portfolio", "data");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().holdings : null;
}

// Watchlist
export async function saveWatchlist(watchlist: any[]) {
  if (!db || !auth.currentUser) return;
  const ref = doc(db, "users", auth.currentUser.uid, "watchlist", "data");
  await setDoc(ref, { watchlist });
}

export async function loadWatchlist() {
  if (!db || !auth.currentUser) return null;
  const ref = doc(db, "users", auth.currentUser.uid, "watchlist", "data");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().watchlist : null;
}

// Dividends
export async function saveDividends(dividends: any[]) {
  if (!db || !auth.currentUser) return;
  const ref = doc(db, "users", auth.currentUser.uid, "dividends", "data");
  await setDoc(ref, { dividends });
}

export async function loadDividends() {
  if (!db || !auth.currentUser) return null;
  const ref = doc(db, "users", auth.currentUser.uid, "dividends", "data");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().dividends : null;
}

// Multi-portfolio support
export async function savePortfolios(portfolios: any[]) {
  if (!db || !auth.currentUser) return;
  const ref = doc(db, "users", auth.currentUser.uid, "portfolios", "data");
  await setDoc(ref, { portfolios });
}

export async function loadPortfolios() {
  if (!db || !auth.currentUser) return null;
  const ref = doc(db, "users", auth.currentUser.uid, "portfolios", "data");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().portfolios : null;
} 