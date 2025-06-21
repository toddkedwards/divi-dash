import { Portfolio, Position, PortfolioSummary } from '@divly/data-models';

/**
 * Calculate total portfolio value based on current prices
 */
export function calculatePortfolioValue(positions: Position[]): number {
  return positions.reduce((total, position) => {
    return total + (position.shares * position.currentPrice);
  }, 0);
}

/**
 * Calculate total portfolio cost basis
 */
export function calculatePortfolioCost(positions: Position[]): number {
  return positions.reduce((total, position) => {
    return total + (position.shares * position.averageCost);
  }, 0);
}

/**
 * Calculate portfolio gain/loss
 */
export function calculatePortfolioGainLoss(positions: Position[]): { gainLoss: number; gainLossPercent: number } {
  const totalValue = calculatePortfolioValue(positions);
  const totalCost = calculatePortfolioCost(positions);
  const gainLoss = totalValue - totalCost;
  const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;
  
  return { gainLoss, gainLossPercent };
}

/**
 * Calculate annual dividend income
 */
export function calculateAnnualDividendIncome(positions: Position[]): number {
  return positions.reduce((total, position) => {
    const annualDividend = position.annualDividendPerShare || 0;
    return total + (position.shares * annualDividend);
  }, 0);
}

/**
 * Calculate portfolio dividend yield
 */
export function calculatePortfolioDividendYield(positions: Position[]): number {
  const totalValue = calculatePortfolioValue(positions);
  const annualIncome = calculateAnnualDividendIncome(positions);
  return totalValue > 0 ? (annualIncome / totalValue) * 100 : 0;
}

/**
 * Calculate comprehensive portfolio summary
 */
export function calculatePortfolioSummary(positions: Position[]): PortfolioSummary {
  const totalValue = calculatePortfolioValue(positions);
  const totalCost = calculatePortfolioCost(positions);
  const { gainLoss, gainLossPercent } = calculatePortfolioGainLoss(positions);
  const annualDividendIncome = calculateAnnualDividendIncome(positions);
  const dividendYield = calculatePortfolioDividendYield(positions);
  
  // Calculate daily change (simplified - would need historical data)
  const dailyChange = positions.reduce((total, position) => {
    const change = position.currentPrice - (position.currentPrice * 0.99); // Placeholder
    return total + (position.shares * change);
  }, 0);
  
  const dailyChangePercent = totalValue > 0 ? (dailyChange / totalValue) * 100 : 0;
  
  // Get top and worst performers
  const sortedPositions = [...positions].sort((a, b) => b.gainLossPercent - a.gainLossPercent);
  const topPerformers = sortedPositions.slice(0, 5);
  const worstPerformers = sortedPositions.slice(-5).reverse();
  
  return {
    totalValue,
    totalGainLoss: gainLoss,
    totalGainLossPercent: gainLossPercent,
    dailyChange,
    dailyChangePercent,
    annualDividendIncome,
    dividendYield,
    positionCount: positions.length,
    topPerformers,
    worstPerformers
  };
}

/**
 * Calculate position metrics
 */
export function calculatePositionMetrics(position: Partial<Position>): Position {
  const shares = position.shares || 0;
  const averageCost = position.averageCost || 0;
  const currentPrice = position.currentPrice || 0;
  
  const totalValue = shares * currentPrice;
  const totalCost = shares * averageCost;
  const gainLoss = totalValue - totalCost;
  const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;
  
  return {
    ...position,
    shares,
    averageCost,
    currentPrice,
    totalValue,
    totalCost,
    gainLoss,
    gainLossPercent,
    lastUpdated: new Date()
  } as Position;
}

/**
 * Calculate sector allocation
 */
export function calculateSectorAllocation(positions: Position[]): { sector: string; percentage: number; value: number }[] {
  const totalValue = calculatePortfolioValue(positions);
  const sectorMap = new Map<string, number>();
  
  positions.forEach(position => {
    const sector = position.sector || 'Unknown';
    const value = position.shares * position.currentPrice;
    sectorMap.set(sector, (sectorMap.get(sector) || 0) + value);
  });
  
  return Array.from(sectorMap.entries()).map(([sector, value]) => ({
    sector,
    value,
    percentage: totalValue > 0 ? (value / totalValue) * 100 : 0
  })).sort((a, b) => b.percentage - a.percentage);
}

/**
 * Calculate risk metrics (simplified)
 */
export function calculateRiskMetrics(positions: Position[]): {
  diversificationScore: number;
  concentrationRisk: number;
  sectorConcentration: number;
} {
  const totalValue = calculatePortfolioValue(positions);
  const sectorAllocation = calculateSectorAllocation(positions);
  
  // Diversification score based on number of positions
  const diversificationScore = Math.min(positions.length / 20, 1) * 100;
  
  // Concentration risk - largest single position
  const largestPosition = Math.max(...positions.map(p => (p.shares * p.currentPrice) / totalValue * 100));
  const concentrationRisk = largestPosition;
  
  // Sector concentration - largest sector allocation
  const sectorConcentration = Math.max(...sectorAllocation.map(s => s.percentage));
  
  return {
    diversificationScore,
    concentrationRisk,
    sectorConcentration
  };
}
