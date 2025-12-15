import React from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      <div className="flex items-start">
        <input
          type="checkbox"
          id={checkboxId}
          className={`
            mt-1 mr-3 w-4 h-4 rounded border transition-all
            bg-[var(--surface-2)] border-[var(--border)] 
            text-[var(--accent)] 
            focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-[var(--accent)]
            checked:bg-[var(--accent)] checked:border-[var(--accent)]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-[var(--accent)]' : ''}
            ${className}
          `}
          {...props}
        />
        {label && (
          <label
            htmlFor={checkboxId}
            className={`
              text-sm font-medium cursor-pointer flex-1
              text-[var(--text)]
              ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {label}
          </label>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-[var(--accent)]">{error}</p>
      )}
    </div>
  );
};

