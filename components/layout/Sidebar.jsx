'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Settings,
  X,
  Sparkles,
  Layers,
  HelpCircle,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Products',
      href: '/products',
      icon: Package,
      current: pathname.startsWith('/products'),
    },
    {
      name: 'Overview',
      href: '#',
      icon: LayoutDashboard,
      current: false,
      badge: 'Soon',
    },
    {
      name: 'Settings',
      href: '#',
      icon: Settings,
      current: false,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800/80 bg-slate-900/50">
          <Link href="/products" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">NexusAdmin</span>
              <span className="block text-[10px] uppercase font-semibold tracking-wider text-indigo-400">
                Enterprise
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Catalog Management
            </p>
            <nav className="mt-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all ${
                      item.current
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${item.current ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700/60 rounded">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              System Info
            </p>
            <div className="mt-3 px-3 py-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  API
                </span>
                <span className="text-slate-300 font-mono">DummyJSON</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                  Architecture
                </span>
                <span className="text-slate-300">Axios + URL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>React Hiring Assignment</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium">
              v1.0.0
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
