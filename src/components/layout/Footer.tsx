import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/lib/config';

export function Footer() {
  return (
    <footer className="border-t border-[#00F0FF]/20 py-10 bg-[#05050A]">
      <div className="w-[min(74rem,calc(100%-2rem))] mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-[#00F0FF]/15">
          {/* Logo with attached emblem */}
          <Link href="/#top" className="inline-flex items-center gap-3 group" aria-label="Motionxyne — Home">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_18px_rgba(0,240,255,0.45)] border border-[#00F0FF]/35 group-hover:border-[#FF007F] group-hover:shadow-[0_0_22px_rgba(255,0,127,0.6)] transition-all flex-shrink-0 bg-[#05050A]">
              <Image
                src="/motion-logo.jpg"
                alt="Motionxyne"
                width={40}
                height={40}
                className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl tracking-wider text-[#F4F6FF] uppercase leading-none">
                MOTIONXYNE
              </span>
              <span className="font-mono text-[9px] bg-gradient-to-r from-[#00F0FF] via-[#9D4EDD] to-[#FF007F] bg-clip-text text-transparent tracking-widest uppercase font-semibold">
                CYBER POST-PRODUCTION
              </span>
            </div>
          </Link>

          {/* Middle statement */}
          <p className="font-mono text-xs text-[#8A94B8] text-center sm:text-left">
            © 2026 Motionxyne • {siteConfig.contact.location} — All rights reserved.
          </p>

          {/* Socials & Links */}
          <div className="flex items-center gap-5 text-xs font-mono">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-[#F4F6FF] hover:text-[#00F0FF] transition-colors"
            >
              Email
            </a>
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`}
              className="text-[#F4F6FF] hover:text-[#00F0FF] transition-colors"
            >
              Phone
            </a>
            {siteConfig.social.linkedin && (
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F4F6FF] hover:text-[#FF007F] transition-colors"
              >
                LinkedIn
              </a>
            )}
            {siteConfig.social.instagram && (
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F4F6FF] hover:text-[#FF007F] transition-colors"
              >
                Instagram
              </a>
            )}
            {siteConfig.social.upwork && (
              <a
                href={siteConfig.social.upwork}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F4F6FF] hover:text-[#00F0FF] transition-colors"
              >
                Upwork
              </a>
            )}
          </div>
        </div>

        {/* Secondary link row */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#8A94B8]">
          <div className="flex flex-wrap gap-4 sm:gap-6 font-mono text-[11px]">
            <a href="/#work" className="hover:text-[#00F0FF]">Work</a>
            <a href="/#long-videos" className="hover:text-[#00F0FF]">Long Videos</a>
            <a href="/#shorts" className="hover:text-[#00F0FF]">Shorts & Reels</a>
            <a href="/#services" className="hover:text-[#00F0FF]">Services</a>
            <a href="/#process" className="hover:text-[#00F0FF]">Process</a>
            <a href="/#about" className="hover:text-[#00F0FF]">About</a>
            <a href="/#testimonials" className="hover:text-[#00F0FF]">Reviews</a>
            <a href="/#contact" className="hover:text-[#FF007F]">Contact</a>
          </div>

          <div className="flex gap-4 font-mono text-[11px]">
            <Link href="/admin" className="hover:text-[#00F0FF]">Admin Portal</Link>
            <Link href="/editor" className="hover:text-[#FF007F]">Editor Portal</Link>
            <Link href="/privacy-policy" className="hover:text-[#F4F6FF]">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#F4F6FF]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
