"use client";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Calendar, BarChart, Smartphone, RefreshCw, Gem, DollarSign, Target, Eye, Star } from 'lucide-react';
import GoProButton from '@/components/GoProButton';
import ScreenshotPlaceholder from '@/components/ScreenshotPlaceholder';

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            <span>Trusted by 10,000+ investors</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Divly
            <span className="block bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              Track your portfolio, dividends, and financial goals
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Track your portfolio, dividends, and financial goals with real-time data, beautiful charts, and powerful tools—all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href={user ? "/dashboard" : "/signup"}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <span>{user ? "Go to Dashboard" : "Get Started Free"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group border border-gray-200 dark:border-gray-700 shadow flex flex-col items-center">
              <LayoutDashboard size={36} className="mb-3 text-primary" />
              <h3 className="font-bold text-lg mb-2">Dashboard Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">See your total portfolio value, income projections, yield, and gain/loss at a glance. Now includes real-time price updates, gain/loss breakdowns, and yield on cost.</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group border border-gray-200 dark:border-gray-700 shadow flex flex-col items-center">
              <Calendar size={36} className="mb-3 text-primary" />
              <h3 className="font-bold text-lg mb-2">Dividend Calendar</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">Track upcoming and past payouts, ex-dates, and export to your favorite calendar app. Get browser notifications, filter by company/date, and export to .ics.</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group border border-gray-200 dark:border-gray-700 shadow flex flex-col items-center">
              <BarChart size={36} className="mb-3 text-primary" />
              <h3 className="font-bold text-lg mb-2">Advanced Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">Visualize dividend growth, sector allocation, and income trends with beautiful charts. Includes performance metrics, news, and dividend history popovers.</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group border border-gray-200 dark:border-gray-700 shadow flex flex-col items-center">
              <Smartphone size={36} className="mb-3 text-primary" />
              <h3 className="font-bold text-lg mb-2">Mobile-First Design</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">Enjoy a seamless experience on any device, with dark/light mode and touch-friendly UI.</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group border border-gray-200 dark:border-gray-700 shadow flex flex-col items-center">
              <RefreshCw size={36} className="mb-3 text-primary" />
              <h3 className="font-bold text-lg mb-2">Import & Export</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">Import from CSV, Excel, or Google Sheets. Export your data anytime. Bulk import/export for holdings and dividends, with error feedback and sample files.</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group border border-gray-200 dark:border-gray-700 shadow flex flex-col items-center">
              <DollarSign size={36} className="mb-3 text-primary" />
              <h3 className="font-bold text-lg mb-2">Dividend Calculator</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">Project your future portfolio value and income with our interactive dividend calculator. Includes DRIP, growth, and contribution modeling.</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group border border-gray-200 dark:border-gray-700 shadow flex flex-col items-center">
              <Target size={36} className="mb-3 text-primary" />
              <h3 className="font-bold text-lg mb-2">Portfolio Goals</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">Set and track custom financial goals for your portfolio and income.</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group border border-gray-200 dark:border-gray-700 shadow flex flex-col items-center">
              <Eye size={36} className="mb-3 text-primary" />
              <h3 className="font-bold text-lg mb-2">Watchlist</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">Monitor stocks you're interested in, with real-time price updates and easy add/remove.</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group border border-gray-200 dark:border-gray-700 shadow flex flex-col items-center">
              <Gem size={36} className="mb-3 text-yellow-400" />
              <h3 className="font-bold text-lg mb-2">Divly Pro</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">Unlock advanced analytics, integrations, and priority support with Pro.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Placeholder */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
          <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow flex items-center justify-center mb-4">
            <span className="text-2xl text-gray-400">[App Screenshot Carousel Here]</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-center">See your portfolio in action. (Screenshots or demo video coming soon!)</p>
        </div>
      </section>

      {/* Pro/Upgrade Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400">Upgrade to Divly Pro</h2>
          <p className="text-lg text-gray-700 dark:text-gray-200 mb-6">Unlock advanced analytics, integrations, and more. Perfect for power users and serious investors.</p>
          <GoProButton className="mb-2" />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="mb-6 text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 text-center">Frequently Asked Questions</h2>
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
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="mb-6 text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 text-center">What Users Are Saying</h2>
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
              <div key={idx} className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group border border-gray-200 dark:border-gray-700 shadow flex flex-col items-center">
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
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="mb-6 text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 text-center">Pricing</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            <div className="p-8 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow flex flex-col items-center">
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
                <span className="inline-block px-6 py-2 rounded-lg bg-emerald-600 text-white font-bold text-lg shadow hover:bg-emerald-700 transition-colors">Get Started</span>
              </Link>
            </div>
            <div className="p-8 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow flex flex-col items-center">
              <h3 className="font-bold text-xl mb-2 text-emerald-500">Pro</h3>
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
        </div>
      </section>

      {/* Screenshot Placeholder Grid */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="mb-6 text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 text-center">App Screenshots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ScreenshotPlaceholder label="Dashboard Overview" />
            <ScreenshotPlaceholder label="Dividend Calendar" />
            <ScreenshotPlaceholder label="Portfolio Insights" />
            <ScreenshotPlaceholder label="News Intelligence" />
            <ScreenshotPlaceholder label="Goal Planning" />
            <ScreenshotPlaceholder label="Mobile Experience" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-3xl text-center text-gray-400 dark:text-gray-500 text-sm mt-12 mx-auto">
        &copy; {year ?? ""} Divly. All rights reserved.
      </footer>
    </div>
  );
} 