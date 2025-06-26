"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface Toast {
  id: number;
  title: string;
  description: string;
  variant?: 'default' | 'destructive' | 'success';
}

interface ToastContextType {
  toast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

// Simple ToastContainer component inline
function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <>
      <div className="fixed top-4 left-1/2 z-[9999] flex flex-col items-center space-y-2" style={{ transform: 'translateX(-50%)' }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-all duration-300 animate-pulse
              ${toast.variant === 'success' ? 'bg-green-500 text-white' : ''}
              ${toast.variant === 'destructive' ? 'bg-red-500 text-white' : ''}
              ${toast.variant === 'default' ? 'bg-blue-500 text-white' : ''}
            `}
            style={{ minWidth: 220, maxWidth: 320, textAlign: 'center', opacity: 0.97 }}
          >
            <div className="font-bold">{toast.title}</div>
            <div>{toast.description}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const toast = useCallback(({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, description, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
} 