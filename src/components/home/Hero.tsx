'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Play, Sparkles, Volume2, Film, Layers, Monitor } from 'lucide-react';
import { Tilt3D } from '@/components/ui/Tilt3D';
import { Studio3DBackground } from '@/components/ui/Studio3DBackground';

export function Hero() {
  const [timecode, setTimecode] = useState('00:00:24:18');

  useEffect(() => {
    let frame = 18;
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
    'MOTIONXYNE STUDIO',
    'RETENTION EDITING',
    'DAVINCI RESOLVE COLOR',
    'AFTER EFFECTS VFX',
    'SOUND DESIGN & MASTERING',
    '4K PRORES 422 HQ',
    'VIRAL REELS & SHORTS',
    'YOUTUBE STORYTELLING',
  ];

  return (
    <>
      <section className="pt-32 pb-16 sm:pt-44 sm:pb-24 relative bg-[#05050A] overflow-hidden bg-grid-pattern" id="top">
        {/* Interactive 3D Perspective Studio Stage */}
        <Studio3DBackground />

        {/* Ambient Cyberpunk Neon Lighting Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[900px] h-[400px] bg-gradient-to-tr from-[#00F0FF]/20 via-[#9D4EDD]/18 to-[#FF007F]/15 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-[#FF007F]/15 blur-[110px] pointer-events-none rounded-full" />

        <div className="w-[min(76rem,calc(100%-2rem))] mx-auto relative z-10">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2.5 mb-6 px-3.5 py-1.5 rounded-full bg-[#0D0E1A]/90 backdrop-blur-md border border-[#00F0FF]/35 shadow-[0_0_24px_rgba(0,240,255,0.2)]">
            <div className="w-5 h-5 rounded-md overflow-hidden border border-[#00F0FF]/70 flex-shrink-0 shadow-[0_0_10px_rgba(0,240,255,0.75)] bg-[#05050A]">
              <Image
                src="/motion-logo.jpg"
                alt="Motionxyne"
                width={20}
                height={20}
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-widest font-semibold bg-gradient-to-r from-[#00F0FF] via-[#F4F6FF] to-[#FF007F] bg-clip-text text-transparent">
              MOTIONXYNE — CYBER POST-PRODUCTION STUDIO
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF007F] animate-ping" />
          </div>

          {/* Main Display Headline */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#F4F6FF] leading-[1.02] max-w-5xl uppercase drop-shadow-sm">
            BORING GETS SKIPPED.<br />
            <span className="bg-gradient-to-r from-[#00F0FF] via-[#9D4EDD] to-[#FF007F] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(0,240,255,0.3)]">
              WE MAKE IT UNMISSABLE.
            </span>
          </h1>

          {/* Lede paragraph */}
          <p className="mt-5 sm:mt-6 mb-8 sm:mb-10 text-base sm:text-lg md:text-xl text-[#8A94B8] max-w-2xl leading-relaxed">
            We engineer high-retention video edits designed for creators, founders, and ambitious brands. From dopamine-packed viral Reels to binge-worthy YouTube breakdowns and cinematic brand films.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-14 sm:mb-16">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF007F] text-[#05050A] font-bold text-sm sm:text-base hover:shadow-[0_0_32px_rgba(0,240,255,0.6)] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Your Project</span>
            </a>
            <a
              href="#work"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#0D0E1A]/80 backdrop-blur-md border border-[#00F0FF]/35 text-[#F4F6FF] font-semibold text-sm sm:text-base hover:border-[#FF007F] hover:text-[#00F0FF] transition-all duration-300 hover:shadow-[0_0_24px_rgba(255,0,127,0.28)]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch Showreel</span>
            </a>
          </div>

          {/* Virtual NLE Post-Production Studio Timeline Component in 3D Stage */}
          <div className="perspective-stage">
            <Tilt3D
              maxTilt={5.5}
              perspective={1500}
              scale={1.012}
              glareColor="rgba(0, 240, 255, 0.18)"
              className="rounded-2xl"
            >
              <div className="rounded-2xl border border-[#00F0FF]/25 bg-[#0D0E1A]/90 backdrop-blur-2xl shadow-[0_25px_65px_rgba(0,0,0,0.88),0_0_40px_rgba(0,240,255,0.1)] preserve-3d">
                {/* Timeline Suite Topbar */}
                <div className="bg-[#121426] px-4 py-3 border-b border-[#00F0FF]/18 rounded-t-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono depth-layer-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF007F] inline-block shadow-[0_0_8px_#FF007F]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FCEE0A] inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] inline-block shadow-[0_0_8px_#00F0FF]" />
                    </div>
                    <span className="text-[#8A94B8] hidden sm:inline">SEQUENCE:</span>
                    <span className="text-[#F4F6FF] font-semibold">Motionxyne_MasterShowreel_4K.prproj</span>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] sm:text-xs">
                    <span className="px-2 py-0.5 rounded bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/35 font-semibold">
                      4K DCI 60FPS
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#FF007F]/15 text-[#FF4DA6] border border-[#FF007F]/35 font-semibold">
                      CYBER LUT v4
                    </span>
                    <span className="text-[#8A94B8] hidden md:inline">TIMECODE:</span>
                    <span className="font-bold bg-black/70 px-2 py-0.5 rounded border border-[#00F0FF]/30 text-[#00F0FF]">
                      {timecode}
                    </span>
                  </div>
                </div>

                {/* Timeline Multi-Track Layers View */}
                <div className="p-4 sm:p-5 space-y-2 bg-[#070812]/95 rounded-b-2xl font-mono text-[11px] preserve-3d">
                  {/* V3: Titles / Hooks */}
                  <div className="flex items-center gap-2 depth-layer-sm">
                    <span className="w-12 text-[#8A94B8] text-right text-[10px] flex-shrink-0 font-bold">V3 [GFX]</span>
                    <div className="flex-1 h-7 rounded bg-[#0D0E1A] border border-[#00F0FF]/12 flex items-center p-1 gap-1 overflow-hidden relative">
                      <div className="h-full px-2.5 rounded bg-[#FF007F]/25 border border-[#FF007F]/55 text-[#FF4DA6] text-[10px] font-semibold flex items-center whitespace-nowrap shadow-sm">
                        HOOK_TYPOGRAPHY_01.aep
                      </div>
                      <div className="h-full px-2 rounded bg-[#FCEE0A]/15 border border-[#FCEE0A]/40 text-[#FCEE0A] text-[10px] flex items-center whitespace-nowrap">
                        LOWER_THIRD_HUD.mogrt
                      </div>
                      <div className="h-full px-2.5 rounded bg-[#FF007F]/25 border border-[#FF007F]/55 text-[#FF4DA6] text-[10px] flex items-center whitespace-nowrap">
                        CTA_END_SCREEN.mov
                      </div>
                    </div>
                  </div>

                  {/* V2: B-Roll & Dynamic Cuts */}
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-[#8A94B8] text-right text-[10px] flex-shrink-0 font-bold">V2 [CUTS]</span>
                    <div className="flex-1 h-7 rounded bg-[#0D0E1A] border border-[#00F0FF]/12 flex items-center p-1 gap-1.5 overflow-hidden">
                      <div className="h-full px-3 rounded bg-[#00F0FF]/20 border border-[#00F0FF]/50 text-[#00F0FF] text-[10px] font-semibold flex items-center whitespace-nowrap">
                        BROLL_DRONE_4K_60FPS.mp4
                      </div>
                      <div className="h-full px-3 rounded bg-[#9D4EDD]/25 border border-[#9D4EDD]/50 text-[#D8B4FE] text-[10px] flex items-center whitespace-nowrap">
                        ZOOM_TRANSITION_GLITCH.mov
                      </div>
                      <div className="h-full px-3 rounded bg-[#00F0FF]/20 border border-[#00F0FF]/50 text-[#00F0FF] text-[10px] flex items-center whitespace-nowrap">
                        PRODUCT_CINEMATIC_REEL.mov
                      </div>
                    </div>
                  </div>

                  {/* V1: A-Roll Talking Head */}
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-[#8A94B8] text-right text-[10px] flex-shrink-0 font-bold">V1 [MAIN]</span>
                    <div className="flex-1 h-7 rounded bg-[#0D0E1A] border border-[#00F0FF]/12 flex items-center p-1 gap-1 overflow-hidden">
                      <div className="h-full w-full rounded bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-[10px] font-semibold flex items-center px-3 justify-between">
                        <span>A_ROLL_INTERVIEW_CAM_A_LOG3.mp4</span>
                        <span className="text-[9px] text-indigo-300">PRORES 422 HQ</span>
                      </div>
                    </div>
                  </div>

                  {/* Audio Waveform Track A1 */}
                  <div className="flex items-center gap-2 pt-1 border-t border-white/[0.06]">
                    <span className="w-12 text-[#00F0FF] text-right text-[10px] flex-shrink-0 font-bold">A1 [VOX]</span>
                    <div className="flex-1 h-7 rounded bg-[#0D0E1A] border border-[#00F0FF]/12 flex items-center px-3 justify-between">
                      <div className="flex items-center gap-1.5 h-full py-1">
                        <span className="w-1 bg-[#00F0FF]/85 rounded animate-eq-1" />
                        <span className="w-1 bg-[#00F0FF]/85 rounded animate-eq-2" />
                        <span className="w-1 bg-[#00F0FF]/85 rounded animate-eq-3" />
                        <span className="w-1 bg-[#00F0FF]/85 rounded animate-eq-4" />
                        <span className="w-1 bg-[#00F0FF]/85 rounded animate-eq-2" />
                        <span className="text-[10px] text-[#00F0FF] ml-2">CLEAN_DIALOGUE_MASTER.wav</span>
                      </div>
                      <span className="text-[9px] text-[#00F0FF]/75 hidden sm:inline">-14 LUFS TARGET</span>
                    </div>
                  </div>

                  {/* Audio Sound Design Track A2 */}
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-[#FF007F] text-right text-[10px] flex-shrink-0 font-bold">A2 [SFX]</span>
                    <div className="flex-1 h-7 rounded bg-[#0D0E1A] border border-[#00F0FF]/12 flex items-center px-3 justify-between">
                      <div className="flex items-center gap-1.5 h-full py-1">
                        <span className="w-1 bg-[#FF007F]/85 rounded animate-eq-3" />
                        <span className="w-1 bg-[#FF007F]/85 rounded animate-eq-1" />
                        <span className="w-1 bg-[#FF007F]/85 rounded animate-eq-4" />
                        <span className="text-[10px] text-[#FF4DA6] ml-2">WHOOSH_RISER_SUBDROP_SFX.wav</span>
                      </div>
                      <span className="text-[9px] text-[#FF4DA6]/75 hidden sm:inline">STEREO 48kHz</span>
                    </div>
                  </div>

                  {/* Cyberpunk Animated Scrubber Track */}
                  <div className="pt-2 depth-layer-md">
                    <div className="relative h-2 bg-white/[0.08] rounded-full overflow-hidden">
                      <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00F0FF] via-[#9D4EDD] to-[#FF007F] animate-scrub shadow-[0_0_12px_#00F0FF]" />
                    </div>
                  </div>
                </div>
              </div>
            </Tilt3D>
          </div>
        </div>
      </section>

      {/* Marquee Ticker with Neon Glow */}
      <div className="overflow-hidden border-y border-[#00F0FF]/20 bg-[#090A14]/95 py-1">
        <div className="flex w-max animate-marquee">
          <div className="flex items-center flex-none">
            {tickerItems.map((item, idx) => (
              <React.Fragment key={idx}>
                <span className="font-mono text-xs sm:text-sm tracking-widest text-[#8A94B8] py-3 px-5 sm:px-6 whitespace-nowrap">
                  {item}
                </span>
                <span className="text-[#FF007F] text-xs px-1">◆</span>
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center flex-none" aria-hidden="true">
            {tickerItems.map((item, idx) => (
              <React.Fragment key={`dup-${idx}`}>
                <span className="font-mono text-xs sm:text-sm tracking-widest text-[#8A94B8] py-3 px-5 sm:px-6 whitespace-nowrap">
                  {item}
                </span>
                <span className="text-[#FF007F] text-xs px-1">◆</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
