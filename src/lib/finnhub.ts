const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

interface StockQuote {
  c: number;  // Current price
  d: number;  // Daily change
  dp: number; // Daily change percentage
  h: number;  // High price of the day
  l: number;  // Low price of the day
  o: number;  // Open price of the day
  pc: number; // Previous close price
}

export async function getStockQuote(symbol: string): Promise<StockQuote> {
  if (!FINNHUB_API_KEY) {
    throw new Error('Finnhub API key is not configured');
  }

  const response = await fetch(
    `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch quote for ${symbol}`);
  }

  return response.json();
} 