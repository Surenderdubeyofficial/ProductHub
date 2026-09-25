'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  PackageCheck,
} from 'lucide-react';

import productService from '@/services/productService';
import { formatCurrency, formatRating, getStockStatus } from '@/utils/formatters';
import Badge from '@/components/common/Badge';
import Loader from '@/components/common/Loader';
import DeleteModal from '@/components/products/DeleteModal';
import { useToast } from '@/hooks/useToast';
import ProductNotFound from './not-found';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
        if (isMounted) {
          setProduct(data);
          const initialImg = data.thumbnail || (data.images && data.images[0]) || '';
          setSelectedImage(initialImg);
        }
      } catch (err) {
        if (isMounted) {
          setIsNotFound(true);
        }
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

  const handleDeleteConfirm = async () => {
    if (!product || isDeleting) return;

    try {
      setIsDeleting(true);
      await productService.deleteProduct(product.id);
      showToast({
        type: 'success',
        message: `Product "${product.title}" deleted.`,
      });
      router.push('/products');
    } catch (err) {
      showToast({
        type: 'error',
        message: err.friendlyMessage || 'Failed to delete product.',
      });
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader size="md" text="Loading product details..." />
      </div>
    );
  }

  if (isNotFound || !product) {
    return <ProductNotFound />;
  }

  const stockStatus = getStockStatus(product.stock);
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.thumbnail].filter(Boolean);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
        <div className="flex items-center space-x-2">
          <Link
            href="/products"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Back to products"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
            <Link href="/products" className="hover:text-slate-900 transition-colors">
              Products
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold truncate max-w-xs sm:max-w-md">
              {product.title}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <Link
            href={`/products/${product.id}/edit`}
            className="h-8 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium inline-flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            className="h-8 px-3 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-600 rounded-lg text-xs font-medium inline-flex items-center space-x-1.5 shadow-xs transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 flex items-center justify-center h-72 sm:h-80 shadow-xs overflow-hidden">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={product.title}
                width={320}
                height={320}
                className="object-contain max-h-full max-w-full"
                unoptimized
              />
            ) : (
              <span className="text-xs text-slate-400">No Image Available</span>
            )}
          </div>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex items-center space-x-2 overflow-x-auto py-1">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-14 h-14 rounded-lg border p-1 bg-white overflow-hidden flex-shrink-0 transition-all ${
                    selectedImage === imgUrl
                      ? 'border-slate-900 ring-1 ring-slate-900 shadow-xs'
                      : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    width={48}
                    height={48}
                    className="object-contain w-full h-full"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Key Info & Pricing (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="default">{product.category}</Badge>
              {product.brand && (
                <Badge variant="default" className="text-slate-500 font-normal">
                  {product.brand}
                </Badge>
              )}
              {product.sku && (
                <span className="text-[11px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100">
                  SKU: {product.sku}
                </span>
              )}
            </div>

            {/* Title & Rating */}
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
                {product.title}
              </h1>
              <div className="mt-2 flex items-center space-x-2">
                <div className="inline-flex items-center space-x-1 text-xs text-slate-700">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="font-semibold tabular-nums">{formatRating(product.rating)}</span>
                </div>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">
                  {product.reviews?.length || 0} reviews
                </span>
              </div>
            </div>

            {/* Price & Stock bar */}
            <div className="p-3.5 rounded-lg bg-slate-50/80 border border-slate-200/60 flex items-center justify-between">
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-slate-900 tabular-nums">
                    {formatCurrency(product.price)}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded">
                      {product.discountPercentage}% off
                    </span>
                  )}
                </div>
              </div>

              <div>
                <Badge variant={stockStatus.variant} size="md">
                  {stockStatus.label}
                </Badge>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">
                Description
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              {product.warrantyInformation && (
                <div className="flex items-start space-x-2 text-xs text-slate-600">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-slate-900 block">Warranty</span>
                    {product.warrantyInformation}
                  </div>
                </div>
              )}
              {product.shippingInformation && (
                <div className="flex items-start space-x-2 text-xs text-slate-600">
                  <Truck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-slate-900 block">Shipping</span>
                    {product.shippingInformation}
                  </div>
                </div>
              )}
              {product.returnPolicy && (
                <div className="flex items-start space-x-2 text-xs text-slate-600">
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-slate-900 block">Returns</span>
                    {product.returnPolicy}
                  </div>
                </div>
              )}
              {product.dimensions && (
                <div className="flex items-start space-x-2 text-xs text-slate-600">
                  <PackageCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-slate-900 block">Dimensions</span>
                    {product.dimensions.width} &times; {product.dimensions.height} &times; {product.dimensions.depth} cm
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Reviews */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center justify-between">
                <span>Customer Reviews</span>
                <span className="text-xs text-slate-400 font-normal">
                  {product.reviews.length} total
                </span>
              </h3>

              <div className="space-y-3 divide-y divide-slate-100">
                {product.reviews.map((rev, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-xs text-slate-900">
                          {rev.reviewerName}
                        </span>
                        <div className="flex items-center space-x-0.5">
                          {Array.from({ length: 5 }).map((_, s) => (
                            <Star
                              key={s}
                              className={`w-2.5 h-2.5 ${
                                s < rev.rating
                                  ? 'text-amber-500 fill-amber-500'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {rev.date ? new Date(rev.date).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 italic">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteOpen}
        product={product}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
