import React from 'react';
import { Smartphone, Tv, Sparkles, Check, Clock } from 'lucide-react';
import { ServiceItem } from '@/types/service';

const iconMap = {
  Smartphone: Smartphone,
  Tv: Tv,
  Sparkles: Sparkles,
};

interface ServiceDetailProps {
  service: ServiceItem;
  index: number;
}

export function ServiceDetail({ service, index }: ServiceDetailProps) {
  const Icon = iconMap[service.icon as keyof typeof iconMap] || Sparkles;

  return (
    <div
      id={service.id}
      className="scroll-mt-28 py-12 sm:py-16 border-b border-[rgba(243,239,231,0.10)] last:border-b-0"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#15151B] border border-[rgba(243,239,231,0.10)] text-[#FF6B35] flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            {service.badge && (
              <span className="font-mono text-xs uppercase px-2.5 py-0.5 rounded-full bg-[#19C3B8]/10 text-[#19C3B8] border border-[#19C3B8]/30">
                {service.badge}
              </span>
            )}
          </div>

          <h3 className="font-display text-3xl sm:text-4xl text-[#F3EFE7] uppercase leading-tight">
            {service.title}
          </h3>

          <p className="text-base text-[#97959F] leading-relaxed">
            {service.fullDescription}
          </p>

          <div className="space-y-3 pt-2">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#FF6B35]">
              What Is Included:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.included.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-[#F3EFE7] bg-[#15151B] p-3 rounded-xl border border-[rgba(243,239,231,0.08)]"
                >
                  <Check className="w-4 h-4 text-[#19C3B8] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(243,239,231,0.10)]">
            <div className="flex items-center gap-2 font-mono text-xs text-[#97959F]">
              <Clock className="w-4 h-4 text-[#19C3B8]" />
              <span>{service.turnaroundEstimate}</span>
            </div>

            <a
              href={`/#contact?service=${encodeURIComponent(service.title)}`}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#FF6B35] text-[#0B0B0D] font-semibold text-xs sm:text-sm hover:shadow-glow-orange transition-all"
            >
              Request Quote for {service.title}
            </a>
          </div>
        </div>

        {/* Visual spec box */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl bg-[#15151B] border border-[rgba(243,239,231,0.10)] p-6 space-y-4">
            <div className="flex justify-between items-center text-xs font-mono text-[#97959F] pb-3 border-b border-[rgba(243,239,231,0.10)]">
              <span className="text-[#19C3B8]">FORMAT SPECIFICATIONS</span>
              <span>{service.aspectRatios.join(' • ')}</span>
            </div>

            <div className="space-y-2.5 text-xs text-[#97959F]">
              <div className="flex justify-between py-1 border-b border-[rgba(243,239,231,0.06)]">
                <span>Pacing Strategy:</span>
                <span className="text-[#F3EFE7]">Hook-first retention structure</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[rgba(243,239,231,0.06)]">
                <span>Color Grade:</span>
                <span className="text-[#F3EFE7]">Rec.709 & Custom LUT pass</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[rgba(243,239,231,0.06)]">
                <span>Sound Design:</span>
                <span className="text-[#F3EFE7]">Dialogue EQ, SFX & Licensed Music</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Master Delivery:</span>
                <span className="text-[#F3EFE7]">4K UHD / 1080p ProRes & MP4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
