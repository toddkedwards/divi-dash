"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, PieLabelRenderProps, LegendProps } from 'recharts';
import { useState } from 'react';
import { LineChart, Line } from 'recharts';
import { useToast } from './ToastProvider';
import Card from './Card';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import ProBadge from './ProBadge';

const COLORS = ['#3b82f6', '#fbbf24', '#10b981', '#6366f1', '#f472b6', '#f87171', '#34d399', '#818cf8', '#f59e42', '#a3e635'];

interface DividendHistory {
  exDate: string;
  paymentDate: string;
  amount: number;
  growth: number;
}

interface Holding {
  symbol: string;
  sector: string;
  dividendHistory: DividendHistory[];
  beta?: number;
  payoutRatio?: number;
  dividendGrowthRate?: number;
  yearsOfGrowth?: number;
}

function getTickerData(holdings: any[]) {
  return holdings.map((h: any) => ({ name: h.symbol, value: h.shares * h.currentPrice }));
}

function getSectorData(holdings: any[]) {
  const sectorMap: Record<string, number> = {};
  holdings.forEach((h: any) => {
    sectorMap[h.sector] = (sectorMap[h.sector] || 0) + h.shares * h.currentPrice;
  });
  return Object.entries(sectorMap).map(([name, value]) => ({ name, value }));
}

function getDividendOverTime(dividends: any[]) {
  // Group by month (YYYY-MM)
  const map: Record<string, number> = {};
  dividends.forEach((d: any) => {
    const month = d.date.slice(0, 7);
    map[month] = (map[month] || 0) + d.amount;
  });
  return Object.entries(map).map(([month, value]) => ({ month, value }));
}

function getDividendGrowthData(holdings: any[]) {
  return holdings
    .filter(h => h.dividendGrowthRate)
    .map(h => ({
      name: h.symbol,
      growthRate: h.dividendGrowthRate,
      yearsOfGrowth: h.yearsOfGrowth || 0
    }))
    .sort((a, b) => b.growthRate - a.growthRate);
}

function getYieldComparisonData(holdings: any[]) {
  return holdings.map(h => ({
    name: h.symbol,
    currentYield: h.dividendYield,
    yieldOnCost: (h.dividendYield * h.currentPrice) / h.avgPrice
  }));
}

function getProjectedIncomeData(holdings: any[]) {
  const months = 12;
  const data = [];
  const today = new Date();
  
  for (let i = 0; i < months; i++) {
    const month = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const monthStr = month.toISOString().slice(0, 7);
    let totalIncome = 0;
    
    holdings.forEach(h => {
      if (h.payoutFrequency === 'monthly') {
        totalIncome += h.shares * h.currentPrice * (h.dividendYield / 100) / 12;
      } else if (h.payoutFrequency === 'quarterly') {
        if (h.typicalPaymentMonth?.includes(month.getMonth())) {
          totalIncome += h.shares * h.currentPrice * (h.dividendYield / 100) / 4;
        }
      } else if (h.payoutFrequency === 'semi-annual') {
        if (h.typicalPaymentMonth?.includes(month.getMonth())) {
          totalIncome += h.shares * h.currentPrice * (h.dividendYield / 100) / 2;
        }
      } else if (h.payoutFrequency === 'annual') {
        if (h.typicalPaymentMonth?.includes(month.getMonth())) {
          totalIncome += h.shares * h.currentPrice * (h.dividendYield / 100);
        }
      }
    });
    
    data.push({ month: monthStr, value: totalIncome });
  }
  
  return data;
}

// Helper: Calculate total return (price appreciation + dividends)
function getTotalReturnData(holdings: any[], dividends: any[]) {
  return holdings.map(h => {
    const marketValue = h.shares * h.currentPrice;
    const costBasis = h.costBasis;
    const holdingDividends = dividends.filter(d => d.symbol === h.symbol).reduce((sum, d) => sum + d.amount, 0);
    const totalReturn = (marketValue + holdingDividends - costBasis);
    const totalReturnPct = costBasis > 0 ? (totalReturn / costBasis) * 100 : 0;
    return {
      name: h.symbol,
      totalReturn,
      totalReturnPct,
      marketValue,
      costBasis,
      dividends: holdingDividends
    };
  });
}

