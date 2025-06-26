import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Pencil, Trash2 } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import LoadingSpinner from './LoadingSpinner';

interface Portfolio {
  id: string;
  name: string;
}

export default function PortfolioSelector() {
  const portfolioContext = usePortfolio();
  
  // Add null checks and error handling
  if (!portfolioContext) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 min-w-[160px]">
        <LoadingSpinner size="sm" />
        <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
      </div>
    );
  }

  const { 
    portfolios, 
    selectedPortfolioId,
    selectPortfolio, 
    createPortfolio, 
    renamePortfolio, 
    deletePortfolio,
    isProUser,
    loading
  } = portfolioContext;
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Show loading state if context is still loading
  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 min-w-[160px]">
        <LoadingSpinner size="sm" />
        <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
      </div>
    );
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreatePortfolio = async () => {
    if (!newName.trim()) return;
    try {
      await createPortfolio(newName);
      setNewName('');
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to create portfolio:', error);
    }
  };

  const handleRenamePortfolio = async (id: string) => {
    if (!newName.trim()) return;
    try {
      await renamePortfolio(id, newName);
      setNewName('');
      setIsRenaming(false);
    } catch (error) {
      console.error('Failed to rename portfolio:', error);
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (portfolios.length <= 1) {
      console.error('Cannot delete portfolio: You must have at least one portfolio.');
      return;
    }

    try {
      await deletePortfolio(id);
    } catch (error) {
      console.error('Failed to delete portfolio:', error);
    }
  };

  const currentPortfolio = portfolios.find(p => p.id === selectedPortfolioId);

  return (
    <div className="relative max-w-xs" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 min-w-[160px] w-auto text-sm"
      >
        <div className="flex-1 text-left">
          <span className="text-xs text-gray-500 dark:text-gray-400">Portfolio</span>
          <p className="font-medium text-sm text-white leading-tight">
            {currentPortfolio?.name || 'Select Portfolio'}
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[250px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          <div className="max-h-[300px] overflow-y-auto">
            {portfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className="group flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <button
                  onClick={() => {
                    selectPortfolio(portfolio.id);
                    setIsOpen(false);
                  }}
                  className="flex-1 text-left"
                >
                  <span className={`text-sm ${portfolio.id === selectedPortfolioId ? 'font-medium text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>
                    {portfolio.name}
                  </span>
                </button>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setNewName(portfolio.name);
                      setIsRenaming(true);
                    }}
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePortfolio(portfolio.id)}
                    className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!isProUser && portfolios.length >= 1 ? (
            <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Upgrade to Pro to create more portfolios
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 border-t border-gray-200 dark:border-gray-700"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Portfolio</span>
            </button>
          )}
        </div>
      )}

      {/* Create/Rename Modal */}
      {(isCreating || isRenaming) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {isCreating ? 'Create New Portfolio' : 'Rename Portfolio'}
            </h3>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Portfolio name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setIsCreating(false);
                  setIsRenaming(false);
                  setNewName('');
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (isCreating) {
                    handleCreatePortfolio();
                  } else if (isRenaming) {
                    const portfolioToRename = portfolios.find(p => p.name === newName);
                    if (portfolioToRename) {
                      handleRenamePortfolio(portfolioToRename.id);
                    }
                  }
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                {isCreating ? 'Create' : 'Rename'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 