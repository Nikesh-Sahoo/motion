'use client';

import React from 'react';
import { siteConfig } from '@/lib/config';
import { Tilt3D } from '@/components/ui/Tilt3D';

export function WhyChooseUs() {
  const metaRows = [
    { label: 'Location', val: siteConfig.contact.location },
    { label: 'Tools', val: 'Premiere Pro / After Effects / DaVinci Resolve / Photoshop' },
    { label: 'Specialty', val: 'Reels · YouTube · App & Brand Promos · Self Reference' },
    { label: 'Delivery', val: 'Remote · Fast Turnaround' },
  ];

  const stats = [
    { num: '20+', label: 'Projects Edited', color: 'text-[#00F0FF]' },
    { num: '2+', label: 'Years Editing', color: 'text-[#F4F6FF]' },
    { num: '100%', label: 'Remote-Friendly', color: 'text-[#FF007F]' },
  ];

  return (
    <section id="about" className="py-16 sm:py-24 bg-[#05050A] scroll-mt-24 border-t border-[#00F0FF]/15">
      <div className="w-[min(74rem,calc(100%-2rem))] mx-auto">
        <div className="max-w-3xl mx-auto">
          {/* Copy and Meta */}
          <div className="space-y-6">
            <div>
              <div className="eyebrow flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF007F]" />
                <span>MEET THE LEAD EDITOR</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F4F6FF] uppercase leading-[1.02] mb-4">
                I&apos;M SAYAN.<br />
                <span className="bg-gradient-to-r from-[#00F0FF] via-[#9D4EDD] to-[#FF007F] bg-clip-text text-transparent">
                  I MAKE FOOTAGE WORTH FINISHING.
                </span>
              </h2>
              <p className="text-base sm:text-lg text-[#8A94B8] leading-relaxed max-w-xl">
                I lead post-production at Motionxyne, engineering high-retention video edits for creators, YouTube channels, and high-impact brands. We treat pacing, sound design, and color grading as retention mechanics—ensuring your audience stays hooked from the first three seconds to the final frame.
              </p>
            </div>

            {/* Meta List */}
            <div className="border-t border-[#00F0FF]/15 divide-y divide-white/[0.08] pt-2 text-sm">
              {metaRows.map((row) => (
                <div key={row.label} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#8A94B8]">
                    {row.label}
                  </span>
                  <span className="text-[#F4F6FF] font-medium text-left sm:text-right">
                    {row.val}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats Row in Cyberpunk Neon */}
            <div className="pt-4 grid grid-cols-3 gap-4 perspective-stage">
              {stats.map((stat) => (
                <Tilt3D
                  key={stat.label}
                  maxTilt={10}
                  scale={1.04}
                  glareColor="rgba(0, 240, 255, 0.18)"
                  className="rounded-xl"
                >
                  <div className="p-4 rounded-xl bg-[#0D0E1A]/90 backdrop-blur-md border border-[#00F0FF]/20 hover:border-[#FF007F]/55 text-center shadow-[0_10px_28px_rgba(0,0,0,0.55)] transition-colors preserve-3d">
                    <div className={`font-display text-3xl sm:text-4xl depth-layer-sm ${stat.color || 'text-[#00F0FF]'}`}>
                      {stat.num}
                    </div>
                    <div className="font-mono text-[10px] sm:text-xs text-[#8A94B8] uppercase tracking-wider mt-1">
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
