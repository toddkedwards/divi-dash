"use client";
import React, { useState, useRef, useEffect } from 'react';
import type { MouseEvent, ChangeEvent } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './calendar.module.css';
import { holdings as initialHoldings, Holding, PayoutFrequency } from '../../data/holdings';
import { dividends as initialDividends } from '../../data/dividends';
import {
  adjustToBusinessDay,
  getExDividendDate,
  addMonthsWithBusinessDayAdjustment,
  formatDateInTimezone,
  toNYSETimezone,
  isMarketHoliday,
  isWeekend
} from '../../utils/dateUtils';
import { companyInfo } from "@/utils/companyLogos";
import { format } from "date-fns";
import { addMonths, isSameDay, isSameMonth } from "date-fns";
import { getNextBusinessDay, getPreviousBusinessDay } from "@/utils/dateUtils";
import { Calendar as CalendarIcon, Download } from '@geist-ui/icons';
import { useToast } from '@/components/ToastProvider';
import ConfirmDialog from '@/components/ConfirmDialog';
import { getDividends } from '@/utils/finnhub';
import { useUserSettings } from '@/context/UserSettingsContext';
import ProBadge from '@/components/ProBadge';
import { usePortfolio } from '@/context/PortfolioContext';

// Local types for holdings and dividends
interface Dividend {
  symbol: string;
  amount: number;
  date: string;
}

// Types
interface Payout {
  symbol: string;
  amount: number;
  date: Date;
  auto: boolean;
  type: 'ex-date' | 'payment-date';
  growth?: number;
  source?: string;
  priority?: 'high' | 'medium' | 'low';
  notificationTiming?: number; // Days before event to notify
}

// Generate upcoming payouts based on frequency and historical data
function getUpcomingDividends(holdings: Holding[]): Payout[] {
  const payouts: Payout[] = [];
  const today = toNYSETimezone(new Date());

  holdings.forEach((h) => {
    // Skip if no dividend yield
    if (!h.dividendYield) return;

    // Add historical payouts if available
    if (h.dividendHistory && h.dividendHistory.length > 0) {
      h.dividendHistory.forEach((history) => {
        payouts.push({
          symbol: h.symbol,
          amount: history.amount,
          date: new Date(history.exDate),
          auto: true,
          type: 'ex-date',
          growth: history.growth
        });
        payouts.push({
          symbol: h.symbol,
          amount: history.amount,
          date: new Date(history.paymentDate),
          auto: true,
          type: 'payment-date',
          growth: history.growth
        });
      });

      // Add next known ex-date and payment date if available
      if (h.nextExDate && h.nextPaymentDate) {
        payouts.push({
          symbol: h.symbol,
          amount: h.dividendHistory[0].amount,
          date: new Date(h.nextExDate),
          auto: true,
          type: 'ex-date',
          growth: h.dividendGrowthRate
        });
        payouts.push({
          symbol: h.symbol,
          amount: h.dividendHistory[0].amount,
          date: new Date(h.nextPaymentDate),
          auto: true,
          type: 'payment-date',
          growth: h.dividendGrowthRate
        });
      }
    }

    // If no dividend history, estimate based on current yield
    const estimatedQuarterlyAmount = (h.currentPrice * h.shares * (h.dividendYield / 100)) / 4;

    // Generate future payouts based on frequency and typical payment patterns
    let currentDate = h.nextPaymentDate ? new Date(h.nextPaymentDate) : today;
    const monthsToProject = 12;

    for (let i = 0; i < monthsToProject; i++) {
      // Calculate next payment date based on frequency and typical payment pattern
      let nextPaymentDate: Date;
      
      if (h.payoutFrequency === 'monthly' && h.typicalPaymentDay) {
        nextPaymentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, h.typicalPaymentDay);
      } else if (h.typicalPaymentMonth) {
        const nextMonth = h.typicalPaymentMonth.find(m => m > currentDate.getMonth()) || h.typicalPaymentMonth[0];
        const nextYear = nextMonth < currentDate.getMonth() ? currentDate.getFullYear() + 1 : currentDate.getFullYear();
        nextPaymentDate = new Date(nextYear, nextMonth, 15); // Use 15th as default day
      } else {
        nextPaymentDate = addMonthsWithBusinessDayAdjustment(currentDate, getFrequencyMonths(h.payoutFrequency));
      }

      // Adjust for weekends and holidays
      nextPaymentDate = adjustToBusinessDay(nextPaymentDate);
      
      // Calculate ex-dividend date
      const exDate = getExDividendDate(nextPaymentDate);

      // Use historical amount if available, otherwise use estimated amount
      const amount = h.dividendHistory && h.dividendHistory.length > 0 
        ? h.dividendHistory[0].amount 
        : estimatedQuarterlyAmount;

      // Add both dates to payouts
      payouts.push({
        symbol: h.symbol,
        amount,
        date: exDate,
        auto: true,
        type: 'ex-date',
        growth: h.dividendGrowthRate
      });

      payouts.push({
        symbol: h.symbol,
        amount,
        date: nextPaymentDate,
        auto: true,
        type: 'payment-date',
        growth: h.dividendGrowthRate
      });

      currentDate = nextPaymentDate;
    }
  });

  return payouts;
}

