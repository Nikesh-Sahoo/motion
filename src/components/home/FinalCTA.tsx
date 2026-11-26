'use client';

import React from 'react';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import { ContactForm } from '@/components/forms/ContactForm';

export function FinalCTA() {
  return (
    <section id="contact" className="py-16 sm:py-24 bg-[#05050A] scroll-mt-24 border-t border-[#00F0FF]/15 relative">
      <div className="w-[min(76rem,calc(100%-2rem))] mx-auto relative z-10">
        <div className="rounded-3xl border border-[#00F0FF]/25 p-8 sm:p-14 bg-[#0D0E1A]/92 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(0,240,255,0.08)] relative overflow-hidden">
          {/* Subtle Cyberpunk Accent Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00F0FF]/12 blur-[110px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF007F]/12 blur-[110px] pointer-events-none rounded-full" />

          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
            <div className="eyebrow justify-center mb-3">MOTIONXYNE INQUIRY DESK</div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F4F6FF] uppercase leading-[1.02] mb-4">
              LET&apos;S CUT SOMETHING<br />
              <span className="bg-gradient-to-r from-[#00F0FF] via-[#9D4EDD] to-[#FF007F] bg-clip-text text-transparent">
                THAT PERFORMS.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-[#8A94B8] leading-relaxed">
              Send your raw footage, self-reference link, and budget (starting from ₹500). We reply within 24–48 hours with a tailored edit plan.
            </p>

            {/* Direct action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <a
                href={`mailto:${siteConfig.contact.email}?subject=Project%20Inquiry%20to%20Motionxyne`}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF007F] text-[#05050A] font-bold text-sm sm:text-base hover:shadow-[0_0_28px_rgba(0,240,255,0.55)] transition-all hover:-translate-y-0.5"
              >
                <Mail className="w-4 h-4" />
                <span>Email Sayan Directly</span>
              </a>

              <a
                href={siteConfig.social.upwork}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#060710] border border-[#00F0FF]/30 text-[#F4F6FF] font-semibold text-sm sm:text-base hover:border-[#FF007F] hover:text-[#00F0FF] transition-all hover:-translate-y-0.5"
              >
                <span>View Upwork Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Contact Meta Info */}
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 font-mono text-xs text-[#8A94B8] border-t border-[#00F0FF]/15 pt-6 mt-8">
              <div>
                STUDIO — <b className="text-[#F4F6FF]">MOTIONXYNE</b>
              </div>
              <div>
                EMAIL — <b className="text-[#00F0FF]">{siteConfig.contact.email}</b>
              </div>
              <div>
                PHONE — <a href={`tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`} className="text-[#F4F6FF] hover:text-[#FF007F] font-semibold">{siteConfig.contact.phone}</a>
              </div>
              <div>
                BASED IN — <b className="text-[#F4F6FF]">{siteConfig.contact.location}</b>
              </div>
            </div>
          </div>

          {/* Interactive Project Inquiry Form */}
          <div className="mt-12 pt-10 border-t border-[#00F0FF]/15 max-w-3xl mx-auto">
            <h3 className="font-display text-2xl text-[#F4F6FF] uppercase text-center mb-6">
              Or Send Your Project Brief Directly Below
            </h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
