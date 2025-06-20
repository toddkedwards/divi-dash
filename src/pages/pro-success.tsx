import Link from 'next/link';

export default function ProSuccessPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl p-8 shadow flex flex-col items-center max-w-lg mt-20">
        <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">Thank you for upgrading!</h1>
        <p className="text-lg text-gray-700 dark:text-gray-200 mb-6 text-center">Your Divly Pro features are now unlocked. Enjoy advanced analytics, integrations, and priority support.</p>
        <Link href="/dashboard">
          <span className="inline-block px-6 py-2 rounded-lg bg-primary text-white font-bold text-lg shadow hover:bg-primary-dark transition-colors">Go to Dashboard</span>
        </Link>
      </div>
    </main>
  );
} 