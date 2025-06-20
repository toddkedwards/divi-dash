// App Constants
export const APP_NAME = 'Divly';
export const APP_VERSION = '1.0.0';

// API Constants
export const API_ENDPOINTS = {
  FINNHUB: 'https://finnhub.io/api/v1',
  ALPHA_VANTAGE: 'https://www.alphavantage.co/query',
  POLYGON: 'https://api.polygon.io/v2'
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM d, yyyy',
  ISO: 'yyyy-MM-dd',
  TIMESTAMP: 'yyyy-MM-dd HH:mm:ss'
} as const;

// Currency
export const CURRENCIES = {
  USD: { symbol: '$', code: 'USD', name: 'US Dollar' },
  EUR: { symbol: '€', code: 'EUR', name: 'Euro' },
  GBP: { symbol: '£', code: 'GBP', name: 'British Pound' },
  CAD: { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar' }
} as const;

// Dividend Frequencies
export const DIVIDEND_FREQUENCIES = {
  MONTHLY: { value: 'monthly', multiplier: 12, label: 'Monthly' },
  QUARTERLY: { value: 'quarterly', multiplier: 4, label: 'Quarterly' },
  SEMIANNUAL: { value: 'semiannual', multiplier: 2, label: 'Semi-Annual' },
  ANNUAL: { value: 'annual', multiplier: 1, label: 'Annual' },
  SPECIAL: { value: 'special', multiplier: 0, label: 'Special' }
} as const;

// Risk Levels
export const RISK_LEVELS = {
  LOW: { value: 'Low', color: '#10b981', threshold: 15 },
  MEDIUM: { value: 'Medium', color: '#f59e0b', threshold: 25 },
  HIGH: { value: 'High', color: '#ef4444', threshold: Infinity }
} as const;

// Chart Colors
export const CHART_COLORS = [
  '#10b981', // green
  '#3b82f6', // blue
  '#f59e0b', // yellow
  '#ef4444', // red
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#f97316', // orange
  '#84cc16', // lime
] as const;

// Sectors
export const SECTORS = [
  'Technology',
  'Healthcare',
  'Financial Services',
  'Consumer Cyclical',
  'Communication Services',
  'Industrials',
  'Consumer Defensive',
  'Energy',
  'Utilities',
  'Real Estate',
  'Basic Materials'
] as const;

// Stock Exchanges
export const EXCHANGES = {
  NYSE: 'New York Stock Exchange',
  NASDAQ: 'NASDAQ',
  TSX: 'Toronto Stock Exchange',
  LSE: 'London Stock Exchange',
  XETRA: 'Deutsche Börse XETRA'
} as const;

// Platform Constants
export const PLATFORMS = {
  WEB: 'web',
  IOS: 'ios',
  ANDROID: 'android',
  DESKTOP: 'desktop'
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'divly_user_preferences',
  PORTFOLIOS: 'divly_portfolios',
  WATCHLIST: 'divly_watchlist',
  THEME: 'divly_theme',
  AUTH_TOKEN: 'divly_auth_token'
} as const;

// Validation Constants
export const VALIDATION = {
  MIN_SHARES: 0.001,
  MAX_SHARES: 999999999,
  MIN_PRICE: 0.01,
  MAX_PRICE: 999999999,
  MAX_SYMBOL_LENGTH: 10,
  MAX_PORTFOLIO_NAME_LENGTH: 50,
  MAX_GOAL_NAME_LENGTH: 100
} as const;

// Pro Features
export const PRO_FEATURES = [
  'advanced_analytics',
  'risk_analysis',
  'multiple_portfolios',
  'api_integrations',
  'priority_support',
  'export_capabilities'
] as const;

// Default Values
export const DEFAULTS = {
  PORTFOLIO_NAME: 'My Portfolio',
  CURRENCY: 'USD',
  THEME: 'system',
  DIVIDEND_FREQUENCY: 'quarterly',
  CHART_TIMEFRAME: '1Y'
} as const; 