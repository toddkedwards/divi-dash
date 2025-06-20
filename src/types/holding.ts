export interface Holding {
  symbol: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  costBasis: number;
  marketValue: number;
  gainLoss: number;
  gainLossPercentage: number;
  dividendYield: number;
  dailyChange?: number;
  dailyChangePercent?: number;
} 