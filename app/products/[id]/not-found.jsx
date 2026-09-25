'use client';

import React from 'react';
import Link from 'next/link';
import { PackageX, ArrowLeft } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-white rounded-xl border border-slate-200/80 shadow-xs">
      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 mb-3">
        <PackageX className="w-5 h-5 text-slate-600" />
      </div>
      <h2 className="text-sm font-semibold text-slate-900">Product not found</h2>
      <p className="mt-1 text-xs text-slate-500 max-w-sm">
        The requested product could not be located. It may have been deleted or the identifier is invalid.
      </p>
      <Link
        href="/products"
        className="mt-4 inline-flex items-center space-x-1.5 h-8 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium shadow-xs transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Products</span>
      </Link>
    </div>
  );
}
