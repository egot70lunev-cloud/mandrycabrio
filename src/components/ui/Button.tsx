import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[var(--accent)] text-[var(--navy-950)] hover:bg-[var(--accent-hover)] focus:ring-2 focus:ring-[var(--focus-ring)] active:scale-[0.98] font-semibold',
    secondary: 'border-2 border-[var(--accent)] text-[var(--accent)] bg-[var(--surface)]/50 hover:bg-[var(--surface-hover)] hover:border-[var(--accent-hover)] focus:ring-2 focus:ring-[var(--focus-ring)]',
    outline: 'border-2 border-[var(--border-strong)] text-[var(--text)] bg-transparent hover:bg-[var(--surface-hover)] focus:ring-2 focus:ring-[var(--focus-ring)]',
    ghost: 'text-[var(--text)] hover:bg-[var(--surface-hover)] focus:ring-2 focus:ring-[var(--focus-ring)]',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};



