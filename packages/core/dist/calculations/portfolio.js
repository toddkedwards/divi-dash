"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePortfolioValue = calculatePortfolioValue;
exports.calculatePortfolioCost = calculatePortfolioCost;
exports.calculatePortfolioGainLoss = calculatePortfolioGainLoss;
exports.calculateAnnualDividendIncome = calculateAnnualDividendIncome;
exports.calculatePortfolioDividendYield = calculatePortfolioDividendYield;
exports.calculatePortfolioSummary = calculatePortfolioSummary;
exports.calculatePositionMetrics = calculatePositionMetrics;
exports.calculateSectorAllocation = calculateSectorAllocation;
exports.calculateRiskMetrics = calculateRiskMetrics;
/**
 * Calculate total portfolio value based on current prices
 */
function calculatePortfolioValue(positions) {
    return positions.reduce((total, position) => {
        return total + (position.shares * position.currentPrice);
    }, 0);
}
/**
 * Calculate total portfolio cost basis
 */
function calculatePortfolioCost(positions) {
    return positions.reduce((total, position) => {
        return total + (position.shares * position.averageCost);
    }, 0);
}
/**
 * Calculate portfolio gain/loss
 */
function calculatePortfolioGainLoss(positions) {
    const totalValue = calculatePortfolioValue(positions);
    const totalCost = calculatePortfolioCost(positions);
    const gainLoss = totalValue - totalCost;
    const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;
    return { gainLoss, gainLossPercent };
}
/**
 * Calculate annual dividend income
 */
function calculateAnnualDividendIncome(positions) {
    return positions.reduce((total, position) => {
        const annualDividend = position.annualDividendPerShare || 0;
        return total + (position.shares * annualDividend);
    }, 0);
}
/**
 * Calculate portfolio dividend yield
 */
function calculatePortfolioDividendYield(positions) {
    const totalValue = calculatePortfolioValue(positions);
    const annualIncome = calculateAnnualDividendIncome(positions);
    return totalValue > 0 ? (annualIncome / totalValue) * 100 : 0;
}
/**
 * Calculate comprehensive portfolio summary
 */
function calculatePortfolioSummary(positions) {
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
function calculatePositionMetrics(position) {
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
    };
}
/**
 * Calculate sector allocation
 */
function calculateSectorAllocation(positions) {
    const totalValue = calculatePortfolioValue(positions);
    const sectorMap = new Map();
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
function calculateRiskMetrics(positions) {
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
