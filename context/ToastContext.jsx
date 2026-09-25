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
    ({ type = 'success', message, duration = 4000 }) => {
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
      {/* Toast container */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg border text-sm transition-all transform animate-slideUp ${
                isSuccess
                  ? 'bg-emerald-950/90 border-emerald-700/50 text-emerald-200'
                  : isError
                  ? 'bg-rose-950/90 border-rose-700/50 text-rose-200'
                  : 'bg-slate-900/90 border-slate-700 text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
                {isError && <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
                {!isSuccess && !isError && <Info className="w-5 h-5 text-indigo-400 flex-shrink-0" />}
                <p className="font-medium text-xs sm:text-sm">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="ml-3 p-1 rounded-md hover:bg-white/10 transition-colors text-current opacity-70 hover:opacity-100"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
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
