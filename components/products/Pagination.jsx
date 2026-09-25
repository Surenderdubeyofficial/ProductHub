'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { generatePageNumbers } from '@/utils/pagination';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  limit = 10,
  showingText = '',
  onPageChange,
  onLimitChange,
  disabled = false,
}) {
  const pageNumbers = generatePageNumbers(currentPage, totalPages);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
      {/* Showing range text */}
      <div className="text-xs sm:text-sm text-slate-500 font-medium order-2 sm:order-1">
        {showingText}
      </div>

      {/* Controls: Page Numbers and Limit Selector */}
      <div className="flex flex-wrap items-center gap-3 order-1 sm:order-2">
        {/* Page Size Selector */}
        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <label htmlFor="limit-select" className="font-medium whitespace-nowrap">
            Rows per page:
          </label>
          <select
            id="limit-select"
            value={limit}
            disabled={disabled}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Page Navigation Buttons */}
        <nav
          aria-label="Pagination Navigation"
          className="inline-flex items-center space-x-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm"
        >
          {/* Previous Button */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || disabled}
            aria-label="Go to previous page"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:text-slate-300 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Number Buttons */}
          <div className="flex items-center space-x-1">
            {pageNumbers.map((num, idx) => {
              if (num === '...') {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 py-1 text-xs text-slate-400 select-none"
                  >
                    ...
                  </span>
                );
              }

              const isCurrent = num === currentPage;
              return (
                <button
                  key={`page-${num}`}
                  type="button"
                  onClick={() => onPageChange(num)}
                  disabled={disabled}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`min-w-[32px] h-8 px-2 text-xs font-semibold rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  } disabled:opacity-50`}
                >
                  {num}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || disabled}
            aria-label="Go to next page"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:text-slate-300 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </div>
  );
}
