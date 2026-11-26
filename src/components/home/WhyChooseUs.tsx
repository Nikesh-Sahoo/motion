'use client';

import React from 'react';
import { siteConfig } from '@/lib/config';
import { Tilt3D } from '@/components/ui/Tilt3D';

export function WhyChooseUs() {
  const metaRows = [
    { label: 'Location', val: `🇮🇳 ${siteConfig.contact.location}` },
    { label: 'Tools', val: 'Premiere Pro / After Effects / DaVinci Resolve' },
    { label: 'Specialty', val: 'Reels · Travel Films · Brand Content' },
    { label: 'Delivery', val: 'Remote · Fast Turnaround' },
  ];

  const stats = [
    { num: '20+', label: 'Projects Edited', color: 'text-[#FF9933]' },
    { num: '2+', label: 'Years Editing', color: 'text-[#FFFFFF]' },
    { num: '100%', label: 'Remote-Friendly', color: 'text-[#138808]' },
  ];

  return (
    <section id="about" className="py-16 sm:py-24 bg-[#0B0B0D] scroll-mt-24 border-t border-[rgba(243,239,231,0.10)]">
      <div className="w-[min(74rem,calc(100%-2rem))] mx-auto">
        <div className="max-w-3xl mx-auto">
          {/* Copy and Meta */}
          <div className="space-y-6">
            <div>
              <div className="eyebrow flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
                <span>MEET THE LEAD EDITOR</span>
                <span>🇮🇳</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F3EFE7] uppercase leading-[1.02] mb-4">
                I&apos;M SAYAN.<br />
                <span className="bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] bg-clip-text text-transparent">
                  I MAKE FOOTAGE WORTH FINISHING.
                </span>
              </h2>
              <p className="text-base sm:text-lg text-[#97959F] leading-relaxed max-w-xl">
                I lead post-production at Motionxyne, engineering high-retention video edits for creators, YouTube channels, and high-impact brands. We treat pacing, sound design, and color grading as retention mechanics—ensuring your audience stays hooked from the first three seconds to the final frame.
              </p>
            </div>

            {/* Meta List */}
            <div className="border-t border-white/[0.08] divide-y divide-white/[0.08] pt-2 text-sm">
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

            {/* Stats Row in Indian Flag Tri-Colors */}
            <div className="pt-4 grid grid-cols-3 gap-4 perspective-stage">
              {stats.map((stat) => (
                <Tilt3D
                  key={stat.label}
                  maxTilt={10}
                  scale={1.04}
                  glareColor="rgba(255, 153, 51, 0.16)"
                  className="rounded-xl"
                >
                  <div className="p-4 rounded-xl bg-[#14141B]/80 backdrop-blur-md border border-white/[0.08] hover:border-[#19C3B8]/50 text-center shadow-[0_10px_28px_rgba(0,0,0,0.45)] transition-colors preserve-3d">
                    <div className={`font-display text-3xl sm:text-4xl depth-layer-sm ${stat.color || 'text-[#FF9933]'}`}>
                      {stat.num}
                    </div>
                    <div className="font-mono text-[10px] sm:text-xs text-[#97959F] uppercase tracking-wider mt-1">
                      {stat.label}
                    </div>
                  </div>
                </Tilt3D>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
