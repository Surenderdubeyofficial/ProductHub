import React from 'react';

export function TableSkeleton({ rows = 8 }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs animate-pulse">
      <div className="h-10 bg-slate-50 border-b border-slate-200/80" />
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-4 py-3 flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-10 h-10 bg-slate-200/70 rounded-lg flex-shrink-0" />
              <div className="space-y-1.5 flex-1 max-w-xs">
                <div className="h-3.5 bg-slate-200/70 rounded w-4/5" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
            <div className="h-5 bg-slate-100 rounded w-20 hidden sm:block" />
            <div className="h-4 bg-slate-200/70 rounded w-14" />
            <div className="h-4 bg-slate-100 rounded w-12 hidden md:block" />
            <div className="h-5 bg-slate-100 rounded w-16 hidden lg:block" />
            <div className="h-7 bg-slate-100 rounded w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({ cards = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-pulse">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200/80 p-3.5 space-y-3 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-slate-200/70 rounded-lg flex-shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3.5 bg-slate-200/70 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <div className="h-4 bg-slate-200/70 rounded w-16" />
            <div className="h-4 bg-slate-100 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
