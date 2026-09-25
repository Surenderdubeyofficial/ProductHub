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
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs flex flex-col justify-between">
      <div>
        {/* Top: Thumbnail & Title Info */}
        <div className="flex items-start space-x-3">
          <div className="w-14 h-14 rounded-lg bg-slate-50 border border-slate-200/70 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.title}
                width={56}
                height={56}
                className="object-contain w-full h-full"
                unoptimized
              />
            ) : (
              <span className="text-[10px] text-slate-400 font-medium">N/A</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-1">
              <Badge variant="default" size="sm">
                {product.category}
              </Badge>
              <div className="inline-flex items-center space-x-0.5 text-xs text-slate-700">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="tabular-nums font-medium">{formatRating(product.rating)}</span>
              </div>
            </div>

            <Link
              href={`/products/${product.id}`}
              className="font-medium text-xs sm:text-sm text-slate-900 hover:text-slate-700 line-clamp-1 transition-colors"
            >
              {product.title}
            </Link>
            <p className="text-[11px] text-slate-400 truncate">
              {product.brand || 'General'}
            </p>
          </div>
        </div>

        {/* Middle: Price & Stock */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-slate-900 tabular-nums">
              {formatCurrency(product.price)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="ml-1 text-[11px] text-emerald-700 font-medium">
                -{Math.round(product.discountPercentage)}%
              </span>
            )}
          </div>
          <Badge variant={stockStatus.variant} size="sm">
            {stockStatus.label}
          </Badge>
        </div>
      </div>

      {/* Bottom: Compact Touch Actions */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1.5">
        <Link
          href={`/products/${product.id}`}
          className="flex-1 h-8 px-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 transition-colors shadow-xs"
        >
          <Eye className="w-3 h-3 text-slate-400" />
          <span>View</span>
        </Link>
        <Link
          href={`/products/${product.id}/edit`}
          className="flex-1 h-8 px-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 transition-colors shadow-xs"
        >
          <Edit2 className="w-3 h-3 text-slate-400" />
          <span>Edit</span>
        </Link>
        <button
          type="button"
          onClick={() => onDeleteClick(product)}
          className="h-8 px-2.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 rounded-lg text-xs font-medium flex items-center justify-center transition-colors shadow-xs"
          aria-label="Delete product"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
