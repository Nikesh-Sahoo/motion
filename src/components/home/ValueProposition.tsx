import React from 'react';
import { BookOpen, MonitorPlay, CheckSquare, MessageSquare } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

const valueProps = [
  {
    icon: BookOpen,
    title: 'Creative Storytelling',
    description:
      'We do not simply cut clips; we identify narrative pacing, emotional hooks, and viewer retention drivers to transform ordinary footage into engaging stories.',
    accent: 'purple',
  },
  {
    icon: MonitorPlay,
    title: 'Platform-Ready Content',
    description:
      'Every video is exported with precise aspect ratios, bitrates, safe-margin titles, and platform-specific audio standards for YouTube, Reels, TikTok, or LinkedIn.',
    accent: 'cyan',
  },
  {
    icon: CheckSquare,
    title: 'Consistent Quality',
    description:
      'Every project goes through structured editing followed by internal quality review before delivery, ensuring color, audio, and typography match your standards.',
    accent: 'purple',
  },
  {
    icon: MessageSquare,
    title: 'Reliable Collaboration',
    description:
      'Transparent milestones, clear project scoping, organized asset handoffs, and feedback loops make working with Motionxyne predictable and stress-free.',
    accent: 'cyan',
  },
];

export function ValueProposition() {
  return (
    <section className="py-20 bg-background-alt border-y border-border relative">
      <Container>
        <SectionHeading
          badge="Our Core Principles"
          badgeVariant="purple"
          title="More Than Just Video Editing."
          subtitle="A disciplined creative process dedicated to making your content watchable, platform-native, and strategically impactful."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((prop, idx) => {
            const Icon = prop.icon;
            const isPurple = prop.accent === 'purple';

            return (
              <div
                key={prop.title}
                className="group relative p-6 sm:p-7 rounded-2xl bg-surface border border-border hover:border-slate-600 transition-all duration-300 hover:shadow-card-hover flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105 ${
                      isPurple
                        ? 'bg-accent-purple/10 border border-accent-purple/30 text-accent-purple-light'
                        : 'bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">
                    Phase 0{idx + 1}
                  </span>

                  <h3 className="text-lg font-bold text-white mt-1 mb-2.5">
                    {prop.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {prop.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-border/60 flex items-center justify-between text-xs text-slate-500">
                  <span>Professional Scope</span>
                  <span className="text-slate-300 font-mono">0{idx + 1} / 04</span>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
