import React from 'react';

interface Toast {
  id: number;
  title: string;
  description: string;
  variant?: 'default' | 'destructive' | 'success';
}

interface ToastContainerProps {
  toasts: Toast[];
}

export default function ToastContainer({ toasts }: ToastContainerProps) {
  return (
    <>
      <div className="fixed top-4 left-1/2 z-[9999] flex flex-col items-center space-y-2" style={{ transform: 'translateX(-50%)' }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-all duration-300 animate-fade-in-out
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
      <style jsx global>{`
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(-16px) scale(0.98); }
          10% { opacity: 1; transform: translateY(0) scale(1); }
          90% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-16px) scale(0.98); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 3.5s both;
        }
      `}</style>
    </>
  );
} 