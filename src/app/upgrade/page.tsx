"use client";
import React from 'react';
import { Gem } from 'lucide-react';
import GoProButton from '@/components/GoProButton';

export default function UpgradePage() {
  return (
    <main className="max-w-2xl mx-auto my-10 px-4 bg-white dark:bg-[#18181b] min-h-screen rounded-2xl shadow-lg flex flex-col items-center">
      <div className="flex items-center gap-3 mb-6 mt-8">
        <Gem size={32} className="text-yellow-400" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-400">Upgrade to Divly Pro</h1>
      </div>
      <p className="text-lg text-gray-700 dark:text-gray-200 mb-8 text-center max-w-xl">
        Unlock advanced analytics, integrations, and priority support. Perfect for power users and serious investors.
      </p>
      <div className="w-full flex flex-col md:flex-row gap-8 justify-center mb-12">
        <div className="flex-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-8 shadow flex flex-col items-center">
          <h3 className="font-bold text-xl mb-2">Free</h3>
          <p className="text-3xl font-extrabold mb-2">$0</p>
          <ul className="text-gray-600 dark:text-gray-300 mb-4 text-center">
            <li>✔️ Portfolio tracking</li>
            <li>✔️ Dividend calendar</li>
            <li>✔️ CSV import/export</li>
            <li>✔️ Basic analytics</li>
          </ul>
          <span className="inline-block px-6 py-2 rounded-lg bg-primary text-white font-bold text-lg shadow hover:bg-primary-dark transition-colors">Get Started</span>
        </div>
        <div className="flex-1 bg-white dark:bg-zinc-800 border border-yellow-400 dark:border-yellow-500 rounded-2xl p-8 shadow flex flex-col items-center">
          <h3 className="font-bold text-xl mb-2 text-yellow-500">Pro</h3>
          <p className="text-3xl font-extrabold mb-2">$4/mo</p>
          <ul className="text-gray-600 dark:text-gray-300 mb-4 text-center">
            <li>✔️ All Free features</li>
            <li>✔️ Advanced analytics</li>
            <li>✔️ Priority support</li>
            <li>✔️ Integrations (coming soon)</li>
          </ul>
          <GoProButton />
        </div>
      </div>
      <div className="w-full max-w-xl mt-8 mb-12">
        <h2 className="text-2xl font-bold mb-4 text-primary text-center">Why Go Pro?</h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-200 space-y-2">
          <li>Unlock all advanced analytics and charting features</li>
          <li>Access integrations with brokerages and financial tools (coming soon)</li>
          <li>Get priority email support</li>
          <li>Support ongoing development of Divly</li>
        </ul>
      </div>
      <footer className="w-full text-center text-gray-400 dark:text-gray-500 text-sm mt-12 mb-4">
        &copy; {new Date().getFullYear()} Divly. All rights reserved.
      </footer>
    </main>
  );
} 