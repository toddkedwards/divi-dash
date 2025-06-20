"use client";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Calendar, BarChart, Smartphone, RefreshCw, Gem, DollarSign, Target, Eye, Star } from 'lucide-react';
import GoProButton from '@/components/GoProButton';

export default function LandingPage() {
  const [year, setYear] = useState<number | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  // Auto-redirect logged-in users to dashboard
  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  return (
    <main>
      {/* Hero Section */}
      <section className="w-full max-w-3xl text-center mb-16 mx-auto">
        <h1 className="mb-4">Divly</h1>
        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-8">
          Track your portfolio, dividends, and financial goals with real-time data, beautiful charts, and powerful tools—all in one place.
        </p>
        <Link
          href={user ? "/dashboard" : "/signup"}
          className="inline-block px-8 py-4 rounded-lg bg-primary text-white font-bold text-lg shadow-lg hover:bg-primary-dark transition-colors"
        >
          {user ? "Go to Dashboard" : "Get Started Free"}
        </Link>
      </section>

      {/* Feature Highlights */}
      <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 mx-auto">
        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-6 shadow flex flex-col items-center">
          <LayoutDashboard size={36} className="mb-3 text-primary" />
          <h3 className="font-bold text-lg mb-2">Dashboard Analytics</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">See your total portfolio value, income projections, yield, and gain/loss at a glance. Now includes real-time price updates, gain/loss breakdowns, and yield on cost.</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-6 shadow flex flex-col items-center">
          <Calendar size={36} className="mb-3 text-primary" />
          <h3 className="font-bold text-lg mb-2">Dividend Calendar</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">Track upcoming and past payouts, ex-dates, and export to your favorite calendar app. Get browser notifications, filter by company/date, and export to .ics.</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-6 shadow flex flex-col items-center">
          <BarChart size={36} className="mb-3 text-primary" />
          <h3 className="font-bold text-lg mb-2">Advanced Analytics</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">Visualize dividend growth, sector allocation, and income trends with beautiful charts. Includes performance metrics, news, and dividend history popovers.</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-6 shadow flex flex-col items-center">
          <Smartphone size={36} className="mb-3 text-primary" />
          <h3 className="font-bold text-lg mb-2">Mobile-First Design</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">Enjoy a seamless experience on any device, with dark/light mode and touch-friendly UI.</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-6 shadow flex flex-col items-center">
          <RefreshCw size={36} className="mb-3 text-primary" />
          <h3 className="font-bold text-lg mb-2">Import & Export</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">Import from CSV, Excel, or Google Sheets. Export your data anytime. Bulk import/export for holdings and dividends, with error feedback and sample files.</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-6 shadow flex flex-col items-center">
          <DollarSign size={36} className="mb-3 text-primary" />
          <h3 className="font-bold text-lg mb-2">Dividend Calculator</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">Project your future portfolio value and income with our interactive dividend calculator. Includes DRIP, growth, and contribution modeling.</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-6 shadow flex flex-col items-center">
          <Target size={36} className="mb-3 text-primary" />
          <h3 className="font-bold text-lg mb-2">Portfolio Goals</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">Set and track custom financial goals for your portfolio and income.</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-6 shadow flex flex-col items-center">
          <Eye size={36} className="mb-3 text-primary" />
          <h3 className="font-bold text-lg mb-2">Watchlist</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">Monitor stocks you're interested in, with real-time price updates and easy add/remove.</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-6 shadow flex flex-col items-center">
          <Gem size={36} className="mb-3 text-yellow-400" />
          <h3 className="font-bold text-lg mb-2">Divly Pro</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">Unlock advanced analytics, integrations, and priority support with Pro.</p>
        </div>
      </section>

      {/* Screenshots Placeholder */}
      <section className="w-full max-w-4xl mb-20 flex flex-col items-center mx-auto">
        <div className="w-full h-64 bg-gray-100 dark:bg-zinc-800 rounded-2xl shadow flex items-center justify-center mb-4">
          <span className="text-2xl text-gray-400">[App Screenshot Carousel Here]</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-center">See your portfolio in action. (Screenshots or demo video coming soon!)</p>
      </section>

      {/* Pro/Upgrade Section */}
      <section className="w-full max-w-2xl text-center mb-20 mx-auto">
        <h2 className="mb-4 text-primary">Upgrade to Divly Pro</h2>
        <p className="text-lg text-gray-700 dark:text-gray-200 mb-6">Unlock advanced analytics, integrations, and more. Perfect for power users and serious investors.</p>
        <GoProButton className="mb-2" />
      </section>

      {/* FAQ Section */}
      <section className="w-full max-w-3xl mb-20 mx-auto">
        <h2 className="mb-6 text-primary text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-1">Is Divly free to use?</h3>
            <p className="text-gray-600 dark:text-gray-300">Yes! Divly is free for all core features. Upgrade to Pro for advanced analytics and integrations.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">How do I import my portfolio?</h3>
            <p className="text-gray-600 dark:text-gray-300">You can import from CSV, Excel, or Google Sheets. Use the Import CSV button on the Portfolio page.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Is my data secure?</h3>
            <p className="text-gray-600 dark:text-gray-300">Your data is stored locally in your browser. Nothing is sent to our servers unless you opt-in for cloud sync (coming soon).</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full max-w-4xl mb-20 mx-auto">
        <h2 className="mb-6 text-primary text-center">What Users Are Saying</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[{
            quote: "The best dividend tracker I've ever used. Clean, fast, and packed with features.",
            author: "Alex P."
          }, {
            quote: "Divly made tracking my income so much easier. Highly recommend!",
            author: "Jamie L."
          }, {
            quote: "Love the analytics and the calendar export. The UI is beautiful!",
            author: "Morgan S."
          }].map(({ quote, author }, idx) => (
            <div key={idx} className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-6 shadow flex flex-col items-center">
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={22} className="text-yellow-400" fill="#facc15" strokeWidth={1.5} />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">“{quote}”</p>
              <span className="text-sm text-gray-500 dark:text-gray-400">— {author}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full max-w-2xl mb-20 mx-auto">
        <h2 className="mb-6 text-primary text-center">Pricing</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <div className="flex-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-8 shadow flex flex-col items-center">
            <h3 className="font-bold text-xl mb-2">Free</h3>
            <p className="text-3xl font-extrabold mb-2">$0</p>
            <ul className="text-gray-600 dark:text-gray-300 mb-4 text-center space-y-1">
              <li>✔️ Portfolio tracking</li>
              <li>✔️ Dividend calendar</li>
              <li>✔️ Dividend calculator</li>
              <li>✔️ Portfolio goals</li>
              <li>✔️ Watchlist</li>
              <li>✔️ CSV import/export</li>
              <li>✔️ Basic analytics</li>
            </ul>
            <Link href={user ? "/dashboard" : "/signup"}>
              <span className="inline-block px-6 py-2 rounded-lg bg-primary text-white font-bold text-lg shadow hover:bg-primary-dark transition-colors">Get Started</span>
            </Link>
          </div>
          <div className="flex-1 bg-white dark:bg-zinc-800 border-2 border-yellow-400 dark:border-yellow-500 rounded-2xl p-8 shadow flex flex-col items-center">
            <h3 className="font-bold text-xl mb-2 text-yellow-500">Pro</h3>
            <p className="text-3xl font-extrabold mb-2">$4/mo</p>
            <ul className="text-gray-600 dark:text-gray-300 mb-4 text-center space-y-1">
              <li>✔️ All Free features</li>
              <li>✔️ Advanced analytics</li>
              <li>✔️ Priority support</li>
              <li>✔️ Integrations (coming soon)</li>
            </ul>
            <GoProButton />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-3xl text-center text-gray-400 dark:text-gray-500 text-sm mt-12 mx-auto">
        &copy; {year ?? ""} Divly. All rights reserved.
      </footer>
    </main>
  );
} 