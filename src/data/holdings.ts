export type PayoutFrequency = 'monthly' | 'quarterly' | 'semi-annual' | 'annual';

export interface DividendHistory {
  exDate: string;
  paymentDate: string;
  amount: number;
  growth?: number; // Year-over-year growth
}

export interface Holding {
  symbol: string;
  shares: number;
  avgPrice: number;
  dividendYield: number;
  costBasis: number;
  sector: string;
  currentPrice: number;
  payoutFrequency: PayoutFrequency;
  lastExDate: string;
  lastPaymentDate: string;
  nextExDate: string;
  nextPaymentDate: string;
  dividendHistory: DividendHistory[];
  typicalPaymentDay?: number; // Day of month for monthly payers
  typicalPaymentMonth?: number[]; // Months for quarterly/semi-annual/annual payers
  dividendGrowthRate?: number; // 5-year average growth rate
  payoutRatio?: number; // Current payout ratio
  yearsOfGrowth?: number; // Consecutive years of dividend growth
}

export const holdings: Holding[] = [
  {
    symbol: "AAPL",
    shares: 10,
    avgPrice: 150,
    dividendYield: 0.6,
    costBasis: 1500,
    sector: "Technology",
    currentPrice: 170,
    payoutFrequency: "quarterly",
    lastExDate: "2024-02-09",
    lastPaymentDate: "2024-02-15",
    nextExDate: "2024-05-10",
    nextPaymentDate: "2024-05-16",
    typicalPaymentMonth: [2, 5, 8, 11], // Feb, May, Aug, Nov
    dividendGrowthRate: 5.8,
    payoutRatio: 15.2,
    yearsOfGrowth: 11,
    dividendHistory: [
      { exDate: "2024-02-09", paymentDate: "2024-02-15", amount: 0.24, growth: 4.3 },
      { exDate: "2023-11-10", paymentDate: "2023-11-16", amount: 0.24, growth: 4.3 },
      { exDate: "2023-08-11", paymentDate: "2023-08-17", amount: 0.24, growth: 4.3 },
      { exDate: "2023-05-12", paymentDate: "2023-05-18", amount: 0.24, growth: 4.3 }
    ]
  },
  {
    symbol: "MSFT",
    shares: 5,
    avgPrice: 300,
    dividendYield: 0.8,
    costBasis: 1500,
    sector: "Technology",
    currentPrice: 320,
    payoutFrequency: "quarterly",
    lastExDate: "2024-02-14",
    lastPaymentDate: "2024-03-14",
    nextExDate: "2024-05-15",
    nextPaymentDate: "2024-06-13",
    typicalPaymentMonth: [3, 6, 9, 12], // Mar, Jun, Sep, Dec
    dividendGrowthRate: 10.2,
    payoutRatio: 28.5,
    yearsOfGrowth: 18,
    dividendHistory: [
      { exDate: "2024-02-14", paymentDate: "2024-03-14", amount: 0.75, growth: 10.3 },
      { exDate: "2023-12-14", paymentDate: "2024-03-14", amount: 0.75, growth: 10.3 },
      { exDate: "2023-09-14", paymentDate: "2023-12-14", amount: 0.75, growth: 10.3 },
      { exDate: "2023-06-15", paymentDate: "2023-09-14", amount: 0.75, growth: 10.3 }
    ]
  },
  {
    symbol: "T",
    shares: 20,
    avgPrice: 18,
    dividendYield: 6.5,
    costBasis: 360,
    sector: "Telecom",
    currentPrice: 16,
    payoutFrequency: "monthly",
    lastExDate: "2024-03-07",
    lastPaymentDate: "2024-04-01",
    nextExDate: "2024-04-09",
    nextPaymentDate: "2024-05-01",
    typicalPaymentDay: 1, // 1st of each month
    dividendGrowthRate: 2.1,
    payoutRatio: 58.3,
    yearsOfGrowth: 35,
    dividendHistory: [
      { exDate: "2024-03-07", paymentDate: "2024-04-01", amount: 0.2775, growth: 2.0 },
      { exDate: "2024-02-08", paymentDate: "2024-03-01", amount: 0.2775, growth: 2.0 },
      { exDate: "2024-01-09", paymentDate: "2024-02-01", amount: 0.2775, growth: 2.0 },
      { exDate: "2023-12-07", paymentDate: "2024-01-01", amount: 0.2775, growth: 2.0 }
    ]
  },
  {
    symbol: "JNJ",
    shares: 8,
    avgPrice: 165,
    dividendYield: 3.1,
    costBasis: 1320,
    sector: "Healthcare",
    currentPrice: 158,
    payoutFrequency: "quarterly",
    lastExDate: "2024-02-16",
    lastPaymentDate: "2024-03-12",
    nextExDate: "2024-05-17",
    nextPaymentDate: "2024-06-11",
    typicalPaymentMonth: [3, 6, 9, 12],
    dividendGrowthRate: 6.2,
    payoutRatio: 43.8,
    yearsOfGrowth: 61,
    dividendHistory: [
      { exDate: "2024-02-16", paymentDate: "2024-03-12", amount: 1.19, growth: 5.3 },
      { exDate: "2023-11-17", paymentDate: "2023-12-12", amount: 1.19, growth: 5.3 },
      { exDate: "2023-08-18", paymentDate: "2023-09-12", amount: 1.19, growth: 5.3 },
      { exDate: "2023-05-19", paymentDate: "2023-06-13", amount: 1.19, growth: 5.3 }
    ]
  },
  {
    symbol: "PG",
    shares: 12,
    avgPrice: 145,
    dividendYield: 2.4,
    costBasis: 1740,
    sector: "Consumer Defensive",
    currentPrice: 152,
    payoutFrequency: "quarterly",
    lastExDate: "2024-01-19",
    lastPaymentDate: "2024-02-15",
    nextExDate: "2024-04-19",
    nextPaymentDate: "2024-05-15",
    typicalPaymentMonth: [2, 5, 8, 11],
    dividendGrowthRate: 3.1,
    payoutRatio: 61.2,
    yearsOfGrowth: 67,
    dividendHistory: [
      { exDate: "2024-01-19", paymentDate: "2024-02-15", amount: 0.9407, growth: 3.0 },
      { exDate: "2023-10-20", paymentDate: "2023-11-15", amount: 0.9407, growth: 3.0 },
      { exDate: "2023-07-21", paymentDate: "2023-08-15", amount: 0.9407, growth: 3.0 },
      { exDate: "2023-04-21", paymentDate: "2023-05-15", amount: 0.9407, growth: 3.0 }
    ]
  },
  {
    symbol: "KO",
    shares: 15,
    avgPrice: 58,
    dividendYield: 3.2,
    costBasis: 870,
    sector: "Consumer Defensive",
    currentPrice: 60,
    payoutFrequency: "quarterly",
    lastExDate: "2024-02-15",
    lastPaymentDate: "2024-04-01",
    nextExDate: "2024-05-15",
    nextPaymentDate: "2024-07-01",
    typicalPaymentMonth: [1, 4, 7, 10],
    dividendGrowthRate: 3.8,
    payoutRatio: 70.1,
    yearsOfGrowth: 61,
    dividendHistory: [
      { exDate: "2024-02-15", paymentDate: "2024-04-01", amount: 0.46, growth: 3.8 },
      { exDate: "2023-11-16", paymentDate: "2024-01-01", amount: 0.46, growth: 3.8 },
      { exDate: "2023-08-17", paymentDate: "2023-10-01", amount: 0.46, growth: 3.8 },
      { exDate: "2023-05-18", paymentDate: "2023-07-01", amount: 0.46, growth: 3.8 }
    ]
  },
  {
    symbol: "VZ",
    shares: 25,
    avgPrice: 42,
    dividendYield: 6.8,
    costBasis: 1050,
    sector: "Telecom",
    currentPrice: 38,
    payoutFrequency: "quarterly",
    lastExDate: "2024-01-09",
    lastPaymentDate: "2024-02-01",
    nextExDate: "2024-04-09",
    nextPaymentDate: "2024-05-01",
    typicalPaymentMonth: [2, 5, 8, 11],
    dividendGrowthRate: 2.0,
    payoutRatio: 55.2,
    yearsOfGrowth: 17,
    dividendHistory: [
      { exDate: "2024-01-09", paymentDate: "2024-02-01", amount: 0.665, growth: 1.5 },
      { exDate: "2023-10-10", paymentDate: "2023-11-01", amount: 0.665, growth: 1.5 },
      { exDate: "2023-07-11", paymentDate: "2023-08-01", amount: 0.665, growth: 1.5 },
      { exDate: "2023-04-12", paymentDate: "2023-05-01", amount: 0.665, growth: 1.5 }
    ]
  },
  {
    symbol: "O",
    shares: 18,
    avgPrice: 65,
    dividendYield: 5.2,
    costBasis: 1170,
    sector: "Real Estate",
    currentPrice: 62,
    payoutFrequency: "monthly",
    lastExDate: "2024-03-14",
    lastPaymentDate: "2024-04-15",
    nextExDate: "2024-04-12",
    nextPaymentDate: "2024-05-15",
    typicalPaymentDay: 15,
    dividendGrowthRate: 3.5,
    payoutRatio: 78.9,
    yearsOfGrowth: 25,
    dividendHistory: [
      { exDate: "2024-03-14", paymentDate: "2024-04-15", amount: 0.2565, growth: 3.2 },
      { exDate: "2024-02-14", paymentDate: "2024-03-15", amount: 0.2565, growth: 3.2 },
      { exDate: "2024-01-12", paymentDate: "2024-02-15", amount: 0.2565, growth: 3.2 },
      { exDate: "2023-12-14", paymentDate: "2024-01-15", amount: 0.2565, growth: 3.2 }
    ]
  },
  {
    symbol: "SCHD",
    shares: 30,
    avgPrice: 75,
    dividendYield: 3.4,
    costBasis: 2250,
    sector: "ETF",
    currentPrice: 78,
    payoutFrequency: "quarterly",
    lastExDate: "2024-03-21",
    lastPaymentDate: "2024-03-28",
    nextExDate: "2024-06-21",
    nextPaymentDate: "2024-06-28",
    typicalPaymentMonth: [3, 6, 9, 12],
    dividendGrowthRate: 8.5,
    payoutRatio: 45.2,
    yearsOfGrowth: 12,
    dividendHistory: [
      { exDate: "2024-03-21", paymentDate: "2024-03-28", amount: 0.7324, growth: 8.2 },
      { exDate: "2023-12-21", paymentDate: "2023-12-28", amount: 0.7324, growth: 8.2 },
      { exDate: "2023-09-21", paymentDate: "2023-09-28", amount: 0.7324, growth: 8.2 },
      { exDate: "2023-06-21", paymentDate: "2023-06-28", amount: 0.7324, growth: 8.2 }
    ]
  },
  {
    symbol: "VYM",
    shares: 22,
    avgPrice: 95,
    dividendYield: 2.9,
    costBasis: 2090,
    sector: "ETF",
    currentPrice: 98,
    payoutFrequency: "quarterly",
    lastExDate: "2024-03-18",
    lastPaymentDate: "2024-03-25",
    nextExDate: "2024-06-18",
    nextPaymentDate: "2024-06-25",
    typicalPaymentMonth: [3, 6, 9, 12],
    dividendGrowthRate: 6.8,
    payoutRatio: 42.1,
    yearsOfGrowth: 15,
    dividendHistory: [
      { exDate: "2024-03-18", paymentDate: "2024-03-25", amount: 0.7123, growth: 6.5 },
      { exDate: "2023-12-18", paymentDate: "2023-12-25", amount: 0.7123, growth: 6.5 },
      { exDate: "2023-09-18", paymentDate: "2023-09-25", amount: 0.7123, growth: 6.5 },
      { exDate: "2023-06-18", paymentDate: "2023-06-25", amount: 0.7123, growth: 6.5 }
    ]
  },
  {
    symbol: "HD",
    shares: 6,
    avgPrice: 320,
    dividendYield: 2.3,
    costBasis: 1920,
    sector: "Consumer Cyclical",
    currentPrice: 335,
    payoutFrequency: "quarterly",
    lastExDate: "2024-02-22",
    lastPaymentDate: "2024-03-21",
    nextExDate: "2024-05-23",
    nextPaymentDate: "2024-06-20",
    typicalPaymentMonth: [3, 6, 9, 12],
    dividendGrowthRate: 15.2,
    payoutRatio: 52.8,
    yearsOfGrowth: 14,
    dividendHistory: [
      { exDate: "2024-02-22", paymentDate: "2024-03-21", amount: 2.09, growth: 15.5 },
      { exDate: "2023-11-23", paymentDate: "2023-12-21", amount: 2.09, growth: 15.5 },
      { exDate: "2023-08-24", paymentDate: "2023-09-21", amount: 2.09, growth: 15.5 },
      { exDate: "2023-05-25", paymentDate: "2023-06-22", amount: 2.09, growth: 15.5 }
    ]
  }
]; 