// Helper: Calculate annual dividend growth rate for the portfolio
function getPortfolioDividendGrowth(dividends: any[]) {
  // Group by year
  const map: Record<string, number> = {};
  dividends.forEach((d: any) => {
    const year = d.date.slice(0, 4);
    map[year] = (map[year] || 0) + d.amount;
  });
  // Sort by year
  const years = Object.keys(map).sort();
  const data = years.map((year, i) => {
    const prev = i > 0 ? map[years[i - 1]] : null;
    const growth = prev ? ((map[year] - prev) / prev) * 100 : null;
    return { year, value: map[year], growth };
  });
  return data;
}

// Helper: Calculate diversification score (Herfindahl-Hirschman Index, normalized)
function getDiversificationScore(holdings: any[]) {
  const sectorMap: Record<string, number> = {};
  const total = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0);
  holdings.forEach(h => {
    sectorMap[h.sector] = (sectorMap[h.sector] || 0) + h.shares * h.currentPrice;
  });
  const weights = Object.values(sectorMap).map(v => v / total);
  const hhi = weights.reduce((sum, w) => sum + w * w, 0);
  // Normalize: 1 = concentrated, 0 = perfectly diversified
  const score = 1 - hhi;
  return { score, hhi, sectorMap };
}

// Helper: Calculate volatility using standard deviation of returns
function calculateVolatility(holdings: Holding[]) {
  return holdings.map(h => {
    // Use dividend history to calculate returns
    const returns = h.dividendHistory
      .slice(0, 12) // Use last 12 periods
      .map((d: DividendHistory, i: number, arr: DividendHistory[]) => {
        if (i === 0) return 0;
        return ((d.amount - arr[i-1].amount) / arr[i-1].amount) * 100;
      })
      .filter((r: number) => !isNaN(r));

    // Calculate standard deviation
    const mean = returns.reduce((a: number, b: number) => a + b, 0) / returns.length;
    const variance = returns.reduce((a: number, b: number) => a + Math.pow(b - mean, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance);

    return {
      name: h.symbol,
      volatility,
      beta: h.beta ?? null,
      sector: h.sector
    };
  });
}

// Helper: Calculate sector correlation matrix using returns
function calculateSectorCorrelation(holdings: Holding[]) {
  const sectors = Array.from(new Set(holdings.map(h => h.sector)));
  const sectorReturns: Record<string, number[]> = {};
  
  // Initialize sector returns arrays
  sectors.forEach(sector => {
    sectorReturns[sector] = [];
  });

  // Calculate returns for each sector
  holdings.forEach(h => {
    const returns = h.dividendHistory
      .slice(0, 12)
      .map((d: DividendHistory, i: number, arr: DividendHistory[]) => {
        if (i === 0) return 0;
        return ((d.amount - arr[i-1].amount) / arr[i-1].amount) * 100;
      })
      .filter((r: number) => !isNaN(r));

    // Add returns to sector array
    returns.forEach((r: number, i: number) => {
      if (!sectorReturns[h.sector][i]) {
        sectorReturns[h.sector][i] = 0;
      }
      sectorReturns[h.sector][i] += r;
    });
  });

  // Calculate correlation matrix
  const matrix = sectors.map(rowSector =>
    sectors.map(colSector => {
      if (rowSector === colSector) return 1;
      
      const rowReturns = sectorReturns[rowSector];
      const colReturns = sectorReturns[colSector];
      
      // Calculate correlation coefficient
      const meanRow = rowReturns.reduce((a, b) => a + b, 0) / rowReturns.length;
      const meanCol = colReturns.reduce((a, b) => a + b, 0) / colReturns.length;
      
      const covariance = rowReturns.reduce((sum, r, i) => 
        sum + (r - meanRow) * (colReturns[i] - meanCol), 0) / rowReturns.length;
      
      const stdRow = Math.sqrt(rowReturns.reduce((sum, r) => 
        sum + Math.pow(r - meanRow, 2), 0) / rowReturns.length);
      const stdCol = Math.sqrt(colReturns.reduce((sum, r) => 
        sum + Math.pow(r - meanCol, 2), 0) / colReturns.length);
      
      return covariance / (stdRow * stdCol);
    })
  );

  return { sectors, matrix };
}

// Helper: Calculate dividend sustainability score
function calculateSustainabilityScore(holdings: any[]) {
  return holdings.map(h => {
    const payoutRatio = h.payoutRatio ?? 0;
    const growthRate = h.dividendGrowthRate ?? 0;
    const yearsOfGrowth = h.yearsOfGrowth ?? 0;
    
    // Calculate sustainability score (0-100)
    let score = 100;
    
    // Penalize high payout ratios
    if (payoutRatio > 80) score -= 30;
    else if (payoutRatio > 60) score -= 15;
    else if (payoutRatio > 40) score -= 5;
    
    // Reward consistent growth
    score += Math.min(yearsOfGrowth * 2, 20);
    
    // Reward higher growth rates
    score += Math.min(growthRate, 10);
    
    // Cap score at 100
    score = Math.min(Math.max(score, 0), 100);
    
    return {
      name: h.symbol,
      score,
      payoutRatio,
      growthRate,
      yearsOfGrowth,
      riskLevel: score < 50 ? 'high' : score < 75 ? 'medium' : 'low'
    };
  });
}

// Helper: Calculate additional risk metrics
function calculateAdvancedRiskMetrics(holdings: Holding[]) {
  return holdings.map(h => {
    const returns = h.dividendHistory
      .slice(0, 12)
      .map((d: DividendHistory, i: number, arr: DividendHistory[]) => {
        if (i === 0) return 0;
        return ((d.amount - arr[i-1].amount) / arr[i-1].amount) * 100;
      })
      .filter((r: number) => !isNaN(r));

    // Calculate standard deviation
    const mean = returns.reduce((a: number, b: number) => a + b, 0) / returns.length;
    const variance = returns.reduce((a: number, b: number) => a + Math.pow(b - mean, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance);

    // Calculate maximum drawdown
    let maxDrawdown = 0;
    let peak = returns[0];
    returns.forEach((r: number) => {
      if (r > peak) peak = r;
      const drawdown = (peak - r) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    });

    // Calculate Sharpe ratio (assuming risk-free rate of 2%)
    const riskFreeRate = 2;
    const sharpeRatio = (mean - riskFreeRate) / volatility;

    // Calculate Sortino ratio (using negative returns only)
    const negativeReturns = returns.filter((r: number) => r < 0);
    const downsideDeviation = Math.sqrt(
      negativeReturns.reduce((sum: number, r: number) => sum + Math.pow(r - mean, 2), 0) / negativeReturns.length
    );
    const sortinoRatio = (mean - riskFreeRate) / downsideDeviation;

    return {
      name: h.symbol,
      volatility,
      beta: h.beta ?? null,
      maxDrawdown: maxDrawdown * 100, // Convert to percentage
      sharpeRatio,
      sortinoRatio,
      sector: h.sector
    };
  });
}

// Helper: Calculate enhanced sector correlation matrix
function calculateEnhancedSectorCorrelation(holdings: Holding[]) {
  const sectors = Array.from(new Set(holdings.map(h => h.sector)));
  const sectorReturns: Record<string, number[]> = {};
  const sectorVolatility: Record<string, number> = {};
  const sectorBeta: Record<string, number> = {};
  
  // Initialize sector data
  sectors.forEach(sector => {
    sectorReturns[sector] = [];
    sectorVolatility[sector] = 0;
    sectorBeta[sector] = 0;
  });

  // Calculate returns and metrics for each sector
  holdings.forEach(h => {
    const returns = h.dividendHistory
      .slice(0, 12)
      .map((d: DividendHistory, i: number, arr: DividendHistory[]) => {
        if (i === 0) return 0;
        return ((d.amount - arr[i-1].amount) / arr[i-1].amount) * 100;
      })
      .filter((r: number) => !isNaN(r));

    // Add returns to sector array
    returns.forEach((r: number, i: number) => {
      if (!sectorReturns[h.sector][i]) {
        sectorReturns[h.sector][i] = 0;
      }
      sectorReturns[h.sector][i] += r;
    });

    // Update sector volatility and beta
    if (h.beta) {
      sectorBeta[h.sector] = (sectorBeta[h.sector] || 0) + h.beta;
    }
  });

  // Calculate correlation matrix and sector metrics
  const matrix = sectors.map(rowSector =>
    sectors.map(colSector => {
      if (rowSector === colSector) return 1;
      
      const rowReturns = sectorReturns[rowSector];
      const colReturns = sectorReturns[colSector];
      
      // Calculate correlation coefficient
      const meanRow = rowReturns.reduce((a, b) => a + b, 0) / rowReturns.length;
      const meanCol = colReturns.reduce((a, b) => a + b, 0) / colReturns.length;
      
      const covariance = rowReturns.reduce((sum, r, i) => 
        sum + (r - meanRow) * (colReturns[i] - meanCol), 0) / rowReturns.length;
      
      const stdRow = Math.sqrt(rowReturns.reduce((sum, r) => 
        sum + Math.pow(r - meanRow, 2), 0) / rowReturns.length);
      const stdCol = Math.sqrt(colReturns.reduce((sum, r) => 
        sum + Math.pow(r - meanCol, 2), 0) / colReturns.length);
      
      return covariance / (stdRow * stdCol);
    })
  );

  // Calculate sector metrics
  const sectorMetrics = sectors.map(sector => {
    const returns = sectorReturns[sector];
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const volatility = Math.sqrt(
      returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length
    );
    const beta = sectorBeta[sector] / holdings.filter(h => h.sector === sector).length;

    return {
      sector,
      volatility,
      beta,
      meanReturn: mean
    };
  });

  return { sectors, matrix, sectorMetrics };
}

// Helper: Calculate enhanced dividend sustainability score
function calculateEnhancedSustainabilityScore(holdings: Holding[]) {
  return holdings.map(h => {
    const payoutRatio = h.payoutRatio ?? 0;
    const growthRate = h.dividendGrowthRate ?? 0;
    const yearsOfGrowth = h.yearsOfGrowth ?? 0;
    
    // Calculate base sustainability score (0-100)
    let score = 100;
    
    // Payout ratio analysis
    if (payoutRatio > 80) score -= 30;
    else if (payoutRatio > 60) score -= 15;
    else if (payoutRatio > 40) score -= 5;
    
    // Growth consistency analysis
    score += Math.min(yearsOfGrowth * 2, 20);
    
    // Growth rate analysis
    score += Math.min(growthRate, 10);
    
    // Dividend history analysis
    const recentGrowth = h.dividendHistory
      .slice(0, 4)
      .map((d, i, arr) => i === 0 ? 0 : ((d.amount - arr[i-1].amount) / arr[i-1].amount) * 100)
      .filter(r => !isNaN(r));
    
    const growthConsistency = recentGrowth.every(r => r > 0) ? 10 : 0;
    score += growthConsistency;
    
    // Volatility analysis
    const volatility = Math.sqrt(
      recentGrowth.reduce((sum, r) => sum + Math.pow(r - (recentGrowth.reduce((a, b) => a + b, 0) / recentGrowth.length), 2), 0) / recentGrowth.length
    );
    if (volatility > 10) score -= 10;
    else if (volatility > 5) score -= 5;
    
    // Cap score at 100
    score = Math.min(Math.max(score, 0), 100);
    
    return {
      name: h.symbol,
      score,
      payoutRatio,
      growthRate,
      yearsOfGrowth,
      growthConsistency,
      volatility,
      riskLevel: score < 50 ? 'high' : score < 75 ? 'medium' : 'low',
      riskFactors: [
        payoutRatio > 80 ? 'High payout ratio' : null,
        volatility > 10 ? 'High volatility' : null,
        growthRate < 2 ? 'Low growth rate' : null,
        yearsOfGrowth < 5 ? 'Short growth history' : null
      ].filter(Boolean)
    };
  });
}

// Custom label for Pie slices: show ticker and percent only if slice is big enough
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: PieLabelRenderProps) => {
  if (!percent || percent < 0.06) return null; // Hide labels for very small slices
  const RADIAN = Math.PI / 180;
  const nCx = Number(cx);
  const nCy = Number(cy);
  const nInner = Number(innerRadius);
  const nOuter = Number(outerRadius);
  const nMid = Number(midAngle);
  const radius = nInner + (nOuter - nInner) * 1.35;
  const x = nCx + radius * Math.cos(-nMid * RADIAN);
  const y = nCy + radius * Math.sin(-nMid * RADIAN);
  return (
    <text x={x} y={y} fill="#222" textAnchor={x > nCx ? 'start' : 'end'} dominantBaseline="central" fontSize={14} fontWeight={600}>
      {name}: {(percent * 100).toFixed(1)}%
    </text>
  );
};

// Custom legend for PieChart
const renderCustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-4">
      {payload?.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-sm text-gray-600 dark:text-gray-300">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function ChartsSection({ holdings, dividends }: { holdings: any[]; dividends: any[] }) {
  const tickerData = getTickerData(holdings);
  const sectorData = getSectorData(holdings);
  const dividendData = getDividendOverTime(dividends);
  const growthData = getDividendGrowthData(holdings);
  const yieldData = getYieldComparisonData(holdings);
  const projectedData = getProjectedIncomeData(holdings);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [sectorChartType, setSectorChartType] = useState<'pie' | 'bar'>('pie');
  const toastContext = useToast();
  const isProUser = false; // TODO: Replace with real check
  const totalReturnData = getTotalReturnData(holdings, dividends);
  const portfolioGrowthData = getPortfolioDividendGrowth(dividends);
  const diversification = getDiversificationScore(holdings);
  const volatilityData = calculateVolatility(holdings);
  const sectorCorr = calculateSectorCorrelation(holdings);
  const sustainabilityData = calculateSustainabilityScore(holdings);
  const advancedRiskData = calculateAdvancedRiskMetrics(holdings);
  const enhancedSectorCorr = calculateEnhancedSectorCorrelation(holdings);
  const enhancedSustainabilityData = calculateEnhancedSustainabilityScore(holdings);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Basic Charts */}
      <Card className="flex-1 min-w-[320px] bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-sm rounded-2xl p-6 flex flex-col">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-blue-100 mb-2">Asset Allocation by Ticker</h3>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={tickerData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={renderPieLabel}
              >
                {tickerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend content={renderCustomLegend} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Pro Charts */}
      <Card className="flex-1 min-w-[320px] bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-sm rounded-2xl p-6 flex flex-col relative">
        <div className="absolute top-4 right-4 z-10"><ProBadge /></div>
        {!isProUser && (
          <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 flex flex-col items-center justify-center z-20 cursor-pointer" onClick={() => toastContext.toast({ title: 'Pro Feature', description: 'Upgrade to Divly Pro to unlock advanced analytics!', variant: 'default' })}>
            <div className="flex flex-col items-center">
              <ProBadge />
              <span className="mt-2 text-gray-700 dark:text-gray-200 font-semibold">Pro Only</span>
            </div>
          </div>
        )}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-blue-100 mb-2">Diversification Score</h3>
        <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">{(diversification.score * 100).toFixed(1)}%</div>
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">(0% = concentrated, 100% = perfectly diversified)</div>
        <div className="w-full mt-2">
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={Object.entries(diversification.sectorMap).map(([name, value]) => ({ name, value }))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={40} label>
                {Object.keys(diversification.sectorMap).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="flex-1 min-w-[320px] bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-sm rounded-2xl p-6 flex flex-col relative">
        <div className="absolute top-4 right-4 z-10"><ProBadge /></div>
        {!isProUser && (
          <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 flex flex-col items-center justify-center z-20 cursor-pointer" onClick={() => toastContext.toast({ title: 'Pro Feature', description: 'Upgrade to Divly Pro to unlock advanced analytics!', variant: 'default' })}>
            <div className="flex flex-col items-center">
              <ProBadge />
              <span className="mt-2 text-gray-700 dark:text-gray-200 font-semibold">Pro Only</span>
            </div>
          </div>
        )}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-blue-100 mb-2">Volatility Analysis</h3>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volatilityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="volatility" fill="#fbbf24" name="Volatility (%)" />
              <Bar dataKey="beta" fill="#3b82f6" name="Beta" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="flex-1 min-w-[400px] bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-sm rounded-2xl p-6 flex flex-col relative">
        <div className="absolute top-4 right-4 z-10"><ProBadge /></div>
        {!isProUser && (
          <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 flex flex-col items-center justify-center z-20 cursor-pointer" onClick={() => toastContext.toast({ title: 'Pro Feature', description: 'Upgrade to Divly Pro to unlock advanced analytics!', variant: 'default' })}>
            <div className="flex flex-col items-center">
              <ProBadge />
              <span className="mt-2 text-gray-700 dark:text-gray-200 font-semibold">Pro Only</span>
            </div>
          </div>
        )}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-blue-100 mb-2">Sector Correlation Matrix</h3>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectorCorr.matrix.map((row, i) => ({ name: sectorCorr.sectors[i], ...row }))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {sectorCorr.sectors.map((sector, i) => (
                <Bar key={sector} dataKey={sector} fill={COLORS[i % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="flex-1 min-w-[400px] bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-sm rounded-2xl p-6 flex flex-col relative">
        <div className="absolute top-4 right-4 z-10"><ProBadge /></div>
        {!isProUser && (
          <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 flex flex-col items-center justify-center z-20 cursor-pointer" onClick={() => toastContext.toast({ title: 'Pro Feature', description: 'Upgrade to Divly Pro to unlock advanced analytics!', variant: 'default' })}>
            <div className="flex flex-col items-center">
              <ProBadge />
              <span className="mt-2 text-gray-700 dark:text-gray-200 font-semibold">Pro Only</span>
            </div>
          </div>
        )}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-blue-100 mb-2">Advanced Risk Metrics</h3>
        <div className="w-full h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={advancedRiskData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="volatility" fill="#fbbf24" name="Volatility (%)" />
              <Bar dataKey="maxDrawdown" fill="#ef4444" name="Max Drawdown (%)" />
              <Bar dataKey="sharpeRatio" fill="#3b82f6" name="Sharpe Ratio" />
              <Bar dataKey="sortinoRatio" fill="#10b981" name="Sortino Ratio" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300 mt-4">
          Advanced risk metrics including volatility, maximum drawdown, Sharpe ratio, and Sortino ratio.
        </div>
      </Card>

      <Card className="flex-1 min-w-[400px] bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-sm rounded-2xl p-6 flex flex-col relative">
        <div className="absolute top-4 right-4 z-10"><ProBadge /></div>
        {!isProUser && (
          <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 flex flex-col items-center justify-center z-20 cursor-pointer" onClick={() => toastContext.toast({ title: 'Pro Feature', description: 'Upgrade to Divly Pro to unlock advanced analytics!', variant: 'default' })}>
            <div className="flex flex-col items-center">
              <ProBadge />
              <span className="mt-2 text-gray-700 dark:text-gray-200 font-semibold">Pro Only</span>
            </div>
          </div>
        )}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-blue-100 mb-2">Dividend Sustainability</h3>
        <div className="w-full h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sustainabilityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sustainabilityScore" fill="#10b981" name="Sustainability Score" />
              <Bar dataKey="payoutRatio" fill="#fbbf24" name="Payout Ratio (%)" />
              <Bar dataKey="growthRate" fill="#3b82f6" name="Growth Rate (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300 mt-4">
          Dividend sustainability analysis based on payout ratio, growth rate, and years of growth.
        </div>
      </Card>
    </div>
  );
} 