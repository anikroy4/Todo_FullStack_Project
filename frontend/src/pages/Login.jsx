import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError, clearMessage } from '../features/auth/authSlice';

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { message, error, loading, accessToken, user } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearMessage());
  }, [dispatch]);

  useEffect(() => {
    if (accessToken || user) {
      navigate('/', { replace: true });
    }
  }, [accessToken, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return;
    dispatch(login(form));
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
            Sign in to your account
          </h1>
          <p className="text-xs text-zinc-500 mt-1.5">
            Minimal, fast, and organized task management
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full text-sm px-3.5 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 outline-none focus:bg-white focus:border-zinc-800 transition"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-zinc-500 hover:text-zinc-900 transition"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full text-sm px-3.5 py-2.5 pr-10 bg-zinc-50/50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 outline-none focus:bg-white focus:border-zinc-800 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 text-xs cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200/70 text-rose-700 text-xs rounded-xl leading-relaxed">
                {error}
              </div>
            )}

            {/* Success Message */}
            {message && !error && (
              <div className="p-3 bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-xs rounded-xl leading-relaxed">
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 pt-5 border-t border-zinc-100 text-center">
            <p className="text-xs text-zinc-500">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-zinc-900 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
