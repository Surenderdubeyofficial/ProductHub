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
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th scope="col" className="py-3.5 pl-6 pr-3">Product</th>
              <th scope="col" className="py-3.5 px-3">Category</th>
              <th scope="col" className="py-3.5 px-3">Price</th>
              <th scope="col" className="py-3.5 px-3">Rating</th>
              <th scope="col" className="py-3.5 px-3">Stock</th>
              <th scope="col" className="py-3.5 pl-3 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {products.map((product) => {
              const stockStatus = getStockStatus(product.stock);

              return (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  {/* Product Details (Image + Title + Brand) */}
                  <td className="py-4 pl-6 pr-3">
                    <div className="flex items-center space-x-3.5">
                      <div className="relative w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/70 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                        {product.thumbnail ? (
                          <Image
                            src={product.thumbnail}
                            alt={product.title}
                            width={48}
                            height={48}
                            className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-200"
                            unoptimized
                          />
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold">N/A</span>
                        )}
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <Link
                          href={`/products/${product.id}`}
                          className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors truncate block"
                          title={product.title}
                        >
                          {product.title}
                        </Link>
                        <p className="text-xs text-slate-500 truncate">
                          {product.brand || 'Nexus Brand'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-3 whitespace-nowrap">
                    <Badge variant="indigo" size="sm">
                      {product.category}
                    </Badge>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-3 whitespace-nowrap font-medium text-slate-900">
                    <div>{formatCurrency(product.price)}</div>
                    {product.discountPercentage > 0 && (
                      <div className="text-[11px] text-emerald-600 font-semibold">
                        -{Math.round(product.discountPercentage)}%
                      </div>
                    )}
                  </td>

                  {/* Rating */}
                  <td className="py-4 px-3 whitespace-nowrap">
                    <div className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-md">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{formatRating(product.rating)}</span>
                    </div>
                  </td>

                  {/* Stock */}
                  <td className="py-4 px-3 whitespace-nowrap">
                    <Badge variant={stockStatus.variant} size="sm">
                      {stockStatus.label}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="py-4 pl-3 pr-6 text-right whitespace-nowrap">
                    <div className="inline-flex items-center space-x-1.5">
                      <Link
                        href={`/products/${product.id}`}
                        title="View details"
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="sr-only">View</span>
                      </Link>
                      <Link
                        href={`/products/${product.id}/edit`}
                        title="Edit product"
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDeleteClick(product)}
                        title="Delete product"
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
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
