'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit3 } from 'lucide-react';
import ProductForm from '@/components/products/ProductForm';
import productService from '@/services/productService';
import Loader from '@/components/common/Loader';
import { useToast } from '@/hooks/useToast';
import ProductNotFound from '../not-found';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // Load existing product details for pre-filling
  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      setIsLoading(true);
      setIsNotFound(false);
      try {
        const data = await productService.getProductById(productId);
        if (!data) {
          if (isMounted) setIsNotFound(true);
          return;
        }
        if (isMounted) setProduct(data);
      } catch (err) {
        if (isMounted) setIsNotFound(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    if (productId) {
      loadProduct();
    }

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const handleUpdate = async (formData) => {
    // Prevent duplicate clicks
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setApiError('');
      await productService.updateProduct(productId, formData);

      showToast({
        type: 'success',
        message: `Product "${formData.title}" updated successfully!`,
      });

      router.push(`/products/${productId}`);
    } catch (err) {
      console.error('Failed to update product:', err);
      setApiError(err.friendlyMessage || 'Failed to update product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader size="lg" text="Loading product for editing..." />
      </div>
    );
  }

  if (isNotFound || !product) {
    return <ProductNotFound />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Breadcrumb / Top Header */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
        <Link
          href={`/products/${productId}`}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Back to product details"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Edit Product #{productId}
            </h1>
            <span className="p-1 rounded-lg bg-amber-50 text-amber-700">
              <Edit3 className="w-4 h-4" />
            </span>
          </div>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            Modify product information and inventory settings.
          </p>
        </div>
      </div>

      {/* Pre-filled Product Form */}
      <ProductForm
        initialData={product}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
        apiError={apiError}
        title="Update Specifications"
        submitButtonText="Save Changes"
      />
    </div>
  );
}
