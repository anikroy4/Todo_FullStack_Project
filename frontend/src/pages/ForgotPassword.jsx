import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { forgot, clearError, clearMessage } from '../features/auth/authSlice';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  const { message, error, loading, resetLink } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearMessage());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    dispatch(forgot({ email }));
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center px-4 py-12 antialiased">
      <div className="w-full max-w-sm">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-11 h-11 rounded-2xl bg-zinc-900 text-white font-bold text-lg flex items-center justify-center mx-auto mb-3 shadow-xs">
            ✓
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Reset Password
          </h1>
          <p className="text-xs text-zinc-500 mt-1.5">
            Enter your email to receive a password reset link
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-sm px-3.5 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 outline-none focus:bg-white focus:border-zinc-800 transition"
              />
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200/70 text-rose-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            {message && !error && (
              <div className="p-3 bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-xs rounded-xl space-y-2">
                <p>{message}</p>
                {resetLink && (
                  <div className="pt-1">
                    <Link
                      to={resetLink.replace(/^https?:\/\/[^/]+/, '')}
                      className="inline-block text-xs font-semibold underline text-emerald-800 hover:text-emerald-950"
                    >
                      Click here to reset your password now →
                    </Link>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{loading ? 'Sending link...' : 'Send Reset Link'}</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-zinc-100 text-center">
            <Link
              to="/login"
              className="text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:underline"
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
