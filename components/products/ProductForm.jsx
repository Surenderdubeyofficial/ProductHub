'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, ArrowLeft, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { validateProductForm } from '@/utils/validation';
import productService from '@/services/productService';

export default function ProductForm({
  initialData = null,
  onSubmit,
  isSubmitting = false,
  apiError = '',
  title = 'Product Information',
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

  // Populate data when editing existing product
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

  // Load category list for dropdown
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

    // Clear field-level error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prevent duplicate submission
    if (isSubmitting) return;

    // Validate fields
    const { errors: validationErrors, isValid } = validateProductForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    // Pass validated data to caller
    onSubmit({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      discountPercentage: formData.discountPercentage ? Number(formData.discountPercentage) : 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Global API Error Alert */}
      {apiError && (
        <div
          className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start space-x-3"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <span>{apiError}</span>
        </div>
      )}

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
          {title}
        </h2>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
          >
            Product Title <span className="text-rose-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="e.g. Wireless Noise-Cancelling Headphones"
            className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
              errors.title
                ? 'border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
            } disabled:opacity-50`}
          />
          {errors.title && (
            <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.title}
            </p>
          )}
        </div>

        {/* Category & Brand Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
            >
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.category
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
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
              <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Brand */}
          <div>
            <label
              htmlFor="brand"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
            >
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
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Price, Stock, and Discount Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
            >
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
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.price
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
              } disabled:opacity-50`}
            />
            {errors.price && (
              <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.price}
              </p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label
              htmlFor="stock"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
            >
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
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.stock
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
              } disabled:opacity-50`}
            />
            {errors.stock && (
              <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.stock}
              </p>
            )}
          </div>

          {/* Discount Percentage */}
          <div>
            <label
              htmlFor="discountPercentage"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
            >
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
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.discountPercentage
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
              } disabled:opacity-50`}
            />
            {errors.discountPercentage && (
              <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.discountPercentage}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
          >
            Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Write a clear, detailed overview of the product specifications and features..."
            className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
              errors.description
                ? 'border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
            } disabled:opacity-50`}
          />
          {errors.description && (
            <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.description}
            </p>
          )}
        </div>

        {/* Thumbnail Image URL with Live Preview */}
        <div>
          <label
            htmlFor="thumbnail"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2"
          >
            Image URL / Thumbnail
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <input
              id="thumbnail"
              name="thumbnail"
              type="url"
              value={formData.thumbnail}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="https://example.com/product-image.jpg"
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-50 w-full"
            />
            {formData.thumbnail && (
              <div className="w-12 h-12 rounded-xl border border-slate-200 bg-white p-1 overflow-hidden flex items-center justify-center flex-shrink-0">
                <Image
                  src={formData.thumbnail}
                  alt="Preview"
                  width={48}
                  height={48}
                  className="object-contain w-full h-full"
                  unoptimized
                />
              </div>
            )}
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">
            Leave empty to use the default high-resolution product placeholder.
          </p>
        </div>
      </div>

      {/* Form Action Controls */}
      <div className="flex items-center justify-end space-x-3 pt-2">
        <Link
          href="/products"
          className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
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
