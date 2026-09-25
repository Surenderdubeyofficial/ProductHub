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
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
        {/* Search Input (Takes 5 columns on medium/large) */}
        <div className="md:col-span-5 relative">
          <label htmlFor="product-search" className="sr-only">
            Search products
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="product-search"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, brand, description..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Dropdown (Takes 4 columns on medium/large) */}
        <div className="md:col-span-4 relative">
          <label htmlFor="category-select" className="sr-only">
            Filter by category
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <select
            id="category-select"
            value={category}
            disabled={isSearchActive || isLoadingCategories}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={`w-full pl-9 pr-8 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
              isSearchActive
                ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-75'
                : 'border-slate-200'
            }`}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Controls (Takes 3 columns) */}
        <div className="md:col-span-3 flex items-center space-x-2">
          <div className="relative flex-1">
            <label htmlFor="sort-select" className="sr-only">
              Sort by
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value, order)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="">Sort by: Default</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="title">Title</option>
            </select>
          </div>

          {/* Ascending / Descending Toggle */}
          {sortBy && (
            <button
              type="button"
              onClick={() => onSortChange(sortBy, order === 'asc' ? 'desc' : 'asc')}
              title={`Switch to ${order === 'asc' ? 'Descending' : 'Ascending'} order`}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span className="sr-only">Toggle sort direction</span>
            </button>
          )}

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              title="Reset all filters"
              className="p-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-xl transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="sr-only">Reset filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Helpful Search/Category priority notice */}
      {isSearchActive && (
        <div className="flex items-center space-x-2 text-xs text-indigo-700 bg-indigo-50/80 border border-indigo-100 rounded-xl px-3.5 py-2 animate-fadeIn">
          <Info className="w-4 h-4 text-indigo-500 flex-shrink-0" />
          <span>
            Search query is active. Category filter is disabled because DummyJSON does not support simultaneous search + category filtering.
          </span>
        </div>
      )}
    </div>
  );
}
