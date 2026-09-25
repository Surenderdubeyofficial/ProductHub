'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Store,
  Sliders,
  Terminal,
  RotateCcw,
  Check,
  User,
  ShieldCheck,
  LogOut,
  Clock,
  Database,
  AlertTriangle,
} from 'lucide-react';

import DashboardShell from '@/components/layout/DashboardShell';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const isDelayActive = searchParams.get('delay') === '2000';

  // Store Preferences local state
  const [storePreferences, setStorePreferences] = useState({
    storeName: 'ProductHub Enterprise',
    lowStockThreshold: 10,
    defaultPageSize: 10,
  });

  const [isSaved, setIsSaved] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nexus_store_preferences');
      if (saved) {
        setStorePreferences(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load settings:', e);
    }
  }, []);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('nexus_store_preferences', JSON.stringify(storePreferences));
      setIsSaved(true);
      showToast({
        type: 'success',
        message: 'Store preferences saved successfully.',
      });
      setTimeout(() => setIsSaved(false), 2500);
    } catch (e) {
      showToast({
        type: 'error',
        message: 'Failed to save preferences.',
      });
    }
  };

  const handleToggleDelay = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (isDelayActive) {
      params.delete('delay');
    } else {
      params.set('delay', '2000');
    }
    const query = params.toString();
    router.push(query ? `/settings?${query}` : '/settings', { scroll: false });
    showToast({
      type: 'info',
      message: `Simulated 2000ms API delay is now ${!isDelayActive ? 'ENABLED' : 'DISABLED'}.`,
    });
  };

  const handleResetLocalData = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('nexus_custom_products');
    localStorage.removeItem('nexus_edited_products');
    localStorage.removeItem('nexus_deleted_product_ids');
    setShowResetModal(false);
    showToast({
      type: 'success',
      message: 'Client mutation overlay reset. Products restored to pristine DummyJSON data.',
    });
  };

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username
    : 'Emily Johnson';

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="pb-2 border-b border-slate-200/60">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Settings
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Configure catalog preferences, developer tools, and account details.
          </p>
        </div>

        {/* Section 1: Store Preferences */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Catalog & Store Preferences
              </h2>
              <p className="text-[11px] text-slate-400">
                General display parameters for your inventory dashboard
              </p>
            </div>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="storeName"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Organization / Store Name
                </label>
                <input
                  id="storeName"
                  type="text"
                  value={storePreferences.storeName}
                  onChange={(e) =>
                    setStorePreferences((prev) => ({ ...prev, storeName: e.target.value }))
                  }
                  className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:border-slate-900 focus:ring-slate-900/10 transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="defaultPageSize"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Default Items per Page
                </label>
                <select
                  id="defaultPageSize"
                  value={storePreferences.defaultPageSize}
                  onChange={(e) =>
                    setStorePreferences((prev) => ({
                      ...prev,
                      defaultPageSize: Number(e.target.value),
                    }))
                  }
                  className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:border-slate-900 focus:ring-slate-900/10 transition-all"
                >
                  <option value={10}>10 items</option>
                  <option value={20}>20 items</option>
                  <option value={50}>50 items</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="lowStockThreshold"
                  className="block text-xs font-medium text-slate-700 mb-1.5"
                >
                  Low Stock Alert Threshold
                </label>
                <input
                  id="lowStockThreshold"
                  type="number"
                  min="1"
                  max="100"
                  value={storePreferences.lowStockThreshold}
                  onChange={(e) =>
                    setStorePreferences((prev) => ({
                      ...prev,
                      lowStockThreshold: Number(e.target.value),
                    }))
                  }
                  className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:border-slate-900 focus:ring-slate-900/10 transition-all"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Products with stock at or below this value will show warning status.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                className="h-8 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium inline-flex items-center space-x-1.5 shadow-xs transition-colors"
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Preferences</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Section 2: Developer & Testing Tools */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Developer & Testing Controls
              </h2>
              <p className="text-[11px] text-slate-400">
                Testing tools for simulated latency and client mutation overlays
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* 2-Second Delay Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 gap-3">
              <div>
                <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Artificial API Network Delay (2000ms)</span>
                </p>
                <p className="text-slate-500 mt-0.5">
                  Injects <code className="font-mono text-[11px] bg-slate-200/60 px-1 py-0.5 rounded">&delay=2000</code> into all DummyJSON calls to test AbortController race-condition cancellation.
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleDelay}
                className={`h-8 px-3 rounded-lg font-medium border transition-colors self-start sm:self-auto flex items-center space-x-1.5 shadow-xs ${
                  isDelayActive
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{isDelayActive ? 'Delay Active (2s)' : 'Enable Delay (2s)'}</span>
              </button>
            </div>

            {/* Clear Mutation Cache */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 gap-3">
              <div>
                <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-slate-600" />
                  <span>Reset Local Mutation Overlay</span>
                </p>
                <p className="text-slate-500 mt-0.5">
                  Purges all locally stored added, edited, and deleted products, reverting the catalog to pristine DummyJSON mock data.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="h-8 px-3 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-600 rounded-lg font-medium transition-colors self-start sm:self-auto flex items-center space-x-1.5 shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Cache</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Profile & Session Details */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                User Profile & Session
              </h2>
              <p className="text-[11px] text-slate-400">
                Currently authenticated DummyJSON administrator session
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0 text-slate-500">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={displayName}
                    width={48}
                    height={48}
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm text-slate-900">{displayName}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Administrator</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  @{user?.username || 'emilys'} • {user?.email || 'emily.johnson@x.dummyjson.com'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="h-8 px-3.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium inline-flex items-center space-x-1.5 shadow-xs transition-colors self-start sm:self-auto"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Resetting Local Mutations */}
      {showResetModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm bg-white rounded-xl border border-slate-200 shadow-xl p-5 overflow-hidden animate-slideUp">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Reset Local Mutations?
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  This will clear all added products, edits, and deletions stored in your browser, reverting to the original DummyJSON catalog.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="h-8 px-3 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetLocalData}
                className="h-8 px-3 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-xs transition-colors"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <DashboardShell>
          <div className="py-20 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
          </div>
        </DashboardShell>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
