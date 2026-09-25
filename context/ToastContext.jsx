'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = 'success', message, duration = 3500 }) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, message }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container positioned top-right on desktop, top-center on mobile */}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full sm:w-auto"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <div
              key={toast.id}
              className="pointer-events-auto flex items-center justify-between min-w-[280px] max-w-md p-3.5 bg-white border border-slate-200 rounded-lg shadow-lg text-sm text-slate-800 animate-slideDown"
            >
              <div className="flex items-center space-x-2.5">
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                {isError && <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
                {!isSuccess && !isError && <Info className="w-4 h-4 text-indigo-600 flex-shrink-0" />}
                <p className="text-xs sm:text-sm font-medium leading-tight">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="ml-3 p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastContext;
