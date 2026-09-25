/**
 * Pagination & URL Parameter Utilities
 * Provides safe sanitization of search parameters, range calculations,
 * and page number sequence generation.
 */

export const VALID_LIMITS = [10, 20, 50];
export const VALID_SORT_FIELDS = ['title', 'price', 'rating'];
export const VALID_ORDERS = ['asc', 'desc'];

/**
 * Sanitize raw URL search parameters with safe fallback defaults
 */
export function sanitizeQueryParams(params) {
  // Normalize params whether passed as URLSearchParams or plain object
  const getParam = (key) => {
    if (!params) return null;
    if (typeof params.get === 'function') return params.get(key);
    return params[key];
  };

  // 1. Sanitize Limit (must be 10, 20, or 50; default 10)
  const rawLimit = parseInt(getParam('limit'), 10);
  const limit = VALID_LIMITS.includes(rawLimit) ? rawLimit : 10;

  // 2. Sanitize Page (must be integer >= 1; default 1)
  const rawPage = parseInt(getParam('page'), 10);
  const page = !isNaN(rawPage) && rawPage >= 1 ? rawPage : 1;

  // 3. Sanitize Search Query
  const rawSearch = getParam('search');
  const search = typeof rawSearch === 'string' ? rawSearch.trim() : '';

  // 4. Sanitize Category
  const rawCategory = getParam('category');
  const category = typeof rawCategory === 'string' ? rawCategory.trim() : '';

  // 5. Sanitize Sort Field
  const rawSortBy = getParam('sortBy');
  const sortBy = VALID_SORT_FIELDS.includes(rawSortBy) ? rawSortBy : '';

  // 6. Sanitize Sort Order (asc or desc; default asc)
  const rawOrder = getParam('order');
  const order = VALID_ORDERS.includes(rawOrder) ? rawOrder : 'asc';

  return {
    page,
    limit,
    search,
    category,
    sortBy,
    order,
  };
}

/**
 * Calculate pagination offsets, bounds, and user-facing text
 */
export function calculatePagination({ total = 0, page = 1, limit = 10 }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  // Gracefully clamp page if it exceeds totalPages or is less than 1
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const skip = (currentPage - 1) * limit;

  const from = total === 0 ? 0 : skip + 1;
  const to = Math.min(currentPage * limit, total);
  const showingText = total === 0 ? 'Showing 0 products' : `Showing ${from}–${to} of ${total}`;

  return {
    totalPages,
    currentPage,
    skip,
    from,
    to,
    showingText,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

/**
 * Generate an array of page numbers with ellipsis for display
 * Example output: [1, 2, 3, '...', 10]
 */
export function generatePageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If near the beginning
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, '...', totalPages];
  }

  // If near the end
  if (currentPage >= totalPages - 3) {
    return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  // Somewhere in the middle
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
}
