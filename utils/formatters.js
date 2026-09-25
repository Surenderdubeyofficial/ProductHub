/**
 * Formatting helpers for UI presentation
 */

export function formatCurrency(amount) {
  const num = Number(amount);
  if (isNaN(num)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
}

export function formatRating(rating) {
  const num = Number(rating);
  if (isNaN(num)) return '0.0';
  return num.toFixed(1);
}

export function getStockStatus(stock) {
  const count = Number(stock);
  if (count <= 0) {
    return { label: 'Out of Stock', variant: 'danger' };
  }
  if (count <= 10) {
    return { label: `Low Stock (${count})`, variant: 'warning' };
  }
  return { label: `In Stock (${count})`, variant: 'success' };
}
