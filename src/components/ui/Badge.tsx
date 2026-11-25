import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'orange' | 'teal' | 'neutral' | 'outline' | 'purple' | 'cyan';
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  className,
  variant = 'orange',
  size = 'md',
  ...props
}: BadgeProps) {
  const variants = {
    orange:
      'bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/30',
    purple:
      'bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/30',
    teal:
      'bg-[#19C3B8]/10 text-[#19C3B8] border border-[#19C3B8]/30',
    cyan:
      'bg-[#19C3B8]/10 text-[#19C3B8] border border-[#19C3B8]/30',
    neutral:
      'bg-[#1B1B22] text-[#97959F] border border-[rgba(243,239,231,0.10)]',
    outline:
      'bg-transparent text-[#97959F] border border-[rgba(243,239,231,0.15)]',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-full font-mono tracking-wider',
    md: 'text-xs px-3 py-1 rounded-full font-mono tracking-wider',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 transition-colors uppercase font-medium',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
