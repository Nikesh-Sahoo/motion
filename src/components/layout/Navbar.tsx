'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { mainNavLinks } from '@/data/navigation';
import { MobileMenu } from '@/components/layout/MobileMenu';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        id="nav"
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#0B0B0D]/90 backdrop-blur-md py-3 border-b border-[rgba(243,239,231,0.10)] shadow-lg shadow-black/40'
            : 'bg-transparent py-5 border-b border-transparent'
        }`}
      >
        <div className="w-[min(74rem,calc(100%-2rem))] mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo with Attached Motion Emblem */}
          <Link
            href="/#top"
            className="inline-flex items-center gap-3 flex-none rounded-xl transition-transform hover:-translate-y-0.5 group"
            aria-label="Motion — Home"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(25,195,184,0.5)] border border-[rgba(243,239,231,0.15)] group-hover:border-[#19C3B8] group-hover:shadow-[0_0_25px_rgba(25,195,184,0.7)] transition-all flex-shrink-0 bg-[#0B0B0D]">
              <Image
                src="/motion-logo.jpg"
                alt="Motion Logo"
                width={48}
                height={48}
                priority
                className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl sm:text-3xl tracking-wider text-[#F3EFE7] uppercase leading-none">
                MOTION
              </span>
              <span className="font-mono text-[9px] bg-gradient-to-r from-[#FF9933] via-white to-[#138808] bg-clip-text text-transparent tracking-widest uppercase font-semibold">
                POST-PRODUCTION 🇮🇳
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[0.92rem] text-[#97959F] font-medium" aria-label="Main Navigation">
            {mainNavLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[#F3EFE7] transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Button & Mobile Burger */}
          <div className="flex items-center gap-3">
            <a
              href="/#contact"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-[rgba(243,239,231,0.20)] text-[#F3EFE7] hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all text-xs sm:text-sm font-semibold tracking-wide hover:-translate-y-0.5"
            >
              Start a Project
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 rounded-lg text-[#F3EFE7] hover:text-[#FF6B35] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
