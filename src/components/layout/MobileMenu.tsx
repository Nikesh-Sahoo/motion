'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ArrowRight } from 'lucide-react';
import { mainNavLinks } from '@/data/navigation';
import { siteConfig } from '@/lib/config';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#0B0B0D] border-l border-[rgba(243,239,231,0.10)] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[rgba(243,239,231,0.10)]">
            <Link href="/#top" onClick={onClose} className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(25,195,184,0.45)] border border-[rgba(243,239,231,0.15)] flex-shrink-0 bg-[#0B0B0D]">
                <Image
                  src="/motion-logo.jpg"
                  alt="Motion"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover scale-110"
                />
              </div>
              <span className="font-display text-2xl text-[#F3EFE7] uppercase tracking-wider">
                MOTION
              </span>
            </Link>

            <button
              onClick={onClose}
              aria-label="Close navigation menu"
              className="p-2 rounded-lg text-[#97959F] hover:text-[#F3EFE7] hover:bg-[#15151B] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Nav items */}
          <nav className="mt-8 space-y-2">
            {mainNavLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between px-3 py-3 rounded-xl text-lg font-display uppercase tracking-wider text-[#F3EFE7] hover:text-[#FF6B35] hover:bg-[#15151B] transition-colors"
              >
                <span>{item.label}</span>
                <ArrowRight className="w-4 h-4 text-[#97959F]" />
              </a>
            ))}

            <a
              href="/#contact"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-3 rounded-xl text-lg font-display uppercase tracking-wider text-[#FF6B35] bg-[#15151B] transition-colors mt-4"
            >
              <span>Contact</span>
              <ArrowRight className="w-4 h-4 text-[#FF6B35]" />
            </a>
          </nav>
        </div>

        {/* Footer in mobile drawer */}
        <div className="pt-6 border-t border-[rgba(243,239,231,0.10)] space-y-3 text-center">
          <p className="text-xs text-[#97959F]">
            Motion • {siteConfig.contact.location}
          </p>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="text-xs text-[#19C3B8] font-mono hover:underline block"
          >
            {siteConfig.contact.email}
          </a>
        </div>
      </div>
    </div>
  );
}
