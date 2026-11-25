import React from 'react';
import { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import { ContactForm } from '@/components/forms/ContactForm';
import { Mail, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact | Motion Video Editing',
  description:
    'Send your video footage and brief to Sayan at Motion. Turnaround 48-72 hours. Email: sayanedits@gmail.com, Phone: +91 6370283042, Based in: Bhubaneswar, India.',
};

export default function ContactPage() {
  return (
    <div className="pt-28 pb-20 bg-[#0B0B0D]">
      <div className="w-[min(74rem,calc(100%-2rem))] mx-auto">
        <div className="rounded-3xl border border-[rgba(243,239,231,0.10)] p-8 sm:p-14 bg-gradient-to-br from-[#15151B] via-[#0B0B0D] to-[#15151B] shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="eyebrow justify-center mb-3">GOT FOOTAGE? LET&apos;S TALK</div>
            <h1 className="font-display text-4xl sm:text-6xl text-[#F3EFE7] uppercase leading-[1.02] mb-4">
              LET&apos;S CUT SOMETHING<br />
              <span className="bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] bg-clip-text text-transparent">
                THAT PERFORMS.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-[#97959F] leading-relaxed">
              Send your footage and a quick brief. Turnaround is usually 48–72 hours depending on length and scope.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <a
                href={`mailto:${siteConfig.contact.email}?subject=Project%20Inquiry`}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#FF6B35] text-[#0B0B0D] font-semibold text-sm sm:text-base hover:shadow-glow-orange transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Email Sayan</span>
              </a>

              <a
                href={siteConfig.social.upwork}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[rgba(243,239,231,0.20)] text-[#F3EFE7] font-semibold text-sm sm:text-base hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all"
              >
                <span>View Upwork Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 font-mono text-xs text-[#97959F] border-t border-[rgba(243,239,231,0.10)] pt-6 mt-8">
              <div>
                EMAIL — <b className="text-[#F3EFE7]">{siteConfig.contact.email}</b>
              </div>
              <div>
                PHONE — <a href={`tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`} className="text-[#F3EFE7] hover:text-[#FF6B35] font-semibold">{siteConfig.contact.phone}</a>
              </div>
              <div>
                BASED IN — <b className="text-[#F3EFE7]">{siteConfig.contact.location}</b>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-10 border-t border-[rgba(243,239,231,0.10)] max-w-3xl mx-auto">
            <h3 className="font-display text-2xl text-[#F3EFE7] uppercase text-center mb-6">
              Send Project Brief Directly
            </h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
