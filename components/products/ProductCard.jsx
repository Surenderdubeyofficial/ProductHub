'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Edit2, Trash2, Star } from 'lucide-react';
import Badge from '@/components/common/Badge';
import { formatCurrency, formatRating, getStockStatus } from '@/utils/formatters';

export default function ProductCard({ product, onDeleteClick }) {
  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
      <div>
        {/* Top: Image + Info */}
        <div className="flex items-start space-x-3.5">
          <div className="relative w-20 h-20 rounded-xl bg-slate-100 border border-slate-200/70 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.title}
                width={80}
                height={80}
                className="object-contain w-full h-full"
                unoptimized
              />
            ) : (
              <span className="text-xs text-slate-400 font-bold">N/A</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-1">
              <Badge variant="indigo" size="sm">
                {product.category}
              </Badge>
              <div className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>{formatRating(product.rating)}</span>
              </div>
            </div>

            <Link
              href={`/products/${product.id}`}
              className="font-bold text-sm text-slate-900 hover:text-indigo-600 line-clamp-1 transition-colors"
            >
              {product.title}
            </Link>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {product.brand || 'Nexus Brand'}
            </p>
          </div>
        </div>

        {/* Middle: Price & Stock Status */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-slate-900">
              {formatCurrency(product.price)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="ml-1.5 text-xs text-emerald-600 font-semibold">
                -{Math.round(product.discountPercentage)}%
              </span>
            )}
          </div>
          <Badge variant={stockStatus.variant} size="sm">
            {stockStatus.label}
          </Badge>
        </div>
      </div>

      {/* Bottom: Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          href={`/products/${product.id}`}
          className="flex-1 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-slate-200"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View</span>
        </Link>
        <Link
          href={`/products/${product.id}/edit`}
          className="flex-1 py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-amber-200"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </Link>
        <button
          type="button"
          onClick={() => onDeleteClick(product)}
          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold flex items-center justify-center transition-colors border border-rose-200"
          aria-label="Delete product"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
