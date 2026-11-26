import React from 'react';
import { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import { ContactForm } from '@/components/forms/ContactForm';
import { Mail, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact | Motionxyne Creative Post-Production',
  description:
    'Send your video footage and brief to Sayan at Motionxyne. Turnaround 48-72 hours. Email: sayanedits007@gmail.com, Phone: +91 6370283042, Based in: Bhubaneswar, India.',
};

export default function ContactPage() {
  return (
    <div className="pt-28 pb-20 bg-[#05050A]">
      <div className="w-[min(74rem,calc(100%-2rem))] mx-auto">
        <div className="rounded-3xl border border-[#00F0FF]/25 p-8 sm:p-14 bg-gradient-to-br from-[#0D0E1A] via-[#05050A] to-[#110D22] shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="eyebrow justify-center mb-3">GOT FOOTAGE? LET&apos;S TALK</div>
            <h1 className="font-display text-4xl sm:text-6xl text-[#F4F6FF] uppercase leading-[1.02] mb-4">
              LET&apos;S CUT SOMETHING<br />
              <span className="bg-gradient-to-r from-[#00F0FF] via-[#9D4EDD] to-[#FF007F] bg-clip-text text-transparent">
                THAT PERFORMS.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-[#8A94B8] leading-relaxed">
              Send your footage, self-reference link, and budget (starting from ₹500). Turnaround is usually 24–72 hours depending on scope.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <a
                href={`mailto:${siteConfig.contact.email}?subject=Project%20Inquiry`}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF007F] text-[#05050A] font-bold text-sm sm:text-base hover:shadow-[0_0_26px_rgba(0,240,255,0.55)] transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Email Sayan</span>
              </a>

              <a
                href={siteConfig.social.upwork}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#00F0FF]/30 text-[#F4F6FF] font-semibold text-sm sm:text-base hover:border-[#FF007F] hover:text-[#00F0FF] transition-all"
              >
                <span>View Upwork Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 font-mono text-xs text-[#8A94B8] border-t border-[#00F0FF]/15 pt-6 mt-8">
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

          <div className="mt-12 pt-10 border-t border-[#00F0FF]/15 max-w-3xl mx-auto">
            <h3 className="font-display text-2xl text-[#F4F6FF] uppercase text-center mb-6">
              Send Project Brief Directly
            </h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
