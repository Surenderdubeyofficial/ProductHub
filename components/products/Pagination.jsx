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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3 px-1 text-xs">
      {/* Range Summary Text */}
      <div className="text-slate-500 font-medium order-2 sm:order-1">
        {showingText}
      </div>

      {/* Controls: Rows per page + Page Navigation */}
      <div className="flex flex-wrap items-center gap-3 order-1 sm:order-2">
        {/* Rows per page selector */}
        <div className="flex items-center space-x-1.5 text-slate-500">
          <label htmlFor="limit-select" className="font-medium whitespace-nowrap">
            Rows per page:
          </label>
          <select
            id="limit-select"
            value={limit}
            disabled={disabled}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="h-8 bg-white border border-slate-200 rounded-md px-2 text-xs font-medium text-slate-700 shadow-xs hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-950 disabled:opacity-50"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Page Buttons Nav */}
        <nav
          aria-label="Pagination"
          className="inline-flex items-center space-x-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-xs"
        >
          {/* Previous Button */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || disabled}
            aria-label="Previous page"
            className="h-7 w-7 flex items-center justify-center rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:text-slate-300 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-0.5">
            {pageNumbers.map((num, idx) => {
              if (num === '...') {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-1.5 py-1 text-slate-400 select-none text-[11px]"
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
                  className={`min-w-[28px] h-7 px-1.5 text-xs font-medium rounded-md transition-colors ${
                    isCurrent
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
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
            aria-label="Next page"
            className="h-7 w-7 flex items-center justify-center rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:text-slate-300 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </nav>
      </div>
    </div>
  );
}
