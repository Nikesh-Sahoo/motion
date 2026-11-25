'use client';

import React from 'react';
import { clientTestimonials } from '@/data/portfolio';

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-[#0B0B0D] scroll-mt-24 border-t border-[rgba(243,239,231,0.10)]">
      <div className="w-[min(74rem,calc(100%-2rem))] mx-auto">
        <div className="eyebrow">CLIENT CUTS</div>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F3EFE7] uppercase leading-[1.02] mb-12 sm:mb-16">
          CLIENT<br />TESTIMONIALS
        </h2>

        {/* Horizontal scroll or responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientTestimonials.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl bg-[#15151B] border border-[rgba(243,239,231,0.10)] p-6 sm:p-7 flex flex-col justify-between hover:border-[#FF6B35] transition-all duration-300"
            >
              <div>
                <div className="font-mono text-[#19C3B8] text-sm tracking-widest mb-3">
                  ★★★★★
                </div>
                <p className="text-sm sm:text-base text-[#F3EFE7] leading-relaxed mb-6 italic">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[rgba(243,239,231,0.10)]">
                <div className="font-display text-lg text-[#F3EFE7] uppercase tracking-wide">
                  {review.name}
                </div>
                <div className="font-mono text-xs text-[#97959F]">
                  {review.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
