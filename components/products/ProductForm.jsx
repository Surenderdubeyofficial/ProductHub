'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, AlertCircle } from 'lucide-react';
import { validateProductForm } from '@/utils/validation';
import productService from '@/services/productService';

export default function ProductForm({
  initialData = null,
  onSubmit,
  isSubmitting = false,
  apiError = '',
  submitButtonText = 'Save Product',
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    brand: '',
    thumbnail: '',
    discountPercentage: '',
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price !== undefined ? String(initialData.price) : '',
        stock: initialData.stock !== undefined ? String(initialData.stock) : '',
        category: initialData.category || '',
        brand: initialData.brand || '',
        thumbnail: initialData.thumbnail || '',
        discountPercentage:
          initialData.discountPercentage !== undefined
            ? String(initialData.discountPercentage)
            : '',
      });
    }
  }, [initialData]);

  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        const catList = await productService.getCategories();
        if (isMounted) setCategories(catList);
      } catch (e) {
        console.warn('Failed to load categories for form:', e);
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const { errors: validationErrors, isValid } = validateProductForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      discountPercentage: formData.discountPercentage ? Number(formData.discountPercentage) : 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Global API Error Alert */}
      {apiError && (
        <div
          className="p-3.5 rounded-lg bg-rose-50 border border-rose-200/80 text-rose-800 text-xs sm:text-sm flex items-start space-x-2.5"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Section 1: Product Information */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
          Product Information
        </h2>

        <div>
          <label htmlFor="title" className="block text-xs font-medium text-slate-700 mb-1.5">
            Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="e.g. Wireless Noise-Cancelling Headphones"
            className={`w-full h-9 px-3 bg-white border rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all ${
              errors.title
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900/10'
            } disabled:opacity-50`}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.title}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-xs font-medium text-slate-700 mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full h-9 px-3 bg-white border rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 transition-all ${
                errors.category
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900/10'
              } disabled:opacity-50`}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.category}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="brand" className="block text-xs font-medium text-slate-700 mb-1.5">
              Brand
            </label>
            <input
              id="brand"
              name="brand"
              type="text"
              value={formData.brand}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g. Sony, Apple, Nike"
              className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-slate-900 focus:ring-slate-900/10 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-xs font-medium text-slate-700 mb-1.5">
            Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Detailed overview of product features and specifications..."
            className={`w-full p-3 bg-white border rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all ${
              errors.description
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900/10'
            } disabled:opacity-50`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.description}
            </p>
          )}
        </div>
      </div>

      {/* Section 2: Pricing & Inventory */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
          Pricing & Inventory
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="price" className="block text-xs font-medium text-slate-700 mb-1.5">
              Price ($) <span className="text-rose-500">*</span>
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="99.99"
              className={`w-full h-9 px-3 bg-white border rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all ${
                errors.price
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900/10'
              } disabled:opacity-50`}
            />
            {errors.price && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.price}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="stock" className="block text-xs font-medium text-slate-700 mb-1.5">
              Stock Quantity <span className="text-rose-500">*</span>
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              step="1"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="50"
              className={`w-full h-9 px-3 bg-white border rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all ${
                errors.stock
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900/10'
              } disabled:opacity-50`}
            />
            {errors.stock && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.stock}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="discountPercentage" className="block text-xs font-medium text-slate-700 mb-1.5">
              Discount (%)
            </label>
            <input
              id="discountPercentage"
              name="discountPercentage"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={formData.discountPercentage}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="0"
              className={`w-full h-9 px-3 bg-white border rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all ${
                errors.discountPercentage
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900/10'
              } disabled:opacity-50`}
            />
            {errors.discountPercentage && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.discountPercentage}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Media */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3">
          Media
        </h2>

        <div>
          <label htmlFor="thumbnail" className="block text-xs font-medium text-slate-700 mb-1.5">
            Thumbnail Image URL
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input
              id="thumbnail"
              name="thumbnail"
              type="url"
              value={formData.thumbnail}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="https://example.com/product-image.jpg"
              className="flex-1 h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:border-slate-900 focus:ring-slate-900/10 transition-all disabled:opacity-50 w-full"
            />
            {formData.thumbnail && (
              <div className="w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 p-0.5 overflow-hidden flex items-center justify-center flex-shrink-0">
                <Image
                  src={formData.thumbnail}
                  alt="Preview"
                  width={34}
                  height={34}
                  className="object-contain w-full h-full"
                  unoptimized
                />
              </div>
            )}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Optional. If omitted, a clean placeholder will be assigned.
          </p>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end space-x-2.5 pt-1">
        <Link
          href="/products"
          className="h-9 px-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-xs"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-9 px-4 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white rounded-lg text-xs sm:text-sm font-medium shadow-xs transition-colors focus:outline-none focus:ring-1 focus:ring-slate-950 flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>{submitButtonText}</span>
          )}
        </button>
      </div>
    </form>
  );
}
