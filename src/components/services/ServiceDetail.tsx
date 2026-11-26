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
      className="scroll-mt-28 py-12 sm:py-16 border-b border-[#00F0FF]/15 last:border-b-0"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D0E1A] border border-[#00F0FF]/25 text-[#FF007F] flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            {service.badge && (
              <span className="font-mono text-xs uppercase px-2.5 py-0.5 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/35">
                {service.badge}
              </span>
            )}
          </div>

          <h3 className="font-display text-3xl sm:text-4xl text-[#F4F6FF] uppercase leading-tight">
            {service.title}
          </h3>

          <p className="text-base text-[#8A94B8] leading-relaxed">
            {service.fullDescription}
          </p>

          <div className="space-y-3 pt-2">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#FF007F]">
              What Is Included:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.included.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-[#F4F6FF] bg-[#0D0E1A] p-3 rounded-xl border border-[#00F0FF]/15"
                >
                  <Check className="w-4 h-4 text-[#00F0FF] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#00F0FF]/15">
            <div className="flex items-center gap-2 font-mono text-xs text-[#8A94B8]">
              <Clock className="w-4 h-4 text-[#00F0FF]" />
              <span>{service.turnaroundEstimate}</span>
            </div>

            <a
              href={`/#contact?service=${encodeURIComponent(service.title)}`}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF007F] text-[#05050A] font-bold text-xs sm:text-sm hover:shadow-[0_0_24px_rgba(0,240,255,0.5)] transition-all"
            >
              Request Quote for {service.title}
            </a>
          </div>
        </div>

        {/* Visual spec box */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl bg-[#0D0E1A] border border-[#00F0FF]/20 p-6 space-y-4">
            <div className="flex justify-between items-center text-xs font-mono text-[#8A94B8] pb-3 border-b border-[#00F0FF]/15">
              <span className="text-[#00F0FF]">FORMAT SPECIFICATIONS</span>
              <span>{service.aspectRatios.join(' • ')}</span>
            </div>

            <div className="space-y-2.5 text-xs text-[#8A94B8]">
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span>Pacing Strategy:</span>
                <span className="text-[#F4F6FF]">Hook-first retention structure</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span>Color Grade:</span>
                <span className="text-[#F4F6FF]">Rec.709 &amp; Custom LUT pass</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/[0.06]">
                <span>Sound Design:</span>
                <span className="text-[#F4F6FF]">Dialogue EQ, SFX &amp; Music</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Master Delivery:</span>
                <span className="text-[#F4F6FF]">4K UHD / 1080p ProRes &amp; MP4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
