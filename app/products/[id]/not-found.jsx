'use client';

import React from 'react';
import Link from 'next/link';
import { PackageX, ArrowLeft } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 mb-4 shadow-inner">
        <PackageX className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
      <p className="mt-2 text-sm text-slate-500 max-w-md">
        The requested product could not be found. It may have been deleted, or the URL ID might be invalid.
      </p>
      <Link
        href="/products"
        className="mt-6 inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Products</span>
      </Link>
    </div>
  );
}
