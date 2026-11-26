'use client';

import React from 'react';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import { ContactForm } from '@/components/forms/ContactForm';

export function FinalCTA() {
  return (
    <section id="contact" className="py-16 sm:py-24 bg-[#0B0B0D] scroll-mt-24 border-t border-white/[0.08] relative">
      <div className="w-[min(76rem,calc(100%-2rem))] mx-auto relative z-10">
        <div className="rounded-3xl border border-white/[0.12] p-8 sm:p-14 bg-[#121219]/90 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* Subtle Accent Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#19C3B8]/10 blur-[100px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF9933]/10 blur-[100px] pointer-events-none rounded-full" />

          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 relative z-10">
            <div className="eyebrow justify-center mb-3">MOTIONXYNE INQUIRY DESK 🇮🇳</div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F3EFE7] uppercase leading-[1.02] mb-4">
              LET&apos;S CUT SOMETHING<br />
              <span className="bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] bg-clip-text text-transparent">
                THAT PERFORMS.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-[#97959F] leading-relaxed">
              Send your raw footage and brief. We store your requirements into our MongoDB pipeline and reply within 24–48 hours with a customized quotation.
            </p>

            {/* Direct action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <a
                href={`mailto:${siteConfig.contact.email}?subject=Project%20Inquiry%20to%20Motionxyne`}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#FF9933] text-[#0B0B0D] font-bold text-sm sm:text-base hover:shadow-[0_0_25px_rgba(255,153,51,0.6)] transition-all hover:-translate-y-0.5"
              >
                <Mail className="w-4 h-4" />
                <span>Email Sayan Directly</span>
              </a>

              <a
                href={siteConfig.social.upwork}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white/[0.04] border border-white/[0.15] text-[#F3EFE7] font-semibold text-sm sm:text-base hover:border-[#19C3B8] hover:text-[#19C3B8] transition-all hover:-translate-y-0.5"
              >
                <span>View Upwork Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Contact Meta Info */}
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 font-mono text-xs text-[#97959F] border-t border-white/[0.08] pt-6 mt-8">
              <div>
                STUDIO — <b className="text-[#F3EFE7]">MOTIONXYNE</b>
              </div>
              <div>
                EMAIL — <b className="text-[#F3EFE7]">{siteConfig.contact.email}</b>
              </div>
              <div>
                PHONE — <a href={`tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`} className="text-[#F3EFE7] hover:text-[#FF9933] font-semibold">{siteConfig.contact.phone}</a>
              </div>
              <div>
                BASED IN — <b className="text-[#F3EFE7]">🇮🇳 {siteConfig.contact.location}</b>
              </div>
            </div>
          </div>

          {/* Interactive Project Inquiry Form */}
          <div className="mt-12 pt-10 border-t border-[rgba(243,239,231,0.10)] max-w-3xl mx-auto">
            <h3 className="font-display text-2xl text-[#F3EFE7] uppercase text-center mb-6">
              Or Send Your Project Brief Directly Below
            </h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
