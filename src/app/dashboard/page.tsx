"use client";
import { usePortfolio } from '../../context/PortfolioContext';
import DividendCard from '../../components/DividendCard';
import { useDividends } from '../../context/DividendsContext';
import Card from '../../components/Card';
import PortfolioSelector from '@/components/PortfolioSelector';

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
    <main>
      <PortfolioSelector />
      <h1 className="mb-8">Portfolio</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mb-10 md:mb-16">
        <Card>
          <DividendCard 
            title="Total Portfolio Value" 
            value={`$${totalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} 
            meta={<span className="text-green-600 dark:text-green-400 text-sm">+$14.69 (+0.03%) Today</span>} 
          />
        </Card>
        <Card>
          <DividendCard 
            title="Projected Annual Income" 
            value={`$${projectedAnnualIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} 
            meta={<span className="text-green-600 dark:text-green-400 text-sm">+{avgYield.toFixed(2)}% Current Yield</span>} 
          />
        </Card>
        <Card>
          <DividendCard title="Total Cost Basis" value={`$${totalCostBasis.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
        </Card>
        <Card>
          <DividendCard title="Projected Daily Income" value={`$${projectedDailyIncome.toLocaleString(undefined, { maximumFractionDigits: 4 })}`} />
        </Card>
        <Card>
          <DividendCard title="Projected Hourly Income" value={`$${projectedHourlyIncome.toLocaleString(undefined, { maximumFractionDigits: 6 })}`} />
        </Card>
        <Card>
          <DividendCard 
            title="Total Gain / Loss" 
            value={`$${totalGainLoss.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} 
            meta={<span className={`${totalGainLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} text-sm`}>{gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}% Overall</span>} 
          />
        </Card>
        <Card>
          <DividendCard title="Yield on Cost" value={`${yieldOnCost.toFixed(2)}%`} />
        </Card>
      </div>
      <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded mb-8 md:mb-12" />
      <Card className="mb-8 md:mb-12">
        <h2 className="mb-4">Dividend Income Projections</h2>
        <div className="text-base text-gray-600 dark:text-gray-300 mb-4">
          Estimated income based on current holdings and dividend rates.
        </div>
        <div className="flex gap-10 text-lg font-semibold">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Monthly</div>
            ${monthlyIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Quarterly</div>
            ${quarterlyIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Annually</div>
            ${projectedAnnualIncome.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
      </Card>
    </main>
  );
}
