import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { verify } from '../features/auth/authSlice';

const VerifyEmail = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const { message, error, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(verify(token));
    }
  }, [token, dispatch]);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center px-4 py-12 antialiased">
      <div className="w-full max-w-sm">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-11 h-11 rounded-2xl bg-zinc-900 text-white font-bold text-lg flex items-center justify-center mx-auto mb-3 shadow-xs">
            ✓
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Email Verification
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-8 shadow-xs text-center">
          {loading ? (
            <div className="py-6 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
              <p className="text-sm font-medium text-zinc-600">
                Verifying your email, please wait...
              </p>
            </div>
          ) : error ? (
            <div className="py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto text-xl font-bold">
                ✕
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">
                  Verification Failed
                </h3>
                <p className="text-xs text-rose-600 mt-1">{error}</p>
              </div>
              <Link
                to="/login"
                className="inline-block mt-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-medium hover:bg-zinc-800 transition"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto text-xl font-bold">
                ✓
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">
                  Email Verified!
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  {message || 'Your email has been verified successfully.'}
                </p>
              </div>
              <Link
                to="/login"
                className="inline-block mt-2 px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-semibold hover:bg-zinc-800 transition"
              >
                Sign In Now →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
