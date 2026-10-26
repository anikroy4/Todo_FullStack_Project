import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import LoadingSpinner from './LoadingSpinner';

export const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const { accessToken, user, loading } = useSelector((state) => state.auth);
  const [isValidToken, setIsValidToken] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if token is still valid
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        const isExpired = decoded.exp && decoded.exp * 1000 < Date.now();
        setIsValidToken(!isExpired);
      } catch (error) {
        console.error('Token validation error:', error);
        setIsValidToken(false);
      }
    }
    setIsChecking(false);
  }, [accessToken]);

  if (isChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  if (!accessToken || !user || !isValidToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { accessToken, user, loading } = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    setIsChecking(false);
  }, []);

  if (isChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  if (accessToken && user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

