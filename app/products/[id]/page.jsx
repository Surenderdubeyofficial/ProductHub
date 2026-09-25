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
  Tag,
  PackageCheck,
  Barcode,
  Calendar,
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
        message: `Product "${product.title}" has been deleted.`,
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
        <Loader size="lg" text="Loading product details..." />
      </div>
    );
  }

  if (isNotFound || !product) {
    return <ProductNotFound />;
  }

  const stockStatus = getStockStatus(product.stock);
  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.thumbnail].filter(Boolean);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Action Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <Link
          href="/products"
          className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        <div className="flex items-center space-x-3">
          <Link
            href={`/products/${product.id}/edit`}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs sm:text-sm font-semibold border border-amber-200 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Product</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs sm:text-sm font-semibold border border-rose-200 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Product Images Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center justify-center h-80 sm:h-96 shadow-sm overflow-hidden relative">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={product.title}
                width={400}
                height={400}
                className="object-contain max-h-full max-w-full hover:scale-105 transition-transform duration-300"
                unoptimized
              />
            ) : (
              <span className="text-sm text-slate-400">No Image Available</span>
            )}
          </div>

          {/* Thumbnails list */}
          {galleryImages.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto py-2">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-16 h-16 rounded-xl border-2 p-1 bg-white overflow-hidden flex-shrink-0 transition-all ${
                    selectedImage === imgUrl
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    width={64}
                    height={64}
                    className="object-contain w-full h-full"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Specifications (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            {/* Badges & Meta */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="indigo">{product.category}</Badge>
              {product.brand && (
                <Badge variant="default" className="text-slate-600">
                  Brand: {product.brand}
                </Badge>
              )}
              {product.sku && (
                <Badge variant="default" className="font-mono text-slate-500">
                  SKU: {product.sku}
                </Badge>
              )}
            </div>

            {/* Title & Ratings */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {product.title}
              </h1>
              <div className="mt-3 flex items-center space-x-3">
                <div className="flex items-center space-x-1 text-sm font-bold text-slate-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{formatRating(product.rating)}</span>
                </div>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500">
                  {product.reviews ? `${product.reviews.length} customer reviews` : 'Top Rated'}
                </span>
              </div>
            </div>

            {/* Price & Stock Display */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
                  Price
                </p>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {formatCurrency(product.price)}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mb-1">
                  Availability
                </p>
                <Badge variant={stockStatus.variant} size="md">
                  {stockStatus.label}
                </Badge>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Description
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Highlights / Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              {product.warrantyInformation && (
                <div className="flex items-start space-x-3 text-xs text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Warranty</span>
                    {product.warrantyInformation}
                  </div>
                </div>
              )}
              {product.shippingInformation && (
                <div className="flex items-start space-x-3 text-xs text-slate-600">
                  <Truck className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Shipping</span>
                    {product.shippingInformation}
                  </div>
                </div>
              )}
              {product.returnPolicy && (
                <div className="flex items-start space-x-3 text-xs text-slate-600">
                  <RotateCcw className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Returns</span>
                    {product.returnPolicy}
                  </div>
                </div>
              )}
              {product.dimensions && (
                <div className="flex items-start space-x-3 text-xs text-slate-600">
                  <PackageCheck className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Dimensions</span>
                    {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth} cm
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Reviews Section */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
                <span>Customer Reviews</span>
                <span className="text-xs font-semibold text-slate-500">
                  {product.reviews.length} total
                </span>
              </h3>

              <div className="space-y-4 divide-y divide-slate-100">
                {product.reviews.map((rev, idx) => (
                  <div key={idx} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-xs sm:text-sm text-slate-900">
                          {rev.reviewerName}
                        </span>
                        <div className="flex items-center space-x-0.5">
                          {Array.from({ length: 5 }).map((_, s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s < rev.rating
                                  ? 'text-amber-500 fill-amber-500'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {rev.date ? new Date(rev.date).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 italic">
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
