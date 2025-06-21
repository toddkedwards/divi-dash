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
    timezone: string;
    notifications: NotificationSettings;
    privacy: PrivacySettings;
}
export interface NotificationSettings {
    email: boolean;
    push: boolean;
    dividendReminders: boolean;
    priceAlerts: boolean;
    newsUpdates: boolean;
}
export interface PrivacySettings {
    sharePortfolio: boolean;
    publicProfile: boolean;
    dataCollection: boolean;
}
export interface Portfolio {
    id: string;
    userId: string;
    name: string;
    description?: string;
    positions: Position[];
    totalValue: number;
    totalCost: number;
    totalGainLoss: number;
    totalGainLossPercent: number;
    annualDividendIncome: number;
    dividendYield: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface Position {
    id: string;
    portfolioId: string;
    symbol: string;
    companyName: string;
    shares: number;
    averageCost: number;
    currentPrice: number;
    totalValue: number;
    totalCost: number;
    gainLoss: number;
    gainLossPercent: number;
    dividendYield?: number;
    annualDividendPerShare?: number;
    sector?: string;
    industry?: string;
    country?: string;
    currency: string;
    lastUpdated: Date;
}
export interface Dividend {
    id: string;
    symbol: string;
    companyName: string;
    amount: number;
    currency: string;
    exDate: Date;
    payDate: Date;
    recordDate?: Date;
    declarationDate?: Date;
    frequency: DividendFrequency;
    type: DividendType;
    status: DividendStatus;
}
export type DividendFrequency = 'monthly' | 'quarterly' | 'semi-annual' | 'annual' | 'special';
export type DividendType = 'regular' | 'special' | 'return-of-capital' | 'stock';
export type DividendStatus = 'announced' | 'confirmed' | 'paid' | 'cancelled';
export interface Stock {
    symbol: string;
    companyName: string;
    currentPrice: number;
    previousClose: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap?: number;
    peRatio?: number;
    dividendYield?: number;
    fiftyTwoWeekHigh?: number;
    fiftyTwoWeekLow?: number;
    sector?: string;
    industry?: string;
    currency: string;
    exchange: string;
    lastUpdated: Date;
}
export interface PortfolioSummary {
    totalValue: number;
    totalGainLoss: number;
    totalGainLossPercent: number;
    dailyChange: number;
    dailyChangePercent: number;
    annualDividendIncome: number;
    dividendYield: number;
    positionCount: number;
    topPerformers: Position[];
    worstPerformers: Position[];
}
export interface DividendSummary {
    monthlyIncome: number;
    quarterlyIncome: number;
    annualIncome: number;
    nextDividends: Dividend[];
    dividendGrowthRate: number;
    payoutRatio: number;
}
