import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  children: ReactNode;
};

const variants = {
  primary: 'bg-ink text-cream shadow-soft hover:bg-moss',
  secondary: 'bg-cream/80 text-ink ring-1 ring-ink/10 hover:bg-white',
  ghost: 'bg-transparent text-ink hover:bg-ink/5',
  danger: 'bg-terracotta text-white hover:bg-[#a85135]'
};

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
