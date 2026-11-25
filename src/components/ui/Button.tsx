import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'teal' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      children,
      disabled,
      href,
      target,
      rel,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0D] disabled:opacity-50 disabled:pointer-events-none select-none rounded-full active:scale-[0.98]';

    const variants = {
      primary:
        'bg-[#FF6B35] text-[#0B0B0D] hover:shadow-glow-orange hover:-translate-y-0.5',
      secondary:
        'bg-[#15151B] text-[#F3EFE7] border border-[rgba(243,239,231,0.15)] hover:border-[#FF6B35] hover:text-[#FF6B35]',
      outline:
        'border border-[rgba(243,239,231,0.20)] bg-transparent text-[#F3EFE7] hover:border-[#FF6B35] hover:text-[#FF6B35]',
      ghost:
        'bg-transparent text-[#97959F] hover:text-[#F3EFE7]',
      teal:
        'bg-[#19C3B8] text-[#0B0B0D] hover:shadow-glow-teal hover:-translate-y-0.5',
      cyan:
        'bg-[#19C3B8] text-[#0B0B0D] hover:shadow-glow-teal hover:-translate-y-0.5',
    };

    const sizes = {
      sm: 'text-xs px-4 py-2 gap-1.5',
      md: 'text-sm px-6 py-3 gap-2',
      lg: 'text-base px-8 py-3.5 gap-2.5',
    };

    const classes = cn(baseStyles, variants[variant], sizes[size], className);

    if (href) {
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
        return (
          <a
            href={href}
            className={classes}
            target={target || (href.startsWith('http') ? '_blank' : undefined)}
            rel={rel || (href.startsWith('http') ? 'noopener noreferrer' : undefined)}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={classes} target={target} rel={rel}>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={classes}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
