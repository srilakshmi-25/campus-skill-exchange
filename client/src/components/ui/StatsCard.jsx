import React from 'react';

const StatsCard = ({ title, value, icon: Icon, trend, color = 'indigo' }) => {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
    slate: 'bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400'
  };

  const iconColors = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-600',
    amber: 'bg-amber-600',
    rose: 'bg-rose-600',
    slate: 'bg-slate-600'
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4 transition-all hover:translate-y-[-2px] hover:shadow-md">
      <div className={`p-3 rounded-xl text-white ${iconColors[color]} shadow-lg shadow-${color}-500/20`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100">{value}</h4>
          {trend && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-lg ${colors[color]}`}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
