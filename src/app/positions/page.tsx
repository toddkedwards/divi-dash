"use client";
import { useState, useRef, useEffect } from 'react';
import HoldingsTable from '../../components/HoldingsTable';
import DividendsTable from '../../components/DividendsTable';
import { usePortfolio } from '../../context/PortfolioContext';
import { useDividends } from '../../context/DividendsContext';
import { Tooltip, Card, Text, Spacer, Popover, Input } from '@geist-ui/core';
import { Download, Upload, Copy, FileText, HelpCircle } from '@geist-ui/icons';
import { useToast } from '../../components/ToastProvider';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Dispatch, SetStateAction, FormEvent } from 'react';
import Button from '../../components/Button';
import { getStockQuote } from '../../utils/finnhub';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Holding } from '@/data/holdings';
import { companyInfo } from '../../utils/companyLogos';
import { getStockProfile } from '../../utils/finnhub';
import Watchlist from '../../components/Watchlist';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import PortfolioSelector from '@/components/PortfolioSelector';

export default function PositionsPage() {
  const { holdings, addHolding, editHolding, deleteHolding, removeHolding, updateHolding, refreshHoldings } = usePortfolio();
  const { dividends, addDividend, editDividend, deleteDividend } = useDividends();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Modal state for editing holdings
  const [editHoldingIndex, setEditHoldingIndex] = useState<number | null>(null);
  const [editHoldingForm, setEditHoldingForm] = useState<any>(null);
  const [deleteHoldingIndex, setDeleteHoldingIndex] = useState<number | null>(null);

  // Modal state for editing dividends
  const [editDividendIndex, setEditDividendIndex] = useState<number | null>(null);
  const [editDividendForm, setEditDividendForm] = useState<any>(null);
  const [deleteDividendIndex, setDeleteDividendIndex] = useState<number | null>(null);

  // Add Holding form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ticker: '', shares: '', avgPrice: '', dividendYield: '', costBasis: '', sector: '', currentPrice: '' });

  // Add validation state
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const holdingsFileInput = useRef<HTMLInputElement>(null);
  const dividendsFileInput = useRef<HTMLInputElement>(null);
  const [importPreview, setImportPreview] = useState<any[] | null>(null);
  const [importType, setImportType] = useState<'holdings' | 'dividends' | null>(null);

  // Real-time price update for a holding
  const [refreshingIndex, setRefreshingIndex] = useState<number | null>(null);

  // Analytics state
  const [analytics, setAnalytics] = useState<{
    assetAllocation: { name: string; value: number }[];
    sectorAllocation: Record<string, number>;
    performanceMetrics: {
      totalReturn: number;
      yield: number;
      incomeProjection: number;
    };
  }>({
    assetAllocation: [],
    sectorAllocation: {},
    performanceMetrics: {
      totalReturn: 0,
      yield: 0,
      incomeProjection: 0,
    },
  });

  // Filtering and sorting state
  const [filters, setFilters] = useState({ sector: '', yield: '' });
  const [sortConfig, setSortConfig] = useState<{ key: keyof Holding; direction: 'ascending' | 'descending' }>({ key: 'symbol', direction: 'ascending' });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Simulate data loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load data'));
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate analytics
  useEffect(() => {
    const assetAllocation = holdings.map(h => ({ name: h.symbol, value: h.shares * h.currentPrice }));
    const sectorAllocation = holdings.reduce((acc, h) => {
      const sector = h.sector || 'Unknown';
      acc[sector] = (acc[sector] || 0) + h.shares * h.currentPrice;
      return acc;
    }, {} as Record<string, number>);
    const performanceMetrics = {
      totalReturn: holdings.reduce((sum, h) => sum + (h.currentPrice - h.avgPrice) * h.shares, 0),
      yield: holdings.reduce((sum, h) => sum + h.dividendYield, 0) / holdings.length,
      incomeProjection: holdings.reduce((sum, h) => sum + h.shares * h.currentPrice * (h.dividendYield / 100), 0),
    };
    setAnalytics({ assetAllocation, sectorAllocation, performanceMetrics });
  }, [holdings]);

  // Filter and sort holdings
  const filteredHoldings = holdings.filter(h => {
    return (filters.sector ? h.sector === filters.sector : true) &&
           (filters.yield ? h.dividendYield >= Number(filters.yield) : true);
  }).sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue === undefined || bValue === undefined) return 0;
      if (sortConfig.direction === 'ascending') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    }
    return 0;
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => {
      let updated = { ...prev, [name]: value };
      if (name === 'ticker') {
        const upperTicker = value.toUpperCase();
        // Fetch sector and dividend yield from Finnhub
        getStockProfile(upperTicker).then(profile => {
          if (profile) {
            setForm(f => ({
              ...f,
              sector: profile.sector || '',
              dividendYield: profile.dividendYield || '',
            }));
          }
        });
        // Fetch current price from Finnhub
        getStockQuote(upperTicker).then(quote => {
          if (quote && typeof quote.c === 'number') {
            setForm(f => ({ ...f, currentPrice: quote.c.toString() }));
          }
        });
      }
      // Auto-calculate cost basis if shares and avgPrice are present
      if (name === 'shares' || name === 'avgPrice') {
        const shares = name === 'shares' ? value : prev.shares;
        const avgPrice = name === 'avgPrice' ? value : prev.avgPrice;
        if (!isNaN(Number(shares)) && !isNaN(Number(avgPrice))) {
          updated.costBasis = (Number(shares) * Number(avgPrice)).toString();
        }
      }
      return updated;
    });
  }

  function validateForm() {
    const errors: { [key: string]: string } = {};
    if (!form.ticker) errors.ticker = 'Ticker is required';
    if (!form.shares || isNaN(Number(form.shares)) || Number(form.shares) <= 0) errors.shares = 'Shares must be a positive number';
    if (!form.avgPrice || isNaN(Number(form.avgPrice)) || Number(form.avgPrice) <= 0) errors.avgPrice = 'Avg Price must be a positive number';
    if (form.dividendYield && (isNaN(Number(form.dividendYield)) || Number(form.dividendYield) < 0)) errors.dividendYield = 'Dividend Yield must be 0 or greater';
    return errors;
  }

  const handleAddHolding = async (e?: React.FormEvent<HTMLFormElement>) => {
    console.log('handleAddHolding called');
    if (e) e.preventDefault();
    console.log('form state:', form);
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      console.log('validation errors:', errors);
      return;
    }
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const shares = Number(form.shares);
      const avgPrice = Number(form.avgPrice);
      const currentPrice = form.currentPrice ? Number(form.currentPrice) : avgPrice;
      const costBasis = form.costBasis ? Number(form.costBasis) : shares * avgPrice;
      const dividendYield = form.dividendYield ? Number(form.dividendYield) : 0;
      const newHolding: Holding = {
        symbol: form.ticker.toUpperCase(),
        shares,
        avgPrice,
        currentPrice,
        costBasis,
        dividendYield,
        sector: form.sector || '',
        payoutFrequency: 'quarterly',
        lastExDate: '',
        lastPaymentDate: '',
        nextExDate: '',
        nextPaymentDate: '',
        dividendHistory: [],
      };
      addHolding(newHolding);
      toast({ title: 'Success', description: 'Holding added successfully', variant: 'success' });
      setForm({ ticker: '', shares: '', avgPrice: '', dividendYield: '', costBasis: '', sector: '', currentPrice: '' });
      setShowForm(false);
      setFormErrors({});
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to add holding', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // Edit Holding
  function openEditHolding(symbol: string) {
    const idx = holdings.findIndex(h => h.symbol === symbol);
    if (idx !== -1) {
      setEditHoldingIndex(idx);
      setEditHoldingForm({ ...holdings[idx] });
    }
  }
  function handleEditHoldingChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEditHoldingForm({ ...editHoldingForm, [e.target.name]: e.target.value });
  }
  function handleEditHoldingSave() {
    if (editHoldingIndex !== null) {
      editHolding(holdings[editHoldingIndex].symbol, {
        ...editHoldingForm,
        shares: Number(editHoldingForm.shares),
        avgPrice: Number(editHoldingForm.avgPrice),
        dividendYield: Number(editHoldingForm.dividendYield),
        costBasis: Number(editHoldingForm.costBasis),
        currentPrice: Number(editHoldingForm.currentPrice),
      });
      setEditHoldingIndex(null);
      setEditHoldingForm(null);
      toast({ title: 'Success', description: 'Holding updated successfully', variant: 'success' });
    }
  }

  // Delete Holding
  function openDeleteHolding(symbol: string) {
    const idx = holdings.findIndex(h => h.symbol === symbol);
    if (idx !== -1) {
      setDeleteHoldingIndex(idx);
    }
  }
  function handleDeleteHoldingConfirm() {
    if (deleteHoldingIndex !== null) {
      deleteHolding(holdings[deleteHoldingIndex].symbol);
      setDeleteHoldingIndex(null);
      toast({ title: 'Success', description: 'Holding deleted', variant: 'success' });
    }
  }
  function handleDeleteHoldingCancel() {
    setDeleteHoldingIndex(null);
  }

  // Edit Dividend
  function openEditDividend(index: number) {
    setEditDividendIndex(index);
    setEditDividendForm({ ...dividends[index] });
  }
  function handleEditDividendChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEditDividendForm({ ...editDividendForm, [e.target.name]: e.target.value });
  }
  function handleEditDividendSave() {
    if (editDividendIndex !== null) {
      editDividend(editDividendIndex, {
        ...editDividendForm,
        amount: Number(editDividendForm.amount),
      });
      setEditDividendIndex(null);
      setEditDividendForm(null);
      toast({ title: 'Success', description: 'Dividend updated successfully', variant: 'success' });
    }
  }

  // Delete Dividend
  function openDeleteDividend(index: number) {
    setDeleteDividendIndex(index);
  }
  function handleDeleteDividendConfirm() {
    if (deleteDividendIndex !== null) {
      deleteDividend(deleteDividendIndex);
      setDeleteDividendIndex(null);
      toast({ title: 'Success', description: 'Dividend deleted', variant: 'success' });
    }
  }
  function handleDeleteDividendCancel() {
    setDeleteDividendIndex(null);
  }

  function toCSV(data: any[], headers: string[]): string {
    return [headers.join(','), ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))].join('\n');
  }

  // Export functionality
  const handleExportHoldingsCSV = () => {
    const headers = ['Symbol', 'Shares', 'Avg Price', 'Current Price', 'Total Return', 'Yield'];
    const data = filteredHoldings.map(h => [h.symbol, h.shares, h.avgPrice, h.currentPrice, (h.currentPrice - h.avgPrice) * h.shares, h.dividendYield]);
    const csv = toCSV(data, headers);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'holdings.csv';
    a.click();
  };

  function handleExportDividendsCSV() {
    const headers = ['symbol','amount','date'];
    const csv = toCSV(dividends, headers);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dividends.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
  function handleCopyHoldingsCSV() {
    const headers = ['symbol','shares','avgPrice','dividendYield','costBasis','sector','currentPrice'];
    const csv = toCSV(holdings, headers);
    navigator.clipboard.writeText(csv);
  }
  function handleCopyDividendsCSV() {
    const headers = ['symbol','amount','date'];
    const csv = toCSV(dividends, headers);
    navigator.clipboard.writeText(csv);
  }
  function handleImportClick(type: 'holdings' | 'dividends') {
    setImportType(type);
    if (type === 'holdings') holdingsFileInput.current?.click();
    else dividendsFileInput.current?.click();
  }
  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>, type: 'holdings' | 'dividends') {
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
      setImportPreview(data);
      setImportType(type);
    };
    reader.readAsText(file);
  }
  function handleImportConfirm() {
    if (importType === 'holdings' && importPreview) {
      const requiredFields = ['symbol', 'shares', 'avgPrice', 'dividendYield', 'costBasis', 'sector', 'currentPrice'];
      const missingFields = requiredFields.filter(field => !importPreview[0]?.[field]);
      
      if (missingFields.length > 0) {
        toast({ title: 'Error', description: `Missing required fields: ${missingFields.join(', ')}`, variant: 'destructive' });
        return;
      }

      importPreview.forEach(h => addHolding({
        symbol: h.symbol,
        shares: Number(h.shares),
        avgPrice: Number(h.avgPrice),
        dividendYield: Number(h.dividendYield),
        costBasis: Number(h.costBasis),
        sector: h.sector,
        currentPrice: Number(h.currentPrice),
        payoutFrequency: 'quarterly',
        lastExDate: '', lastPaymentDate: '', nextExDate: '', nextPaymentDate: '', dividendHistory: [],
      }));
      toast({ title: 'Success', description: 'Holdings imported successfully', variant: 'success' });
    } else if (importType === 'dividends' && importPreview) {
      const requiredFields = ['symbol', 'amount', 'date'];
      const missingFields = requiredFields.filter(field => !importPreview[0]?.[field]);
      
      if (missingFields.length > 0) {
        toast({ title: 'Error', description: `Missing required fields: ${missingFields.join(', ')}`, variant: 'destructive' });
        return;
      }

      importPreview.forEach(d => addDividend({
        symbol: d.symbol,
        amount: Number(d.amount),
        date: d.date,
      }));
      toast({ title: 'Success', description: 'Dividends imported successfully', variant: 'success' });
    }
    setImportPreview(null);
    setImportType(null);
  }
  function handleImportCancel() {
    setImportPreview(null);
    setImportType(null);
  }

  // Add sample CSV generation
  function generateSampleCSV(type: 'holdings' | 'dividends'): string {
    if (type === 'holdings') {
      return 'symbol,shares,avgPrice,dividendYield,costBasis,sector,currentPrice\nAAPL,10,150.00,0.65,1500.00,Technology,175.00\nMSFT,5,250.00,0.80,1250.00,Technology,300.00';
    } else {
      return 'symbol,amount,date\nAAPL,0.23,2024-03-15\nMSFT,0.68,2024-03-14';
    }
  }

  function handleSampleCSV(type: 'holdings' | 'dividends') {
    const csv = generateSampleCSV(type);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sample_${type}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Add custom tooltip component
  const CustomTooltip = ({ content, children }: { content: React.ReactNode, children: React.ReactNode }) => {
    const [isVisible, setIsVisible] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (isVisible && tooltipRef.current && triggerRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        
        // Position tooltip above the trigger
        tooltipRef.current.style.top = `${triggerRect.top - tooltipRect.height - 10}px`;
        tooltipRef.current.style.left = `${triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2)}px`;
      }
    }, [isVisible]);

    return (
      <div className="relative">
        <div
          ref={triggerRef}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          {children}
        </div>
        {isVisible && (
          <div
            ref={tooltipRef}
            className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
          >
            {content}
          </div>
        )}
      </div>
    );
  };

  // Add HelpContent component
  const HelpContent = ({ type }: { type: 'holdings' | 'dividends' }) => (
    <div className="p-4 max-w-sm">
      <div className="space-y-4">
        <div>
          <Text small type="secondary" className="font-medium">Supported Applications</Text>
          <p className="mt-1 text-sm text-gray-600">
            CSV files can be opened in Excel, Google Sheets, or Numbers. Use the "Copy for Spreadsheets" option to paste directly into these applications.
          </p>
        </div>
        <div>
          <Text small type="secondary" className="font-medium">Required CSV Headers</Text>
          <div className="mt-1 space-y-1">
            {type === 'holdings' ? (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Holdings:</span> symbol, shares, avgPrice, dividendYield, costBasis, sector, currentPrice
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Dividends:</span> symbol, amount, date
              </p>
            )}
          </div>
        </div>
        <div>
          <Text small type="secondary" className="font-medium">Tips</Text>
          <ul className="mt-1 space-y-1 text-sm text-gray-600">
            <li>• Download a sample CSV to see the correct format</li>
            <li>• Ensure all numeric values are properly formatted</li>
            <li>• Dates should be in YYYY-MM-DD format</li>
            <li>• Preview your data before importing</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // Real-time price update for a holding
  async function handleRefreshPrice(symbol: string) {
    const idx = holdings.findIndex(h => h.symbol === symbol);
    if (idx === -1) return;
    setRefreshingIndex(idx);
    try {
      const quote = await getStockQuote(symbol);
      if (quote && typeof quote.c === 'number') {
        editHolding(symbol, { currentPrice: quote.c });
        toast({ title: 'Success', description: `Updated price for ${symbol}: $${quote.c.toFixed(2)}`, variant: 'success' });
      } else {
        toast({ title: 'Error', description: 'Failed to fetch price', variant: 'destructive' });
      }
    } catch (e) {
      toast({ title: 'Error', description: 'Error fetching price', variant: 'destructive' });
    } finally {
      setRefreshingIndex(null);
    }
  }

  function handleRemoveHolding(symbol: string) {
    const idx = holdings.findIndex(h => h.symbol === symbol);
    if (idx !== -1) {
      removeHolding(idx);
    }
  }
  function handleUpdateHolding(symbol: string, holding: Holding) {
    const idx = holdings.findIndex(h => h.symbol === symbol);
    if (idx !== -1) {
      updateHolding(idx, holding);
    }
  }

  const handleDeleteHolding = async (holding: Holding) => {
    try {
      await deleteHolding(holding.symbol);
      toast({
        title: 'Success',
        description: `${holding.symbol} has been deleted from your portfolio.`,
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete holding. Please try again.',
        variant: 'destructive'
      });
    }
  };

  if (error) {
    throw error; // This will be caught by the ErrorBoundary
  }

  return (
    <ErrorBoundary>
      <main>
        <PortfolioSelector />
        <h1 className="mb-8">Portfolio</h1>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 w-full max-w-lg relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
                onClick={() => setShowForm(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Add Position</h2>
              <AddHoldingForm
                form={form}
                setForm={setForm}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
                onCancel={() => setShowForm(false)}
                onSubmit={handleAddHolding}
                handleChange={handleChange}
              />
            </div>
          </div>
        )}
        <HoldingsTable
          holdings={filteredHoldings}
          onEdit={(holding) => openEditHolding(holding.symbol)}
          onDelete={handleDeleteHolding}
          onRefresh={(holding) => handleRefreshPrice(holding.symbol)}
          onUpdate={(holding) => handleUpdateHolding(holding.symbol, holding)}
          onAdd={() => setShowForm(true)}
          loading={isLoading}
        />
        <Watchlist />
      </main>
    </ErrorBoundary>
  );
}

