'use client';

import React from 'react';
import { servicesData } from '@/data/services';
import { Tilt3D } from '@/components/ui/Tilt3D';

export function ServicesPreview() {
  return (
    <section id="services" className="py-16 sm:py-24 bg-[#0B0B0D] scroll-mt-24 border-t border-[rgba(243,239,231,0.10)]">
      <div className="w-[min(74rem,calc(100%-2rem))] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="eyebrow flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF9933] inline-block animate-pulse" />
              <span>MOTIONXYNE POST-PRODUCTION SUITE</span>
              <span>🇮🇳</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F3EFE7] uppercase leading-[1.02]">
              EDITING THAT FITS<br />
              <span className="bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] bg-clip-text text-transparent">
                THE PLATFORM.
              </span>
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#97959F] max-w-lg leading-relaxed">
            Hand over your raw footage and references. We architect the narrative arc, soundscape, color grade, and pacing around your core conversion goal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 perspective-stage">
          {servicesData.map((service, idx) => (
            <Tilt3D
              key={service.id}
              maxTilt={8}
              scale={1.025}
              glareColor={
                idx === 0
                  ? 'rgba(255, 153, 51, 0.16)'
                  : idx === 1
                  ? 'rgba(25, 195, 184, 0.16)'
                  : 'rgba(19, 136, 8, 0.16)'
              }
              className="rounded-2xl h-full"
            >
              <article
                className="h-full rounded-2xl bg-[#14141B]/90 backdrop-blur-xl border border-white/[0.08] hover:border-[#19C3B8]/60 p-7 sm:p-8 flex flex-col justify-between shadow-[0_14px_34px_rgba(0,0,0,0.55)] hover:shadow-[0_22px_48px_rgba(25,195,184,0.18)] transition-all duration-300 group relative preserve-3d"
              >
                {/* Subtle Top Accent Rim */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${
                    idx === 0
                      ? 'bg-gradient-to-r from-[#FF9933] to-[#FF8855]'
                      : idx === 1
                      ? 'bg-gradient-to-r from-[#19C3B8] to-[#00F0FF]'
                      : 'bg-gradient-to-r from-[#138808] to-[#10B981]'
                  }`}
                />

                <div className="preserve-3d">
                  <div className="flex items-center justify-between mb-4 font-mono text-xs depth-layer-sm">
                    <span className="text-[#97959F]">TIER 0{idx + 1}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-[#19C3B8]">
                      {service.turnaroundEstimate}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl text-[#F3EFE7] uppercase mb-3 group-hover:text-white transition-colors depth-layer-md">
                    {service.title}
                  </h3>

                  <p className="text-sm text-[#97959F] leading-relaxed mb-6 depth-layer-sm">
                    {service.shortDescription}
                  </p>

                  <ul className="space-y-3 text-xs sm:text-sm text-[#F3EFE7] border-t border-white/[0.08] pt-6 font-mono depth-layer-sm">
                    {service.included.slice(0, 3).map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#19C3B8] flex-shrink-0" />
                        <span className="font-sans text-xs sm:text-sm text-[#DDD8CE]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-white/[0.08] flex items-center justify-between depth-layer-sm">
                  <span className="font-mono text-xs text-[#97959F]">
                    STUDIO POLISH
                  </span>
                  <a
                    href="#contact"
                    className="font-mono text-xs text-[#FF9933] font-bold hover:underline inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform"
                  >
                    Book this edit →
                  </a>
                </div>
              </article>
            </Tilt3D>
          ))}
        </div>
      </div>
    </section>
  );
}
