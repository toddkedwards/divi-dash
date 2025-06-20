"use client";
import { usePortfolio } from '../../context/PortfolioContext';
import { useDividends } from '../../context/DividendsContext';
import ChartsSection from '../../components/ChartsSection';
import MonthlyIncomeChart from '../../components/MonthlyIncomeChart';
import Card from '../../components/Card';
import PortfolioSelector from '@/components/PortfolioSelector';

export default function PortfolioInsightsPage() {
  const { holdings } = usePortfolio();
  const { dividends } = useDividends();

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <PortfolioSelector />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Portfolio Insights</h1>
      
      <MonthlyIncomeChart holdings={holdings} />
      
      <Card>
        <ChartsSection holdings={holdings} dividends={dividends} />
      </Card>
    </main>
  );
} 