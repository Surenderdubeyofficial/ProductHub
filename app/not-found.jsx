import Link from 'next/link';
import { Compass, ArrowLeft } from 'lucide-react';

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mx-auto mb-4">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">404 - Page Not Found</h1>
        <p className="mt-2 text-sm text-slate-500">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    </div>
  );
}
