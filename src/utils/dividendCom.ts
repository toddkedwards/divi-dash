const API_KEY = process.env.NEXT_PUBLIC_DIVIDEND_COM_API_KEY;
const BASE_URL = 'https://api.dividend.com/v1';

interface DividendCalendar {
  symbol: string;
  exDate: string;
  paymentDate: string;
  amount: number;
  yield: number;
  frequency: string;
}

interface DividendHistory {
  symbol: string;
  exDate: string;
  paymentDate: string;
  amount: number;
  yield: number;
}

interface DividendMetrics {
  symbol: string;
  currentYield: number;
  fiveYearAvgYield: number;
  payoutRatio: number;
  dividendGrowth: number;
  yearsOfGrowth: number;
  sustainabilityScore: number;
}

export async function getDividendCalendar(symbols: string[]): Promise<DividendCalendar[]> {
  const res = await fetch(`${BASE_URL}/calendar?symbols=${symbols.join(',')}&apikey=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch dividend calendar');
  return res.json();
}

export async function getDividendHistory(symbol: string, years: number = 5): Promise<DividendHistory[]> {
  const res = await fetch(`${BASE_URL}/history/${symbol}?years=${years}&apikey=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch dividend history');
  return res.json();
}

export async function getDividendMetrics(symbol: string): Promise<DividendMetrics> {
  const res = await fetch(`${BASE_URL}/metrics/${symbol}?apikey=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch dividend metrics');
  return res.json();
}

export async function getUpcomingDividends(days: number = 30): Promise<DividendCalendar[]> {
  const res = await fetch(`${BASE_URL}/upcoming?days=${days}&apikey=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch upcoming dividends');
  return res.json();
}

export async function getDividendScreener(params: {
  minYield?: number;
  maxYield?: number;
  minGrowth?: number;
  minPayoutRatio?: number;
  maxPayoutRatio?: number;
  sectors?: string[];
}): Promise<DividendMetrics[]> {
  const queryParams = new URLSearchParams();
  if (params.minYield) queryParams.append('minYield', params.minYield.toString());
  if (params.maxYield) queryParams.append('maxYield', params.maxYield.toString());
  if (params.minGrowth) queryParams.append('minGrowth', params.minGrowth.toString());
  if (params.minPayoutRatio) queryParams.append('minPayoutRatio', params.minPayoutRatio.toString());
  if (params.maxPayoutRatio) queryParams.append('maxPayoutRatio', params.maxPayoutRatio.toString());
  if (params.sectors) queryParams.append('sectors', params.sectors.join(','));

  const res = await fetch(`${BASE_URL}/screener?${queryParams.toString()}&apikey=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch dividend screener results');
  return res.json();
} 