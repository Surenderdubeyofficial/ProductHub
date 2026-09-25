'use client';

import React, { useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function DeleteModal({
  isOpen,
  product,
  onClose,
  onConfirm,
  isDeleting = false,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div
        className="w-full max-w-sm bg-white rounded-xl border border-slate-200 shadow-xl p-5 overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 id="delete-modal-title" className="text-sm font-semibold text-slate-900">
              Delete product?
            </h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              This action will remove <span className="font-medium text-slate-700">&ldquo;{product.title}&rdquo;</span> from your inventory view.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-5 flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="h-8 px-3 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-8 px-3 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Product</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
