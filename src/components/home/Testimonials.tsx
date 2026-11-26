'use client';

import React from 'react';
import { clientTestimonials } from '@/data/portfolio';
import { Tilt3D } from '@/components/ui/Tilt3D';

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-[#0B0B0D] scroll-mt-24 border-t border-white/[0.08]">
      <div className="w-[min(76rem,calc(100%-2rem))] mx-auto">
        <div className="eyebrow flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#FF9933] inline-block animate-pulse" />
          <span>CLIENT RESULTS & REVIEWS</span>
          <span>🇮🇳</span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F3EFE7] uppercase leading-[1.02] mb-12 sm:mb-16">
          PROOF OF<br />
          <span className="bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] bg-clip-text text-transparent">
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
              glareColor="rgba(255, 153, 51, 0.14)"
              className="rounded-2xl h-full"
            >
              <div
                className="h-full rounded-2xl bg-[#14141B]/90 backdrop-blur-xl border border-white/[0.08] hover:border-[#FF9933]/50 p-6 sm:p-7 flex flex-col justify-between shadow-[0_14px_34px_rgba(0,0,0,0.55)] hover:shadow-[0_22px_48px_rgba(255,153,51,0.16)] transition-all duration-300 group preserve-3d"
              >
                <div className="preserve-3d">
                  <div className="font-mono text-[#FF9933] text-sm tracking-widest mb-4 flex items-center gap-1 depth-layer-sm">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    <span className="text-[10px] text-[#97959F] ml-2 font-mono">5.0 VERIFIED EDIT</span>
                  </div>
                  <p className="text-sm sm:text-base text-[#DDD8CE] leading-relaxed mb-6 italic depth-layer-sm">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between depth-layer-sm">
                  <div>
                    <div className="font-display text-lg text-[#F3EFE7] uppercase tracking-wide group-hover:text-white transition-colors">
                      {review.name}
                    </div>
                    <div className="font-mono text-xs text-[#97959F]">
                      {review.role}
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#19C3B8]">
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
