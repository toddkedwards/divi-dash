export declare const MARKET_HOURS: {
    NYSE: {
        open: string;
        close: string;
        timezone: string;
    };
    NASDAQ: {
        open: string;
        close: string;
        timezone: string;
    };
    LSE: {
        open: string;
        close: string;
        timezone: string;
    };
};
export declare const CURRENCY_SYMBOLS: {
    USD: string;
    EUR: string;
    GBP: string;
    CAD: string;
    AUD: string;
    JPY: string;
};
export declare const DIVIDEND_FREQUENCIES: {
    monthly: number;
    quarterly: number;
    'semi-annual': number;
    annual: number;
    special: number;
};
export declare const RISK_LEVELS: {
    LOW: {
        min: number;
        max: number;
        label: string;
        color: string;
    };
    MODERATE: {
        min: number;
        max: number;
        label: string;
        color: string;
    };
    HIGH: {
        min: number;
        max: number;
        label: string;
        color: string;
    };
};
export declare const SECTORS: string[];
export declare const DEFAULT_ALLOCATION_TARGETS: {
    Conservative: {
        stocks: number;
        bonds: number;
        cash: number;
    };
    Moderate: {
        stocks: number;
        bonds: number;
        cash: number;
    };
    Aggressive: {
        stocks: number;
        bonds: number;
        cash: number;
    };
};
export declare const API_RATE_LIMITS: {
    FINNHUB: number;
    ALPHA_VANTAGE: number;
    SCHWAB: number;
    TD_AMERITRADE: number;
    ALPACA: number;
    INTERACTIVE_BROKERS: number;
};
export declare const FINANCIAL_THRESHOLDS: {
    PE_RATIO: {
        undervalued: number;
        fair: number;
        overvalued: number;
    };
    DIVIDEND_YIELD: {
        low: number;
        moderate: number;
        high: number;
    };
    DEBT_TO_EQUITY: {
        low: number;
        moderate: number;
        high: number;
    };
};
