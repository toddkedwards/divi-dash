"use client";

interface Dividend {
  symbol: string;
  amount: number;
  date: string;
}

export default function DividendsTable({ dividends, onEdit, onDelete }: { dividends: Dividend[]; onEdit: (index: number) => void; onDelete: (index: number) => void }) {
  return (
    <table className="w-full border-collapse bg-white dark:bg-zinc-900 rounded-lg shadow mb-6">
      <thead>
        <tr className="bg-gray-100 dark:bg-zinc-800">
          <th className="text-left p-3 text-gray-700 dark:text-gray-200">Symbol</th>
          <th className="text-left p-3 text-gray-700 dark:text-gray-200">Amount</th>
          <th className="text-left p-3 text-gray-700 dark:text-gray-200">Date</th>
          <th className="text-left p-3"></th>
        </tr>
      </thead>
      <tbody>
        {dividends.map((d, i) => (
          <tr key={i} className="border-t border-gray-100 dark:border-zinc-800">
            <td className="p-3 text-gray-900 dark:text-gray-100">{d.symbol}</td>
            <td className="p-3 text-gray-900 dark:text-gray-100">{d.amount}</td>
            <td className="p-3 text-gray-900 dark:text-gray-100">{d.date}</td>
            <td className="p-3">
              <button
                onClick={() => onEdit(i)}
                className="mr-2 px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(i)}
                className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 