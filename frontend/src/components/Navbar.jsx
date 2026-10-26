import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <header className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
            ✓
          </div>
          <div>
            <span className="font-semibold text-zinc-900 text-base tracking-tight">
              MinimalTasks
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs text-zinc-400 font-mono">
              v1.0
            </span>
          </div>
        </div>

        {/* User profile & actions */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2.5 pl-2">
              <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 font-medium text-xs flex items-center justify-center">
                {initial}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-medium text-zinc-800 leading-none">
                  {user.username}
                </p>
                <p className="text-[11px] text-zinc-400 truncate max-w-35 leading-tight mt-0.5">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="text-xs font-medium text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
