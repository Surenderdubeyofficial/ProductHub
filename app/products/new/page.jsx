'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/components/products/ProductForm';
import productService from '@/services/productService';
import { useToast } from '@/hooks/useToast';

export default function NewProductPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleCreate = async (formData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setApiError('');
      const newProduct = await productService.createProduct(formData);

      showToast({
        type: 'success',
        message: `Product "${newProduct.title}" created.`,
      });

      router.push('/products');
    } catch (err) {
      console.error('Failed to create product:', err);
      setApiError(err.friendlyMessage || 'Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-12">
      {/* Breadcrumb / Top Header */}
      <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-200/60">
        <Link
          href="/products"
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Back to products"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            Add Product
          </h1>
          <p className="text-xs text-slate-500">
            Create a new item in your inventory catalog.
          </p>
        </div>
      </div>

      {/* Product Form */}
      <ProductForm
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
        apiError={apiError}
        submitButtonText="Create Product"
      />
    </div>
  );
}
