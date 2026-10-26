import React from 'react';

const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className={`${sizeClasses[size]} border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin`} />
      {message && <p className="text-sm text-zinc-600">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