// AddHoldingForm component (inline for now)
interface AddHoldingFormProps {
  form: any;
  setForm: Dispatch<SetStateAction<any>>;
  formErrors: { [key: string]: string };
  setFormErrors: Dispatch<SetStateAction<{ [key: string]: string }>>;
  onCancel: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}
function AddHoldingForm({ form, setForm, formErrors, setFormErrors, onCancel, onSubmit, handleChange }: AddHoldingFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="ticker">Ticker</label>
        <input
          id="ticker"
          name="ticker"
          value={form.ticker}
          onChange={handleChange}
          placeholder="e.g. AAPL"
          required
          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="text-xs text-gray-500 mt-1">Enter the stock ticker symbol (e.g. AAPL). Logo will be shown automatically.</div>
        {formErrors.ticker && <div className="text-red-500 text-xs mt-1">{formErrors.ticker}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="shares">Shares</label>
        <input
          id="shares"
          name="shares"
          value={form.shares}
          onChange={handleChange}
          placeholder="Shares"
          type="number"
          min={0}
          step="any"
          required
          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {formErrors.shares && <div className="text-red-500 text-xs mt-1">{formErrors.shares}</div>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="avgPrice">Avg. Price</label>
        <input
          id="avgPrice"
          name="avgPrice"
          value={form.avgPrice}
          onChange={handleChange}
          placeholder="Avg. Price"
          type="number"
          min={0}
          step="any"
          required
          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {formErrors.avgPrice && <div className="text-red-500 text-xs mt-1">{formErrors.avgPrice}</div>}
      </div>
      <div className="flex gap-2 justify-end items-end mt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white">Save</button>
      </div>
    </form>
  );
} 