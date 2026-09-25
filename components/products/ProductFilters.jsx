'use client';

import React from 'react';
import { Search, X, ArrowUpDown, Filter, RotateCcw, Info } from 'lucide-react';

export default function ProductFilters({
  searchTerm = '',
  onSearchChange,
  onClearSearch,
  category = '',
  categories = [],
  onCategoryChange,
  sortBy = '',
  order = 'asc',
  onSortChange,
  onResetFilters,
  isLoadingCategories = false,
}) {
  const isSearchActive = !!searchTerm.trim();
  const hasActiveFilters = isSearchActive || !!category || !!sortBy;

  return (
    <div className="space-y-2.5">
      {/* Unified Single-Row Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-2 sm:p-2.5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-2">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="product-search"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-8 h-9 bg-slate-50/70 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-950 focus:border-slate-950 transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <div className="relative min-w-[140px] flex-1 sm:flex-initial">
            <select
              id="category-select"
              value={category}
              disabled={isSearchActive || isLoadingCategories}
              onChange={(e) => onCategoryChange(e.target.value)}
              className={`w-full h-9 pl-3 pr-8 bg-slate-50/70 border rounded-lg text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-950 focus:border-slate-950 transition-all ${
                isSearchActive
                  ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                  : 'border-slate-200'
              }`}
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative min-w-[120px] flex-1 sm:flex-initial">
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value, order)}
              className="w-full h-9 px-3 bg-slate-50/70 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-950 focus:border-slate-950 transition-all"
            >
              <option value="">Sort by</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="title">Title</option>
            </select>
          </div>

          {/* Order Toggle Button */}
          {sortBy && (
            <button
              type="button"
              onClick={() => onSortChange(sortBy, order === 'asc' ? 'desc' : 'asc')}
              title={`Order: ${order === 'asc' ? 'Ascending' : 'Descending'} (click to toggle)`}
              className="h-9 px-2.5 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span className="uppercase text-[10px] tracking-wider font-semibold text-slate-600">
                {order}
              </span>
            </button>
          )}

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              title="Reset all filters"
              className="h-9 px-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Subtle Search vs Category notice */}
      {isSearchActive && (
        <div className="flex items-center space-x-2 text-[11px] text-slate-600 bg-slate-100/80 border border-slate-200/80 rounded-lg px-3 py-1.5 animate-fadeIn">
          <Info className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <span>
            Search is active. Category filter is disabled because DummyJSON does not support simultaneous search + category queries.
          </span>
        </div>
      )}
    </div>
  );
}
