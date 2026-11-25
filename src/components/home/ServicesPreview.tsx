'use client';

import React from 'react';
import { servicesData } from '@/data/services';
import { Check } from 'lucide-react';

export function ServicesPreview() {
  return (
    <section id="services" className="py-16 sm:py-24 bg-[#0B0B0D] scroll-mt-24 border-t border-[rgba(243,239,231,0.10)]">
      <div className="w-[min(74rem,calc(100%-2rem))] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="eyebrow">WHAT CLIENTS BOOK</div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F3EFE7] uppercase leading-[1.02]">
              EDITING THAT FITS<br />THE PLATFORM.
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#97959F] max-w-lg leading-relaxed">
            Choose the kind of content you need, send the footage and reference style, and I will shape the edit around your audience, deadline, and brand voice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {servicesData.map((service) => (
            <article
              key={service.id}
              className="rounded-2xl bg-[#15151B] border border-[rgba(243,239,231,0.10)] p-7 sm:p-8 flex flex-col justify-between hover:border-[#FF6B35] transition-all duration-300 hover:-translate-y-1 group"
            >
              <div>
                <h3 className="font-display text-2xl sm:text-3xl text-[#F3EFE7] uppercase mb-3 group-hover:text-[#FF6B35] transition-colors">
                  {service.title}
                </h3>

                <p className="text-sm text-[#97959F] leading-relaxed mb-6">
                  {service.shortDescription}
                </p>

                <ul className="space-y-2.5 text-xs sm:text-sm text-[#F3EFE7] border-t border-[rgba(243,239,231,0.10)] pt-6">
                  {service.included.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-[rgba(243,239,231,0.10)] flex items-center justify-between">
                <span className="font-mono text-xs text-[#19C3B8]">
                  {service.turnaroundEstimate}
                </span>
                <a
                  href="#contact"
                  className="font-mono text-xs text-[#FF6B35] font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Book this edit →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
