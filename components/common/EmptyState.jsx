import React from 'react';
import { PackageSearch, RotateCcw } from 'lucide-react';

/**
 * Clean, Restrained SaaS Empty State
 */
export default function EmptyState({
  title = 'No products found',
  description = 'Try adjusting your search terms or filters to find what you are looking for.',
  actionLabel = 'Clear filters',
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-200/80 shadow-xs my-4">
      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 mb-3">
        <PackageSearch className="w-5 h-5 text-slate-600" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-xs text-slate-500 max-w-sm">{description}</p>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center space-x-1.5 h-8 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium shadow-xs transition-colors focus:outline-none focus:ring-1 focus:ring-slate-950"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
