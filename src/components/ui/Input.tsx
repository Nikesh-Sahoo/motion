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
            className="block font-mono text-[11px] uppercase tracking-wider text-[#8A94B8]"
          >
            {label} {required && <span className="text-[#FF007F]">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-xl border bg-[#060710] px-3.5 py-2 text-sm text-[#F4F6FF] placeholder:text-[#8A94B8]/55 transition-colors',
            'focus:outline-none focus:ring-1 focus:ring-[#00F0FF] focus:border-[#00F0FF]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/30'
              : 'border-[#00F0FF]/20 hover:border-[#00F0FF]/45',
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
