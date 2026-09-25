'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import ProductForm from '@/components/products/ProductForm';
import productService from '@/services/productService';
import { useToast } from '@/hooks/useToast';

export default function NewProductPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleCreate = async (formData) => {
    // Guard against multiple submissions
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setApiError('');
      const newProduct = await productService.createProduct(formData);

      showToast({
        type: 'success',
        message: `Product "${newProduct.title}" created successfully!`,
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
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Breadcrumb / Top Header */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
        <Link
          href="/products"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Back to products"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Create New Product
            </h1>
            <span className="p-1 rounded-lg bg-indigo-50 text-indigo-600">
              <PlusCircle className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            Fill in the information below to add an item to the product catalog.
          </p>
        </div>
      </div>

      {/* Product Form */}
      <ProductForm
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
        apiError={apiError}
        title="Product Specifications"
        submitButtonText="Create Product"
      />
    </div>
  );
}
