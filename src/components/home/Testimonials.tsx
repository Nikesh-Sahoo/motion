'use client';

import React from 'react';
import { clientTestimonials } from '@/data/portfolio';
import { Tilt3D } from '@/components/ui/Tilt3D';

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-[#05050A] scroll-mt-24 border-t border-[#00F0FF]/15">
      <div className="w-[min(76rem,calc(100%-2rem))] mx-auto">
        <div className="eyebrow flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#FF007F] inline-block animate-pulse shadow-[0_0_8px_#FF007F]" />
          <span>CLIENT RESULTS &amp; REVIEWS</span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F4F6FF] uppercase leading-[1.02] mb-12 sm:mb-16">
          PROOF OF<br />
          <span className="bg-gradient-to-r from-[#00F0FF] via-[#9D4EDD] to-[#FF007F] bg-clip-text text-transparent">
            AUDIENCE RETENTION.
          </span>
        </h2>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-stage">
          {clientTestimonials.map((review) => (
            <Tilt3D
              key={review.id}
              maxTilt={6}
              scale={1.02}
              glareColor="rgba(255, 0, 127, 0.16)"
              className="rounded-2xl h-full"
            >
              <div
                className="h-full rounded-2xl bg-[#0D0E1A]/95 backdrop-blur-xl border border-[#00F0FF]/18 hover:border-[#FF007F]/60 p-6 sm:p-7 flex flex-col justify-between shadow-[0_14px_34px_rgba(0,0,0,0.6)] hover:shadow-[0_0_30px_rgba(255,0,127,0.18)] transition-all duration-300 group preserve-3d"
              >
                <div className="preserve-3d">
                  <div className="font-mono text-[#FF007F] text-sm tracking-widest mb-4 flex items-center gap-1 depth-layer-sm">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    <span className="text-[10px] text-[#8A94B8] ml-2 font-mono">5.0 VERIFIED EDIT</span>
                  </div>
                  <p className="text-sm sm:text-base text-[#D5DCF5] leading-relaxed mb-6 italic depth-layer-sm">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between depth-layer-sm">
                  <div>
                    <div className="font-display text-lg text-[#F4F6FF] uppercase tracking-wide group-hover:text-[#00F0FF] transition-colors">
                      {review.name}
                    </div>
                    <div className="font-mono text-xs text-[#8A94B8]">
                      {review.role}
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#00F0FF]">
                    RETENTION+
                  </span>
                </div>
              </div>
            </Tilt3D>
          ))}
        </div>
      </div>
    </section>
  );
}
