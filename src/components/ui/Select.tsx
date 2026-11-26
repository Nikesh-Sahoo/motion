import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface OptionItem {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  helperText?: string;
  options: readonly string[] | OptionItem[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      error,
      label,
      helperText,
      id,
      required,
      options,
      placeholder = 'Select an option...',
      value,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block font-mono text-[11px] uppercase tracking-wider text-[#8A94B8]"
          >
            {label} {required && <span className="text-[#FF007F]">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            value={value}
            className={cn(
              'flex h-11 w-full appearance-none rounded-xl border bg-[#060710] px-3.5 py-2 pr-10 text-sm text-[#F4F6FF] transition-colors',
              'focus:outline-none focus:ring-1 focus:ring-[#00F0FF] focus:border-[#00F0FF]',
              'disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
              !value && 'text-[#8A94B8]/60',
              error
                ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/30'
                : 'border-[#00F0FF]/20 hover:border-[#00F0FF]/45',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-[#0D0E1A] text-[#8A94B8]">
                {placeholder}
              </option>
            )}
            {options.map((option) => {
              const optValue = typeof option === 'string' ? option : option.value;
              const optLabel = typeof option === 'string' ? option : option.label;
              return (
                <option key={optValue} value={optValue} className="bg-[#0D0E1A] text-[#F4F6FF]">
                  {optLabel}
                </option>
              );
            })}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#97959F]" />
        </div>
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

Select.displayName = 'Select';
