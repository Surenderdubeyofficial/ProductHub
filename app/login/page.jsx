'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { validateLoginForm } from '@/utils/validation';
import { Eye, EyeOff, Lock, User, AlertCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';

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
    // Clear field-level error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const handleFillDemo = (username, password) => {
    setFormData({ username, password });
    setErrors({});
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Guard against duplicate concurrent submissions
    if (isSubmitting) return;

    setApiError('');

    // Client-side validation
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-4 shadow-inner">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            NexusAdmin
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to manage your product catalog & analytics
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* API Error Alert */}
          {apiError && (
            <div
              className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-3 text-rose-300 text-sm animate-fadeIn"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
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
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.username
                      ? 'border-rose-500 focus:ring-rose-500/30'
                      : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                />
              </div>
              {errors.username && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
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
                  className={`w-full pl-10 pr-11 py-2.5 bg-slate-900/60 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? 'border-rose-500 focus:ring-rose-500/30'
                      : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Box */}
          <div className="mt-6 pt-5 border-t border-slate-700/60">
            <p className="text-xs font-medium text-slate-400 mb-2">
              DummyJSON Demo Credentials:
            </p>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/70 border border-slate-700/40 text-xs text-slate-300">
              <div>
                <span className="text-slate-400">User: </span>
                <span className="font-mono text-indigo-300 font-semibold">emilys</span>
                <span className="mx-2 text-slate-600">|</span>
                <span className="text-slate-400">Pass: </span>
                <span className="font-mono text-indigo-300 font-semibold">emilyspass</span>
              </div>
              <button
                type="button"
                onClick={() => handleFillDemo('emilys', 'emilyspass')}
                className="px-2 py-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded transition-colors"
              >
                Auto-fill
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-xs text-slate-500">
          React Developer Hiring Assignment • Next.js & Pure JavaScript
        </p>
      </div>
    </div>
  );
}
