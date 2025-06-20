// Portfolio Models
export interface Portfolio {
  id: string;
  name: string;
  positions: Position[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Position {
  id: string;
  symbol: string;
  shares: number;
  avgCost: number;
  currentPrice?: number;
  lastUpdated?: Date;
  exchange?: string;
  sector?: string;
  industry?: string;
}

// Dividend Models
export interface Dividend {
  id: string;
  symbol: string;
  amount: number;
  exDate: Date;
  payDate: Date;
  recordDate?: Date;
  declaredDate?: Date;
  frequency: DividendFrequency;
  type: DividendType;
}

export interface DividendHistory {
  symbol: string;
  dividends: Dividend[];
  totalPaid: number;
  averageYield: number;
  growthRate?: number;
}

// User Models
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isPro: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  dateFormat: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  dividendReminders: boolean;
  portfolioUpdates: boolean;
  newsAlerts: boolean;
  priceAlerts: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface PrivacySettings {
  sharePortfolio: boolean;
  publicProfile: boolean;
  analyticsConsent: boolean;
}

// Market Data Models
export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  pe?: number;
  eps?: number;
  dividendYield?: number;
  timestamp: Date;
}

export interface CompanyInfo {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  industry: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  employees?: number;
  marketCap?: number;
}

// Watchlist Models
export interface WatchlistItem {
  id: string;
  symbol: string;
  addedAt: Date;
  notes?: string;
  priceAlert?: number;
  targetPrice?: number;
}

export interface Watchlist {
  id: string;
  name: string;
  items: WatchlistItem[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Goal Models
export interface PortfolioGoal {
  id: string;
  name: string;
  type: GoalType;
  targetValue: number;
  currentValue: number;
  targetDate: Date;
  isActive: boolean;
  createdAt: Date;
}

// Risk Analysis Models
export interface RiskMetrics {
  portfolioValue: number;
  volatility: number;
  sharpeRatio: number;
  beta: number;
  maxDrawdown: number;
  diversificationScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface SectorAllocation {
  sector: string;
  value: number;
  percentage: number;
  riskScore: number;
}

// Calculation Models
export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  projectedAnnualIncome: number;
  averageYield: number;
  positionCount: number;
  lastUpdated: Date;
}

export interface DividendProjection {
  monthly: number;
  quarterly: number;
  annual: number;
  nextPayment?: {
    date: Date;
    amount: number;
    symbol: string;
  };
}

// Enums and Types
export type DividendFrequency = 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'special';
export type DividendType = 'regular' | 'special' | 'return_of_capital';
export type GoalType = 'portfolio_value' | 'annual_income' | 'dividend_growth';
export type Platform = 'web' | 'ios' | 'android' | 'desktop';

// API Models
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Models
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Platform-specific Extensions
export interface WebPortfolioSettings extends Portfolio {
  chartPreferences: {
    defaultTimeframe: string;
    showVolume: boolean;
    indicatorSettings: Record<string, any>;
  };
  exportSettings: {
    format: 'csv' | 'excel' | 'pdf';
    includeCharts: boolean;
    dateRange: string;
  };
}

export interface MobilePortfolioSettings extends Portfolio {
  notificationSettings: {
    dividendAlerts: boolean;
    priceAlerts: boolean;
    newsAlerts: boolean;
    vibration: boolean;
  };
  displaySettings: {
    compactView: boolean;
    showPercentages: boolean;
    defaultSort: string;
  };
} 