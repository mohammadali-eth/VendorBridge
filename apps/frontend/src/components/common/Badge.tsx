import React from 'react';
import clsx from 'clsx';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({
  children,
  variant = 'neutral',
  className,
}: BadgeProps) {
  const styles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/60',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/60',
    info: 'bg-[#F5EEF4] text-[#714B67] border-[#A87D9F]/20',
    neutral: 'bg-slate-50 text-slate-700 border-slate-200/60',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
