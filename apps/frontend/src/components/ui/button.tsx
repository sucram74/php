import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'border-slate-900 bg-slate-900 text-white hover:bg-slate-700',
  secondary: 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100',
  danger: 'border-red-700 bg-red-700 text-white hover:bg-red-600',
};

export function Button({ className, type = 'button', variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex min-h-10 cursor-pointer items-center justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
