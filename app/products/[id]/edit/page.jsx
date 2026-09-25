'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setApiError('');
      await productService.updateProduct(productId, formData);

      showToast({
        type: 'success',
        message: `Product "${formData.title}" updated.`,
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
        <Loader size="md" text="Loading product..." />
      </div>
    );
  }

  if (isNotFound || !product) {
    return <ProductNotFound />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-12">
      {/* Header */}
      <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-200/60">
        <Link
          href={`/products/${productId}`}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Back to product details"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            Edit Product
          </h1>
          <p className="text-xs text-slate-500">
            Modify details for &ldquo;{product.title}&rdquo;
          </p>
        </div>
      </div>

      {/* Form */}
      <ProductForm
        initialData={product}
        onSubmit={handleUpdate}
        isSubmitting={isSubmitting}
        apiError={apiError}
        submitButtonText="Save Changes"
      />
    </div>
  );
}
