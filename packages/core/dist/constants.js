"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FINANCIAL_THRESHOLDS = exports.API_RATE_LIMITS = exports.DEFAULT_ALLOCATION_TARGETS = exports.SECTORS = exports.RISK_LEVELS = exports.DIVIDEND_FREQUENCIES = exports.CURRENCY_SYMBOLS = exports.MARKET_HOURS = void 0;
// Market constants
exports.MARKET_HOURS = {
    NYSE: {
        open: '09:30',
        close: '16:00',
        timezone: 'America/New_York'
    },
    NASDAQ: {
        open: '09:30',
        close: '16:00',
        timezone: 'America/New_York'
    },
    LSE: {
        open: '08:00',
        close: '16:30',
        timezone: 'Europe/London'
    }
};
// Currency symbols
exports.CURRENCY_SYMBOLS = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    JPY: '¥'
};
// Dividend frequencies
exports.DIVIDEND_FREQUENCIES = {
    monthly: 12,
    quarterly: 4,
    'semi-annual': 2,
    annual: 1,
    special: 0
};
// Risk levels
exports.RISK_LEVELS = {
    LOW: { min: 0, max: 3, label: 'Low Risk', color: '#10B981' },
    MODERATE: { min: 3, max: 7, label: 'Moderate Risk', color: '#F59E0B' },
    HIGH: { min: 7, max: 10, label: 'High Risk', color: '#EF4444' }
};
// Sector classifications
exports.SECTORS = [
    'Technology',
    'Healthcare',
    'Financial Services',
    'Consumer Discretionary',
    'Consumer Staples',
    'Energy',
    'Industrials',
    'Materials',
    'Real Estate',
    'Utilities',
    'Communication Services'
];
// Default portfolio allocation targets
exports.DEFAULT_ALLOCATION_TARGETS = {
    'Conservative': {
        stocks: 40,
        bonds: 50,
        cash: 10
    },
    'Moderate': {
        stocks: 60,
        bonds: 35,
        cash: 5
    },
    'Aggressive': {
        stocks: 80,
        bonds: 15,
        cash: 5
    }
};
// API rate limits (requests per minute)
exports.API_RATE_LIMITS = {
    FINNHUB: 60,
    ALPHA_VANTAGE: 5,
    SCHWAB: 120,
    TD_AMERITRADE: 120,
    ALPACA: 200,
    INTERACTIVE_BROKERS: 50
};
// Common financial ratios thresholds
exports.FINANCIAL_THRESHOLDS = {
    PE_RATIO: {
        undervalued: 15,
        fair: 25,
        overvalued: 35
    },
    DIVIDEND_YIELD: {
        low: 2,
        moderate: 4,
        high: 6
    },
    DEBT_TO_EQUITY: {
        low: 0.3,
        moderate: 0.6,
        high: 1.0
    }
};
