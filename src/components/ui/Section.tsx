import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'primary' | 'secondary' | 'anthracite' | 'surface';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  id?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  background = 'primary',
  padding = 'lg',
  id,
}) => {
  const backgrounds = {
    primary: 'bg-[var(--navy-deep)]',
    secondary: 'bg-[var(--surface)]',
    anthracite: 'bg-[var(--navy-deep)]',
    surface: 'bg-[var(--surface-2)]',
  };
  
  const paddings = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24',
  };
  
  const textColors = {
    primary: 'text-[var(--text)]',
    secondary: 'text-[var(--text)]',
    anthracite: 'text-[var(--text)]',
    surface: 'text-[var(--text)]',
  };
  
  return (
    <section
      id={id}
      className={`${backgrounds[background]} ${paddings[padding]} ${textColors[background]} ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};

