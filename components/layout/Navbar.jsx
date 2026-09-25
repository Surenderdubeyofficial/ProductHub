'use client';

import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { Menu, LogOut, User, Bell } from 'lucide-react';

export default function Navbar({ onOpenSidebar }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors">
      {/* Left: Mobile hamburger & Title */}
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-medium text-slate-500">
            <span>Admin</span>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Products</span>
          </nav>
        </div>
      </div>

      {/* Right: User Profile & Actions */}
      <div className="flex items-center space-x-3 sm:space-x-5">
        {/* Mock Notification Icon */}
        <button
          type="button"
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
        </button>

        <div className="h-5 w-px bg-slate-200" />

        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 flex-shrink-0">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.firstName || 'User'}
                width={32}
                height={32}
                className="object-cover"
                unoptimized
              />
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>

          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight">
              {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'Emily Johnson'}
            </p>
            <p className="text-[11px] text-slate-500 font-medium leading-tight">
              @{user?.username || 'emilys'} • Admin
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={logout}
          title="Sign out of your session"
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/20"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
