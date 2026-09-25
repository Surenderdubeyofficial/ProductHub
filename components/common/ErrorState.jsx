import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * Restrained SaaS Error State with functional Retry
 */
export default function ErrorState({
  title = 'Failed to load products',
  message = 'An unexpected error occurred while communicating with the server. Please try again.',
  onRetry,
  isRetrying = false,
}) {
  return (
    <div
      className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-rose-200 shadow-xs my-4"
      role="alert"
    >
      <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-xs text-slate-500 max-w-md">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-4 inline-flex items-center space-x-1.5 h-8 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium shadow-xs transition-colors focus:outline-none focus:ring-1 focus:ring-slate-950 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>{isRetrying ? 'Retrying...' : 'Retry'}</span>
        </button>
      )}
    </div>
  );
}
