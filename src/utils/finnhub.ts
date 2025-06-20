const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';

export async function searchStocks(query: string) {
  const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}&token=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to search stocks');
  return res.json();
}

export async function getStockQuote(symbol: string) {
  const res = await fetch(`${BASE_URL}/quote?symbol=${encodeURIComponent(symbol)}&token=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch stock quote');
  return res.json();
}

export async function getStockProfile(symbol: string) {
  const res = await fetch(`${BASE_URL}/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch stock profile');
  return res.json();
}

export async function getDividends(symbol: string, from: string, to: string) {
  // from/to format: YYYY-MM-DD
  const res = await fetch(`${BASE_URL}/stock/dividend?symbol=${encodeURIComponent(symbol)}&from=${from}&to=${to}&token=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch dividends');
  return res.json();
}

export async function getStockCandles(symbol: string, resolution: string, from: number, to: number) {
  // resolution: 1, 5, 15, 30, 60, D, W, M
  const res = await fetch(`${BASE_URL}/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=${resolution}&from=${from}&to=${to}&token=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch stock candles');
  return res.json();
}

export async function getStockMetrics(symbol: string) {
  const res = await fetch(`${BASE_URL}/stock/metric?symbol=${encodeURIComponent(symbol)}&metric=all&token=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch stock metrics');
  return res.json();
}

export async function getFinancials(symbol: string) {
  const res = await fetch(`${BASE_URL}/stock/financials-reported?symbol=${encodeURIComponent(symbol)}&token=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch financials');
  return res.json();
}

export async function getRecommendations(symbol: string) {
  const res = await fetch(`${BASE_URL}/stock/recommendation?symbol=${encodeURIComponent(symbol)}&token=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  return res.json();
}

export async function getEarnings(symbol: string) {
  const res = await fetch(`${BASE_URL}/stock/earnings?symbol=${encodeURIComponent(symbol)}&token=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch earnings');
  return res.json();
}

export async function getEarningsCalendar(symbol: string) {
  // Finnhub's earnings calendar endpoint requires a date range
  const now = new Date();
  const from = now.toISOString().slice(0, 10);
  const to = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate()).toISOString().slice(0, 10); // 3 months ahead
  const res = await fetch(`${BASE_URL}/calendar/earnings?symbol=${encodeURIComponent(symbol)}&from=${from}&to=${to}&token=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch earnings calendar');
  return res.json();
}

export async function getNews(symbol: string) {
  const now = new Date();
  const from = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10); // 30 days ago
  const to = now.toISOString().slice(0, 10);
  const res = await fetch(`${BASE_URL}/company-news?symbol=${encodeURIComponent(symbol)}&from=${from}&to=${to}&token=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch news');
  return res.json();
} 