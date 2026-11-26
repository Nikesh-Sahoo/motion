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
    <div className="pt-28 pb-20 bg-[#0B0B0D]">
      <div className="w-[min(74rem,calc(100%-2rem))] mx-auto">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="eyebrow justify-center">WHAT CLIENTS BOOK</div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl text-[#F3EFE7] uppercase leading-[1.02]">
            EDITING THAT FITS<br />
            <span className="bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] bg-clip-text text-transparent">
              THE PLATFORM.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#97959F] leading-relaxed">
            Choose the kind of content you need, send the footage and reference style, and I will shape the edit around your audience, deadline, and brand voice.
          </p>
        </div>

        {/* Detailed Service Sections */}
        <div className="space-y-4">
          {servicesData.map((service, idx) => (
            <ServiceDetail key={service.id} service={service} index={idx} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-[#15151B] border border-[rgba(243,239,231,0.10)] text-center max-w-3xl mx-auto">
          <div className="eyebrow justify-center mb-3">READY TO CUT?</div>
          <h3 className="font-display text-3xl sm:text-4xl text-[#F3EFE7] uppercase mb-4">
            LET&apos;S SHAPE YOUR NEXT VIDEO.
          </h3>
          <p className="text-sm sm:text-base text-[#97959F] max-w-lg mx-auto mb-8">
            Send your footage and a quick brief. Turnaround is usually 48–72 hours depending on length and scope.
          </p>

          <a
            href="/#contact"
            className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#FF9933] text-[#0B0B0D] font-bold text-sm hover:shadow-[0_0_25px_rgba(255,153,51,0.6)] transition-all"
          >
            Start a Project with Motionxyne
          </a>
        </div>
      </div>
    </div>
  );
}
