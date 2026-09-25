'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { validateLoginForm } from '@/utils/validation';
import { Eye, EyeOff, Lock, User, AlertCircle, Loader2, Package } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to /products immediately
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/products');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const handleFillDemo = () => {
    setFormData({ username: 'emilys', password: 'emilyspass' });
    setErrors({});
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setApiError('');

    const { errors: validationErrors, isValid } = validateLoginForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await login(formData.username, formData.password);
      router.push('/products');
    } catch (err) {
      setApiError(err.friendlyMessage || err.message || 'Invalid username or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex items-center justify-center space-x-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
            <Package className="w-4 h-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            ProductHub
          </span>
        </div>

        <h1 className="text-center text-xl font-semibold tracking-tight text-slate-900">
          Welcome back
        </h1>
        <p className="mt-1 text-center text-xs text-slate-500">
          Sign in to manage your product catalog and inventory.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-[400px]">
        <div className="bg-white px-6 py-7 shadow-xs border border-slate-200/80 rounded-xl sm:px-8">
          {/* API Error Alert */}
          {apiError && (
            <div
              className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200/80 flex items-start space-x-2.5 text-xs text-rose-700"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="e.g. emilys"
                  className={`w-full pl-9 pr-3 h-9 bg-white border rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all ${
                    errors.username
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900/10'
                  } disabled:opacity-50`}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Enter your password"
                  className={`w-full pl-9 pr-10 h-9 bg-white border rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 transition-all ${
                    errors.password
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900/10'
                  } disabled:opacity-50`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-9 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs sm:text-sm font-medium rounded-lg shadow-xs flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-slate-950"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign in</span>
                )}
              </button>
            </div>
          </form>

          {/* Discreet Secondary Demo Utility Action */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Demo: <span className="font-mono text-slate-700">emilys</span> / <span className="font-mono text-slate-700">emilyspass</span></span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-slate-600 hover:text-slate-900 font-medium underline underline-offset-2 hover:no-underline transition-colors"
            >
              Fill demo credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
