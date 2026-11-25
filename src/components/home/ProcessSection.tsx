import React from 'react';

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
    <section id="process" className="py-16 sm:py-24 bg-[#0B0B0D] scroll-mt-24 border-t border-[rgba(243,239,231,0.10)]">
      <div className="w-[min(74rem,calc(100%-2rem))] mx-auto">
        <div className="eyebrow">HOW IT WORKS</div>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#F3EFE7] uppercase leading-[1.02] mb-12 sm:mb-16">
          FROM FOOTAGE<br />TO FINAL CUT.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {processSteps.map((step, idx) => (
            <div
              key={step.scene}
              className="p-6 sm:p-7 rounded-2xl bg-[#15151B] border border-[rgba(243,239,231,0.10)] flex flex-col justify-between hover:border-[#FF6B35] transition-colors"
            >
              <div>
                <span className="font-mono text-xs text-[#FF6B35] tracking-widest block mb-4">
                  {step.scene}
                </span>

                <h3 className="font-display text-2xl text-[#F3EFE7] uppercase mb-2">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#97959F] leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[rgba(243,239,231,0.08)] font-mono text-[11px] text-[#97959F]">
                Phase 0{idx + 1} of 04
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
