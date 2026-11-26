import React from 'react';
import { Metadata } from 'next';
import { longVideos, shortVideos } from '@/data/portfolio';
import { Tilt3D } from '@/components/ui/Tilt3D';

export const metadata: Metadata = {
  title: 'Our Work | Motionxyne Portfolio',
  description:
    'Watch real client video edits by Sayan at Motionxyne: YouTube finance storytelling, vlogs, gameplay, real estate films, and viral shorts.',
};

export default function PortfolioPage() {
  return (
    <div className="pt-28 pb-20 bg-[#05050A]">
      <div className="w-[min(74rem,calc(100%-2rem))] mx-auto">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="eyebrow justify-center">MY WORK</div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl text-[#F4F6FF] uppercase leading-[1.02]">
            THE WORK<br />
            <span className="bg-gradient-to-r from-[#00F0FF] via-[#9D4EDD] to-[#FF007F] bg-clip-text text-transparent">
              SPEAKS FIRST.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#8A94B8] leading-relaxed">
            A quick look at pacing, story, color, sound, and scroll-stopping edits made for real client goals.
          </p>
        </div>

        {/* Long Videos */}
        <div className="mb-20">
          <div className="mb-6">
            <div className="eyebrow">LONG YOUTUBE VIDEOS</div>
            <h2 className="font-display text-3xl sm:text-4xl text-[#F4F6FF] uppercase">
              BUILT FOR WATCH TIME.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 perspective-stage">
            {longVideos.map((video) => (
              <Tilt3D
                key={video.id}
                maxTilt={5}
                scale={1.015}
                glareColor="rgba(0, 240, 255, 0.16)"
                className="rounded-2xl h-full"
              >
                <article
                  className="h-full overflow-hidden border border-[#00F0FF]/20 hover:border-[#00F0FF]/70 rounded-2xl bg-[#0D0E1A] shadow-[0_14px_34px_rgba(0,0,0,0.6)] hover:shadow-[0_0_28px_rgba(0,240,255,0.2)] transition-all duration-300"
                >
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
                  <div className="p-4 bg-[#0D0E1A] border-t border-[#00F0FF]/15 flex items-center justify-between">
                    <span className="font-display text-base uppercase text-[#F4F6FF]">
                      {video.title}
                    </span>
                    <span className="font-mono text-xs text-[#00F0FF]">
                      {video.category}
                    </span>
                  </div>
                </article>
              </Tilt3D>
            ))}
          </div>
        </div>

        {/* Shorts */}
        <div>
          <div className="mb-6 max-w-2xl">
            <div className="eyebrow">SHORTS &amp; REELS</div>
            <h2 className="font-display text-3xl sm:text-4xl text-[#F4F6FF] uppercase">
              6 SHORT-FORM EDIT STYLES.
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#8A94B8]">
              Six vertical formats for creators and brands who need consistent short-form output across YouTube Shorts, Instagram Reels, and TikTok.
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
                  className="h-full relative rounded-2xl overflow-hidden border border-[#FF007F]/20 hover:border-[#FF007F]/70 bg-[#0D0E1A] flex flex-col justify-between transition-colors"
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

                  <div className="p-3 bg-[#0D0E1A] border-t border-[#FF007F]/15 text-center">
                    <span className="font-mono text-[11px] text-[#8A94B8] block truncate">
                      {short.subtitle}
                    </span>
                  </div>
                </div>
              </Tilt3D>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <a
            href="/#contact"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF007F] text-[#05050A] font-bold text-sm hover:shadow-[0_0_28px_rgba(0,240,255,0.55)] transition-all"
          >
            Get a Quote for Your Project
          </a>
        </div>
      </div>
    </div>
  );
}
