import { Holding } from "@/data/holdings";
import { getDividends } from "./finnhub";

const STORAGE_KEY = "holdings";

export function getHoldings(): Holding[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export async function saveHolding(newHolding: Holding) {
  // Fetch dividend history for the past year
  try {
    const now = new Date();
    const from = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString().slice(0, 10);
    const to = now.toISOString().slice(0, 10);
    const dividends = await getDividends(newHolding.symbol, from, to);

    // Convert Finnhub dividends to our DividendHistory format
    if (Array.isArray(dividends)) {
      newHolding.dividendHistory = dividends.map(d => ({
        exDate: d.date,
        paymentDate: d.paymentDate || d.date, // Fallback to ex-date if payment date not available
        amount: d.amount,
      }));

      // Sort by date descending to get most recent first
      newHolding.dividendHistory.sort((a, b) => new Date(b.exDate).getTime() - new Date(a.exDate).getTime());

      // Set next dates based on most recent dividend if available
      if (newHolding.dividendHistory.length > 0) {
        const lastDividend = newHolding.dividendHistory[0];
        const lastExDate = new Date(lastDividend.exDate);
        const lastPaymentDate = new Date(lastDividend.paymentDate);

        // Estimate next dates based on payout frequency
        const monthsToAdd = newHolding.payoutFrequency === 'monthly' ? 1 :
                          newHolding.payoutFrequency === 'quarterly' ? 3 :
                          newHolding.payoutFrequency === 'semi-annual' ? 6 : 12;

        newHolding.nextExDate = new Date(lastExDate.setMonth(lastExDate.getMonth() + monthsToAdd)).toISOString();
        newHolding.nextPaymentDate = new Date(lastPaymentDate.setMonth(lastPaymentDate.getMonth() + monthsToAdd)).toISOString();
      }
    }
  } catch (error) {
    console.error('Failed to fetch dividend history:', error);
    // Continue with saving even if dividend history fetch fails
    newHolding.dividendHistory = [];
  }

  const holdings = getHoldings();
  const idx = holdings.findIndex(h => h.symbol === newHolding.symbol);
  if (idx !== -1) {
    holdings[idx] = newHolding;
  } else {
    holdings.push(newHolding);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
} 