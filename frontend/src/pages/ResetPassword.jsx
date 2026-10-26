import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { reset, clearError, clearMessage } from '../features/auth/authSlice';

const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { message, error, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearMessage());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    dispatch(reset({ token, data: { password } }));
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
            Set new password
          </h1>
          <p className="text-xs text-zinc-500 mt-1.5">
            Create a secure password for your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-700">
                  New Password
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full text-sm px-3.5 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 outline-none focus:bg-white focus:border-zinc-800 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full text-sm px-3.5 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-zinc-900 placeholder-zinc-400 outline-none focus:bg-white focus:border-zinc-800 transition"
              />
            </div>

            {validationError && (
              <div className="p-3 bg-rose-50 border border-rose-200/70 text-rose-700 text-xs rounded-xl">
                {validationError}
              </div>
            )}

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200/70 text-rose-700 text-xs rounded-xl">
                {error}
              </div>
            )}

            {message && !error && (
              <div className="p-3 bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-xs rounded-xl space-y-3">
                <p>{message}</p>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 cursor-pointer"
                >
                  Proceed to Login
                </button>
              </div>
            )}

            {!message && (
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                <span>{loading ? 'Updating...' : 'Update Password'}</span>
              </button>
            )}
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

export default ResetPassword;
