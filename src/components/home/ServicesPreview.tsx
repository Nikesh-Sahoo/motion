'use client';

import React from 'react';
import { servicesData } from '@/data/services';
import { Tilt3D } from '@/components/ui/Tilt3D';
import { Sparkles } from 'lucide-react';

export function ServicesPreview() {
  const coreServices = servicesData.filter((s) => s.id !== 'self-reference-service');
  const selfRefService = servicesData.find((s) => s.id === 'self-reference-service');

  return (
    <section
      id="services"
      className="py-16 sm:py-24 bg-[#05050A] scroll-mt-24 border-t border-[#00F0FF]/15 relative"
    >
      <div className="w-[min(74rem,calc(100%-2rem))] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="eyebrow flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF007F] inline-block animate-pulse shadow-[0_0_8px_#FF007F]" />
              <span>MOTIONXYNE POST-PRODUCTION SUITE</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F4F6FF] uppercase leading-[1.02]">
              EDITING THAT FITS<br />
              <span className="bg-gradient-to-r from-[#00F0FF] via-[#9D4EDD] to-[#FF007F] bg-clip-text text-transparent">
                EVERY FORMAT &amp; LAUNCH.
              </span>
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#8A94B8] max-w-lg leading-relaxed">
            From ₹500+ creator cuts to full commercial campaigns—hand over your footage and references, and we engineer the cut around your goal.
          </p>
        </div>

        {/* All 10 Core Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 perspective-stage">
          {coreServices.map((service, idx) => {
            const isCyan = idx % 3 === 0;
            const isPink = idx % 3 === 1;
            const accentBar = isCyan
              ? 'bg-gradient-to-r from-[#00F0FF] to-[#3B82F6]'
              : isPink
              ? 'bg-gradient-to-r from-[#FF007F] to-[#FF4DA6]'
              : 'bg-gradient-to-r from-[#9D4EDD] to-[#FCEE0A]';
            const glareColor = isCyan
              ? 'rgba(0, 240, 255, 0.16)'
              : isPink
              ? 'rgba(255, 0, 127, 0.16)'
              : 'rgba(157, 78, 221, 0.18)';

            return (
              <Tilt3D
                key={service.id}
                maxTilt={8}
                scale={1.025}
                glareColor={glareColor}
                className="rounded-2xl h-full"
              >
                <article className="h-full rounded-2xl bg-[#0D0E1A]/95 backdrop-blur-xl border border-[#00F0FF]/18 hover:border-[#00F0FF]/65 p-6 sm:p-7 flex flex-col justify-between shadow-[0_14px_34px_rgba(0,0,0,0.65)] hover:shadow-[0_0_32px_rgba(0,240,255,0.18)] transition-all duration-300 group relative preserve-3d">
                  <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${accentBar}`} />

                  <div className="preserve-3d">
                    <div className="flex items-center justify-between mb-4 font-mono text-xs depth-layer-sm">
                      <span className="text-[#8A94B8]">SVC {String(idx + 1).padStart(2, '0')}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-[10px]">
                        {service.turnaroundEstimate}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl text-[#F4F6FF] uppercase mb-3 group-hover:text-[#00F0FF] transition-colors depth-layer-md">
                      {service.title}
                    </h3>

                    <p className="text-sm text-[#8A94B8] leading-relaxed mb-5 depth-layer-sm">
                      {service.shortDescription}
                    </p>

                    <ul className="space-y-2.5 text-xs sm:text-sm text-[#F4F6FF] border-t border-white/[0.08] pt-5 font-mono depth-layer-sm">
                      {service.included.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-center gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF007F] flex-shrink-0 shadow-[0_0_6px_#FF007F]" />
                          <span className="font-sans text-xs sm:text-sm text-[#D5DCF5]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-5 mt-5 border-t border-white/[0.08] flex items-center justify-between depth-layer-sm">
                    <span className="font-mono text-[11px] text-[#8A94B8]">
                      {service.aspectRatios.join(' · ')}
                    </span>
                    <a
                      href="#contact"
                      className="font-mono text-xs text-[#FF007F] font-bold hover:text-[#00F0FF] inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-all"
                    >
                      Book edit →
                    </a>
                  </div>
                </article>
              </Tilt3D>
            );
          })}
        </div>

        {/* Highlighted Self Reference Service Banner */}
        {selfRefService && (
          <div className="mt-8 perspective-stage">
            <Tilt3D
              maxTilt={4}
              scale={1.01}
              glareColor="rgba(255, 0, 127, 0.16)"
              className="rounded-2xl"
            >
              <div className="rounded-2xl bg-gradient-to-r from-[#0D0E1A] via-[#13112B] to-[#0D0E1A] border border-[#FF007F]/45 p-6 sm:p-8 shadow-[0_0_35px_rgba(255,0,127,0.16)] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF007F]/15 border border-[#FF007F]/40 font-mono text-[11px] text-[#FF4DA6] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Self Reference Service Available</span>
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl text-[#F4F6FF] uppercase">
                    {selfRefService.title} — Send Your Reference Edit &amp; We Match It
                  </h3>
                  <p className="text-sm text-[#8A94B8] leading-relaxed">
                    {selfRefService.fullDescription}
                  </p>
                </div>

                <a
                  href="#contact"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF007F] text-[#05050A] font-bold text-sm whitespace-nowrap hover:shadow-[0_0_24px_rgba(0,240,255,0.55)] transition-all"
                >
                  Send Self-Reference Brief →
                </a>
              </div>
            </Tilt3D>
          </div>
        )}
      </div>
    </section>
  );
}
