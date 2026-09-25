import Link from 'next/link';
import { Compass, ArrowLeft } from 'lucide-react';

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-sm w-full bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 mx-auto mb-3">
          <Compass className="w-5 h-5" />
        </div>
        <h1 className="text-base font-semibold text-slate-900">Page not found</h1>
        <p className="mt-1 text-xs text-slate-500">
          The page you requested does not exist or has been moved.
        </p>
        <Link
          href="/products"
          className="mt-4 inline-flex items-center space-x-1.5 h-8 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium shadow-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>
      </div>
    </div>
  );
}
