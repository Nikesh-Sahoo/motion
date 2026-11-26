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
      'bg-[#FF007F]/15 text-[#FF4DA6] border border-[#FF007F]/40',
    purple:
      'bg-[#9D4EDD]/15 text-[#D8B4FE] border border-[#9D4EDD]/40',
    teal:
      'bg-[#00F0FF]/12 text-[#00F0FF] border border-[#00F0FF]/35',
    cyan:
      'bg-[#00F0FF]/12 text-[#00F0FF] border border-[#00F0FF]/35',
    neutral:
      'bg-[#0D0E1A] text-[#8A94B8] border border-[#00F0FF]/15',
    outline:
      'bg-transparent text-[#8A94B8] border border-[#00F0FF]/25',
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
