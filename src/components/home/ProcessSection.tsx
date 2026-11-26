'use client';

import React from 'react';
import { Tilt3D } from '@/components/ui/Tilt3D';

const processSteps = [
  {
    scene: 'SCENE 01',
    title: 'Strategy',
    desc: 'We define the goal, platform, audience, references, deadline, and what the video should make viewers do.',
  },
  {
    scene: 'SCENE 02',
    title: 'Story',
    desc: 'I shape the strongest hook, select the useful footage, and build a clear viewing path before polishing.',
  },
  {
    scene: 'SCENE 03',
    title: 'Execution',
    desc: 'The edit gets pacing, captions, sound design, color, motion graphics, and platform-specific formatting.',
  },
  {
    scene: 'SCENE 04',
    title: 'Impact',
    desc: 'You receive final exports plus revisions, thumbnails or cutdowns if included in the project scope.',
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="py-16 sm:py-24 bg-[#0B0B0D] scroll-mt-24 border-t border-white/[0.08]">
      <div className="w-[min(76rem,calc(100%-2rem))] mx-auto">
        <div className="eyebrow flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#19C3B8] inline-block animate-pulse" />
          <span>PRODUCTION PIPELINE</span>
          <span>🇮🇳</span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F3EFE7] uppercase leading-[1.02] mb-12 sm:mb-16">
          FROM RAW FOOTAGE<br />
          <span className="bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] bg-clip-text text-transparent">
            TO VIRAL MASTER CUT.
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 perspective-stage">
          {processSteps.map((step, idx) => (
            <Tilt3D
              key={step.scene}
              maxTilt={8}
              scale={1.025}
              glareColor="rgba(25, 195, 184, 0.15)"
              className="rounded-2xl h-full"
            >
              <div
                className="h-full p-6 sm:p-7 rounded-2xl bg-[#14141B]/90 backdrop-blur-xl border border-white/[0.08] hover:border-[#19C3B8]/60 shadow-[0_14px_34px_rgba(0,0,0,0.55)] hover:shadow-[0_22px_48px_rgba(25,195,184,0.18)] flex flex-col justify-between transition-all duration-300 group relative preserve-3d"
              >
                <div className="preserve-3d">
                  <div className="flex items-center justify-between mb-4 depth-layer-sm">
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-[#19C3B8]/15 text-[#19C3B8] border border-[#19C3B8]/30 tracking-widest font-semibold">
                      {step.scene}
                    </span>
                    <span className="font-mono text-xs text-[#97959F]">0{idx + 1}/04</span>
                  </div>

                  <h3 className="font-display text-2xl text-[#F3EFE7] uppercase mb-2 group-hover:text-white transition-colors depth-layer-md">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#97959F] leading-relaxed depth-layer-sm">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.08] font-mono text-[10px] text-[#FF9933] uppercase tracking-wider flex items-center justify-between depth-layer-sm">
                  <span>STAGE VERIFIED</span>
                  <span>✓</span>
                </div>
              </div>
            </Tilt3D>
          ))}
        </div>
      </div>
    </section>
  );
}
