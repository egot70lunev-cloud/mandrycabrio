import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'amber' | 'beige' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-150';
  
  const variants = {
    default: 'bg-[var(--surface-2)] text-[var(--accent)] border border-[var(--border)]',
    amber: 'bg-[var(--accent)] text-[var(--navy-950)]',
    beige: 'bg-[var(--surface-2)] text-[var(--accent-subtle)] border border-[var(--border)]',
    outline: 'border border-[var(--border-strong)] text-[var(--accent)] bg-transparent',
  };
  
  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};