function getFrequencyDivisor(frequency: PayoutFrequency): number {
  switch (frequency) {
    case 'monthly': return 12;
    case 'quarterly': return 4;
    case 'semi-annual': return 2;
    case 'annual': return 1;
  }
}

function getFrequencyMonths(frequency: PayoutFrequency): number {
  switch (frequency) {
    case 'monthly': return 1;
    case 'quarterly': return 3;
    case 'semi-annual': return 6;
    case 'annual': return 12;
  }
}

// Use existing dividends as past payouts
function getPastDividends(dividends: Dividend[]): Payout[] {
  return dividends.map((d) => ({ 
    symbol: d.symbol, 
    amount: d.amount, 
    date: new Date(d.date), 
    auto: true,
    type: 'payment-date'
  }));
}

function generateICS(payouts: Payout[]): string {
  function pad(n: number) { return n < 10 ? '0' + n : String(n); }
  function formatDate(date: Date) {
    return date.getUTCFullYear() +
      pad(date.getUTCMonth() + 1) +
      pad(date.getUTCDate()) + 'T' +
      pad(date.getUTCHours()) +
      pad(date.getUTCMinutes()) +
      pad(date.getUTCSeconds()) + 'Z';
  }
  let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nPRODID:Divly\n';
  payouts.forEach((p, i) => {
    const start = formatDate(new Date(p.date));
    // 1 hour event
    const end = formatDate(new Date(new Date(p.date).getTime() + 60 * 60 * 1000));
    ics += 'BEGIN:VEVENT\n';
    ics += `UID:divly-${p.symbol}-${start}-${i}@divly\n`;
    ics += `SUMMARY:${p.symbol} ${p.type === 'ex-date' ? 'Ex-Date' : 'Payment'}\n`;
    ics += `DESCRIPTION:Dividend payout for ${p.symbol} ($${p.amount.toFixed(2)})\n`;
    ics += `DTSTART:${start}\n`;
    ics += `DTEND:${end}\n`;
    ics += 'END:VEVENT\n';
  });
  ics += 'END:VCALENDAR';
  return ics;
}

