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
        className="fixed top-3 sm:top-4 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none transition-all duration-300"
      >
        <div
          className={`w-[min(76rem,100%)] mx-auto rounded-2xl pointer-events-auto transition-all duration-300 flex items-center justify-between gap-4 py-2.5 px-3.5 sm:px-6 ${
            scrolled
              ? 'bg-[#0B0B0D]/90 backdrop-blur-2xl border border-white/[0.12] shadow-[0_12px_40px_rgba(0,0,0,0.7)]'
              : 'bg-[#111116]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
          }`}
        >
          {/* Brand Logo with Attached Motionxyne Emblem */}
          <Link
            href="/#top"
            className="inline-flex items-center gap-3 flex-none rounded-xl transition-transform hover:-translate-y-0.5 group"
            aria-label="Motionxyne — Home"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(25,195,184,0.55)] border border-[#19C3B8]/40 group-hover:border-[#19C3B8] group-hover:shadow-[0_0_25px_rgba(25,195,184,0.8)] transition-all flex-shrink-0 bg-[#0B0B0D]">
              <Image
                src="/motion-logo.jpg"
                alt="Motionxyne Logo"
                width={48}
                height={48}
                priority
                className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-2xl tracking-wider text-[#F3EFE7] uppercase leading-none group-hover:text-white transition-colors">
                MOTIONXYNE
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] bg-gradient-to-r from-[#FF9933] via-white to-[#138808] bg-clip-text text-transparent tracking-widest uppercase font-semibold">
                POST-PRODUCTION 🇮🇳
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-2 text-[0.88rem] text-[#97959F] font-medium" aria-label="Main Navigation">
            {mainNavLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[#F3EFE7] hover:bg-white/[0.05] px-3 py-1.5 rounded-lg transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Button & Mobile Burger */}
          <div className="flex items-center gap-2.5">
            <a
              href="/#contact"
              className="inline-flex items-center justify-center px-4 sm:px-5 py-2 rounded-full bg-[#FF9933] text-[#0B0B0D] hover:shadow-[0_0_20px_rgba(255,153,51,0.6)] font-semibold text-xs sm:text-sm tracking-wide transition-all hover:scale-105 active:scale-95"
            >
              Start a Project
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 rounded-xl text-[#F3EFE7] hover:text-[#FF9933] hover:bg-white/[0.06] transition-colors focus:outline-none"
            >
              <Menu className="w-5 h-5" />
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
