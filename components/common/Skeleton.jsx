import React from 'react';

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden animate-pulse">
      <div className="h-12 bg-slate-100/80 border-b border-slate-200/80" />
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-12 h-12 bg-slate-200 rounded-xl flex-shrink-0" />
              <div className="space-y-2 flex-1 max-w-sm">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
            <div className="h-6 bg-slate-200 rounded-full w-20 hidden sm:block" />
            <div className="h-4 bg-slate-200 rounded w-16" />
            <div className="h-4 bg-slate-200 rounded w-12 hidden md:block" />
            <div className="h-6 bg-slate-200 rounded-full w-24 hidden lg:block" />
            <div className="h-8 bg-slate-200 rounded-lg w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({ cards = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-slate-200 rounded-xl" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-5 bg-slate-200 rounded w-16" />
            <div className="h-5 bg-slate-200 rounded w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
