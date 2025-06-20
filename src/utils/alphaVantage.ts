const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

interface StockQuote {
  symbol: string;
  price: number;
  volume: number;
  timestamp: string;
  change: number;
  changePercent: number;
}

interface TechnicalIndicators {
  sma: number[];
  ema: number[];
  rsi: number[];
  macd: {
    macd: number[];
    signal: number[];
    histogram: number[];
  };
}

export async function getStockQuote(symbol: string): Promise<StockQuote> {
  const res = await fetch(`${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch stock quote');
  const data = await res.json();
  const quote = data['Global Quote'];
  
  return {
    symbol,
    price: parseFloat(quote['05. price']),
    volume: parseInt(quote['06. volume']),
    timestamp: quote['07. latest trading day'],
    change: parseFloat(quote['09. change']),
    changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
  };
}

export async function getTechnicalIndicators(symbol: string, interval: string = 'daily'): Promise<TechnicalIndicators> {
  const [smaRes, emaRes, rsiRes, macdRes] = await Promise.all([
    fetch(`${BASE_URL}?function=SMA&symbol=${symbol}&interval=${interval}&time_period=20&series_type=close&apikey=${API_KEY}`),
    fetch(`${BASE_URL}?function=EMA&symbol=${symbol}&interval=${interval}&time_period=20&series_type=close&apikey=${API_KEY}`),
    fetch(`${BASE_URL}?function=RSI&symbol=${symbol}&interval=${interval}&time_period=14&series_type=close&apikey=${API_KEY}`),
    fetch(`${BASE_URL}?function=MACD&symbol=${symbol}&interval=${interval}&series_type=close&apikey=${API_KEY}`),
  ]);

  if (!smaRes.ok || !emaRes.ok || !rsiRes.ok || !macdRes.ok) {
    throw new Error('Failed to fetch technical indicators');
  }

  const [smaData, emaData, rsiData, macdData] = await Promise.all([
    smaRes.json(),
    emaRes.json(),
    rsiRes.json(),
    macdRes.json(),
  ]);

  return {
    sma: Object.values(smaData['Technical Analysis: SMA']).map((v: any) => parseFloat(v.SMA)),
    ema: Object.values(emaData['Technical Analysis: EMA']).map((v: any) => parseFloat(v.EMA)),
    rsi: Object.values(rsiData['Technical Analysis: RSI']).map((v: any) => parseFloat(v.RSI)),
    macd: {
      macd: Object.values(macdData['Technical Analysis: MACD']).map((v: any) => parseFloat(v.MACD)),
      signal: Object.values(macdData['Technical Analysis: MACD']).map((v: any) => parseFloat(v.SIGNAL)),
      histogram: Object.values(macdData['Technical Analysis: MACD']).map((v: any) => parseFloat(v.HIST)),
    },
  };
}

export async function getCompanyOverview(symbol: string) {
  const res = await fetch(`${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch company overview');
  return res.json();
}

export async function getSectorPerformance() {
  const res = await fetch(`${BASE_URL}?function=SECTOR&apikey=${API_KEY}`);
  if (!res.ok) throw new Error('Failed to fetch sector performance');
  return res.json();
} 