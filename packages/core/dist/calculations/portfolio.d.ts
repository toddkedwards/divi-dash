import { Position, PortfolioSummary } from '@divly/data-models';
/**
 * Calculate total portfolio value based on current prices
 */
export declare function calculatePortfolioValue(positions: Position[]): number;
/**
 * Calculate total portfolio cost basis
 */
export declare function calculatePortfolioCost(positions: Position[]): number;
/**
 * Calculate portfolio gain/loss
 */
export declare function calculatePortfolioGainLoss(positions: Position[]): {
    gainLoss: number;
    gainLossPercent: number;
};
/**
 * Calculate annual dividend income
 */
export declare function calculateAnnualDividendIncome(positions: Position[]): number;
/**
 * Calculate portfolio dividend yield
 */
export declare function calculatePortfolioDividendYield(positions: Position[]): number;
/**
 * Calculate comprehensive portfolio summary
 */
export declare function calculatePortfolioSummary(positions: Position[]): PortfolioSummary;
/**
 * Calculate position metrics
 */
export declare function calculatePositionMetrics(position: Partial<Position>): Position;
/**
 * Calculate sector allocation
 */
export declare function calculateSectorAllocation(positions: Position[]): {
    sector: string;
    percentage: number;
    value: number;
}[];
/**
 * Calculate risk metrics (simplified)
 */
export declare function calculateRiskMetrics(positions: Position[]): {
    diversificationScore: number;
    concentrationRisk: number;
    sectorConcentration: number;
};
