'use client';

import React, { Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Menu, LogOut, User, Clock } from 'lucide-react';

function NavbarContent({ onOpenSidebar }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();

  const isDelayActive = searchParams.get('delay') === '2000';

  const toggleDelay = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (isDelayActive) {
      params.delete('delay');
    } else {
      params.set('delay', '2000');
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username
    : 'Emily Johnson';

  return (
    <header className="sticky top-0 z-30 h-14 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
          <span className="text-slate-400">Inventory</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-semibold">Products</span>
        </div>
      </div>

      {/* Right: Subtle Developer API Delay Toggle & User Profile */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Subtle API Delay Test Pill */}
        <button
          type="button"
          onClick={toggleDelay}
          title="Toggle 2000ms network delay for race-condition testing"
          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
            isDelayActive
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-3 h-3 text-slate-400" />
          <span>API Delay: {isDelayActive ? 'ON (2s)' : 'OFF'}</span>
        </button>

        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        {/* User Info & Logout */}
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0 text-slate-500">
            {user?.image ? (
              <Image
                src={user.image}
                alt={displayName}
                width={24}
                height={24}
                className="object-cover"
                unoptimized
              />
            ) : (
              <User className="w-3 h-3" />
            )}
          </div>
          <span className="hidden md:inline text-xs font-medium text-slate-700">
            {displayName}
          </span>
          <button
            type="button"
            onClick={logout}
            title="Sign out"
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default function Navbar({ onOpenSidebar }) {
  return (
    <Suspense fallback={<header className="h-14 bg-white border-b border-slate-200/80" />}>
      <NavbarContent onOpenSidebar={onOpenSidebar} />
    </Suspense>
  );
}
