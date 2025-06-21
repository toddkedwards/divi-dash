"use client";

import { RefreshCw, Edit, Trash2, Download, Upload, DollarSign, FileText } from '@geist-ui/icons';
import { companyInfo } from '../utils/companyLogos';
import { useEffect, useState, useRef } from 'react';
import { getStockProfile, getStockQuote, getNews } from '../utils/finnhub';
import { Holding } from '@/data/holdings';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { useRealTimePrices } from '../hooks/useRealTimePrices';
import AdvancedFilters from './AdvancedFilters';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters';
import { ChevronUp, ChevronDown, ChevronsUpDown, Settings2, Eye, EyeOff, Newspaper as LucideNewspaper, MoreVertical } from 'lucide-react';
import Button from './Button';
import FilterChips from './FilterChips';
import { Filter as FilterIcon } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { getCompanyOverview } from '../utils/alphaVantage';
import ProBadge from './ProBadge';
import { exportToCSV, exportToPDF } from '@/utils/exportUtils';
import LoadingSpinner from './LoadingSpinner';
import { Building2 } from 'lucide-react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Pencil } from 'lucide-react';
import Image from 'next/image';
import { usePortfolio } from '@/context/PortfolioContext';
import { useUserSettings } from '@/context/UserSettingsContext';

interface HoldingsTableProps {
  holdings: Holding[];
  onEdit: (holding: Holding) => void;
  onDelete: (holding: Holding) => void;
  onRefresh: (holding: Holding) => void;
  onUpdate: (holding: Holding) => void;
  onAdd?: () => void;
  loading?: boolean;
}

const DEFAULT_COLUMNS = [
  'Logo', 'Ticker', 'Company', 'Sector', 'Shares', 'Avg. Price', 'Current Price', 'Daily Change', 'Cost Basis', 'Market Value', 'Gain/Loss', 'Dividend Yield', 'Actions'
];

const COLUMN_KEYS = [
  { key: 'Logo', label: 'Logo' },
  { key: 'Ticker', label: 'Ticker' },
  { key: 'Company', label: 'Company' },
  { key: 'Sector', label: 'Sector' },
  { key: 'Shares', label: 'Shares' },
  { key: 'Avg. Price', label: 'Avg. Price' },
  { key: 'Current Price', label: 'Current Price' },
  { key: 'Daily Change', label: 'Daily Change' },
  { key: 'Cost Basis', label: 'Cost Basis' },
  { key: 'Market Value', label: 'Market Value' },
  { key: 'Gain/Loss', label: 'Gain/Loss' },
  { key: 'Dividend Yield', label: 'Dividend Yield' },
  { key: 'Actions', label: 'Actions' }
];

const ESSENTIAL_COLUMNS = ['Logo', 'Ticker', 'Company', 'Shares', 'Current Price', 'Gain/Loss'];

interface FilterState {
  sectors: string[];
  dividendYield: 'all' | 'high' | 'medium' | 'low';
  marketValue: 'all' | 'large' | 'medium' | 'small';
  performance: 'all' | 'gainers' | 'losers';
  priceChange: 'all' | 'up' | 'down';
}

function getClearbitDomain(symbol: string) {
  // Simple mapping for common US stocks; expand as needed
  const map: Record<string, string> = {
    AAPL: 'apple.com',
    MSFT: 'microsoft.com',
    AMZN: 'amazon.com',
    GOOGL: 'abc.xyz',
    GOOG: 'abc.xyz',
    META: 'meta.com',
    FB: 'facebook.com',
    TSLA: 'tesla.com',
    NFLX: 'netflix.com',
    CRM: 'salesforce.com',
    COST: 'costco.com',
    SCHD: 'schwab.com',
    SCHG: 'schwab.com',
    TXRH: 'texasroadhouse.com',
    T: 'att.com',
    // Add more as needed
  };
  return map[symbol.toUpperCase()] || '';
}

