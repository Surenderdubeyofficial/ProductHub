'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Plus, Sparkles, Clock } from 'lucide-react';

import productService from '@/services/productService';
import { sanitizeQueryParams, calculatePagination } from '@/utils/pagination';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/hooks/useToast';

import ProductTable from '@/components/products/ProductTable';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import Pagination from '@/components/products/Pagination';
import DeleteModal from '@/components/products/DeleteModal';
import { TableSkeleton, CardSkeleton } from '@/components/common/Skeleton';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';

function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  // 1. URL State extraction and sanitization
  const sanitizedParams = sanitizeQueryParams(searchParams);
  const {
    page: urlPage,
    limit: urlLimit,
    search: urlSearch,
    category: urlCategory,
    sortBy: urlSortBy,
    order: urlOrder,
  } = sanitizedParams;

  // Local state
  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchInput, 450);

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Artificial delay toggle for testing race conditions (&delay=2000)
  const hasDelayParam = searchParams.get('delay') === '2000';
  const [simulateDelay, setSimulateDelay] = useState(hasDelayParam);

  // Delete modal state
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    product: null,
    isDeleting: false,
  });

  // Reference for in-flight request cancellation (AbortController)
  const abortControllerRef = useRef(null);

  // Sync search input if URL changes externally (e.g. browser back/forward)
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  // Load category list once on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchCategories() {
      setIsLoadingCategories(true);
      try {
        const catList = await productService.getCategories();
        if (isMounted) setCategories(catList);
      } catch (err) {
        console.warn('Failed to load categories:', err);
      } finally {
        if (isMounted) setIsLoadingCategories(false);
      }
    }
    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Helper to push URL state updates
   */
  const updateUrl = useCallback(
    (newParams) => {
      const merged = {
        page: newParams.page !== undefined ? newParams.page : urlPage,
        limit: newParams.limit !== undefined ? newParams.limit : urlLimit,
        search: newParams.search !== undefined ? newParams.search : urlSearch,
        category: newParams.category !== undefined ? newParams.category : urlCategory,
        sortBy: newParams.sortBy !== undefined ? newParams.sortBy : urlSortBy,
        order: newParams.order !== undefined ? newParams.order : urlOrder,
      };

      const params = new URLSearchParams();

      if (merged.page > 1) params.set('page', merged.page.toString());
      if (merged.limit !== 10) params.set('limit', merged.limit.toString());
      if (merged.search) params.set('search', merged.search);
      if (merged.category && !merged.search) params.set('category', merged.category);
      if (merged.sortBy) {
        params.set('sortBy', merged.sortBy);
        params.set('order', merged.order || 'asc');
      }
      if (simulateDelay) {
        params.set('delay', '2000');
      }

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(targetUrl, { scroll: false });
    },
    [urlPage, urlLimit, urlSearch, urlCategory, urlSortBy, urlOrder, pathname, router, simulateDelay]
  );

  /**
   * Fetch products with AbortController race condition cancellation
   */
  const fetchProductList = useCallback(
    async (isRetry = false) => {
      // Abort previous in-flight request to prevent race conditions
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (isRetry) {
        setIsRetrying(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const skip = (urlPage - 1) * urlLimit;
      const delay = simulateDelay ? 2000 : undefined;

      try {
        let result;

        if (urlSearch) {
          // Search takes precedence
          result = await productService.searchProducts({
            q: urlSearch,
            limit: urlLimit,
            skip,
            delay,
            signal: controller.signal,
          });
        } else if (urlCategory) {
          // Filter by category
          result = await productService.getProductsByCategory({
            category: urlCategory,
            limit: urlLimit,
            skip,
            sortBy: urlSortBy,
            order: urlOrder,
            delay,
            signal: controller.signal,
          });
        } else {
          // Standard paginated listing
          result = await productService.getProducts({
            limit: urlLimit,
            skip,
            sortBy: urlSortBy,
            order: urlOrder,
            delay,
            signal: controller.signal,
          });
        }

        setProducts(result.products || []);
        setTotal(result.total || 0);

        // Clamping check: if requested page is out of bounds (e.g. ?page=999)
        const totalPages = Math.max(1, Math.ceil((result.total || 0) / urlLimit));
        if (urlPage > totalPages && result.total > 0) {
          updateUrl({ page: totalPages });
        }
      } catch (err) {
        // Silently ignore aborted requests from previous keystrokes
        if (axios.isCancel(err) || err.name === 'CanceledError') {
          return;
        }

        console.error('Products fetch error:', err);
        setError(err.friendlyMessage || 'Failed to load products. Please check your network connection.');
      } finally {
        setIsLoading(false);
        setIsRetrying(false);
      }
    },
    [urlPage, urlLimit, urlSearch, urlCategory, urlSortBy, urlOrder, simulateDelay, updateUrl]
  );

  // Trigger debounced search URL sync
  useEffect(() => {
    if (debouncedSearch !== urlSearch) {
      updateUrl({
        search: debouncedSearch,
        category: '', // Clear category when search changes
        page: 1,      // Reset to page 1
      });
    }
  }, [debouncedSearch, urlSearch, updateUrl]);

  // Main data fetching effect
  useEffect(() => {
    fetchProductList();

    return () => {
      // Clean up effect on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProductList]);

  // Filter & Pagination Handlers
  const handleSearchChange = (val) => {
    setSearchInput(val);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    updateUrl({ search: '', page: 1 });
  };

  const handleCategoryChange = (cat) => {
    updateUrl({ category: cat, search: '', page: 1 });
  };

  const handleSortChange = (sortByField, sortOrder) => {
    updateUrl({ sortBy: sortByField, order: sortOrder, page: 1 });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    updateUrl({ search: '', category: '', sortBy: '', order: 'asc', page: 1 });
  };

  const handlePageChange = (newPage) => {
    updateUrl({ page: newPage });
  };

  const handleLimitChange = (newLimit) => {
    updateUrl({ limit: newLimit, page: 1 });
  };

  // Delete Handlers
  const handleOpenDelete = (product) => {
    setDeleteModalState({ isOpen: true, product, isDeleting: false });
  };

  const handleCloseDelete = () => {
    if (deleteModalState.isDeleting) return;
    setDeleteModalState({ isOpen: false, product: null, isDeleting: false });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalState.product || deleteModalState.isDeleting) return;

    try {
      setDeleteModalState((prev) => ({ ...prev, isDeleting: true }));
      await productService.deleteProduct(deleteModalState.product.id);

      // Immediate UI update
      setProducts((prev) => prev.filter((p) => p.id !== deleteModalState.product.id));
      setTotal((prev) => Math.max(0, prev - 1));

      showToast({
        type: 'success',
        message: `Product "${deleteModalState.product.title}" successfully deleted.`,
      });

      handleCloseDelete();
    } catch (err) {
      showToast({
        type: 'error',
        message: err.friendlyMessage || 'Failed to delete product. Please try again.',
      });
      setDeleteModalState((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // Calculate pagination summary
  const paginationData = calculatePagination({
    total,
    page: urlPage,
    limit: urlLimit,
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Product Inventory
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {total} Total
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Browse, filter, and manage your e-commerce product catalog.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Race Condition Artificial Delay Toggle */}
          <button
            type="button"
            onClick={() => {
              const nextVal = !simulateDelay;
              setSimulateDelay(nextVal);
              updateUrl({ page: 1 });
            }}
            title="Simulate 2000ms network delay for race condition testing"
            className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              simulateDelay
                ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-inner'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${simulateDelay ? 'text-amber-700 animate-spin' : 'text-slate-400'}`} />
            <span>2s Delay: {simulateDelay ? 'ON' : 'OFF'}</span>
          </button>

          {/* Add Product Button */}
          <Link
            href="/products/new"
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <ProductFilters
        searchTerm={searchInput}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        category={urlCategory}
        categories={categories}
        onCategoryChange={handleCategoryChange}
        sortBy={urlSortBy}
        order={urlOrder}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
        isLoadingCategories={isLoadingCategories}
      />

      {/* Content Rendering: Loading, Error, Empty, or Table */}
      {isLoading ? (
        <>
          <div className="hidden md:block">
            <TableSkeleton rows={urlLimit > 10 ? 10 : urlLimit} />
          </div>
          <div className="block md:hidden">
            <CardSkeleton cards={4} />
          </div>
        </>
      ) : error ? (
        <ErrorState
          title="Could not load products"
          message={error}
          onRetry={() => fetchProductList(true)}
          isRetrying={isRetrying}
        />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try modifying your search query or removing filters to view items."
          onAction={handleResetFilters}
          actionLabel="Clear Filters"
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <ProductTable products={products} onDeleteClick={handleOpenDelete} />
          </div>

          {/* Mobile Card Grid View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDeleteClick={handleOpenDelete}
              />
            ))}
          </div>

          {/* Manual Pagination Controls */}
          <div className="bg-white rounded-2xl border border-slate-200/80 px-4 shadow-sm">
            <Pagination
              currentPage={paginationData.currentPage}
              totalPages={paginationData.totalPages}
              limit={urlLimit}
              showingText={paginationData.showingText}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </div>
        </>
      )}

      {/* Confirmation Modal for Deletion */}
      <DeleteModal
        isOpen={deleteModalState.isOpen}
        product={deleteModalState.product}
        isDeleting={deleteModalState.isDeleting}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8">
          <TableSkeleton rows={8} />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
