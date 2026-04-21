import React from 'react';

const Loader = ({ variant = 'spinner', className = '', size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  if (variant === 'skeleton') {
    return (
      <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg ${className}`} />
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} border-4 border-slate-200 dark:border-slate-800 border-t-indigo-500 rounded-full animate-spin`} />
    </div>
  );
};

export default Loader;
