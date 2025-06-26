"use client";

import { useState, useEffect, useRef } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { searchStocks, getStockQuote, getStockProfile, getStockCandles } from "@/utils/finnhub";
import { getHoldings, saveHolding } from "@/utils/holdingsLocal";
import { companyInfo } from "@/utils/companyLogos";
import { getDividends } from "@/utils/finnhub";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { getStockMetrics, getFinancials, getRecommendations } from "@/utils/finnhub";
import { getEarnings, getEarningsCalendar } from "@/utils/finnhub";
import { useToast } from '@/components/ToastProvider';
import { usePortfolio } from '@/context/PortfolioContext';
import { useWatchlist } from '@/context/WatchlistContext';
import { getTechnicalIndicators, getCompanyOverview, getSectorPerformance } from '@/utils/alphaVantage';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters';

interface StockResult {
  symbol: string;
  description: string;
}

interface StockProfile {
  description: string;
  finnhubIndustry: string;
  logo: string;
  country: string;
  weburl: string;
  dividendYield: number;
}

interface StockQuote {
  price: number;
}

interface Dividend {
  amount: number;
  exDate: string;
}

export default function StockTickerFinderPage() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StockResult[]>([]);
  const [selected, setSelected] = useState<{
    symbol: string;
    name: string;
    sector: string;
    price: number;
    yield: number;
    logo: string | null;
    marketCap: string;
    country: string;
    weburl: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ shares: "", costBasis: "" });
  const [dividendHistory, setDividendHistory] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'1d'|'5d'|'1m'|'6m'|'ytd'|'1y'|'5y'|'all'>('1m');
  const [metrics, setMetrics] = useState<any>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [financials, setFinancials] = useState<any>(null);
  const [financialsLoading, setFinancialsLoading] = useState(false);
  const [financialsError, setFinancialsError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState<string | null>(null);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [earningsLoading, setEarningsLoading] = useState(false);
  const [earningsError, setEarningsError] = useState<string | null>(null);
  const [earningsCalendar, setEarningsCalendar] = useState<any[]>([]);
  const [earningsCalendarLoading, setEarningsCalendarLoading] = useState(false);
  const [earningsCalendarError, setEarningsCalendarError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'annual' | 'quarterly'>('quarterly');
  const { holdings } = usePortfolio();
  const { watchlist, addToWatchlist } = useWatchlist();
  const [technicalIndicators, setTechnicalIndicators] = useState<any>(null);
  const [companyOverview, setCompanyOverview] = useState<any>(null);
  const [dividendMetrics, setDividendMetrics] = useState<any>(null);
  const [sectorPerformance, setSectorPerformance] = useState<any>(null);
  const [loadingIndicators, setLoadingIndicators] = useState(false);
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [loadingSector, setLoadingSector] = useState(false);
  const [profile, setProfile] = useState<StockProfile | null>(null);
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [dividends, setDividends] = useState<Dividend[] | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<'SMA' | 'EMA' | 'RSI' | 'MACD'>('SMA');
  const [dividendGrowthData, setDividendGrowthData] = useState<any[]>([]);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [suggestions, setSuggestions] = useState<StockResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const timeframeOptions = [
    { label: '1D', value: '1d' },
    { label: '5D', value: '5d' },
    { label: '1M', value: '1m' },
    { label: '6M', value: '6m' },
    { label: 'YTD', value: 'ytd' },
    { label: '1Y', value: '1y' },
    { label: '5Y', value: '5y' },
    { label: 'All', value: 'all' },
  ];

  // Debounced live search suggestions
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await searchStocks(query);
        setSuggestions(data.result.filter((r: any) => r.symbol && r.description));
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [query]);

  async function handleSearch() {
    setLoading(true);
    setError(null);
    setSelected(null);
    try {
      const data = await searchStocks(query);
      setResults(data.result.filter((r: any) => r.symbol && r.description));
      setShowSuggestions(false);
    } catch (e: any) {
      setError(e.message || "Failed to search stocks");
    } finally {
      setLoading(false);
    }
  }

  function handleSuggestionClick(symbol: string, description: string) {
    setQuery(symbol);
    setShowSuggestions(false);
    setResults([{ symbol, description }]);
    handleSearch();
  }

  const handleSelect = async (symbol: string) => {
    setSelected(null);
    setLoading(true);
    setError(null);
    setProfile(null);
    setQuote(null);
    setDividends(null);
    setTechnicalIndicators(null);
    setCompanyOverview(null);
    setSectorPerformance(null);

    try {
      const [profileData, quoteData, dividendsData, technicalData, overviewData, sectorData] = await Promise.all([
        getStockProfile(symbol),
        getStockQuote(symbol),
        getDividends(symbol, 'daily', 'all'),
        getTechnicalIndicators(symbol, 'daily'),
        getCompanyOverview(symbol),
        getSectorPerformance()
      ]);

      setSelected({
        symbol,
        name: profileData.description,
        sector: profileData.finnhubIndustry || "N/A",
        price: quoteData.price,
        yield: profileData.dividendYield,
        logo: profileData.logo || (companyInfo[symbol]?.logo ?? null),
        marketCap: overviewData.MarketCapitalization,
        country: profileData.country,
        weburl: profileData.weburl,
      });

      setProfile(profileData);
      setQuote(quoteData);
      setDividends(dividendsData);
      setTechnicalIndicators(technicalData);
      setCompanyOverview(overviewData);
      setSectorPerformance(sectorData);

      // Fetch chart data
      fetchChartData(symbol, timeframe);

      if (dividendsData && dividendsData.length > 1) {
        // Calculate dividend growth per year
        const growth = dividendsData.reduce((acc: any[], curr: Dividend, idx: number, arr: Dividend[]) => {
          if (idx === 0) return acc;
          const prev = arr[idx - 1];
          const year = new Date(curr.exDate).getFullYear();
          const prevYear = new Date(prev.exDate).getFullYear();
          if (year !== prevYear) {
            acc.push({
              year,
              amount: curr.amount,
              growth: ((curr.amount - prev.amount) / prev.amount) * 100
            });
          }
          return acc;
        }, [] as { year: number; amount: number; growth: number }[]);
        setDividendGrowthData(growth);
      } else {
        setDividendGrowthData([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
      toast({
        title: 'Error',
        description: 'Failed to fetch stock data. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  async function fetchChartData(symbol: string, tf: typeof timeframe) {
    setChartLoading(true);
    setChartError(null);
    try {
      const now = Math.floor(Date.now() / 1000);
      let from;
      let resolution;
      const yearStart = new Date(new Date().getFullYear(), 0, 1).getTime() / 1000;
      switch (tf) {
        case '1d':
          from = now - 60 * 60 * 24;
          resolution = '5';
          break;
        case '5d':
          from = now - 60 * 60 * 24 * 5;
          resolution = '15';
          break;
        case '1m':
          from = now - 60 * 60 * 24 * 30;
          resolution = '30';
          break;
        case '6m':
          from = now - 60 * 60 * 24 * 30 * 6;
          resolution = 'D';
          break;
        case 'ytd':
          from = yearStart;
          resolution = 'D';
          break;
        case '1y':
          from = now - 60 * 60 * 24 * 365;
          resolution = 'D';
          break;
        case '5y':
          from = now - 60 * 60 * 24 * 365 * 5;
          resolution = 'W';
          break;
        case 'all':
          from = now - 60 * 60 * 24 * 365 * 20;
          resolution = 'M';
          break;
        default:
          from = now - 60 * 60 * 24 * 30;
          resolution = '30';
      }
      const data = await getStockCandles(symbol, resolution, from, now);
      if (data.s !== 'ok') throw new Error('No chart data');
      // Map to chart format
      const chart = data.t.map((t: number, i: number) => ({
        date: new Date(t * 1000).toLocaleDateString(),
        close: data.c[i],
        high: data.h[i],
        low: data.l[i],
        open: data.o[i],
        volume: data.v[i],
      }));
      setChartData(chart);
    } catch (e: any) {
      setChartError(e.message || 'Failed to load chart');
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  }

  // Fetch chart data when selected or timeframe changes
  useEffect(() => {
    if (selected) {
      fetchChartData(selected.symbol, timeframe);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, timeframe]);

  // Fetch metrics, financials, recommendations when selected changes
  useEffect(() => {
    if (!selected) return;
    setMetricsLoading(true);
    setMetricsError(null);
    setFinancialsLoading(true);
    setFinancialsError(null);
    setRecommendationsLoading(true);
    setRecommendationsError(null);
    getStockMetrics(selected.symbol)
      .then(data => setMetrics(data.metric))
      .catch(e => setMetricsError(e.message || 'Failed to fetch metrics'))
      .finally(() => setMetricsLoading(false));
    getFinancials(selected.symbol)
      .then(data => setFinancials(data.data ? data.data[0] : null))
      .catch(e => setFinancialsError(e.message || 'Failed to fetch financials'))
      .finally(() => setFinancialsLoading(false));
    getRecommendations(selected.symbol)
      .then(data => setRecommendations(data))
      .catch(e => setRecommendationsError(e.message || 'Failed to fetch recommendations'))
      .finally(() => setRecommendationsLoading(false));
  }, [selected]);

  // Fetch earnings and events when selected changes
  useEffect(() => {
    if (!selected) return;
    setEarningsLoading(true);
    setEarningsError(null);
    setEarningsCalendarLoading(true);
    setEarningsCalendarError(null);
    getEarnings(selected.symbol)
      .then(data => setEarnings(data))
      .catch(e => setEarningsError(e.message || 'Failed to fetch earnings'))
      .finally(() => setEarningsLoading(false));
    getEarningsCalendar(selected.symbol)
      .then(data => setEarningsCalendar(data.earningsCalendar || []))
      .catch(e => setEarningsCalendarError(e.message || 'Failed to fetch earnings calendar'))
      .finally(() => setEarningsCalendarLoading(false));
  }, [selected]);

  function handleAddToPortfolio() {
    if (!selected) {
      toast({
        title: 'Error',
        description: 'No stock selected',
        variant: 'destructive'
      });
      return;
    }
    if (!addForm.shares || !addForm.costBasis) {
      toast({
        title: 'Error',
        description: 'Please enter shares and cost basis',
        variant: 'destructive'
      });
      return;
    }
    const newHolding = {
      symbol: selected.symbol,
      shares: Number(addForm.shares),
      avgPrice: Number(addForm.costBasis),
      dividendYield: selected.yield ?? 0,
      costBasis: Number(addForm.shares) * Number(addForm.costBasis),
      sector: selected.sector,
      currentPrice: selected.price,
      payoutFrequency: 'quarterly' as const,
      lastExDate: '',
      lastPaymentDate: '',
      nextExDate: '',
      nextPaymentDate: '',
      dividendHistory: [],
    };
    saveHolding(newHolding);
    setShowAdd(false);
    setAddForm({ shares: "", costBasis: "" });
    toast({
      title: 'Success',
      description: `Added ${selected.symbol} to portfolio!`,
      variant: 'success'
    });
  }

  return (
    <main className="max-w-3xl mx-auto my-10 px-4 bg-white dark:bg-[#0a1629] min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Stock Ticker Finder</h1>
      <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-sm rounded-2xl p-8 mb-12 flex flex-col gap-8">
        <div className="mb-4 flex gap-2 items-center relative">
          <input
            className="w-full border rounded px-3 py-2 text-black dark:text-white bg-white dark:bg-zinc-900 font-bold focus:ring-2 focus:ring-green-400 focus:outline-none transition"
            type="text"
            placeholder="Search by ticker or company name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            autoComplete="off"
          />
          <Button type="button" onClick={handleSearch}>Search</Button>
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-b-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {suggestions.slice(0, 10).map((s, i) => (
                <li
                  key={s.symbol + i}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800"
                  onClick={() => handleSuggestionClick(s.symbol, s.description)}
                >
                  <span className="font-bold text-green-700 dark:text-green-400">{s.symbol}</span>
                  <span className="ml-2 text-gray-700 dark:text-gray-200">{s.description}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Cleaned up search results */}
        {results.length > 0 && (
          <div className="flex flex-col gap-4">
            {results.map((r, i) => (
              <div key={r.symbol + i} className="flex items-center justify-between bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-4 py-3 shadow-sm">
                <div>
                  <span className="font-bold text-green-700 dark:text-green-400">{r.symbol}</span>
                  <span className="ml-2 text-gray-700 dark:text-gray-200">{r.description}</span>
                </div>
                <Button type="button" onClick={() => addToWatchlist(r.symbol)} className="ml-4">Add to Watchlist</Button>
              </div>
            ))}
          </div>
        )}
      </div>
      {selected && (
        <Card className="mt-6">
          <div className="flex items-center gap-4 mb-4">
            {selected.logo && (
              <img src={selected.logo} alt={selected.symbol} className="h-12 w-12 rounded-full object-contain border border-gray-200 bg-white" />
            )}
            <div>
              <div className="text-2xl font-bold flex items-center gap-2">
                {selected.name} <span className="text-gray-500 text-lg">({selected.symbol})</span>
              </div>
              <div className="text-sm text-gray-500">{selected.sector}</div>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex gap-2 mb-2">
              {timeframeOptions.map(opt => (
                <Button
                  key={opt.value}
                  variant={timeframe === opt.value ? 'primary' : 'secondary'}
                  onClick={() => setTimeframe(opt.value as typeof timeframe)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
            {chartLoading && <div className="text-blue-500">Loading chart...</div>}
            {chartError && <div className="text-red-500">{chartError}</div>}
            {!chartLoading && !chartError && chartData.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" minTickGap={30} />
                  <YAxis tickFormatter={(value: number) => formatCurrency(value)} />
                  <Tooltip formatter={(value: any, name?: any, props?: any) => formatCurrency(value)} />
                  <Line type="monotone" dataKey="close" stroke="#3b82f6" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          {/* Price, yield, market cap, country, website row */}
          <div className="flex flex-wrap gap-6 mb-6 items-center border-b pb-4 border-gray-100">
            <div className="text-lg font-semibold text-blue-700">${selected.price}</div>
            <div className="text-sm text-gray-700">Dividend Yield: <span className="font-semibold">{selected.yield ? selected.yield + '%' : 'N/A'}</span></div>
            <div className="text-sm text-gray-700">Market Cap: <span className="font-semibold">{selected.marketCap ? `$${selected.marketCap}B` : 'N/A'}</span></div>
            <div className="text-sm text-gray-700">Country: <span className="font-semibold">{selected.country || 'N/A'}</span></div>
            {selected.weburl && (
              <div className="text-sm"><a href={selected.weburl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Website</a></div>
            )}
          </div>
          {/* Key Statistics Section */}
          <div className="mb-6">
            <div className="text-lg font-semibold mb-2">Key Statistics</div>
            {metricsLoading ? (
              <div className="text-blue-500">Loading key statistics...</div>
            ) : metricsError ? (
              <div className="text-red-500">{metricsError}</div>
            ) : metrics ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm bg-gray-50 rounded-lg p-4">
                <div><span className="font-medium">Day Range:</span> {metrics['dayLow'] && metrics['dayHigh'] ? `${metrics['dayLow']} - ${metrics['dayHigh']}` : 'N/A'}</div>
                <div><span className="font-medium">52W Range:</span> {metrics['52WeekLow'] && metrics['52WeekHigh'] ? `${metrics['52WeekLow']} - ${metrics['52WeekHigh']}` : 'N/A'}</div>
                <div><span className="font-medium">Market Cap:</span> {metrics['marketCapitalization'] ? `$${Number(metrics['marketCapitalization']).toLocaleString()}B` : 'N/A'}</div>
                <div><span className="font-medium">Volume:</span> {metrics['volume'] ? Number(metrics['volume']).toLocaleString() : 'N/A'}</div>
                <div><span className="font-medium">Avg Volume:</span> {metrics['10DayAverageTradingVolume'] ? Number(metrics['10DayAverageTradingVolume']).toLocaleString() : 'N/A'}</div>
                <div><span className="font-medium">P/E Ratio:</span> {metrics['peBasicExclExtraTTM'] ?? 'N/A'}</div>
                <div><span className="font-medium">EPS (TTM):</span> {metrics['epsInclExtraItemsTTM'] ?? 'N/A'}</div>
                <div><span className="font-medium">Dividend Yield:</span> {metrics['dividendYieldIndicatedAnnual'] ? `${metrics['dividendYieldIndicatedAnnual']}%` : 'N/A'}</div>
                <div><span className="font-medium">Beta:</span> {metrics['beta'] ?? 'N/A'}</div>
              </div>
            ) : (
              <div className="text-gray-500">No statistics available.</div>
            )}
          </div>
          {/* Financials Section */}
          <div className="mb-6">
            <div className="text-lg font-semibold mb-2">Financials (Most Recent Report)</div>
            {financialsLoading ? (
              <div className="text-blue-500">Loading financials...</div>
            ) : financialsError ? (
              <div className="text-red-500">{financialsError}</div>
            ) : financials ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm bg-gray-50 rounded-lg p-4">
                {financials.report && financials.report[0] && financials.report[0].ic && (
                  <>
                    <div><span className="font-medium">Revenue:</span> {financials.report[0].ic['Revenue'] ? `$${Number(financials.report[0].ic['Revenue']).toLocaleString()}` : 'N/A'}</div>
                    <div><span className="font-medium">Net Income:</span> {financials.report[0].ic['NetIncome'] ? `$${Number(financials.report[0].ic['NetIncome']).toLocaleString()}` : 'N/A'}</div>
                    <div><span className="font-medium">EPS:</span> {financials.report[0].ic['EPS'] ?? 'N/A'}</div>
                    <div><span className="font-medium">Gross Profit:</span> {financials.report[0].ic['GrossProfit'] ? `$${Number(financials.report[0].ic['GrossProfit']).toLocaleString()}` : 'N/A'}</div>
                    <div><span className="font-medium">Operating Income:</span> {financials.report[0].ic['OperatingIncome'] ? `$${Number(financials.report[0].ic['OperatingIncome']).toLocaleString()}` : 'N/A'}</div>
                    <div><span className="font-medium">Profit Margin:</span> {financials.report[0].ic['ProfitMargin'] ?? 'N/A'}</div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-gray-500">No financials available.</div>
            )}
          </div>
          {/* Analyst Recommendations Section */}
          <div className="mb-6">
            <div className="text-lg font-semibold mb-2">Analyst Recommendations</div>
            {recommendationsLoading ? (
              <div className="text-blue-500">Loading recommendations...</div>
            ) : recommendationsError ? (
              <div className="text-red-500">{recommendationsError}</div>
            ) : recommendations && recommendations.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm bg-gray-50 rounded-lg p-4">
                <div><span className="font-medium">Buy:</span> {recommendations[0].buy ?? 'N/A'}</div>
                <div><span className="font-medium">Hold:</span> {recommendations[0].hold ?? 'N/A'}</div>
                <div><span className="font-medium">Sell:</span> {recommendations[0].sell ?? 'N/A'}</div>
                <div><span className="font-medium">Strong Buy:</span> {recommendations[0].strongBuy ?? 'N/A'}</div>
                <div><span className="font-medium">Strong Sell:</span> {recommendations[0].strongSell ?? 'N/A'}</div>
                <div><span className="font-medium">Target Price:</span> {recommendations[0].targetPrice ?? 'N/A'}</div>
              </div>
            ) : (
              <div className="text-gray-500">No recommendations available.</div>
            )}
          </div>
          {/* Dividend History Table */}
          {dividendHistory.length > 0 && (
            <div className="mt-4">
              <div className="font-semibold mb-2">Dividend History (last 3 years)</div>
              <table className="w-full text-sm border bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Ex-Date</th>
                    <th className="p-2">Payment Date</th>
                    <th className="p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {dividendHistory.map((d, i) => (
                    <tr key={i}>
                      <td className="p-2">{d.exDate || d.date || '-'}</td>
                      <td className="p-2">{d.paymentDate || '-'}</td>
                      <td className="p-2">{d.amount ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Earnings/Financials Charts Section */}
          <div className="mb-6">
            <div className="flex gap-2 items-center mb-2">
              <div className="text-lg font-semibold">Earnings & Financials</div>
              <Button
                variant={chartType === 'quarterly' ? 'primary' : 'secondary'}
                onClick={() => setChartType('quarterly')}
                className="px-3 py-1 text-sm"
              >
                Quarterly
              </Button>
              <Button
                variant={chartType === 'annual' ? 'primary' : 'secondary'}
                onClick={() => setChartType('annual')}
                className="px-3 py-1 text-sm"
              >
                Annual
              </Button>
            </div>
            {earningsLoading ? (
              <div className="text-blue-500">Loading earnings...</div>
            ) : earningsError ? (
              <div className="text-red-500">{earningsError}</div>
            ) : earnings && earnings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* EPS Chart */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-semibold mb-2">Earnings Per Share (EPS)</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={earnings.filter(e => chartType === 'quarterly' ? e.period.includes('Q') : !e.period.includes('Q')).map(e => ({
                      period: e.period,
                      actual: e.actual,
                      estimate: e.estimate,
                    })).reverse()}>
                      <XAxis dataKey="period" minTickGap={20} />
                      <YAxis tickFormatter={(value: number) => formatCurrency(value)} />
                      <Tooltip formatter={(value: any, name?: any, props?: any) => formatCurrency(value)} />
                      <Line type="monotone" dataKey="actual" stroke="#3b82f6" name="Actual EPS" />
                      <Line type="monotone" dataKey="estimate" stroke="#fbbf24" name="Estimate EPS" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {/* Revenue vs Net Income Chart */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-semibold mb-2">Revenue vs Net Income</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={earnings.filter(e => chartType === 'quarterly' ? e.period.includes('Q') : !e.period.includes('Q')).map(e => ({
                      period: e.period,
                      revenue: e.revenue ?? null,
                      netIncome: e.netIncome ?? null,
                    })).reverse()}>
                      <XAxis dataKey="period" minTickGap={20} />
                      <YAxis tickFormatter={(value: number) => formatCurrency(value)} />
                      <Tooltip formatter={(value: any, name?: any, props?: any) => formatCurrency(value)} />
                      <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue" />
                      <Line type="monotone" dataKey="netIncome" stroke="#ef4444" name="Net Income" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">No earnings data available.</div>
            )}
          </div>
          {/* Upcoming Events Section */}
          <div className="mb-6">
            <div className="text-lg font-semibold mb-2">Upcoming Events</div>
            {earningsCalendarLoading ? (
              <div className="text-blue-500">Loading events...</div>
            ) : earningsCalendarError ? (
              <div className="text-red-500">{earningsCalendarError}</div>
            ) : earningsCalendar && earningsCalendar.length > 0 ? (
              <table className="w-full text-sm border bg-white rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Date</th>
                    <th className="p-2">Event</th>
                    <th className="p-2">EPS Estimate</th>
                    <th className="p-2">Revenue Estimate</th>
                  </tr>
                </thead>
                <tbody>
                  {earningsCalendar.map((event, i) => (
                    <tr key={i}>
                      <td className="p-2">{event.date || '-'}</td>
                      <td className="p-2">Earnings</td>
                      <td className="p-2">{event.epsEstimate ?? '-'}</td>
                      <td className="p-2">{event.revenueEstimate ? `$${Number(event.revenueEstimate).toLocaleString()}` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-gray-500">No upcoming events.</div>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => setSelected(null)} variant="secondary">Back to results</Button>
            <Button onClick={() => setShowAdd(true)}>Add to Portfolio</Button>
          </div>
        </Card>
      )}
      {showAdd && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="mb-4 text-lg font-semibold">Add {selected.symbol} to Portfolio</div>
            <form
              onSubmit={e => { e.preventDefault(); handleAddToPortfolio(); }}
              className="flex flex-col gap-3"
            >
              <div>
                <label className="block mb-1 font-medium">Shares</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  type="number"
                  min="0"
                  value={addForm.shares}
                  onChange={e => setAddForm(f => ({ ...f, shares: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Cost Basis (per share)</label>
                <input
                  className="w-full border rounded px-2 py-1"
                  type="number"
                  min="0"
                  value={addForm.costBasis}
                  onChange={e => setAddForm(f => ({ ...f, costBasis: e.target.value }))}
                  required
                />
              </div>
              <div className="flex gap-2 mt-2">
                <Button type="submit">Add</Button>
                <Button type="button" variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {selected && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Technical Indicators Card */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Technical Indicators</h3>
            {loadingIndicators ? (
              <div>Loading indicators...</div>
            ) : technicalIndicators ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">RSI (14)</h4>
                  <p>{technicalIndicators.rsi[0].toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="font-medium">MACD</h4>
                  <p>MACD: {technicalIndicators.macd.macd[0].toFixed(2)}</p>
                  <p>Signal: {technicalIndicators.macd.signal[0].toFixed(2)}</p>
                </div>
              </div>
            ) : (
              <div>No technical data available</div>
            )}
          </Card>

          {/* Dividend Information */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Dividend Information</h3>
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/2"></div>
              </div>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium">Current Yield</h4>
                  <p>{companyOverview?.DividendYield ? formatPercent(companyOverview.DividendYield) : 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-medium">Payout Ratio</h4>
                  <p>{companyOverview?.PayoutRatio ? formatPercent(companyOverview.PayoutRatio) : 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-medium">Latest Dividend</h4>
                  <p>{dividends?.length ? formatCurrency(dividends[0].amount) : 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-medium">Ex-Dividend Date</h4>
                  <p>{dividends?.length ? new Date(dividends[0].exDate).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            )}
          </Card>

          {/* Company Overview Card */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Company Overview</h3>
            {companyOverview ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Market Cap</h4>
                  <p>{formatCurrency(companyOverview.MarketCapitalization)}</p>
                </div>
                <div>
                  <h4 className="font-medium">P/E Ratio</h4>
                  <p>{companyOverview.PERatio}</p>
                </div>
                <div>
                  <h4 className="font-medium">EPS</h4>
                  <p>{companyOverview.EPS}</p>
                </div>
                <div>
                  <h4 className="font-medium">52 Week High</h4>
                  <p>{formatCurrency(companyOverview['52WeekHigh'])}</p>
                </div>
                <div>
                  <h4 className="font-medium">52 Week Low</h4>
                  <p>{formatCurrency(companyOverview['52WeekLow'])}</p>
                </div>
              </div>
            ) : (
              <div>No company overview available</div>
            )}
          </Card>
        </div>
      )}
      {selected && (
        <Card className="p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4">Dividend History</h3>
          {dividends && dividends.length > 0 ? (
            <div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="px-2 py-1">Ex-Date</th>
                      <th className="px-2 py-1">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dividends.slice(0, 10).map((div, idx) => (
                      <tr key={idx}>
                        <td className="px-2 py-1">{new Date(div.exDate).toLocaleDateString()}</td>
                        <td className="px-2 py-1">{formatCurrency(div.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <h4 className="font-medium mb-2">Dividend Growth Over Time</h4>
                {dividendGrowthData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={dividendGrowthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value: number) => formatCurrency(value)} />
                      <Tooltip formatter={(value: any, name?: any, props?: any) => formatCurrency(value)} />
                      <Legend />
                      <Line type="monotone" dataKey="amount" stroke="#3b82f6" name="Dividend" />
                      <Line type="monotone" dataKey="growth" stroke="#fbbf24" name="Growth %" yAxisId={1} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div>No dividend growth data available.</div>
                )}
              </div>
            </div>
          ) : (
            <div>No dividend history available.</div>
          )}
        </Card>
      )}
      {selected && (
        <Card className="p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4">Technical Analysis</h3>
          <div className="mb-4 flex gap-2 items-center">
            <label htmlFor="indicator">Indicator:</label>
            <select
              id="indicator"
              value={selectedIndicator}
              onChange={e => setSelectedIndicator(e.target.value as any)}
              className="border rounded px-2 py-1"
            >
              <option value="SMA">SMA</option>
              <option value="EMA">EMA</option>
              <option value="RSI">RSI</option>
              <option value="MACD">MACD</option>
            </select>
          </div>
          {technicalIndicators && technicalIndicators[selectedIndicator.toLowerCase()] ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={technicalIndicators[selectedIndicator.toLowerCase()]}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value: number) => formatCurrency(value)} />
                <Tooltip formatter={(value: any, name?: any, props?: any) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey={selectedIndicator.toLowerCase()} stroke="#6366f1" name={selectedIndicator} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div>No technical indicator data available.</div>
          )}
        </Card>
      )}
    </main>
  );
} 