'use client';

import React, { Component, ErrorInfo, ReactNode, memo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-[#F7FAFC] dark:bg-[#2D3748]">
          <div className="max-w-md w-full mx-4 p-6 bg-white dark:bg-[#1A202C] rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-[#2D3748] dark:text-white mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-[#4A5568] dark:text-[#A0AEC0] mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors duration-200"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default memo(ErrorBoundary); 