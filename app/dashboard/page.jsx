'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  DollarSign,
  Star,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Plus,
  CheckCircle2,
  ExternalLink,
  Settings as SettingsIcon,
} from 'lucide-react';

import DashboardShell from '@/components/layout/DashboardShell';
import productService from '@/services/productService';
import { formatCurrency, formatRating, getStockStatus } from '@/utils/formatters';
import Badge from '@/components/common/Badge';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentProducts, setRecentProducts] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch up to 100 products to compute real metrics
      const result = await productService.getProducts({ limit: 100 });
      const products = result.products || [];
      const total = result.total || products.length;

      // 1. Calculate Total Catalog Value
      const totalValue = products.reduce((acc, p) => acc + (Number(p.price) || 0), 0);

      // 2. Calculate Average Rating
      const avgRating =
        products.length > 0
          ? products.reduce((acc, p) => acc + (Number(p.rating) || 0), 0) / products.length
          : 0;

      // 3. Stock Health Breakdown
      const outOfStock = products.filter((p) => Number(p.stock) <= 0).length;
      const lowStock = products.filter((p) => Number(p.stock) > 0 && Number(p.stock) <= 10).length;
      const inStock = products.filter((p) => Number(p.stock) > 10).length;

      // 4. Category breakdown
      const catCountMap = {};
      products.forEach((p) => {
        const cat = p.category || 'other';
        catCountMap[cat] = (catCountMap[cat] || 0) + 1;
      });

      const sortedCategories = Object.entries(catCountMap)
        .map(([name, count]) => ({
          name,
          count,
          percentage: Math.round((count / products.length) * 100),
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      setStats({
        total,
        totalValue,
        avgRating,
        inStock,
        lowStock,
        outOfStock,
      });
      setCategoryStats(sortedCategories);
      setRecentProducts(products.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
      setError(err.friendlyMessage || 'Could not load dashboard statistics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/60">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Overview
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Live catalog statistics and inventory health performance.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/products/new"
              className="h-8 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium inline-flex items-center space-x-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </Link>
            <Link
              href="/products"
              className="h-8 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium inline-flex items-center space-x-1.5 shadow-xs transition-colors"
            >
              <span>Manage Catalog</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader size="md" text="Calculating live inventory metrics..." />
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to load dashboard metrics"
            message={error}
            onRetry={fetchDashboardData}
          />
        ) : (
          <>
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Card 1: Total Products */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-medium">Total Products</span>
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
                    {stats?.total || 0}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    <span>Live synced with DummyJSON</span>
                  </p>
                </div>
              </div>

              {/* Card 2: Catalog Value */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-medium">Sample Value</span>
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
                    {formatCurrency(stats?.totalValue || 0)}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Based on current inventory sample
                  </p>
                </div>
              </div>

              {/* Card 3: Average Rating */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-medium">Average Rating</span>
                  <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums flex items-baseline gap-1">
                    <span>{formatRating(stats?.avgRating || 0)}</span>
                    <span className="text-xs font-normal text-slate-400">/ 5.0</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Aggregated customer feedback
                  </p>
                </div>
              </div>

              {/* Card 4: Inventory Alerts */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-medium">Stock Attention</span>
                  <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums flex items-center space-x-2">
                    <span>{stats?.lowStock + stats?.outOfStock}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                      {stats?.lowStock} low, {stats?.outOfStock} out
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Require restocking attention
                  </p>
                </div>
              </div>
            </div>

            {/* Main Analysis Section (2 Columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Top Categories & Recent Additions (8 cols) */}
              <div className="lg:col-span-8 space-y-5">
                {/* Category Distribution */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <h2 className="text-sm font-semibold text-slate-900">
                      Top Categories Distribution
                    </h2>
                    <Link
                      href="/products"
                      className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      Filter by category &rarr;
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {categoryStats.map((cat) => (
                      <div key={cat.name} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-slate-700 capitalize">
                            {cat.name.replace(/-/g, ' ')}
                          </span>
                          <span className="text-slate-400 tabular-nums">
                            {cat.count} items ({cat.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-slate-800 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, cat.percentage * 3)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Products Sample Table */}
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900">
                        Featured Catalog Products
                      </h2>
                      <p className="text-[11px] text-slate-400">
                        Latest items in your inventory
                      </p>
                    </div>
                    <Link
                      href="/products"
                      className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      View all ({stats?.total}) &rarr;
                    </Link>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[11px] font-medium text-slate-500 uppercase">
                          <th className="py-2.5 pl-4 pr-3">Product</th>
                          <th className="py-2.5 px-3">Category</th>
                          <th className="py-2.5 px-3 text-right">Price</th>
                          <th className="py-2.5 px-3 text-center">Stock</th>
                          <th className="py-2.5 pl-3 pr-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {recentProducts.map((p) => {
                          const stockStatus = getStockStatus(p.stock);
                          return (
                            <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-2.5 pl-4 pr-3">
                                <div className="flex items-center space-x-2.5">
                                  <div className="w-8 h-8 rounded-md bg-slate-50 border border-slate-200/70 p-0.5 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                    {p.thumbnail ? (
                                      <Image
                                        src={p.thumbnail}
                                        alt={p.title}
                                        width={30}
                                        height={30}
                                        className="object-contain w-full h-full"
                                        unoptimized
                                      />
                                    ) : (
                                      <span className="text-[9px] text-slate-400">N/A</span>
                                    )}
                                  </div>
                                  <span className="font-medium text-slate-900 truncate max-w-[180px]">
                                    {p.title}
                                  </span>
                                </div>
                              </td>
                              <td className="py-2.5 px-3">
                                <Badge variant="default" size="sm">
                                  {p.category}
                                </Badge>
                              </td>
                              <td className="py-2.5 px-3 text-right font-medium text-slate-900 tabular-nums">
                                {formatCurrency(p.price)}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <Badge variant={stockStatus.variant} size="sm">
                                  {stockStatus.label}
                                </Badge>
                              </td>
                              <td className="py-2.5 pl-3 pr-4 text-right">
                                <Link
                                  href={`/products/${p.id}`}
                                  className="text-slate-600 hover:text-slate-900 font-medium inline-flex items-center space-x-1"
                                >
                                  <span>View</span>
                                  <ArrowRight className="w-3 h-3 text-slate-400" />
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: Inventory Health & Shortcuts (4 cols) */}
              <div className="lg:col-span-4 space-y-5">
                {/* Stock Health Breakdown */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                  <h2 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">
                    Inventory Stock Health
                  </h2>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-medium text-emerald-900">In Stock (&gt;10)</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-800 tabular-nums">
                        {stats?.inStock} items
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/60 border border-amber-100">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-medium text-amber-900">Low Stock (1-10)</span>
                      </div>
                      <span className="text-xs font-bold text-amber-800 tabular-nums">
                        {stats?.lowStock} items
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-rose-50/60 border border-rose-100">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span className="text-xs font-medium text-rose-900">Out of Stock (0)</span>
                      </div>
                      <span className="text-xs font-bold text-rose-800 tabular-nums">
                        {stats?.outOfStock} items
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/products"
                    className="block w-full py-2 text-center text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                  >
                    View Filterable Inventory Table
                  </Link>
                </div>

                {/* System & Architecture Info */}
                <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3 text-xs">
                  <h2 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-100">
                    System Architecture
                  </h2>
                  <div className="space-y-2 text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Framework</span>
                      <span className="font-mono text-slate-800 font-semibold">Next.js 14 App Router</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Language</span>
                      <span className="font-mono text-slate-800 font-semibold">JavaScript (No TS)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">API Client</span>
                      <span className="font-mono text-slate-800 font-semibold">Shared Axios Instance</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Race Handling</span>
                      <span className="font-mono text-slate-800 font-semibold">AbortController</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Local Persistence</span>
                      <span className="font-mono text-slate-800 font-semibold">LocalStorage Overlay</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <Link
                      href="/settings"
                      className="inline-flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 font-medium"
                    >
                      <SettingsIcon className="w-3.5 h-3.5" />
                      <span>Configure System Settings &rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardShell>
  );
}
