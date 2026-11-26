'use client';

import React from 'react';
import { longVideos, shortVideos } from '@/data/portfolio';
import { Tilt3D } from '@/components/ui/Tilt3D';

export function PortfolioPreview() {
  return (
    <section id="work" className="py-16 sm:py-24 bg-[#05050A] scroll-mt-24">
      <div className="w-[min(74rem,calc(100%-2rem))] mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="eyebrow flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] inline-block animate-pulse shadow-[0_0_8px_#00F0FF]" />
              <span>MOTIONXYNE CLIENT WORK</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F4F6FF] uppercase leading-[1.02]">
              THE WORK<br />
              <span className="bg-gradient-to-r from-[#00F0FF] via-[#9D4EDD] to-[#FF007F] bg-clip-text text-transparent">
                SPEAKS FIRST.
              </span>
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#8A94B8] max-w-md leading-relaxed">
            Every cut, transition, and audio hit is calculated to stop scrollers, boost average view duration, and convert audiences.
          </p>
        </div>

        {/* 1. Long YouTube Videos */}
        <div className="mb-16 sm:mb-24" id="long-videos">
          <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-3">
            <div>
              <div className="font-mono text-xs text-[#00F0FF] uppercase tracking-widest mb-1">LONG YOUTUBE VIDEOS</div>
              <h3 className="font-display text-3xl sm:text-4xl text-[#F4F6FF] uppercase tracking-wide">
                BUILT FOR RETENTION &amp; WATCH TIME.
              </h3>
            </div>
            <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#0D0E1A] border border-[#00F0FF]/25 text-[#8A94B8]">
              4K DCI • CYBER REC.709 • 16:9
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 perspective-stage">
            {longVideos.map((video) => (
              <Tilt3D
                key={video.id}
                maxTilt={5}
                scale={1.015}
                glareColor="rgba(0, 240, 255, 0.16)"
                className="rounded-2xl h-full"
              >
                <article
                  className="h-full overflow-hidden border border-[#00F0FF]/20 hover:border-[#00F0FF]/70 rounded-2xl bg-[#0D0E1A]/95 backdrop-blur-xl shadow-[0_14px_34px_rgba(0,0,0,0.65)] hover:shadow-[0_0_32px_rgba(0,240,255,0.2)] transition-all duration-300 group flex flex-col justify-between"
                >
                  {/* Studio Header Bar */}
                  <div className="px-4 py-2.5 bg-[#121426] border-b border-[#00F0FF]/15 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00F0FF] inline-block shadow-[0_0_8px_#00F0FF]" />
                      <span className="text-[#F4F6FF] font-semibold truncate max-w-[220px] sm:max-w-xs">{video.title}</span>
                    </div>
                    <span className="text-[#8A94B8] text-[11px]">4K 60FPS</span>
                  </div>

                  <div className="relative aspect-video bg-[#05050A] overflow-hidden">
                    <iframe
                      src={video.embedUrl}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      className="w-full h-full border-0 block"
                    />
                  </div>

                  <div className="p-4 bg-[#0D0E1A] border-t border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FF007F]/15 text-[#FF4DA6] border border-[#FF007F]/35">
                        HIGH RETENTION
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.05] text-[#8A94B8] border border-white/[0.08]">
                        COLOR GRADED
                      </span>
                    </div>
                    <span className="font-mono text-xs text-[#00F0FF] font-semibold">
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
            <div className="font-mono text-xs text-[#FF007F] uppercase tracking-widest mb-1">VIRAL SHORTS &amp; REELS</div>
            <h3 className="font-display text-3xl sm:text-4xl text-[#F4F6FF] uppercase tracking-wide">
              6 SHORT-FORM EDIT STYLES.
            </h3>
            <p className="mt-2 text-sm sm:text-base text-[#8A94B8]">
              Paced with hook typography, sound design transitions, dynamic motion graphics, and safe-margin exports for Instagram Reels, YouTube Shorts, and TikTok.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 perspective-stage">
            {shortVideos.map((short) => (
              <Tilt3D
                key={short.id}
                maxTilt={7}
                scale={1.025}
                glareColor="rgba(255, 0, 127, 0.18)"
                className="rounded-2xl h-full"
              >
                <div
                  className="h-full relative rounded-2xl overflow-hidden border border-[#FF007F]/20 hover:border-[#FF007F]/75 bg-[#0D0E1A]/95 backdrop-blur-xl shadow-[0_12px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_28px_rgba(255,0,127,0.22)] flex flex-col justify-between transition-all duration-300 group"
                >
                  <div className="relative aspect-[9/16] w-full bg-[#05050A] overflow-hidden">
                    <iframe
                      src={short.embedUrl}
                      title={short.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      className="w-full h-full border-0 block"
                    />
                  </div>

                  <div className="p-3 bg-[#121426] border-t border-[#FF007F]/15 text-center">
                    <span className="font-mono text-[11px] text-[#F4F6FF] font-semibold block truncate">
                      {short.subtitle}
                    </span>
                    <span className="font-mono text-[9px] text-[#00F0FF] uppercase tracking-wider block mt-0.5">
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
