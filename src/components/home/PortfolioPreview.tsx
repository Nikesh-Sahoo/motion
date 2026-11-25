'use client';

import React from 'react';
import { longVideos, shortVideos } from '@/data/portfolio';

export function PortfolioPreview() {
  return (
    <section id="work" className="py-16 sm:py-24 bg-[#0B0B0D] scroll-mt-24">
      <div className="w-[min(74rem,calc(100%-2rem))] mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="eyebrow">MY WORK</div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F3EFE7] uppercase leading-[1.02]">
              THE WORK<br />SPEAKS FIRST.
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#97959F] max-w-md leading-relaxed">
            A quick look at pacing, story, color, sound, and scroll-stopping edits made for real client goals.
          </p>
        </div>

        {/* 1. Long YouTube Videos */}
        <div className="mb-16 sm:mb-24" id="long-videos">
          <div className="mb-6 sm:mb-8">
            <div className="eyebrow">LONG YOUTUBE VIDEOS</div>
            <h3 className="font-display text-3xl sm:text-4xl text-[#F3EFE7] uppercase tracking-wide">
              BUILT FOR WATCH TIME.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {longVideos.map((video) => (
              <article
                key={video.id}
                className="overflow-hidden border border-[#000] rounded-2xl bg-[#F7F6F1] text-[#0B0B0D] shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="relative aspect-video bg-[#121216] overflow-hidden">
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="w-full h-full border-0 block"
                  />
                </div>
                <div className="p-4 bg-[#15151B] border-t border-[rgba(243,239,231,0.10)] flex items-center justify-between">
                  <span className="font-display text-base uppercase text-[#F3EFE7] tracking-wide">
                    {video.title}
                  </span>
                  <span className="font-mono text-xs text-[#19C3B8]">
                    16:9 4K
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 2. Shorts & Reels */}
        <div id="shorts">
          <div className="mb-6 sm:mb-8 max-w-2xl">
            <div className="eyebrow">SHORTS & REELS</div>
            <h3 className="font-display text-3xl sm:text-4xl text-[#F3EFE7] uppercase tracking-wide">
              6 SHORT-FORM EDIT STYLES.
            </h3>
            <p className="mt-2 text-sm sm:text-base text-[#97959F]">
              Six vertical formats for creators and brands who need consistent short-form output across YouTube Shorts, Instagram Reels, and TikTok.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {shortVideos.map((short) => (
              <div
                key={short.id}
                className="relative rounded-2xl overflow-hidden border border-[rgba(243,239,231,0.10)] bg-[#15151B] flex flex-col justify-between transition-all duration-300 hover:border-[#FF6B35] group"
              >
                <div className="relative aspect-[9/16] w-full bg-[#121216] overflow-hidden">
                  <iframe
                    src={short.embedUrl}
                    title={short.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="w-full h-full border-0 block"
                  />
                </div>

                <div className="p-3 bg-[#15151B] border-t border-[rgba(243,239,231,0.10)] text-center">
                  <span className="font-mono text-[11px] text-[#97959F] block truncate">
                    {short.subtitle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
