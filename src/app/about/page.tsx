import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'About | Sayan — Motion Video Editing & Creative Post-Production',
  description:
    'About Sayan and Motion. Professional video editor based in Bhubaneswar, India with 3+ years experience, 50+ completed client edits, working with creators and brands worldwide.',
};

export default function AboutPage() {
  const metaRows = [
    { label: 'Location', val: siteConfig.contact.location },
    { label: 'Tools', val: 'Premiere Pro / After Effects / DaVinci Resolve' },
    { label: 'Specialty', val: 'Reels · Travel Films · Brand Content' },
    { label: 'Delivery', val: 'Remote · Fast Turnaround' },
  ];

  const stats = [
    { num: '40+', label: 'Projects Edited' },
    { num: '2+', label: 'Years Editing' },
    { num: '100%', label: 'Remote-Friendly' },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#0B0B0D]">
      <div className="w-[min(74rem,calc(100%-2rem))] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Portrait Image with photo corners */}
          <div className="lg:col-span-5">
            <div className="relative aspect-square w-full max-w-md mx-auto rounded-2xl overflow-hidden border border-[rgba(243,239,231,0.10)] bg-[#15151B]">
              <Image
                src="/mayank-about.png"
                alt="Sayan — video editor and visual storyteller"
                width={1254}
                height={1254}
                className="w-full h-full object-cover object-center"
                priority
              />

              <div className="absolute top-3.5 left-3.5 w-5 h-5 border-t-2 border-l-2 border-[#F3EFE7] opacity-60" />
              <div className="absolute top-3.5 right-3.5 w-5 h-5 border-t-2 border-r-2 border-[#F3EFE7] opacity-60" />
              <div className="absolute bottom-3.5 left-3.5 w-5 h-5 border-b-2 border-l-2 border-[#F3EFE7] opacity-60" />
              <div className="absolute bottom-3.5 right-3.5 w-5 h-5 border-b-2 border-r-2 border-[#F3EFE7] opacity-60" />

              <span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-wider text-[#97959F]">
                SAYAN • MOTION
              </span>
            </div>
          </div>

          {/* Copy and Meta */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="eyebrow">ABOUT</div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F3EFE7] uppercase leading-[1.02] mb-4">
                I&apos;M SAYAN.<br />I MAKE FOOTAGE<br />
                <span className="bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] bg-clip-text text-transparent">
                  WORTH FINISHING.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-[#97959F] leading-relaxed max-w-xl">
                I&apos;m a freelance video editor working with creators and small brands on reels, travel films, and promotional content. I care about pacing, sound, and color as much as the cut itself — the goal is always the same: keep people watching to the end.
              </p>
            </div>

            {/* Meta List */}
            <div className="border-t border-[rgba(243,239,231,0.10)] divide-y divide-[rgba(243,239,231,0.10)] pt-2 text-sm">
              {metaRows.map((row) => (
                <div key={row.label} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#97959F]">
                    {row.label}
                  </span>
                  <span className="text-[#F3EFE7] font-medium text-left sm:text-right">
                    {row.val}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="pt-4 flex flex-wrap gap-8 sm:gap-12">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-4xl sm:text-5xl text-[#FF6B35]">
                    {stat.num}
                  </div>
                  <div className="font-mono text-xs text-[#97959F] uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <a
                href="/#contact"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#FF6B35] text-[#0B0B0D] font-semibold text-sm hover:shadow-glow-orange transition-all"
              >
                Work With Sayan
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
