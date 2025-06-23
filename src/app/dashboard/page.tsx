"use client";
import { usePortfolio } from '../../context/PortfolioContext';
import DividendCard from '../../components/DividendCard';
import { useDividends } from '../../context/DividendsContext';
import Card from '../../components/Card';
import PortfolioSelector from '@/components/PortfolioSelector';
import MonthlyIncomeChart from '../../components/MonthlyIncomeChart';
import PortfolioCompositionChart from '../../components/PortfolioCompositionChart';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const { holdings } = usePortfolio();
  const { dividends } = useDividends();

  // --- Summary Calculations ---
  const totalPortfolioValue = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0);
  const totalCostBasis = holdings.reduce((sum, h) => sum + h.costBasis, 0);
  const totalGainLoss = totalPortfolioValue - totalCostBasis;
  const gainLossPercent = totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;
  const totalDividends = dividends.reduce((sum, d) => sum + d.amount, 0);
  const projectedAnnualIncome = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice * (h.dividendYield / 100), 0);
  const projectedDailyIncome = projectedAnnualIncome / 365;
  const projectedHourlyIncome = projectedAnnualIncome / (365 * 24);
  const avgYield = holdings.length > 0 ? (holdings.reduce((sum, h) => sum + h.dividendYield, 0) / holdings.length) : 0;
  const yieldOnCost = totalCostBasis > 0 ? (projectedAnnualIncome / totalCostBasis) * 100 : 0;
  // Projections
  const monthlyIncome = projectedAnnualIncome / 12;
  const quarterlyIncome = projectedAnnualIncome / 4;

  return (
    <main className="space-y-8">
      <PortfolioSelector />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio Overview</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DividendCard 
          title="Market Value" 
          value={`$${totalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          trend="up"
          meta={
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <TrendingUp size={16} />
              <span className="text-sm font-medium">+$14.69 (+0.03%)</span>
            </div>
          } 
        />
        
        <DividendCard 
          title="Cost Basis" 
          value={`$${totalCostBasis.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          trend="neutral"
          subtitle="Total invested"
        />
        
        <DividendCard 
          title="Total Gain/Loss" 
          value={`$${totalGainLoss.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          trend={totalGainLoss >= 0 ? "up" : "down"}
          meta={
            <div className={`flex items-center gap-1 ${totalGainLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {totalGainLoss >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="text-sm font-medium">
                {gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%
              </span>
            </div>
          } 
        />
        
        <DividendCard 
          title="Cash Available" 
          value="$257.44"
          trend="neutral"
          subtitle="Ready to invest"
        />
      </div>

      {/* Dividend Income Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DividendCard 
          title="Annual Dividend Income" 
          value={`$${projectedAnnualIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          trend="up"
          subtitle={`${avgYield.toFixed(2)}% average yield`}
          meta={
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <DollarSign size={16} />
              <span className="text-sm font-medium">Projected</span>
            </div>
          }
        />
        
        <DividendCard 
          title="Monthly Income" 
          value={`$${monthlyIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          trend="up"
          subtitle="Average per month"
        />
        
        <DividendCard 
          title="Yield on Cost" 
          value={`${yieldOnCost.toFixed(2)}%`}
          trend="up"
          subtitle="Return on investment"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <MonthlyIncomeChart holdings={holdings} />
        <PortfolioCompositionChart holdings={holdings} />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DividendCard 
          title="Daily Income" 
          value={`$${projectedDailyIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          trend="up"
          subtitle="Projected daily"
        />
        
        <DividendCard 
          title="Quarterly Income" 
          value={`$${quarterlyIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          trend="up"
          subtitle="Every 3 months"
        />
        
        <DividendCard 
          title="Holdings Count" 
          value={holdings.length.toString()}
          trend="neutral"
          subtitle="Total positions"
        />
      </div>
    </main>
  );
}
