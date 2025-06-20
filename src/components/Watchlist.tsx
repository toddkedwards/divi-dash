import React, { useState, useEffect } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { useRealTimePrices } from '../hooks/useRealTimePrices';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RefreshCw, ChevronUp, ChevronDown, PlusCircle, Trash2, Info, Loader2, CheckCircle } from 'lucide-react';
import { companyInfo } from '../utils/companyLogos';
import { getStockProfile, getNews } from '../utils/finnhub';
import { usePortfolio } from '../context/PortfolioContext';

export default function Watchlist() {
  const { watchlist, removeFromWatchlist, addToWatchlist, syncing, syncError } = useWatchlist();
  const { priceUpdates, isUpdating, error, updatePrices } = useRealTimePrices(
    watchlist.map(symbol => ({ symbol, shares: 0, avgPrice: 0, currentPrice: 0, costBasis: 0, dividendYield: 0, sector: '', payoutFrequency: '', lastExDate: '', lastPaymentDate: '', nextExDate: '', nextPaymentDate: '', dividendHistory: [] }))
  );
  const { addHolding } = usePortfolio();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTicker, setNewTicker] = useState('');
  const [addError, setAddError] = useState('');
  const [profileCache, setProfileCache] = useState<Record<string, { name: string; logo: string }>>({});
  const [showPortfolioModal, setShowPortfolioModal] = useState<string | null>(null);
  const [portfolioForm, setPortfolioForm] = useState<{ shares: string; costBasis: string }>({ shares: '', costBasis: '' });
  const [portfolioFormError, setPortfolioFormError] = useState('');
  const [search, setSearch] = useState('');
  const [newsPopover, setNewsPopover] = useState<{ symbol: string; anchor: HTMLElement | null } | null>(null);
  const [newsData, setNewsData] = useState<Record<string, any[]>>({});
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch company names and logos for tickers not in companyInfo or cache
    const missing = watchlist.filter(symbol => !companyInfo[symbol] && !profileCache[symbol]);
    if (missing.length === 0) return;
    missing.forEach(async (symbol) => {
      try {
        const profile = await getStockProfile(symbol);
        if (profile && (profile.name || profile.logo)) {
          setProfileCache(prev => ({ ...prev, [symbol]: { name: profile.name || symbol, logo: profile.logo || '' } }));
        }
      } catch {}
    });
  }, [watchlist, profileCache]);

  const handleAdd = () => {
    if (!newTicker.trim()) {
      setAddError('Please enter a ticker');
      return;
    }
    addToWatchlist(newTicker.trim().toUpperCase());
    setShowAddModal(false);
    setNewTicker('');
    setAddError('');
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 md:p-6 mt-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-4 gap-2">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">Watchlist</h2>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition-colors text-base"
            onClick={() => setShowAddModal(true)}
          >
            + Add to Watchlist
          </button>
          {/* Sync status indicator */}
          <div className="flex items-center gap-1">
            {syncing ? (
              <>
                <Loader2 className="animate-spin text-blue-500" size={20} />
                <span className="text-xs text-blue-600 font-medium" title="Syncing...">Syncing</span>
              </>
            ) : syncError ? (
              <>
                <AlertCircle className="text-red-500" size={20} />
                <span className="text-xs text-red-600 font-medium" title={syncError}>Error</span>
              </>
            ) : (
              <>
                <CheckCircle className="text-green-500" size={20} />
                <span className="text-xs text-green-600 font-medium" title="Synced">Synced</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by ticker or company..."
          className="w-full md:w-72 px-4 py-2 border rounded text-base bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        />
      </div>
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 w-full max-w-sm relative flex flex-col gap-6">
            <button
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
              onClick={() => setShowAddModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100 text-left">Add to Watchlist</h2>
            <input
              type="text"
              value={newTicker}
              onChange={e => setNewTicker(e.target.value)}
              placeholder="Enter ticker (e.g. AAPL)"
              className="w-full px-4 py-3 border rounded mb-2 text-base"
            />
            {addError && <div className="text-red-500 text-sm mb-2">{addError}</div>}
            <button
              className="w-full px-4 py-3 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition-colors text-lg mt-2"
              onClick={handleAdd}
            >
              Add
            </button>
          </div>
        </div>
      )}
      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-2xl font-semibold text-gray-500 dark:text-gray-400 mb-4">No symbols in your watchlist</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs md:text-sm rounded-lg border border-gray-200 dark:border-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left py-3 px-4 border-r border-gray-200 dark:border-gray-700 font-bold text-xs text-gray-500 dark:text-gray-400 uppercase">Ticker</th>
                <th className="text-left py-3 px-4 border-r border-gray-200 dark:border-gray-700 font-bold text-xs text-gray-500 dark:text-gray-400 uppercase">Company</th>
                <th className="text-right py-3 px-4 border-r border-gray-200 dark:border-gray-700 font-bold text-xs text-gray-500 dark:text-gray-400 uppercase">Price</th>
                <th className="text-right py-3 px-4 border-r border-gray-200 dark:border-gray-700 font-bold text-xs text-gray-500 dark:text-gray-400 uppercase">Daily Change</th>
                <th className="text-right py-3 px-4 border-r border-gray-200 dark:border-gray-700 font-bold text-xs text-gray-500 dark:text-gray-400 uppercase">Last Update</th>
                <th className="text-left py-3 px-4 font-bold text-xs text-gray-500 dark:text-gray-400 uppercase"> </th>
              </tr>
            </thead>
            <tbody>
              {watchlist
                .filter(symbol => {
                  const companyName = companyInfo[symbol]?.name || profileCache[symbol]?.name || symbol;
                  return (
                    symbol.toLowerCase().includes(search.toLowerCase()) ||
                    companyName.toLowerCase().includes(search.toLowerCase())
                  );
                })
                .map((symbol, idx) => {
                  const update = priceUpdates[symbol];
                  const price = update?.currentPrice;
                  const change = update?.dailyChange;
                  const percent = update?.dailyChangePercent;
                  const error = update?.error;
                  const lastUpdate = update?.lastUpdate;
                  const previousPrice = update?.previousPrice;
                  const priceChanged = previousPrice !== undefined && price !== previousPrice;
                  const companyName = companyInfo[symbol]?.name || profileCache[symbol]?.name || symbol;
                  const logo = companyInfo[symbol]?.logo || profileCache[symbol]?.logo;
                  return (
                    <tr
                      key={symbol}
                      className={`transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'} hover:bg-green-50 dark:hover:bg-green-900 border-b border-gray-200 dark:border-gray-700`}
                    >
                      <td className="py-2 px-4 font-mono font-normal text-gray-900 dark:text-gray-100 flex items-center gap-2 border-r border-gray-200 dark:border-gray-700">
                        {logo
                          ? <img src={logo} alt={symbol} className="w-6 h-6 rounded bg-white border border-gray-200 dark:border-gray-700" />
                          : <span className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">?</span>}
                        <span>{symbol}</span>
                      </td>
                      <td className="py-2 px-4 font-normal text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 text-left">{companyName}</td>
                      <td className="py-2 px-4 font-normal text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 text-right">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={price}
                            initial={priceChanged ? { y: -10, opacity: 0 } : false}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 10, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={priceChanged ? (price > previousPrice! ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400') : ''}
                          >
                            {price !== undefined && price !== 0 ? `$${price.toFixed(2)}` : '--'}
                          </motion.div>
                        </AnimatePresence>
                      </td>
                      <td className="py-2 px-4 font-normal border-r border-gray-200 dark:border-gray-700 text-right">
                        {change !== undefined && percent !== undefined ? (
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${change > 0 ? 'bg-green-100 text-green-700' : change < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'} dark:${change > 0 ? 'bg-green-900 text-green-300' : change < 0 ? 'bg-red-900 text-red-300' : 'bg-gray-800 text-gray-300'}`}>
                            {change > 0 && <ChevronUp size={14} className="inline-block" />}
                            {change < 0 && <ChevronDown size={14} className="inline-block" />}
                            {change > 0 ? '+' : ''}{change.toFixed(2)} ({percent > 0 ? '+' : ''}{percent.toFixed(2)}%)
                          </span>
                        ) : '--'}
                      </td>
                      <td className="py-2 px-4 font-normal text-gray-900 dark:text-gray-100 border-r border-gray-200 dark:border-gray-700 text-right">{lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : '--'}</td>
                      <td className="py-2 px-4 font-normal text-left">
                        <div className="flex items-center gap-2">
                          {error && (
                            <span className="text-red-500 text-xs" title={error}>
                              <AlertCircle size={14} />
                            </span>
                          )}
                          <button
                            className="p-1 rounded hover:bg-green-100 dark:hover:bg-green-900 text-green-700 dark:text-green-300"
                            title="Add to Portfolio"
                            onClick={() => setShowPortfolioModal(symbol)}
                          >
                            <PlusCircle size={18} />
                          </button>
                          <button
                            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                            title="Remove from Watchlist"
                            onClick={() => removeFromWatchlist(symbol)}
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-300"
                            title="Show News"
                            onClick={async (e) => {
                              e.stopPropagation();
                              setNewsPopover({ symbol, anchor: e.currentTarget });
                              if (!newsData[symbol]) {
                                setNewsLoading(true);
                                setNewsError(null);
                                try {
                                  const news = await getNews(symbol);
                                  setNewsData(prev => ({ ...prev, [symbol]: news.slice(0, 5) }));
                                } catch (err) {
                                  setNewsError('Failed to fetch news');
                                }
                                setNewsLoading(false);
                              }
                            }}
                          >
                            <Info size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
      {showPortfolioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 w-full max-w-sm relative flex flex-col gap-6">
            <button
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
              onClick={() => { setShowPortfolioModal(null); setPortfolioForm({ shares: '', costBasis: '' }); setPortfolioFormError(''); }}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100 text-left">Add {showPortfolioModal} to Portfolio</h2>
            <input
              type="number"
              value={portfolioForm.shares}
              onChange={e => setPortfolioForm(f => ({ ...f, shares: e.target.value }))}
              placeholder="Shares"
              className="w-full px-4 py-3 border rounded mb-2 text-base"
            />
            <input
              type="number"
              value={portfolioForm.costBasis}
              onChange={e => setPortfolioForm(f => ({ ...f, costBasis: e.target.value }))}
              placeholder="Cost Basis (per share)"
              className="w-full px-4 py-3 border rounded mb-2 text-base"
            />
            {portfolioFormError && <div className="text-red-500 text-sm mb-2">{portfolioFormError}</div>}
            <button
              className="w-full px-4 py-3 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition-colors text-lg mt-2"
              onClick={() => {
                if (!portfolioForm.shares || !portfolioForm.costBasis) {
                  setPortfolioFormError('Please enter shares and cost basis');
                  return;
                }
                addHolding({
                  symbol: showPortfolioModal,
                  shares: Number(portfolioForm.shares),
                  avgPrice: Number(portfolioForm.costBasis),
                  dividendYield: 0,
                  costBasis: Number(portfolioForm.shares) * Number(portfolioForm.costBasis),
                  sector: '',
                  currentPrice: priceUpdates[showPortfolioModal]?.currentPrice || 0,
                  payoutFrequency: 'quarterly',
                  lastExDate: '',
                  lastPaymentDate: '',
                  nextExDate: '',
                  nextPaymentDate: '',
                  dividendHistory: [],
                });
                setShowPortfolioModal(null);
                setPortfolioForm({ shares: '', costBasis: '' });
                setPortfolioFormError('');
              }}
            >
              Add to Portfolio
            </button>
          </div>
        </div>
      )}
      {/* News Popover */}
      {newsPopover && (
        <div
          className="fixed z-50 left-0 top-0 w-full h-full flex items-center justify-center bg-black bg-opacity-20"
          onClick={() => setNewsPopover(null)}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6 w-full max-w-md relative"
            style={{ zIndex: 100 }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
              onClick={() => setNewsPopover(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Latest News for {newsPopover.symbol}</h3>
            {newsLoading ? (
              <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            ) : newsError ? (
              <div className="text-red-500">{newsError}</div>
            ) : newsData[newsPopover.symbol] && newsData[newsPopover.symbol].length > 0 ? (
              <ul className="space-y-3">
                {newsData[newsPopover.symbol].map((n, i) => (
                  <li key={i}>
                    <a href={n.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">{n.headline}</a>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{n.source} &middot; {n.datetime ? new Date(n.datetime * 1000).toLocaleDateString() : ''}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 dark:text-gray-400">No news found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 