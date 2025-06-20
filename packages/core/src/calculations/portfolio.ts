import { Portfolio, Position, PortfolioSummary } from '@divly/data-models';

/**
 * Calculate total portfolio value based on current prices
 */
export function calculatePortfolioValue(positions: Position[]): number {
  return positions.reduce((total, position) => {
    const currentPrice = position.currentPrice || position.avgCost;
    return total + (position.shares * currentPrice);
  }, 0);
}

/**
 * Calculate total cost basis of portfolio
 */
export function calculateTotalCost(positions: Position[]): number {
  return positions.reduce((total, position) => {
    return total + (position.shares * position.avgCost);
  }, 0);
}

/**
 * Calculate total gain/loss
 */
export function calculateGainLoss(positions: Position[]): {
  total: number;
  percentage: number;
} {
  const totalValue = calculatePortfolioValue(positions);
  const totalCost = calculateTotalCost(positions);
  const gainLoss = totalValue - totalCost;
  const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;

  return {
    total: gainLoss,
    percentage: gainLossPercent
  };
}

/**
 * Calculate position-level gain/loss
 */
export function calculatePositionGainLoss(position: Position): {
  total: number;
  percentage: number;
} {
  const currentPrice = position.currentPrice || position.avgCost;
  const currentValue = position.shares * currentPrice;
  const costBasis = position.shares * position.avgCost;
  const gainLoss = currentValue - costBasis;
  const gainLossPercent = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;

  return {
    total: gainLoss,
    percentage: gainLossPercent
  };
}

/**
 * Calculate portfolio summary with all key metrics
 */
export function calculatePortfolioSummary(
  positions: Position[], 
  projectedAnnualIncome: number = 0
): PortfolioSummary {
  const totalValue = calculatePortfolioValue(positions);
  const totalCost = calculateTotalCost(positions);
  const { total: totalGainLoss, percentage: totalGainLossPercent } = calculateGainLoss(positions);
  const averageYield = totalValue > 0 ? (projectedAnnualIncome / totalValue) * 100 : 0;

  return {
    totalValue,
    totalCost,
    totalGainLoss,
    totalGainLossPercent,
    projectedAnnualIncome,
    averageYield,
    positionCount: positions.length,
    lastUpdated: new Date()
  };
}

/**
 * Calculate sector allocation
 */
export function calculateSectorAllocation(positions: Position[]): Array<{
  sector: string;
  value: number;
  percentage: number;
}> {
  const totalValue = calculatePortfolioValue(positions);
  const sectorMap = new Map<string, number>();

  positions.forEach(position => {
    const sector = position.sector || 'Unknown';
    const currentPrice = position.currentPrice || position.avgCost;
    const value = position.shares * currentPrice;
    
    sectorMap.set(sector, (sectorMap.get(sector) || 0) + value);
  });

  return Array.from(sectorMap.entries()).map(([sector, value]) => ({
    sector,
    value,
    percentage: totalValue > 0 ? (value / totalValue) * 100 : 0
  })).sort((a, b) => b.value - a.value);
}

/**
 * Calculate yield on cost
 */
export function calculateYieldOnCost(
  positions: Position[], 
  projectedAnnualIncome: number
): number {
  const totalCost = calculateTotalCost(positions);
  return totalCost > 0 ? (projectedAnnualIncome / totalCost) * 100 : 0;
}

/**
 * Find top performers by percentage gain
 */
export function getTopPerformers(positions: Position[], limit: number = 5): Position[] {
  return positions
    .map(position => ({
      ...position,
      gainLossPercent: calculatePositionGainLoss(position).percentage
    }))
    .sort((a, b) => b.gainLossPercent - a.gainLossPercent)
    .slice(0, limit);
}

/**
 * Find worst performers by percentage loss
 */
export function getWorstPerformers(positions: Position[], limit: number = 5): Position[] {
  return positions
    .map(position => ({
      ...position,
      gainLossPercent: calculatePositionGainLoss(position).percentage
    }))
    .sort((a, b) => a.gainLossPercent - b.gainLossPercent)
    .slice(0, limit);
} 