function downloadICS(payouts: Payout[], filename = 'dividends.ics') {
  const ics = generateICS(payouts);
  const blob = new Blob([ics.replace(/\n/g, '\r\n')], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

export default function DividendCalendarPage() {
  const { toast } = useToast();
  const { settings, updateSetting } = useUserSettings();
  const { holdings } = usePortfolio();
  // User-modified payouts (add/edit/delete)
  const [userPayouts, setUserPayouts] = useState<Payout[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(toNYSETimezone(new Date()));
  const [form, setForm] = useState<Omit<Payout, 'auto'>>({ symbol: '', amount: 0, date: new Date(), type: 'payment-date' });
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [popoverDate, setPopoverDate] = useState<Date | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const exportBtnRef = useRef<HTMLButtonElement>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [apiPayouts, setApiPayouts] = useState<Payout[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  // Filtering state
  const [filterCompany, setFilterCompany] = useState('');
  const [filterMinAmount, setFilterMinAmount] = useState('');
  const [filterMaxAmount, setFilterMaxAmount] = useState('');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');
  const [detailsPayout, setDetailsPayout] = useState<Payout | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'day'>(settings.calendarDefaultView);
  const isProUser = false; // TODO: Replace with real check
  const [notificationSettings, setNotificationSettings] = useState({
    defaultTiming: 7, // Default days before event
    priorityLevels: {
      high: { timing: 14, enabled: true },
      medium: { timing: 7, enabled: true },
      low: { timing: 3, enabled: true }
    }
  });

  // Always use the user's default view unless explicitly changed
  useEffect(() => {
    setViewMode(settings.calendarDefaultView);
  }, [settings.calendarDefaultView]);

  // Auto-generated payouts
  const autoPayouts: Payout[] = holdings.length > 0
    ? getUpcomingDividends(holdings)
    : [];

  // Fetch API dividend events for all holdings
  useEffect(() => {
    async function fetchApiDividends() {
      try {
        const payouts: Payout[] = [];
        const now = new Date();
        const from = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10); // 30 days ago
        const to = now.toISOString().slice(0, 10);
        for (const h of holdings) {
          const dividends = await getDividends(h.symbol, from, to);
          for (const d of dividends) {
            payouts.push({
              symbol: h.symbol,
              amount: d.amount,
              date: new Date(d.exDate),
              auto: false,
              type: 'ex-date',
              growth: undefined,
              source: 'API',
            });
            payouts.push({
              symbol: h.symbol,
              amount: d.amount,
              date: new Date(d.paymentDate),
              auto: false,
              type: 'payment-date',
              growth: undefined,
              source: 'API',
            });
          }
        }
        setApiPayouts(payouts);
      } catch (e) {
        toast({ title: 'Error', description: 'Failed to fetch live dividend events', variant: 'destructive' });
      }
    }
    fetchApiDividends();
  }, []);

  // Merge auto-generated, API, and user-modified payouts
  const allPayouts: Payout[] = [
    ...autoPayouts.filter(
      (auto) => !userPayouts.some((user) => user.date.toISOString() === auto.date.toISOString() && user.symbol === auto.symbol)
    ),
    ...userPayouts,
    ...apiPayouts
  ];

  // Get unique companies
  const companies = Array.from(new Set(allPayouts.map(p => p.symbol)));

  // Filter payouts
  const filteredPayouts = allPayouts.filter(p => {
    const amt = p.amount;
    const date = p.date;
    const companyMatch = filterCompany ? p.symbol === filterCompany : true;
    const minMatch = filterMinAmount ? amt >= parseFloat(filterMinAmount) : true;
    const maxMatch = filterMaxAmount ? amt <= parseFloat(filterMaxAmount) : true;
    const fromMatch = filterFromDate ? date >= new Date(filterFromDate) : true;
    const toMatch = filterToDate ? date <= new Date(filterToDate) : true;
    return companyMatch && minMatch && maxMatch && fromMatch && toMatch;
  });

  // Group payouts by date for calendar display
  const payoutsByDate: Record<string, Payout[]> = filteredPayouts.reduce((acc: Record<string, Payout[]>, p) => {
    acc[p.date.toISOString().slice(0, 10)] = acc[p.date.toISOString().slice(0, 10)] || [];
    acc[p.date.toISOString().slice(0, 10)].push(p);
    return acc;
  }, {});

  // Compute all events for the selected month
  const selectedMonthEvents = Object.values(payoutsByDate).flat().filter(p =>
    p.date.getFullYear() === selectedDate.getFullYear() &&
    p.date.getMonth() === selectedDate.getMonth()
  );

  // Compute all events for the selected day
  const selectedDayEvents = payoutsByDate[selectedDate.toISOString().slice(0, 10)] || [];

  // Today's date for highlighting
  const todayStr = new Date().toISOString().slice(0, 10);

  // Modified handleDayClick to switch to day view
  const handleDayClick = (value: Date | null, event: React.MouseEvent<HTMLButtonElement>) => {
    if (value instanceof Date) {
      const nyseDate = toNYSETimezone(value);
      setSelectedDate(nyseDate);
      setForm({ 
        symbol: '', 
        amount: 0, 
        date: nyseDate, 
        type: 'payment-date' 
      });
      setEditingIndex(-1);
      setViewMode('day');
      // Show popover if there are events on this day
      if ((payoutsByDate[nyseDate.toISOString().slice(0, 10)] || []).length > 0) {
        setPopoverDate(nyseDate);
      } else {
        setPopoverDate(null);
      }
    }
  };

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAddPayout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const payoutDate = new Date(form.date);
    const adjustedDate = adjustToBusinessDay(payoutDate);
    
    const newPayout = {
      ...form,
      date: adjustedDate,
      auto: false
    };

    if (editingIndex >= 0) {
      setUserPayouts(userPayouts.map((p, i) => i === editingIndex ? newPayout : p));
      setEditingIndex(-1);
    } else {
      setUserPayouts([...userPayouts, newPayout]);
    }
    setForm({ symbol: '', amount: 0, date: new Date(), type: 'payment-date' });
    setPopoverDate(null);
    toast({ title: 'Success', description: 'Payout added successfully', variant: 'default' });
  }

  function handleEditPayout(index: number) {
    setForm({ 
      symbol: userPayouts[index].symbol, 
      amount: userPayouts[index].amount, 
      date: userPayouts[index].date,
      type: userPayouts[index].type
    });
    setEditingIndex(index);
    setSelectedDate(toNYSETimezone(new Date(userPayouts[index].date)));
    toast({ title: 'Info', description: 'Payout ready to edit', variant: 'default' });
  }

  function handleDeletePayout(index: number) {
    setDeleteIndex(index);
  }

  function handleDeletePayoutConfirm() {
    if (deleteIndex !== null) {
      setUserPayouts(userPayouts.filter((_, i) => i !== deleteIndex));
      setForm({ symbol: '', amount: 0, date: new Date(), type: 'payment-date' });
      setEditingIndex(-1);
      setPopoverDate(null);
      toast({ title: 'Success', description: 'Payout deleted', variant: 'default' });
      setDeleteIndex(null);
    }
  }

  function handleDeletePayoutCancel() {
    setDeleteIndex(null);
  }

  function closePopover() {
    setPopoverDate(null);
  }

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    const payouts = payoutsByDate[date.toISOString().slice(0, 10)] || [];
    if (payouts.length === 0) return null;
    return (
      <div className="flex flex-wrap justify-center gap-0.5 mt-1">
        {payouts.slice(0, 3).map((payout, index) => (
          <span
            key={index}
            className={`w-2 h-2 rounded-full inline-block bg-primary`}
            title={`${payout.symbol} $${payout.amount.toFixed(2)}`}
          />
        ))}
        {payouts.length > 3 && <span className="text-xs text-gray-400">+{payouts.length - 3}</span>}
      </div>
    );
  };

  // Request notification permission
  function enableNotifications() {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setNotificationsEnabled(true);
          toast({ title: 'Success', description: 'Notifications enabled!', variant: 'success' });
        } else {
          toast({ title: 'Info', description: 'Notifications not enabled.', variant: 'default' });
        }
      });
    } else {
      toast({ title: 'Error', description: 'Notifications not supported in this browser.', variant: 'destructive' });
    }
  }

  // Enhanced notification function for Pro users
  function showDividendNotification(payout: Payout) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = `${payout.symbol} ${payout.type === 'ex-date' ? 'Ex-Date' : 'Payment'} Soon!`;
      const body = `Amount: $${payout.amount.toFixed(2)} on ${payout.date.toLocaleDateString()}`;
      const options: NotificationOptions = {
        body,
        icon: '/logo.png',
        badge: '/logo.png',
        tag: `dividend-${payout.symbol}-${payout.date.toISOString()}`,
        requireInteraction: true,
      };
      if (isProUser) {
        (options as any).actions = [
          { action: 'view', title: 'View Details' },
          { action: 'snooze', title: 'Snooze 1 Day' }
        ];
        (options as any).vibrate = [200, 100, 200];
        (options as any).renotify = true;
        (options as any).silent = false;
      }
      const notification = new (window.Notification as any)(title, options);
      notification.onclick = () => {
        window.focus();
        setSelectedDate(payout.date);
        setDetailsPayout(payout);
      };
      notification.onaction = (event: Event) => {
        if ((event as any).action === 'snooze' && isProUser) {
          const snoozeDate = new Date(payout.date);
          snoozeDate.setDate(snoozeDate.getDate() + 1);
          showDividendNotification({ ...payout, date: snoozeDate });
        }
      };
    }
  }

  // Enhanced notification scheduling for Pro users
  useEffect(() => {
    if (!notificationsEnabled || !settings.notificationsEnabled) return;
    
    const now = new Date();
    const upcoming = allPayouts.filter(p => p.date > now);
    
    const timeouts: number[] = upcoming.map(p => {
      const timing = isProUser 
        ? (p.notificationTiming || notificationSettings.priorityLevels[p.priority || 'medium'].timing)
        : 7; // Default 7 days for non-Pro users
      
      const notifyDate = new Date(p.date);
      notifyDate.setDate(notifyDate.getDate() - timing);
      
      const ms = notifyDate.getTime() - now.getTime();
      if (ms > 0 && ms < 30 * 24 * 60 * 60 * 1000) { // Max 30 days ahead
        // eslint-disable-next-line
        // @ts-ignore
        return window.setTimeout(() => showDividendNotification(p), ms);
      }
      return 0;
    });

    return () => { timeouts.forEach(t => t && clearTimeout(t)); };
  }, [notificationsEnabled, allPayouts, settings.notificationsEnabled, isProUser, notificationSettings]);

  // Add Pro notification settings UI
  const renderNotificationSettings = () => {
    if (!isProUser) return null;

    return (
      <div className="mt-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Priority Notification Settings</h3>
        <div className="space-y-4">
          {Object.entries(notificationSettings.priorityLevels).map(([level, settings]) => (
            <div key={level} className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => {
                    setNotificationSettings(prev => ({
                      ...prev,
                      priorityLevels: {
                        ...prev.priorityLevels,
                        [level]: { ...settings, enabled: e.target.checked }
                      }
                    }));
                  }}
                  className="rounded border-gray-300"
                />
                <span className="capitalize">{level} Priority</span>
              </label>
              <input
                type="number"
                value={settings.timing}
                onChange={(e) => {
                  setNotificationSettings(prev => ({
                    ...prev,
                    priorityLevels: {
                      ...prev.priorityLevels,
                      [level]: { ...settings, timing: parseInt(e.target.value) }
                    }
                  }));
                }}
                className="w-20 rounded border px-2 py-1"
                min="1"
                max="30"
              />
              <span className="text-sm text-gray-500">days before</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // In the Events section, determine which events to show based on viewMode
  const eventsToShow = viewMode === 'month' ? selectedMonthEvents : selectedDayEvents;

  return (
    <main className="max-w-6xl mx-auto my-10 px-4 bg-white dark:bg-[#18181b] min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Dividend Calendar</h1>
        <div className="relative">
          <button
            ref={exportBtnRef}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary-dark active:bg-primary-dark transition-colors"
            onClick={() => setExportOpen((v) => !v)}
            aria-label="Export Calendar"
          >
            <CalendarIcon size={20} /> Export Calendar
          </button>
          {exportOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-xl rounded-xl z-50">
              <button className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-800 text-left text-gray-900 dark:text-gray-100" onClick={() => { downloadICS(allPayouts, 'dividends.ics'); setExportOpen(false); toast({ title: 'Success', description: 'iCal file downloaded!', variant: 'default' }); }}>
                <Download size={18} /> Export to iCal (.ics)
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-800 text-left text-gray-900 dark:text-gray-100" onClick={() => { downloadICS(allPayouts, 'dividends.ics'); setExportOpen(false); toast({ title: 'Info', description: 'Google Calendar: Import the .ics file at calendar.google.com > Settings > Import & Export.', variant: 'default' }); }}>
                <CalendarIcon size={18} /> Export to Google Calendar
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-800 text-left text-gray-900 dark:text-gray-100" onClick={() => { downloadICS(allPayouts, 'dividends.ics'); setExportOpen(false); toast({ title: 'Success', description: 'Outlook .ics file downloaded!', variant: 'default' }); }}>
                <CalendarIcon size={18} /> Export to Outlook
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-10 items-start">
        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-sm rounded-2xl p-6 mb-4 relative">
          <div className="mb-6 flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold mb-1">Company</label>
              <select value={filterCompany} onChange={e => setFilterCompany(e.target.value)} className="rounded border px-2 py-1">
                <option value="">All</option>
                {companies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Min Amount</label>
              <input type="number" value={filterMinAmount} onChange={e => setFilterMinAmount(e.target.value)} className="rounded border px-2 py-1" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Max Amount</label>
              <input type="number" value={filterMaxAmount} onChange={e => setFilterMaxAmount(e.target.value)} className="rounded border px-2 py-1" placeholder="" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">From Date</label>
              <input type="date" value={filterFromDate} onChange={e => setFilterFromDate(e.target.value)} className="rounded border px-2 py-1" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">To Date</label>
              <input type="date" value={filterToDate} onChange={e => setFilterToDate(e.target.value)} className="rounded border px-2 py-1" />
            </div>
          </div>
          <div className="calendar-container w-full max-w-none">
            <Calendar
              className={styles.calendar}
              onChange={(date) => {
                if (date instanceof Date) {
                  const nyseDate = toNYSETimezone(date);
                  setSelectedDate(nyseDate);
                  setForm({ 
                    symbol: '', 
                    amount: 0, 
                    date: nyseDate, 
                    type: 'payment-date' 
                  });
                  setEditingIndex(-1);
                  setViewMode('day');
                  if ((payoutsByDate[nyseDate.toISOString().slice(0, 10)] || []).length > 0) {
                    setPopoverDate(nyseDate);
                  } else {
                    setPopoverDate(null);
                  }
                }
              }}
              value={selectedDate}
              tileContent={tileContent}
            />
          </div>
          {/* Popover for events on a day */}
          {popoverDate && (
            <div ref={popoverRef} className="absolute left-1/2 top-1/2 z-50 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-xl rounded-xl p-6 min-w-[320px] max-w-[90vw]" style={{ transform: 'translate(-50%, -50%)' }}>
              <div className="flex justify-between items-center mb-2">
                <div className="font-bold text-lg text-gray-900 dark:text-gray-100">Events on {format(popoverDate, 'MMM d, yyyy')}</div>
                <button onClick={closePopover} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold">×</button>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-zinc-700">
                {(payoutsByDate[popoverDate.toISOString().slice(0, 10)] || []).map((payout, idx) => (
                  <div key={idx} className="py-3 flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full inline-block bg-primary`}></span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{payout.symbol}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">${payout.amount.toFixed(2)} • {payout.type === 'ex-date' ? 'Ex-Date' : 'Payment'}</div>
                    </div>
                    <button onClick={() => setDetailsPayout(payout)} className="ml-2 text-xs text-blue-600 dark:text-blue-300 underline">Details</button>
                  </div>
                ))}
              </div>
              {detailsPayout && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                  <div className="font-semibold mb-2">{detailsPayout.symbol} Dividend History</div>
                  <table className="w-full text-xs mb-2">
                    <thead><tr><th>Date</th><th>Amount</th><th>Growth</th></tr></thead>
                    <tbody>
                      {initialHoldings.find(h => h.symbol === detailsPayout.symbol)?.dividendHistory.map((d, i) => (
                        <tr key={i}><td>{d.paymentDate}</td><td>${d.amount.toFixed(2)}</td><td>{d.growth ? `${d.growth.toFixed(2)}%` : '-'}</td></tr>
                      ))}
                    </tbody>
                  </table>
                  <button onClick={() => setDetailsPayout(null)} className="mt-2 text-xs text-gray-500 underline">Close</button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-10 w-full">
          <div className="flex items-center gap-4 mb-4">
            <button
              className={`px-4 py-2 rounded ${viewMode === 'month' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-100'}`}
              onClick={() => setViewMode('month')}
            >
              Month View
            </button>
            <button
              className={`px-4 py-2 rounded ${viewMode === 'day' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-gray-100'}`}
              onClick={() => setViewMode('day')}
              disabled={selectedDayEvents.length === 0}
            >
              Day View
            </button>
            {viewMode === 'day' && (
              <button
                className="ml-4 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => setViewMode('month')}
              >
                Back to Month
              </button>
            )}
          </div>
          <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-sm rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
              Events on {format(selectedDate, 'MMM d, yyyy')}
            </h2>
            {eventsToShow.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">No dividend events for this period.</div>
            )}
            <table className="w-full border-collapse bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow mb-6">
              <thead>
                <tr className="bg-gray-100 dark:bg-zinc-800">
                  <th className="text-left p-3 text-gray-700 dark:text-gray-200">Symbol</th>
                  <th className="text-left p-3 text-gray-700 dark:text-gray-200">Amount</th>
                  <th className="text-left p-3 text-gray-700 dark:text-gray-200">Type</th>
                  <th className="text-left p-3 text-gray-700 dark:text-gray-200">Source</th>
                  <th className="text-left p-3"></th>
                </tr>
              </thead>
              <tbody>
                {eventsToShow.map((p, i) => (
                  <tr key={i} className={`border-t border-gray-100 dark:border-zinc-800 ${p.date.toISOString().slice(0, 10) === todayStr ? 'bg-yellow-100 dark:bg-yellow-900' : ''}`}>
                    <td className="p-3 text-gray-900 dark:text-gray-100">{p.symbol}</td>
                    <td className="p-3 text-gray-900 dark:text-gray-100">${p.amount.toFixed(2)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${p.type === 'ex-date' ? 'bg-primary' : 'bg-primary'} text-white`}>
                        {p.type === 'ex-date' ? 'Ex-Date' : 'Payment'}
                      </span>
                    </td>
                    <td className="p-3 text-gray-900 dark:text-gray-100">{p.source || (p.auto ? 'Auto' : 'Custom')}</td>
                    <td className="p-3">
                      {!p.auto && (
                        <>
                          <button
                            onClick={() => handleEditPayout(userPayouts.findIndex(x => x.date.toISOString() === p.date.toISOString() && x.symbol === p.symbol))}
                            className="mr-2 px-3 py-1 rounded bg-primary hover:bg-primary-dark text-white text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePayout(userPayouts.findIndex(x => x.date.toISOString() === p.date.toISOString() && x.symbol === p.symbol))}
                            className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="mb-2 px-5 py-2 rounded bg-primary text-white font-semibold hover:bg-primary-dark active:bg-primary-dark transition-colors w-fit"
            onClick={() => setShowPayoutForm(v => !v)}
          >
            {showPayoutForm ? 'Hide Add/Edit Payout' : 'Add/Edit Payout'}
          </button>
          {showPayoutForm && (
            <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-sm rounded-2xl p-6 mb-2">
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Add/Edit Payout</h2>
              <form onSubmit={handleAddPayout} className="flex flex-col gap-3 mb-6">
                <input
                  name="symbol"
                  placeholder="Symbol"
                  value={form.symbol}
                  onChange={handleFormChange}
                  required
                  className="px-3 py-2 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                />
                <input
                  name="amount"
                  placeholder="Amount"
                  type="number"
                  value={form.amount}
                  onChange={handleFormChange}
                  required
                  className="px-3 py-2 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                />
                <input
                  name="date"
                  placeholder="Date"
                  type="date"
                  value={form.date.toISOString().split('T')[0]}
                  onChange={handleFormChange}
                  required
                  className="px-3 py-2 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                />
                <select
                  name="type"
                  value={form.type}
                  onChange={handleFormChange}
                  required
                  className="px-3 py-2 rounded border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="payment-date">Payment Date</option>
                  <option value="ex-date">Ex-Dividend Date</option>
                </select>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white rounded px-5 py-2 font-semibold text-base"
                >
                  {editingIndex >= 0 ? 'Save' : 'Add'} Payout
                </button>
              </form>
            </div>
          )}
        </div>
        {renderNotificationSettings()}
      </div>
      <ConfirmDialog
        open={deleteIndex !== null}
        title="Delete Payout?"
        description="Are you sure you want to delete this payout? This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeletePayoutConfirm}
        onCancel={handleDeletePayoutCancel}
      />
      <div className="mt-8">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={settings.notificationsEnabled} onChange={e => {
            if (!isProUser) {
              toast({ title: 'Pro Feature', description: 'Priority notifications are a Divly Pro feature. Upgrade to enable!', variant: 'default' });
              return;
            }
            updateSetting('notificationsEnabled', e.target.checked);
          }} />
          Enable browser notifications for dividends <ProBadge />
        </label>
      </div>
    </main>
  );
}