import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, helperText, id, required, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-mono text-[11px] uppercase tracking-wider text-[#97959F]"
          >
            {label} {required && <span className="text-[#FF6B35]">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-xl border bg-[#0B0B0D] px-3.5 py-2 text-sm text-[#F3EFE7] placeholder:text-[#97959F]/50 transition-colors',
            'focus:outline-none focus:ring-1 focus:ring-[#FF6B35] focus:border-[#FF6B35]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/30'
              : 'border-[rgba(243,239,231,0.15)] hover:border-[rgba(243,239,231,0.3)]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-400 mt-1 font-medium">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-[11px] text-[#97959F] mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
