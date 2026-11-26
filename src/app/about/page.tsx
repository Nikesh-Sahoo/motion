import React from 'react';
import { Metadata } from 'next';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'About | Sayan — Motionxyne Creative Post-Production',
  description:
    'About Sayan and Motionxyne. Professional video editing and post-production studio based in Bhubaneswar, India, working with creators and brands worldwide.',
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
        <div className="max-w-3xl mx-auto">
          {/* Copy and Meta */}
          <div className="space-y-6">
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
