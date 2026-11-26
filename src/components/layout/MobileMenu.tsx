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
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#05050A] border-l border-[#00F0FF]/25 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#00F0FF]/15">
            <Link href="/#top" onClick={onClose} className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.45)] border border-[#00F0FF]/40 flex-shrink-0 bg-[#05050A]">
                <Image
                  src="/motion-logo.jpg"
                  alt="Motion"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover scale-110"
                />
              </div>
              <span className="font-display text-2xl text-[#F4F6FF] uppercase tracking-wider">
                MOTIONXYNE
              </span>
            </Link>

            <button
              onClick={onClose}
              aria-label="Close navigation menu"
              className="p-2 rounded-lg text-[#8A94B8] hover:text-[#00F0FF] hover:bg-[#0D0E1A] transition-colors"
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
                className="flex items-center justify-between px-3 py-3 rounded-xl text-lg font-display uppercase tracking-wider text-[#F4F6FF] hover:text-[#00F0FF] hover:bg-[#0D0E1A] transition-colors"
              >
                <span>{item.label}</span>
                <ArrowRight className="w-4 h-4 text-[#8A94B8]" />
              </a>
            ))}

            <a
              href="/#contact"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-3 rounded-xl text-lg font-display uppercase tracking-wider text-[#FF007F] bg-[#0D0E1A] border border-[#FF007F]/30 transition-colors mt-4"
            >
              <span>Contact</span>
              <ArrowRight className="w-4 h-4 text-[#FF007F]" />
            </a>
          </nav>
        </div>

        {/* Footer in mobile drawer */}
        <div className="pt-6 border-t border-[#00F0FF]/15 space-y-3 text-center">
          <p className="text-xs text-[#8A94B8]">
            Motionxyne • {siteConfig.contact.location}
          </p>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="text-xs text-[#00F0FF] font-mono hover:underline block"
          >
            {siteConfig.contact.email}
          </a>
        </div>
      </div>
    </div>
  );
}
