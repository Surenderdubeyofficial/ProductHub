'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Loader from '@/components/common/Loader';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/products');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader size="lg" text="Loading NexusAdmin..." />
    </div>
  );
}
