import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registration, clearError, clearMessage } from '../features/auth/authSlice';

const Registration = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { message, error, loading, verifyLink } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearMessage());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (form.password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    dispatch(
      registration({
        username: form.username,
        email: form.email,
        password: form.password,
      })
    );
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
            Create an account
          </h1>
          <p className="text-xs text-zinc-500 mt-1.5">
            Get started with simple, focused task management
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Jane Doe"
                className="w-full text-sm px-3.5 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 outline-none focus:bg-white focus:border-zinc-800 transition"
              />
            </div>

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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-zinc-400 hover:text-zinc-600 text-xs cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full text-sm px-3.5 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 outline-none focus:bg-white focus:border-zinc-800 transition"
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                placeholder="Re-enter password"
                className="w-full text-sm px-3.5 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 outline-none focus:bg-white focus:border-zinc-800 transition"
              />
            </div>

            {/* Client Validation Error */}
            {validationError && (
              <div className="p-3 bg-rose-50 border border-rose-200/70 text-rose-700 text-xs rounded-xl">
                {validationError}
              </div>
            )}

            {/* Server Error Message */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200/70 text-rose-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            {/* Server Success Message */}
            {message && !error && (
              <div className="p-3 bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-xs rounded-xl space-y-2">
                <p>{message}</p>
                {verifyLink && (
                  <div className="pt-1">
                    <a
                      href={verifyLink}
                      className="inline-block text-xs font-semibold underline text-emerald-800 hover:text-emerald-950"
                    >
                      Click here to verify immediately →
                    </a>
                  </div>
                )}
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
              <span>{loading ? 'Creating account...' : 'Create Account'}</span>
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 pt-5 border-t border-zinc-100 text-center">
            <p className="text-xs text-zinc-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-zinc-900 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
