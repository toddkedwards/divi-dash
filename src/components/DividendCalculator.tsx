'use client';
import React, { useState } from 'react';
import Button from './Button';

function parseNumber(val: string) {
  const n = parseFloat(val.replace(/[^\d.\-]/g, ''));
  return isNaN(n) ? 0 : n;
}

export default function DividendCalculator() {
  const [starting, setStarting] = useState('');
  const [monthly, setMonthly] = useState('');
  const [yieldPct, setYieldPct] = useState('');
  const [growthPct, setGrowthPct] = useState('');
  const [priceGrowthPct, setPriceGrowthPct] = useState('');
  const [years, setYears] = useState('10');
  const [result, setResult] = useState<null | {
    finalValue: number;
    totalDividends: number;
    totalContributions: number;
    totalGrowth: number;
  }>(null);
  const [error, setError] = useState('');

  function calculate() {
    setError('');
    const P = parseNumber(starting);
    const C = parseNumber(monthly);
    const r = parseNumber(yieldPct) / 100;
    const g = parseNumber(growthPct) / 100;
    const p = parseNumber(priceGrowthPct) / 100;
    const n = parseInt(years, 10);
    if (n <= 0 || isNaN(n)) return setError('Years must be a positive integer.');
    if (P < 0 || C < 0 || r < 0 || g < 0 || p < 0) return setError('Inputs must be non-negative.');
    if (P === 0 && C === 0) return setError('Please enter a starting amount or monthly contribution.');

    // Monthly compounding
    const periods = n * 12;
    let balance = P;
    let totalDividends = 0;
    let totalContributions = P;
    for (let i = 0; i < periods; i++) {
      const div = balance * r / 12;
      totalDividends += div;
      balance += div; // DRIP
      balance += C;
      totalContributions += C;
      balance *= 1 + (g + p) / 12;
    }
    setResult({
      finalValue: balance,
      totalDividends,
      totalContributions,
      totalGrowth: balance - totalContributions
    });
  }

  return (
          <div className="bg-card border shadow-sm rounded-2xl p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-foreground text-center">Dividend Calculator</h1>
      <p className="mb-8 text-center text-lg text-muted-foreground">Calculate your investment returns with our dividend calculator. All dividends are assumed reinvested (DRIP). Track these metrics in Divly tailored to your portfolio.</p>
      <form
        className="flex flex-col gap-6 mb-6"
        onSubmit={e => { e.preventDefault(); calculate(); }}
        autoComplete="off"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-1 font-medium text-foreground">Starting Amount ($)</label>
            <input 
              type="number" 
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
              value={starting} 
              onChange={e => setStarting(e.target.value)} 
              min="0" 
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-foreground">Monthly Contribution ($)</label>
            <input 
              type="number" 
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
              value={monthly} 
              onChange={e => setMonthly(e.target.value)} 
              min="0" 
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-foreground">Dividend Yield (%)</label>
            <input 
              type="number" 
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
              value={yieldPct} 
              onChange={e => setYieldPct(e.target.value)} 
              min="0" 
              step="0.01" 
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-1 font-medium text-foreground">Dividend Growth Rate (%)</label>
            <input 
              type="number" 
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
              value={growthPct} 
              onChange={e => setGrowthPct(e.target.value)} 
              min="0" 
              step="0.01" 
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-foreground">Annual Price Growth (%)</label>
            <input 
              type="number" 
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
              value={priceGrowthPct} 
              onChange={e => setPriceGrowthPct(e.target.value)} 
              min="0" 
              step="0.01" 
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-foreground">Years</label>
            <input 
              type="number" 
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
              value={years} 
              onChange={e => setYears(e.target.value)} 
              min="1" 
            />
          </div>
        </div>
        <div className="flex justify-start mt-2">
          <Button type="submit" className="px-8 py-3 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition">
            Calculate Gains
          </Button>
        </div>
      </form>
      {error && <div className="text-destructive mb-4 text-center font-medium">{error}</div>}
      {result && (
        <div className="mt-8 bg-primary/10 border border-primary/20 rounded-xl p-6 text-center flex flex-col gap-6">
          <h2 className="text-2xl font-bold mb-2 text-primary">Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
            <div>
              <div className="font-semibold text-foreground">Final Portfolio Value</div>
              <div className="text-2xl font-bold text-primary">${result.finalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">Total Dividends Earned</div>
              <div className="text-2xl font-bold text-primary">${result.totalDividends.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">Total Contributions</div>
              <div className="text-2xl font-bold text-primary">${result.totalContributions.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>
            <div>
              <div className="font-semibold text-foreground">Total Growth</div>
              <div className="text-2xl font-bold text-primary">${result.totalGrowth.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 