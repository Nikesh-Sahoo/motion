import React from 'react';
import { Metadata } from 'next';
import { servicesData } from '@/data/services';
import { ServiceDetail } from '@/components/services/ServiceDetail';

export const metadata: Metadata = {
  title: 'Services | Motionxyne Post-Production',
  description:
    'Motionxyne video editing services: Short-Form Content (Reels/Shorts/TikTok), YouTube & Long Form, and Brand & Promo Edits by Sayan.',
};

export default function ServicesPage() {
  return (
    <div className="pt-28 pb-20 bg-[#05050A]">
      <div className="w-[min(74rem,calc(100%-2rem))] mx-auto">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="eyebrow justify-center">WHAT CLIENTS BOOK</div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl text-[#F4F6FF] uppercase leading-[1.02]">
            EDITING THAT FITS<br />
            <span className="bg-gradient-to-r from-[#00F0FF] via-[#9D4EDD] to-[#FF007F] bg-clip-text text-transparent">
              EVERY FORMAT.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#8A94B8] leading-relaxed">
            Choose from our full editing &amp; promotion catalog (including Self Reference custom style matching), starting from ₹500.
          </p>
        </div>

        {/* Detailed Service Sections */}
        <div className="space-y-4">
          {servicesData.map((service, idx) => (
            <ServiceDetail key={service.id} service={service} index={idx} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-[#0D0E1A] border border-[#00F0FF]/25 text-center max-w-3xl mx-auto shadow-[0_0_35px_rgba(0,240,255,0.08)]">
          <div className="eyebrow justify-center mb-3">READY TO CUT?</div>
          <h3 className="font-display text-3xl sm:text-4xl text-[#F4F6FF] uppercase mb-4">
            LET&apos;S SHAPE YOUR NEXT VIDEO.
          </h3>
          <p className="text-sm sm:text-base text-[#8A94B8] max-w-lg mx-auto mb-8">
            Send your footage, self-reference style link, and budget starting from ₹500.
          </p>

          <a
            href="/#contact"
            className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF007F] text-[#05050A] font-bold text-sm hover:shadow-[0_0_26px_rgba(0,240,255,0.6)] transition-all"
          >
            Start a Project with Motionxyne
          </a>
        </div>
      </div>
    </div>
  );
}
