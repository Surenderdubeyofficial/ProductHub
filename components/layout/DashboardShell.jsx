'use client';

import React, { useState } from 'react';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export default function DashboardShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50/60 flex flex-col">
        {/* Desktop Fixed Sidebar (w-60) & Mobile Drawer */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="lg:pl-60 flex flex-col flex-1 min-w-0">
          <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
