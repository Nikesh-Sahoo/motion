'use client';

import React from 'react';
import { longVideos, shortVideos } from '@/data/portfolio';
import { Tilt3D } from '@/components/ui/Tilt3D';

export function PortfolioPreview() {
  return (
    <section id="work" className="py-16 sm:py-24 bg-[#0B0B0D] scroll-mt-24">
      <div className="w-[min(74rem,calc(100%-2rem))] mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="eyebrow flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#19C3B8] inline-block animate-pulse" />
              <span>MOTIONXYNE CLIENT WORK</span>
              <span>🇮🇳</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F3EFE7] uppercase leading-[1.02]">
              THE WORK<br />
              <span className="bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] bg-clip-text text-transparent">
                SPEAKS FIRST.
              </span>
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#97959F] max-w-md leading-relaxed">
            Every cut, transition, and audio hit is calculated to stop scrollers, boost average view duration, and convert audiences.
          </p>
        </div>

        {/* 1. Long YouTube Videos */}
        <div className="mb-16 sm:mb-24" id="long-videos">
          <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-3">
            <div>
              <div className="font-mono text-xs text-[#19C3B8] uppercase tracking-widest mb-1">LONG YOUTUBE VIDEOS</div>
              <h3 className="font-display text-3xl sm:text-4xl text-[#F3EFE7] uppercase tracking-wide">
                BUILT FOR RETENTION & WATCH TIME.
              </h3>
            </div>
            <span className="font-mono text-xs px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-[#97959F]">
              4K DCI • ARRI REC.709 • 16:9
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 perspective-stage">
            {longVideos.map((video) => (
              <Tilt3D
                key={video.id}
                maxTilt={5}
                scale={1.015}
                glareColor="rgba(25, 195, 184, 0.14)"
                className="rounded-2xl h-full"
              >
                <article
                  className="h-full overflow-hidden border border-white/[0.08] hover:border-[#19C3B8]/60 rounded-2xl bg-[#14141B]/90 backdrop-blur-xl shadow-[0_14px_34px_rgba(0,0,0,0.65)] hover:shadow-[0_22px_48px_rgba(25,195,184,0.20)] transition-all duration-300 group flex flex-col justify-between"
                >
                {/* Studio Header Bar */}
                <div className="px-4 py-2.5 bg-[#1B1B25] border-b border-white/[0.08] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#19C3B8] inline-block" />
                    <span className="text-[#F3EFE7] font-semibold truncate max-w-[220px] sm:max-w-xs">{video.title}</span>
                  </div>
                  <span className="text-[#97959F] text-[11px]">4K 60FPS</span>
                </div>

                <div className="relative aspect-video bg-[#0B0B0D] overflow-hidden">
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="w-full h-full border-0 block"
                  />
                </div>

                <div className="p-4 bg-[#14141B] border-t border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FF9933]/15 text-[#FF9933] border border-[#FF9933]/30">
                      HIGH RETENTION
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.05] text-[#97959F] border border-white/[0.08]">
                      COLOR GRADED
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[#19C3B8] font-semibold">
                    16:9 MASTER
                  </span>
                </div>
              </article>
              </Tilt3D>
            ))}
          </div>
        </div>

        {/* 2. Shorts & Reels */}
        <div id="shorts">
          <div className="mb-6 sm:mb-8 max-w-2xl">
            <div className="font-mono text-xs text-[#FF9933] uppercase tracking-widest mb-1">VIRAL SHORTS & REELS</div>
            <h3 className="font-display text-3xl sm:text-4xl text-[#F3EFE7] uppercase tracking-wide">
              6 SHORT-FORM EDIT STYLES.
            </h3>
            <p className="mt-2 text-sm sm:text-base text-[#97959F]">
              Paced with hook typography, sound design transitions, dynamic motion graphics, and safe-margin exports for Instagram Reels, YouTube Shorts, and TikTok.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 perspective-stage">
            {shortVideos.map((short) => (
              <Tilt3D
                key={short.id}
                maxTilt={7}
                scale={1.025}
                glareColor="rgba(255, 153, 51, 0.16)"
                className="rounded-2xl h-full"
              >
                <div
                  className="h-full relative rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#FF9933]/60 bg-[#14141B]/90 backdrop-blur-xl shadow-[0_12px_30px_rgba(0,0,0,0.55)] hover:shadow-[0_18px_40px_rgba(255,153,51,0.18)] flex flex-col justify-between transition-all duration-300 group"
                >
                <div className="relative aspect-[9/16] w-full bg-[#0B0B0D] overflow-hidden">
                  <iframe
                    src={short.embedUrl}
                    title={short.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="w-full h-full border-0 block"
                  />
                </div>

                <div className="p-3 bg-[#1B1B25] border-t border-white/[0.06] text-center">
                  <span className="font-mono text-[11px] text-[#F3EFE7] font-semibold block truncate">
                    {short.subtitle}
                  </span>
                  <span className="font-mono text-[9px] text-[#FF9933] uppercase tracking-wider block mt-0.5">
                    9:16 VERTICAL
                  </span>
                </div>
              </div>
              </Tilt3D>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
