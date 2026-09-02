import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'success' | 'warning' | 'neutral' | 'outline' | 'electric';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className,
  ...props
}) => {
  const variantStyles = {
    brand: 'bg-brand-50 text-brand-700 border-brand-200/60',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/60',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    outline: 'bg-transparent text-slate-700 border-slate-300',
    electric: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
