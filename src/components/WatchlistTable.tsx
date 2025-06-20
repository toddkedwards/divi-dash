import React, { memo } from 'react';
import { Pencil, Building2, ArrowUp, ArrowDown } from 'lucide-react';
import Image from 'next/image';
import LoadingSpinner from './LoadingSpinner';

interface WatchlistItem {
  id: string;
  symbol: string;
  companyName: string;
  logo?: string;
  price: number;
  dailyChange: number;
}

interface WatchlistTableProps {
  items: WatchlistItem[];
  loading?: boolean;
  onEdit?: (item: WatchlistItem) => void;
}

const WatchlistTable = ({ items, loading = false, onEdit }: WatchlistTableProps) => {
  return (
    <div className="relative">
      {loading ? (
        <div className="animate-fade-in">
          <div className="h-96 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Company</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 dark:text-gray-300">Price</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 dark:text-gray-300">Daily Change</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150 animate-fade-in-up`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        {item.logo ? (
                          <Image
                            src={item.logo}
                            alt={item.companyName}
                            width={32}
                            height={32}
                            className="rounded-lg"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{item.companyName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{item.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">${item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                        item.dailyChange >= 0
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {item.dailyChange >= 0 ? (
                          <ArrowUp className="w-4 h-4 mr-1" />
                        ) : (
                          <ArrowDown className="w-4 h-4 mr-1" />
                        )}
                        {Math.abs(item.dailyChange)}%
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onEdit?.(item)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-150"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(WatchlistTable); 