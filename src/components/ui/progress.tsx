import React from 'react';

interface ProgressProps {
  value: number; // 0 to 100
  className?: string;
  color?: 'emerald' | 'indigo' | 'amber' | 'blue';
}

export function Progress({ value, className = '', color = 'emerald' }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  const colors = {
    emerald: 'bg-emerald-500',
    indigo: 'bg-indigo-500',
    amber: 'bg-amber-500',
    blue: 'bg-blue-500',
  };

  return (
    <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden ${className}`}>
      <div
        className={`h-full transition-all duration-500 ease-out rounded-full ${colors[color]}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
