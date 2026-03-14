import * as React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
};

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const base =
    'inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition';
  const variants: Record<string, string> = {
    primary: 'bg-slate-900 text-white hover:bg-slate-700',
    ghost: 'bg-transparent text-slate-900 hover:bg-slate-100',
  };

  return <button className={`${base} ${variants[variant]} ${className ?? ''}`} {...props} />;
}
