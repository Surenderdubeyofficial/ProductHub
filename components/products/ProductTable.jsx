'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Edit2, Trash2, Star } from 'lucide-react';
import Badge from '@/components/common/Badge';
import { formatCurrency, formatRating, getStockStatus } from '@/utils/formatters';

export default function ProductTable({
  products = [],
  onDeleteClick,
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              <th scope="col" className="py-2.5 pl-4 pr-3">Product</th>
              <th scope="col" className="py-2.5 px-3">Category</th>
              <th scope="col" className="py-2.5 px-3 text-right">Price</th>
              <th scope="col" className="py-2.5 px-3 text-center">Rating</th>
              <th scope="col" className="py-2.5 px-3 text-center">Stock</th>
              <th scope="col" className="py-2.5 pl-3 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {products.map((product) => {
              const stockStatus = getStockStatus(product.stock);

              return (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  {/* Product Details (Thumbnail + Title + Brand) */}
                  <td className="py-3 pl-4 pr-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200/70 overflow-hidden flex-shrink-0 flex items-center justify-center p-0.5">
                        {product.thumbnail ? (
                          <Image
                            src={product.thumbnail}
                            alt={product.title}
                            width={38}
                            height={38}
                            className="object-contain w-full h-full"
                            unoptimized
                          />
                        ) : (
                          <span className="text-[9px] text-slate-400 font-medium">N/A</span>
                        )}
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <Link
                          href={`/products/${product.id}`}
                          className="font-medium text-slate-900 hover:text-slate-700 transition-colors truncate block"
                          title={product.title}
                        >
                          {product.title}
                        </Link>
                        <p className="text-[11px] text-slate-400 truncate">
                          {product.brand || 'General'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <Badge variant="default" size="sm">
                      {product.category}
                    </Badge>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-3 whitespace-nowrap text-right font-medium text-slate-900 tabular-nums">
                    <div>{formatCurrency(product.price)}</div>
                    {product.discountPercentage > 0 && (
                      <div className="text-[10px] text-emerald-700 font-medium">
                        -{Math.round(product.discountPercentage)}%
                      </div>
                    )}
                  </td>

                  {/* Rating */}
                  <td className="py-3 px-3 whitespace-nowrap text-center">
                    <div className="inline-flex items-center space-x-1 text-xs text-slate-700">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="tabular-nums font-medium">{formatRating(product.rating)}</span>
                    </div>
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-3 whitespace-nowrap text-center">
                    <Badge variant={stockStatus.variant} size="sm">
                      {stockStatus.label}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="py-3 pl-3 pr-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center space-x-1">
                      <Link
                        href={`/products/${product.id}`}
                        title="View product details"
                        className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="sr-only">View</span>
                      </Link>
                      <Link
                        href={`/products/${product.id}/edit`}
                        title="Edit product"
                        className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span className="sr-only">Edit</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDeleteClick(product)}
                        title="Delete product"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="sr-only">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
