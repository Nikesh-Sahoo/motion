import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/lib/config';

export function Footer() {
  return (
    <footer className="border-t border-[rgba(243,239,231,0.10)] py-10 bg-[#0B0B0D]">
      <div className="w-[min(74rem,calc(100%-2rem))] mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-[rgba(243,239,231,0.10)]">
          {/* Logo with attached emblem */}
          <Link href="/#top" className="inline-flex items-center gap-3 group" aria-label="Motion — Home">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(25,195,184,0.45)] border border-[rgba(243,239,231,0.15)] group-hover:border-[#19C3B8] group-hover:shadow-[0_0_20px_rgba(25,195,184,0.6)] transition-all flex-shrink-0 bg-[#0B0B0D]">
              <Image
                src="/motion-logo.jpg"
                alt="Motion"
                width={40}
                height={40}
                className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl tracking-wider text-[#F3EFE7] uppercase leading-none">
                MOTION
              </span>
              <span className="font-mono text-[9px] text-[#19C3B8] tracking-widest uppercase">
                POST-PRODUCTION
              </span>
            </div>
          </Link>

          {/* Middle statement */}
          <p className="font-mono text-xs text-[#97959F] text-center sm:text-left">
            © 2025 Motion • {siteConfig.contact.location} — All rights reserved.
          </p>

          {/* Socials & Links */}
          <div className="flex items-center gap-5 text-xs font-mono">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-[#F3EFE7] hover:text-[#FF6B35] transition-colors"
            >
              Email
            </a>
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`}
              className="text-[#F3EFE7] hover:text-[#FF6B35] transition-colors"
            >
              Phone
            </a>
            {siteConfig.social.linkedin && (
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F3EFE7] hover:text-[#FF6B35] transition-colors"
              >
                LinkedIn
              </a>
            )}
            {siteConfig.social.instagram && (
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F3EFE7] hover:text-[#FF6B35] transition-colors"
              >
                Instagram
              </a>
            )}
            {siteConfig.social.upwork && (
              <a
                href={siteConfig.social.upwork}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F3EFE7] hover:text-[#FF6B35] transition-colors"
              >
                Upwork
              </a>
            )}
          </div>
        </div>

        {/* Secondary link row */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#97959F]">
          <div className="flex flex-wrap gap-4 sm:gap-6 font-mono text-[11px]">
            <a href="/#work" className="hover:text-[#F3EFE7]">Work</a>
            <a href="/#long-videos" className="hover:text-[#F3EFE7]">Long Videos</a>
            <a href="/#shorts" className="hover:text-[#F3EFE7]">Shorts & Reels</a>
            <a href="/#services" className="hover:text-[#F3EFE7]">Services</a>
            <a href="/#process" className="hover:text-[#F3EFE7]">Process</a>
            <a href="/#about" className="hover:text-[#F3EFE7]">About</a>
            <a href="/#testimonials" className="hover:text-[#F3EFE7]">Reviews</a>
            <a href="/#contact" className="hover:text-[#FF6B35]">Contact</a>
          </div>

          <div className="flex gap-4 font-mono text-[11px]">
            <Link href="/privacy-policy" className="hover:text-[#F3EFE7]">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#F3EFE7]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
