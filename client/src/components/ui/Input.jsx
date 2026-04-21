import React from 'react';

const Input = ({ 
  label, 
  error, 
  className = '', 
  containerClass = '',
  icon: Icon,
  ...props 
}) => {
  return (
    <div className={`w-full ${containerClass}`}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          className={`
            w-full transition-all duration-200 outline-none
            bg-slate-50 dark:bg-slate-800/50 
            text-slate-900 dark:text-slate-100
            border ${error ? 'border-rose-500' : 'border-slate-200 dark:border-slate-800'}
            focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10
            rounded-xl py-3 px-4
            ${Icon ? 'pl-11' : ''}
            disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-900
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 ml-1 text-xs font-medium text-rose-500 animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
