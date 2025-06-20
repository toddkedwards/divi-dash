"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { holdings } from "@/data/holdings";
import { useToast } from '@/components/ToastProvider';
import ConfirmDialog from '@/components/ConfirmDialog';

// Types
interface Goal {
  id: string;
  type: "portfolioValue" | "annualIncome" | "monthlyIncome" | "dailyIncome";
  label: string;
  target: number;
}

const defaultGoals: Goal[] = [
  { id: "portfolioValue", type: "portfolioValue", label: "Portfolio Value", target: 10000 },
  { id: "annualIncome", type: "annualIncome", label: "Annual Dividend Income", target: 500 },
  { id: "monthlyIncome", type: "monthlyIncome", label: "Monthly Dividend Income", target: 50 },
  { id: "dailyIncome", type: "dailyIncome", label: "Daily Dividend Income", target: 2 },
];

function getPortfolioValue() {
  return holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0);
}

function getAnnualDividendIncome() {
  return holdings.reduce((sum, h) => sum + h.shares * h.dividendHistory[0].amount * (h.payoutFrequency === 'monthly' ? 12 : h.payoutFrequency === 'quarterly' ? 4 : h.payoutFrequency === 'semi-annual' ? 2 : 1), 0);
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);
  if (error) {
    return <div className="bg-red-100 text-red-800 p-4 rounded mb-4">Error: {error.message}</div>;
  }
  return (
    <>{children}</>
  );
}

export default function PortfolioGoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{ label: string; target: string; type: Goal["type"] } | null>(null);
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Load from localStorage with fallback
  useEffect(() => {
    try {
      const stored = localStorage.getItem("portfolioGoals");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGoals(parsed);
        } else {
          setGoals(defaultGoals);
        }
      } else {
        setGoals(defaultGoals);
      }
    } catch (e) {
      setGoals(defaultGoals);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("portfolioGoals", JSON.stringify(goals));
  }, [goals]);

  // Analytics
  const portfolioValue = getPortfolioValue();
  const annualIncome = getAnnualDividendIncome();
  const monthlyIncome = annualIncome / 12;
  const dailyIncome = annualIncome / 365;

  const getCurrentValue = (type: Goal["type"]) => {
    switch (type) {
      case "portfolioValue":
        return portfolioValue;
      case "annualIncome":
        return annualIncome;
      case "monthlyIncome":
        return monthlyIncome;
      case "dailyIncome":
        return dailyIncome;
      default:
        return 0;
    }
  };

  // Add or edit goal
  const handleSave = () => {
    if (!form) return;
    if (editingId) {
      setGoals(goals.map(g => g.id === editingId ? { ...g, label: form.label, target: Number(form.target), type: form.type } : g));
      toast({ title: 'Goal updated successfully', description: '', variant: 'success' });
    } else {
      setGoals([...goals, { id: Date.now().toString(), label: form.label, target: Number(form.target), type: form.type }]);
      toast({ title: 'Goal added successfully', description: '', variant: 'success' });
    }
    setForm(null);
    setEditingId(null);
  };

  // Delete goal
  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      setGoals(goals.filter(g => g.id !== deleteId));
      toast({ title: 'Goal deleted', description: '', variant: 'success' });
      setDeleteId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);
  };

  // Start editing
  const handleEdit = (goal: Goal) => {
    setEditingId(goal.id);
    setForm({ label: goal.label, target: goal.target.toString(), type: goal.type });
  };

  return (
    <ErrorBoundary>
      <main>
        <h1 className="mb-8">Portfolio Goals</h1>
        <div className="grid gap-8 mb-12">
          {goals.length === 0 && (
            <div className="text-gray-500 dark:text-gray-400 text-center py-8">No goals set. Click "Add Goal" to get started.</div>
          )}
          {goals.map(goal => {
            const current = getCurrentValue(goal.type);
            const progress = Math.min((current / goal.target) * 100, 100);
            return (
              <Card key={goal.id} className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-md rounded-2xl p-6 md:p-8 mb-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{goal.label}</div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Current: <span className="text-2xl">{goal.type === 'portfolioValue' ? `$${current.toLocaleString()}` : `$${current.toFixed(2)}`}</span></div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">Target: <span className="text-2xl">${goal.target.toLocaleString()}</span></div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="w-full bg-gray-300 dark:bg-zinc-800 rounded-full h-4">
                      <div
                        className="bg-green-500 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-base text-gray-600 dark:text-gray-300 mt-1">{progress.toFixed(1)}% to goal</div>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Button onClick={() => handleEdit(goal)} className="px-5 py-2 text-base">Edit</Button>
                    <Button variant="secondary" onClick={() => handleDelete(goal.id)} className="px-5 py-2 text-base">Delete</Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        <div className="mb-8">
          <Button onClick={() => { setForm({ label: '', target: '', type: 'portfolioValue' }); setEditingId(null); }} className="px-6 py-3 text-base">Add Goal</Button>
        </div>
        {form && (
          <Card className="mb-8 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-sm p-6 md:p-8 rounded-2xl">
            <div className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">{editingId ? 'Edit Goal' : 'Add Goal'}</div>
            <form
              onSubmit={e => { e.preventDefault(); handleSave(); }}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block mb-1 font-medium text-gray-900 dark:text-gray-100">Label</label>
                <input
                  className="w-full border rounded px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                  value={form.label}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, label: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-900 dark:text-gray-100">Type</label>
                <select
                  className="w-full border rounded px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                  value={form.type}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, type: e.target.value as Goal["type"] })}
                >
                  <option value="portfolioValue">Portfolio Value</option>
                  <option value="annualIncome">Annual Dividend Income</option>
                  <option value="monthlyIncome">Monthly Dividend Income</option>
                  <option value="dailyIncome">Daily Dividend Income</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-900 dark:text-gray-100">Target</label>
                <input
                  className="w-full border rounded px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                  type="number"
                  min="0"
                  value={form.target}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, target: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-2 mt-2">
                <Button type="submit" className="px-5 py-2 text-base">Save</Button>
                <Button type="button" variant="secondary" onClick={() => { setForm(null); setEditingId(null); }} className="px-5 py-2 text-base">Cancel</Button>
              </div>
            </form>
          </Card>
        )}
        <ConfirmDialog
          open={deleteId !== null}
          title="Delete Goal?"
          description="Are you sure you want to delete this goal? This cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      </main>
    </ErrorBoundary>
  );
} 