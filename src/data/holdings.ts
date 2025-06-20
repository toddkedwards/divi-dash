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
      { exDate: "2023-05-12", paymentDate: "2023-05-18", amount: 0.24, growth: 4.3 },
      { exDate: "2023-02-10", paymentDate: "2023-02-16", amount: 0.23, growth: 4.5 },
      { exDate: "2022-11-10", paymentDate: "2022-11-17", amount: 0.23, growth: 4.5 },
      { exDate: "2022-08-12", paymentDate: "2022-08-18", amount: 0.23, growth: 4.5 },
      { exDate: "2022-05-13", paymentDate: "2022-05-19", amount: 0.23, growth: 4.5 },
      { exDate: "2022-02-11", paymentDate: "2022-02-17", amount: 0.22, growth: 4.8 },
      { exDate: "2021-11-12", paymentDate: "2021-11-18", amount: 0.22, growth: 4.8 },
      { exDate: "2021-08-13", paymentDate: "2021-08-19", amount: 0.22, growth: 4.8 },
      { exDate: "2021-05-14", paymentDate: "2021-05-20", amount: 0.22, growth: 4.8 },
      { exDate: "2021-02-12", paymentDate: "2021-02-18", amount: 0.21, growth: 5.0 },
      { exDate: "2020-11-13", paymentDate: "2020-11-19", amount: 0.21, growth: 5.0 },
      { exDate: "2020-08-14", paymentDate: "2020-08-20", amount: 0.21, growth: 5.0 },
      { exDate: "2020-05-15", paymentDate: "2020-05-21", amount: 0.21, growth: 5.0 }
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
      { exDate: "2023-06-15", paymentDate: "2023-09-14", amount: 0.75, growth: 10.3 },
      { exDate: "2023-03-16", paymentDate: "2023-06-15", amount: 0.68, growth: 10.3 },
      { exDate: "2022-12-15", paymentDate: "2023-03-16", amount: 0.68, growth: 10.3 },
      { exDate: "2022-09-15", paymentDate: "2022-12-15", amount: 0.68, growth: 10.3 },
      { exDate: "2022-06-16", paymentDate: "2022-09-15", amount: 0.68, growth: 10.3 },
      { exDate: "2022-03-17", paymentDate: "2022-06-16", amount: 0.62, growth: 10.7 },
      { exDate: "2021-12-16", paymentDate: "2022-03-17", amount: 0.62, growth: 10.7 },
      { exDate: "2021-09-16", paymentDate: "2021-12-16", amount: 0.62, growth: 10.7 },
      { exDate: "2021-06-17", paymentDate: "2021-09-16", amount: 0.62, growth: 10.7 },
      { exDate: "2021-03-18", paymentDate: "2021-06-17", amount: 0.56, growth: 11.0 },
      { exDate: "2020-12-17", paymentDate: "2021-03-18", amount: 0.56, growth: 11.0 },
      { exDate: "2020-09-17", paymentDate: "2020-12-17", amount: 0.56, growth: 11.0 },
      { exDate: "2020-06-18", paymentDate: "2020-09-17", amount: 0.56, growth: 11.0 }
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
      { exDate: "2023-12-07", paymentDate: "2024-01-01", amount: 0.2775, growth: 2.0 },
      { exDate: "2023-11-09", paymentDate: "2023-12-01", amount: 0.2775, growth: 2.0 },
      { exDate: "2023-10-06", paymentDate: "2023-11-01", amount: 0.2775, growth: 2.0 },
      { exDate: "2023-09-07", paymentDate: "2023-10-01", amount: 0.2775, growth: 2.0 },
      { exDate: "2023-08-09", paymentDate: "2023-09-01", amount: 0.2775, growth: 2.0 },
      { exDate: "2023-07-07", paymentDate: "2023-08-01", amount: 0.2775, growth: 2.0 },
      { exDate: "2023-06-08", paymentDate: "2023-07-01", amount: 0.2775, growth: 2.0 },
      { exDate: "2023-05-09", paymentDate: "2023-06-01", amount: 0.2775, growth: 2.0 },
      { exDate: "2023-04-06", paymentDate: "2023-05-01", amount: 0.2775, growth: 2.0 },
      { exDate: "2023-03-09", paymentDate: "2023-04-01", amount: 0.2775, growth: 2.0 },
      { exDate: "2023-02-09", paymentDate: "2023-03-01", amount: 0.2775, growth: 2.0 },
      { exDate: "2023-01-10", paymentDate: "2023-02-01", amount: 0.2775, growth: 2.0 },
      { exDate: "2022-12-08", paymentDate: "2023-01-01", amount: 0.2775, growth: 2.0 }
    ]
  }
]; 