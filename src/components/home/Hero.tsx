'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export function Hero() {
  const [timecode, setTimecode] = useState('00:00:00:00');

  useEffect(() => {
    let frame = 0;
    let animId: number;

    const updateTC = () => {
      frame++;
      const totalFrames = frame % (30 * 60 * 60);
      const f = totalFrames % 30;
      const s = Math.floor(totalFrames / 30) % 60;
      const m = Math.floor(totalFrames / 1800) % 60;
      const h = Math.floor(totalFrames / 108000);

      setTimecode(
        String(h).padStart(2, '0') + ':' +
        String(m).padStart(2, '0') + ':' +
        String(s).padStart(2, '0') + ':' +
        String(f).padStart(2, '0')
      );

      animId = requestAnimationFrame(updateTC);
    };

    animId = requestAnimationFrame(updateTC);
    return () => cancelAnimationFrame(animId);
  }, []);

  const tickerItems = [
    'PREMIERE PRO',
    'AFTER EFFECTS',
    'DAVINCI RESOLVE',
    'COLOR GRADING',
    'MOTION GRAPHICS',
    'SOUND DESIGN',
    'YOUTUBE EDITS',
    'SHORT-FORM EDITING',
  ];

  return (
    <>
      <section className="pt-28 pb-14 sm:pt-40 sm:pb-20 relative bg-[#0B0B0D]" id="top">
        <div className="w-[min(74rem,calc(100%-2rem))] mx-auto">
          {/* Eyebrow with Brand Logo Emblem & Indian Flag Colors */}
          <div className="inline-flex items-center gap-2.5 mb-5 px-3.5 py-1.5 rounded-full bg-[#15151B] border border-[rgba(243,239,231,0.12)] shadow-[0_0_15px_rgba(255,153,51,0.20)]">
            <div className="w-5 h-5 rounded-md overflow-hidden border border-[#FF9933]/60 flex-shrink-0 shadow-[0_0_8px_rgba(255,153,51,0.6)] bg-[#0B0B0D]">
              <Image
                src="/motion-logo.jpg"
                alt="Motion"
                width={20}
                height={20}
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest font-semibold bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] bg-clip-text text-transparent">
              MOTION — VIDEO EDITING FOR CREATORS & BRANDS
            </span>
            <span className="text-xs">🇮🇳</span>
          </div>

          {/* Heading with Indian Flag Tri-Color Gradient */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#F3EFE7] leading-[1.02] max-w-5xl uppercase">
            BORING GETS SKIPPED.<br />
            <span className="bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(255,153,51,0.25)]">
              WE MAKE IT UNMISSABLE.
            </span>
          </h1>

          {/* Lede paragraph */}
          <p className="mt-5 sm:mt-6 mb-8 sm:mb-10 text-base sm:text-lg md:text-xl text-[#97959F] max-w-2xl leading-relaxed">
            We engineer scroll-stopping video edits built for ruthless retention: viral Reels, cinematic YouTube storytelling, and high-impact brand films designed to turn casual viewers into obsessed followers.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3.5 mb-12 sm:mb-16">
            <a
              href="#work"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#FF9933] text-[#0B0B0D] font-semibold text-sm sm:text-base hover:shadow-[0_0_25px_rgba(255,153,51,0.55)] transition-all duration-200 hover:-translate-y-1"
            >
              Watch the Reel
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-[rgba(243,239,231,0.20)] text-[#F3EFE7] font-semibold text-sm sm:text-base hover:border-[#138808] hover:text-[#138808] transition-all duration-200 hover:-translate-y-1"
            >
              Get a Quote
            </a>
          </div>

          {/* Timeline Scrubber with Indian Flag Tri-color Gradient */}
          <div className="border-t border-[rgba(243,239,231,0.10)] pt-5">
            <div className="relative h-[3px] bg-[rgba(243,239,231,0.10)] rounded-full overflow-visible">
              <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] animate-scrub relative">
                <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#FF9933] shadow-[0_0_0_4px_rgba(255,153,51,0.3)]" />
              </div>
            </div>

            <div className="flex justify-between mt-2.5 font-mono text-xs text-[#97959F] tracking-widest">
              <span>NOW EDITING</span>
              <span className="text-[#F3EFE7] font-semibold">{timecode}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <div className="overflow-hidden border-y border-[rgba(243,239,231,0.10)] bg-[#15151B]">
        <div className="flex w-max animate-marquee">
          <div className="flex items-center flex-none">
            {tickerItems.map((item, idx) => (
              <React.Fragment key={idx}>
                <span className="font-mono text-xs sm:text-sm tracking-widest text-[#97959F] py-4 px-5 sm:px-6 whitespace-nowrap">
                  {item}
                </span>
                <span className="text-[#FF6B35] text-xs px-1">●</span>
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center flex-none" aria-hidden="true">
            {tickerItems.map((item, idx) => (
              <React.Fragment key={`dup-${idx}`}>
                <span className="font-mono text-xs sm:text-sm tracking-widest text-[#97959F] py-4 px-5 sm:px-6 whitespace-nowrap">
                  {item}
                </span>
                <span className="text-[#FF6B35] text-xs px-1">●</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