export default function HoldingsTable({ holdings, onEdit, onDelete, onRefresh, onUpdate, onAdd, loading = false }: HoldingsTableProps) {
  const { tableSort, setTableSort, currency } = useUserPreferences();
  const [profileCache, setProfileCache] = useState<Record<string, { name: string; logo: string }>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [prevCloses, setPrevCloses] = useState<Record<string, number>>({});
  const { priceUpdates, isUpdating, updatePrices } = useRealTimePrices(holdings, 0);
  const [editingSymbol, setEditingSymbol] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ shares: string; avgPrice: string; sector: string }>({ shares: '', avgPrice: '', sector: '' });
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const columnsMenuRef = useRef<HTMLDivElement>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedColumns');
      return saved ? JSON.parse(saved) : DEFAULT_COLUMNS;
    }
    return DEFAULT_COLUMNS;
  });
  const [filters, setFilters] = useState<FilterState>({
    sectors: [],
    dividendYield: 'all',
    marketValue: 'all',
    performance: 'all',
    priceChange: 'all'
  });
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const { watchlist, addToWatchlist } = useWatchlist();
  const [apiError, setApiError] = useState<string | null>(null);
  const [refreshCooldown, setRefreshCooldown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [newsPopover, setNewsPopover] = useState<{ symbol: string; anchor: HTMLElement | null } | null>(null);
  const [newsData, setNewsData] = useState<Record<string, any[]>>({});
  const [newsLoading, setNewsLoading] = useState(false);
  const [dividendPopover, setDividendPopover] = useState<{ symbol: string; anchor: HTMLElement | null } | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const isProUser = false; // TODO: Replace with real check
  const { settings } = useUserSettings();
  const currencySymbol = currency === 'USD' ? '$' : '€';

  useEffect(() => {
    setSortConfig({ key: tableSort.key as any, direction: tableSort.direction });
  }, [tableSort]);

  useEffect(() => {
    const cached = localStorage.getItem('companyProfileCache');
    if (cached) {
      setProfileCache(JSON.parse(cached));
    }
  }, []);

  const updateProfileCache = (symbol: string, data: { name: string; logo: string }) => {
    setProfileCache(prev => {
      const updated = { ...prev, [symbol]: data };
      localStorage.setItem('companyProfileCache', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const missing = holdings.filter(h => !companyInfo[h.symbol] && !profileCache[h.symbol]);
    if (missing.length === 0) return;
    missing.forEach(async (h) => {
      try {
        // Try Finnhub first
        const profile = await getStockProfile(h.symbol);
        if (profile && (profile.name || profile.logo)) {
          updateProfileCache(h.symbol, { name: profile.name || h.symbol, logo: profile.logo || '' });
          return;
        }
      } catch (err: any) {
        if (err?.message?.toLowerCase().includes('rate limit')) {
          setApiError('API rate limit reached. Please try again in a few minutes.');
          setRefreshCooldown(true);
          setTimeout(() => setRefreshCooldown(false), 60000);
        }
      }
      try {
        // Fallback: Try Alpha Vantage
        const overview = await getCompanyOverview(h.symbol);
        if (overview && overview.Name) {
          const domain = getClearbitDomain(h.symbol);
          const logo = domain ? `https://logo.clearbit.com/${domain}` : '';
          updateProfileCache(h.symbol, { name: overview.Name, logo });
          return;
        }
      } catch (err: any) {
        if (err?.message?.toLowerCase().includes('rate limit')) {
          setApiError('API rate limit reached. Please try again in a few minutes.');
          setRefreshCooldown(true);
          setTimeout(() => setRefreshCooldown(false), 60000);
        }
      }
      // Final fallback: Try Clearbit with inferred domain only
      const domain = getClearbitDomain(h.symbol);
      if (domain) {
        updateProfileCache(h.symbol, { name: h.symbol, logo: `https://logo.clearbit.com/${domain}` });
        return;
      }
      // If all fail, cache as unknown
      updateProfileCache(h.symbol, { name: h.symbol, logo: '' });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holdings]);

  useEffect(() => {
    const saved = localStorage.getItem('selectedColumns');
    if (saved) {
      setSelectedColumns(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedColumns', JSON.stringify(selectedColumns));
  }, [selectedColumns]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (columnsMenuRef.current && !columnsMenuRef.current.contains(e.target as Node)) {
        setShowColumnsMenu(false);
      }
    }
    if (showColumnsMenu) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showColumnsMenu]);

  // Close more menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    }
    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMoreMenu]);

  // Helper functions for gain/loss and price change
  const calculateMarketValue = (holding: Holding) => holding.shares * (holding.currentPrice || 0);
  const calculateGainLoss = (holding: Holding) => calculateMarketValue(holding) - (holding.shares * holding.avgPrice);
  const calculateGainLossPercentage = (holding: Holding) => {
    const costBasis = holding.shares * holding.avgPrice;
    if (costBasis === 0) return 0;
    return (calculateGainLoss(holding) / costBasis) * 100;
  };
  const calculatePriceChange = (holding: Holding) => {
    // Some holdings may not have prevClose, so default to 0
    const prevClose = (holding as any).prevClose ?? 0;
    return (holding.currentPrice || 0) - prevClose;
  };

  const applyFilters = (holdings: Holding[]) => {
    return holdings.filter(holding => {
      // Sector filter
      if (filters.sectors.length > 0 && !filters.sectors.includes(holding.sector)) {
        return false;
      }

      // Dividend yield filter
      const dividendYield = holding.dividendYield || 0;
      if (filters.dividendYield !== 'all') {
        if (filters.dividendYield === 'high' && dividendYield < 4) return false;
        if (filters.dividendYield === 'medium' && (dividendYield < 2 || dividendYield >= 4)) return false;
        if (filters.dividendYield === 'low' && dividendYield >= 2) return false;
      }

      // Market value filter
      const marketValue = calculateMarketValue(holding);
      if (
        !(
          filters.marketValue === 'all' ||
          (filters.marketValue === 'large' && marketValue >= 10000) ||
          (filters.marketValue === 'medium' && marketValue >= 5000 && marketValue < 10000) ||
          (filters.marketValue === 'small' && marketValue < 5000)
        )
      ) {
        return false;
      }

      // Performance filter
      const gainLoss = calculateGainLoss(holding);
      if (filters.performance !== 'all') {
        if (filters.performance === 'gainers' && gainLoss <= 0) return false;
        if (filters.performance === 'losers' && gainLoss >= 0) return false;
      }

      // Price change filter
      const priceChange = calculatePriceChange(holding);
      if (filters.priceChange !== 'all') {
        if (filters.priceChange === 'up' && priceChange <= 0) return false;
        if (filters.priceChange === 'down' && priceChange >= 0) return false;
      }

      return true;
    });
  };

  // Get filtered and sorted holdings
  const filteredHoldings = applyFilters(holdings);
  const sortedHoldings = [...filteredHoldings].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    // Use a type guard for known keys
    let aValue: any, bValue: any;
    switch (key) {
      case 'Symbol':
        aValue = a.symbol; bValue = b.symbol; break;
      case 'Sector':
        aValue = a.sector; bValue = b.sector; break;
      case 'Shares':
        aValue = a.shares; bValue = b.shares; break;
      case 'Avg Price':
        aValue = a.avgPrice; bValue = b.avgPrice; break;
      case 'Current Price':
        aValue = a.currentPrice; bValue = b.currentPrice; break;
      case 'Market Value':
        aValue = calculateMarketValue(a); bValue = calculateMarketValue(b); break;
      case 'Gain/Loss':
        aValue = calculateGainLoss(a); bValue = calculateGainLoss(b); break;
      case 'Gain/Loss %':
        aValue = calculateGainLossPercentage(a); bValue = calculateGainLossPercentage(b); break;
      case 'Dividend Yield':
        aValue = a.dividendYield; bValue = b.dividendYield; break;
      default:
        aValue = ''; bValue = ''; break;
    }
    if (aValue === bValue) return 0;
    return direction === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
  });

  const requestSort = (key: string) => {
    setSortConfig(current => {
      const direction = current?.key === key && current.direction === 'asc' ? 'desc' : 'asc';
      setTableSort(key, direction);
      return { key, direction };
    });
  };

  const startEdit = (symbol: string, shares: number, avgPrice: number) => {
    setEditingSymbol(symbol);
    setEditValues({ shares: shares.toString(), avgPrice: avgPrice.toString(), sector: '' });
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValues(v => ({ ...v, [e.target.name]: e.target.value }));
  };

  const saveEdit = async (symbol: string, holding: Holding) => {
    setSaving(true);
    const updated = { ...holding, shares: parseFloat(editValues.shares), avgPrice: parseFloat(editValues.avgPrice) };
    await onUpdate(updated);
    setSaving(false);
    setEditingSymbol(null);
  };

  const toggleColumn = (col: string) => {
    if (ESSENTIAL_COLUMNS.includes(col)) return;
    setSelectedColumns(cols =>
      cols.includes(col) ? cols.filter(c => c !== col) : [...cols, col]
    );
  };

  // Export holdings to CSV
  const handleExportCSV = () => {
    exportToCSV(holdings);
  };

  // Export holdings to PDF
  const handleExportPDF = () => {
    exportToPDF(holdings);
  };

  // Import holdings from CSV
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setImportSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split(/\r?\n/).filter(Boolean);
      const headers = rows[0].split(',').map(h => h.replace(/^"|"$/g, ''));
      const data = rows.slice(1).map(row => {
        const values = row.split(',').map(v => v.replace(/^"|"$/g, ''));
        const obj: any = {};
        headers.forEach((h, i) => { obj[h] = values[i]; });
        return obj;
      });
      // Validate required fields
      const required = ['symbol','shares','avgPrice','dividendYield','costBasis','sector','currentPrice'];
      const missing = required.filter(f => !headers.includes(f));
      if (missing.length > 0) {
        setImportError('Missing required fields: ' + missing.join(', '));
        return;
      }
      // Add/update holdings
      let added = 0;
      data.forEach(h => {
        if (!h.symbol) return;
        onUpdate({
          symbol: h.symbol,
          shares: Number(h.shares),
          avgPrice: Number(h.avgPrice),
          dividendYield: Number(h.dividendYield),
          costBasis: Number(h.costBasis),
          sector: h.sector,
          currentPrice: Number(h.currentPrice),
          payoutFrequency: 'quarterly',
          lastExDate: '', lastPaymentDate: '', nextExDate: '', nextPaymentDate: '', dividendHistory: [],
        });
        added++;
      });
      setImportSuccess(`Imported ${added} holdings.`);
    };
    reader.readAsText(file);
  };

  // Fetch news headlines for a symbol
  const handleShowNews = async (symbol: string, anchor: HTMLElement) => {
    setNewsPopover({ symbol, anchor });
    if (!newsData[symbol]) {
      setNewsLoading(true);
      try {
        const news = await getNews(symbol);
        setNewsData(prev => ({ ...prev, [symbol]: news.slice(0, 5) }));
      } catch {}
      setNewsLoading(false);
    }
  };
  const handleCloseNews = () => setNewsPopover(null);
  const handleShowDividend = (symbol: string, anchor: HTMLElement) => setDividendPopover({ symbol, anchor });
  const handleCloseDividend = () => setDividendPopover(null);

  const renderCell = (holding: Holding, column: string) => {
    switch (column) {
      case 'Logo':
        const logoUrl = profileCache[holding.symbol]?.logo || companyInfo[holding.symbol]?.logo;
        return (
          <div className="flex items-center justify-center">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={holding.symbol}
                width={32}
                height={32}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white"
                onError={(e) => {
                  // Hide image if it fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
            )}
          </div>
        );
      case 'Ticker':
        return <span className="font-mono">{holding.symbol}</span>;
      case 'Company':
        return profileCache[holding.symbol]?.name || companyInfo[holding.symbol]?.name || holding.symbol;
      case 'Sector':
        return (
          <div className="flex items-center gap-2">
            {editingSymbol === holding.symbol ? (
              <input value={editValues.sector || ''} name="sector" onChange={handleEditChange} className="w-20 px-2 py-1 border rounded" />
            ) : (
              holding.sector || 'Unknown'
            )}
          </div>
        );
      case 'Shares':
        return (
          <div className="flex items-center gap-2">
            {editingSymbol === holding.symbol ? (
              <input ref={inputRef} name="shares" type="number" min="0" step="any" value={editValues.shares} onChange={handleEditChange} onBlur={() => saveEdit(holding.symbol, holding)} onKeyDown={e => { if (e.key === 'Enter') saveEdit(holding.symbol, holding); }} className="w-20 px-2 py-1 border rounded" disabled={saving} />
            ) : (
              holding.shares
            )}
          </div>
        );
      case 'Avg. Price':
        return (
          <div className="flex items-center gap-2">
            {editingSymbol === holding.symbol ? (
              <input name="avgPrice" type="number" min="0" step="any" value={editValues.avgPrice} onChange={handleEditChange} onBlur={() => saveEdit(holding.symbol, holding)} onKeyDown={e => { if (e.key === 'Enter') saveEdit(holding.symbol, holding); }} className="w-20 px-2 py-1 border rounded" disabled={saving} />
            ) : (
              `${currencySymbol}${holding.avgPrice.toFixed(2)}`
            )}
          </div>
        );
      case 'Current Price':
        return (
          <div className="flex items-center gap-1 justify-end">
            {priceUpdates[holding.symbol]?.currentPrice?.toFixed(2) || holding.currentPrice?.toFixed(2)}
            {isUpdating && priceUpdates[holding.symbol]?.symbol === holding.symbol && (
              <span className="ml-2 text-xs text-blue-500">Updating...</span>
            )}
          </div>
        );
      case 'Daily Change': {
        const priceUpdate = priceUpdates[holding.symbol];
        const dailyChange = priceUpdate?.dailyChange ?? 0;
        const dailyChangePercent = priceUpdate?.dailyChangePercent ?? 0;
        const dailyChangeDisplay = (priceUpdate && typeof dailyChange === 'number' && typeof dailyChangePercent === 'number')
          ? `${dailyChange >= 0 ? '+' : ''}${dailyChange.toFixed(2)} (${dailyChangePercent >= 0 ? '+' : ''}${dailyChangePercent.toFixed(2)}%)`
          : '--';
        const ArrowIcon = dailyChange > 0 ? ChevronUp : dailyChange < 0 ? ChevronDown : ChevronsUpDown;
        return (
          <div className="flex items-center gap-1">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${dailyChange > 0 ? 'bg-green-100 text-green-700' : dailyChange < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'} dark:${dailyChange > 0 ? 'bg-green-900 text-green-300' : dailyChange < 0 ? 'bg-red-900 text-red-300' : 'bg-gray-800 text-gray-300'}`}>
              <ArrowIcon size={14} /> {dailyChangeDisplay}
            </span>
          </div>
        );
      }
      case 'Cost Basis':
        return (
          <div className="flex items-center gap-2">
            {currencySymbol}{holding.costBasis.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </div>
        );
      case 'Market Value':
        return (
          <div className="flex items-center gap-2">
            {currencySymbol}{calculateMarketValue(holding).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </div>
        );
      case 'Gain/Loss': {
        const currentPrice = priceUpdates[holding.symbol]?.currentPrice ?? holding.currentPrice;
        const marketValue = holding.shares * currentPrice;
        const costBasis = holding.shares * holding.avgPrice;
        const gainLoss = marketValue - costBasis;
        const gainLossPercentage = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;
        return (
          <div className="flex items-center gap-1">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${gainLoss > 0 ? 'bg-green-100 text-green-700' : gainLoss < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'} dark:${gainLoss > 0 ? 'bg-green-900 text-green-300' : gainLoss < 0 ? 'bg-red-900 text-red-300' : 'bg-gray-800 text-gray-300'}`}>
              {gainLoss >= 0 ? '+' : ''}{currencySymbol}{gainLoss.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ({gainLossPercentage.toFixed(2)}%)
            </span>
          </div>
        );
      }
      case 'Dividend Yield':
        return (
          <div className="flex items-center gap-2">
            {priceUpdates[holding.symbol]?.dividendYield ? priceUpdates[holding.symbol].dividendYield.toFixed(2) + '%' : '--'}
          </div>
        );
      case 'Actions':
        return (
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => onEdit(holding)} className="text-blue-600 hover:text-blue-800" title="Edit"><Edit size={18} /></button>
            <button onClick={() => onDelete(holding)} className="text-red-600 hover:text-red-800" title="Delete"><Trash2 size={18} /></button>
            <button onClick={() => onRefresh(holding)} className="text-gray-500 hover:text-gray-700" title="Refresh">
              <RefreshCw size={18} />
            </button>
            <button
              className="text-yellow-600 hover:text-yellow-800"
              title="Dividend History"
              onClick={e => handleShowDividend(holding.symbol, e.currentTarget)}
            >
              <DollarSign size={18} />
            </button>
            <button
              className="text-indigo-600 hover:text-indigo-800"
              title="Latest News"
              onClick={e => handleShowNews(holding.symbol, e.currentTarget)}
            >
              <LucideNewspaper size={18} />
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 animate-fade-in">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 md:p-6 space-y-4 overflow-x-auto relative">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
          <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">Current Holdings</h2>
          {apiError && (
            <div className="w-full mb-2 px-4 py-2 rounded bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 text-sm font-semibold text-center">
              {apiError}
            </div>
          )}
          {importError && (
            <div className="w-full mb-2 px-4 py-2 rounded bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 text-sm font-semibold text-center">
              {importError}
            </div>
          )}
          {importSuccess && (
            <div className="w-full mb-2 px-4 py-2 rounded bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 text-sm font-semibold text-center">
              {importSuccess}
            </div>
          )}
          <div className="flex items-center gap-2 relative">
            <Button
              variant="primary"
              size="md"
              onClick={onAdd}
              title="Add a new position"
              style={{ minWidth: 160 }}
            >
              + Add to Portfolio
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={updatePrices}
              disabled={isUpdating || refreshCooldown}
              title="Refresh prices"
              style={{ minWidth: 160 }}
            >
              <RefreshCw size={20} /> {isUpdating ? 'Refreshing...' : refreshCooldown ? 'Try Again Soon' : 'Refresh'}
            </Button>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 font-semibold text-base"
              onClick={() => setShowMoreMenu(v => !v)}
              title="More actions"
              style={{ minWidth: 100 }}
            >
              <MoreVertical size={20} /> More
            </button>
            {showMoreMenu && (
              <div ref={moreMenuRef} className="absolute z-40 mt-2 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 w-56 flex flex-col gap-1">
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
                  onClick={isProUser ? handleExportCSV : () => setApiError('Upgrade to Divly Pro to unlock bulk export!')}
                  title="Export holdings as CSV"
                >
                  <Download size={16} /> Export CSV <ProBadge />
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
                  onClick={isProUser ? handleExportPDF : () => setApiError('Upgrade to Divly Pro to unlock PDF export!')}
                  title="Export holdings as PDF"
                >
                  <FileText size={16} /> Export PDF <ProBadge />
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
                  onClick={() => { setShowColumnsMenu(true); setShowMoreMenu(false); }}
                  title="Show/hide columns"
                >
                  <Settings2 size={16} /> Columns
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
                  onClick={() => { setShowFilterPopover(true); setShowMoreMenu(false); }}
                  title="Filter holdings"
                >
                  <FilterIcon size={16} /> Filters
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleImportCSV}
            />
          </div>
        </div>
        {holdings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-2xl font-semibold text-gray-500 dark:text-gray-400 mb-4">No holdings yet</div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
          {showFilterPopover && (
            <div className="absolute z-20 mt-2 bg-white dark:bg-gray-900 border rounded shadow p-4 left-0" style={{ minWidth: 320 }}>
              <FilterChips holdings={holdings} onFilterChange={setTempFilters} filters={tempFilters} />
              <div className="flex justify-end mt-2 gap-2">
                <button
                  className="px-3 py-1 rounded bg-gray-200 text-gray-800 text-sm dark:bg-gray-700 dark:text-gray-200"
                  onClick={() => setShowFilterPopover(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
                  onClick={() => { setFilters(tempFilters); setShowFilterPopover(false); }}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs md:text-sm rounded-lg border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {COLUMN_KEYS.filter(col => selectedColumns.includes(col.key)).map((col, colIdx, arr) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 ${col.key === 'Actions' ? 'text-right' : ''} ${['Sector', 'Avg. Price', 'Cost Basis', 'Market Value', 'Dividend Yield'].includes(col.key) ? 'hidden md:table-cell' : ''} ${col.key === 'Dividend Yield' ? 'hidden md:table-cell' : ''} ${colIdx < arr.length - 1 ? 'border-r border-gray-200 dark:border-gray-700' : ''}`}
                    onClick={() => requestSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {sortConfig?.key === col.key && (
                        <span className="text-gray-400">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredHoldings.map((holding, idx) => (
                <tr
                  key={holding.symbol}
                  className={`transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'} hover:bg-green-50 dark:hover:bg-green-900 border-b border-gray-200 dark:border-gray-700`}
                >
                  {COLUMN_KEYS.filter(col => selectedColumns.includes(col.key)).map((col, colIdx, arr) => {
                    const borderClass = colIdx < arr.length - 1 ? 'border-r border-gray-200 dark:border-gray-700' : '';
                    return (
                      <td key={col.key} className={`px-4 py-2 whitespace-nowrap text-sm font-normal text-gray-900 dark:text-gray-100 ${borderClass}`}>
                        {renderCell(holding, col.key)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {onAdd && (
        <button
          className="fixed bottom-8 right-8 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-3xl transition-all duration-200"
          style={{ boxShadow: '0 4px 24px rgba(34,197,94,0.2)' }}
          onClick={onAdd}
          aria-label="Add Position"
        >
          +
        </button>
      )}
    </div>
  );
} 