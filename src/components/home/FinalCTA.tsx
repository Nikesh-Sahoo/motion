'use client';

import React from 'react';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { siteConfig } from '@/lib/config';
import { ContactForm } from '@/components/forms/ContactForm';

export function FinalCTA() {
  return (
    <section id="contact" className="py-16 sm:py-24 bg-[#0B0B0D] scroll-mt-24 border-t border-[rgba(243,239,231,0.10)]">
      <div className="w-[min(74rem,calc(100%-2rem))] mx-auto">
        <div className="rounded-3xl border border-[rgba(243,239,231,0.10)] p-8 sm:p-14 bg-gradient-to-br from-[#15151B] via-[#0B0B0D] to-[#15151B] shadow-2xl">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="eyebrow justify-center mb-3">GOT FOOTAGE? LET&apos;S TALK</div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F3EFE7] uppercase leading-[1.02] mb-4">
              LET&apos;S CUT SOMETHING<br />
              <span className="bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] bg-clip-text text-transparent">
                THAT PERFORMS.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-[#97959F] leading-relaxed">
              Send your footage and a quick brief. Turnaround is usually 48–72 hours depending on length and scope.
            </p>

            {/* Direct action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <a
                href={`mailto:${siteConfig.contact.email}?subject=Project%20Inquiry`}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#FF9933] text-[#0B0B0D] font-semibold text-sm sm:text-base hover:shadow-[0_0_20px_rgba(255,153,51,0.5)] transition-all hover:-translate-y-0.5"
              >
                <Mail className="w-4 h-4" />
                <span>Email Sayan</span>
              </a>

              <a
                href={siteConfig.social.upwork}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[rgba(243,239,231,0.20)] text-[#F3EFE7] font-semibold text-sm sm:text-base hover:border-[#138808] hover:text-[#138808] transition-all hover:-translate-y-0.5"
              >
                <span>View Upwork Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Contact Meta Info */}
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 font-mono text-xs text-[#97959F] border-t border-[rgba(243,239,231,0.10)] pt-6 mt-8">
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
