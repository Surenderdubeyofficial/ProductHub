import React from 'react';
import { PackageSearch, RotateCcw } from 'lucide-react';

/**
 * Reusable Empty State Component
 */
export default function EmptyState({
  title = 'No products found',
  description = 'Try changing your search or filters to find what you are looking for.',
  actionLabel = 'Clear Filters',
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-sm my-6">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        <PackageSearch className="w-7 h-7 text-indigo-500" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
