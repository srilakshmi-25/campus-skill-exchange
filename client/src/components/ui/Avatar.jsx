import React from 'react';

const Avatar = ({ src, name = '', size = 'md', className = '', status = null }) => {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl'
  };

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const getStatusColor = (s) => {
    switch(s) {
      case 'active': return 'bg-emerald-500';
      case 'busy': return 'bg-amber-500';
      case 'offline': return 'bg-slate-400';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`${sizes[size]} rounded-full overflow-hidden flex items-center justify-center bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 border-2 border-slate-100 dark:border-slate-800`}>
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
        ) : (
          <span className="font-bold">{initials || '?'}</span>
        )}
      </div>
      {status && (
        <span className={`absolute bottom-0 right-0 w-[25%] h-[25%] border-2 border-white dark:border-slate-900 rounded-full ${getStatusColor(status)}`} />
      )}
    </div>
  );
};

export default Avatar;
