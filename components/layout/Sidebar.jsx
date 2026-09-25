'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  Package,
  LayoutDashboard,
  Settings,
  X,
  LogOut,
  User,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    {
      name: 'Products',
      href: '/products',
      icon: Package,
      current: pathname.startsWith('/products'),
    },
    {
      name: 'Dashboard',
      href: '#',
      icon: LayoutDashboard,
      current: false,
      badge: 'Coming soon',
    },
    {
      name: 'Settings',
      href: '#',
      icon: Settings,
      current: false,
      badge: 'Coming soon',
    },
  ];

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username
    : 'Emily Johnson';

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-60 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-14 px-5 border-b border-slate-100">
          <Link href="/products" className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <Package className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              ProductHub
            </span>
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          <div>
            <p className="px-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Catalog
            </p>
            <nav className="mt-2 space-y-0.5">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`flex items-center justify-between px-2.5 py-2 text-xs font-medium rounded-lg transition-colors ${
                      item.current
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${item.current ? 'text-slate-900' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] text-slate-400 font-normal">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom User Profile Section */}
        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50/70 border border-slate-100">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0 text-slate-500">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={displayName}
                    width={28}
                    height={28}
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <User className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-900 truncate leading-tight">
                  {displayName}
                </p>
                <p className="text-[10px] text-slate-500 truncate leading-tight">
                  Administrator
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              title="Sign out"
              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
