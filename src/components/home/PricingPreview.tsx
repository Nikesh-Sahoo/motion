import React from 'react';
import { ArrowRight, Check, Sparkles, HelpCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const pricingFactors = [
  'Target video duration & aspect ratios',
  'Total raw footage hours provided',
  'Motion graphics, subtitles & visual effects level',
  'Audio cleanup & multi-track sound design scope',
  'Turnaround urgency & delivery timeline',
  'Single video vs recurring monthly batch volume',
];

const pricingModels = [
  {
    title: 'Single Project',
    tagline: 'Ideal for individual video launches, pilot episodes, or one-off campaign videos.',
    badge: 'Flexible',
    badgeVariant: 'neutral' as const,
    features: [
      'Dedicated editor matched to project format',
      'Initial rough cut + revisions pass included',
      'Platform export (1080p / 4K)',
      'Custom subtitle / caption options',
      'Milestone-based delivery timeline',
    ],
    ctaLabel: 'Request a Quote',
    ctaVariant: 'secondary' as const,
  },
  {
    title: 'Monthly Content',
    tagline: 'For active YouTubers, podcasters, and brands needing consistent weekly output.',
    badge: 'Most Popular',
    badgeVariant: 'purple' as const,
    isFeatured: true,
    features: [
      'Predictable recurring video editing pipeline',
      'Priority turnaround queue',
      'Dedicated lead editor for brand consistency',
      'Batch asset management & style guide',
      'Flexible rollover of unused project hours',
    ],
    ctaLabel: 'Discuss a Monthly Plan',
    ctaVariant: 'primary' as const,
  },
  {
    title: 'Custom Production',
    tagline: 'For comprehensive brand films, complex motion graphics, or high-volume enterprise campaigns.',
    badge: 'Enterprise',
    badgeVariant: 'cyan' as const,
    features: [
      'Multi-disciplinary editing team',
      'Advanced 2D/3D motion graphics & color suite',
      'Full audio restoration & stem mastering',
      'Custom NDA & enterprise licensing agreements',
      'Direct communication channel with lead editor',
    ],
    ctaLabel: 'Contact Our Team',
    ctaVariant: 'secondary' as const,
  },
];

export function PricingPreview() {
  return (
    <section className="py-20 md:py-28 bg-background relative" id="pricing">
      <Container>
        <SectionHeading
          badge="Transparent Approach"
          badgeVariant="purple"
          title="Straightforward Pricing. Tailored to Your Needs."
          subtitle="Because video editing scope varies drastically by footage volume, pacing, and graphic density, we provide upfront tailored proposals rather than rigid one-size-fits-all package rates."
        />

        {/* Pricing Factors Box */}
        <div className="mb-14 p-6 sm:p-7 rounded-2xl bg-surface/70 border border-border max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-3 text-slate-200 font-semibold text-sm">
            <HelpCircle className="w-4 h-4 text-accent-cyan" />
            <span>How We Calculate Your Quotation</span>
          </div>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Every project quotation is assessed transparently based on key objective variables:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {pricingFactors.map((factor, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-border/50"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan flex-shrink-0" />
                <span className="truncate">{factor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Three Pricing Approaches */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pricingModels.map((model) => (
            <div
              key={model.title}
              className={`rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                model.isFeatured
                  ? 'bg-gradient-to-b from-slate-900 to-surface border-2 border-accent-purple shadow-glow-purple'
                  : 'bg-surface border border-border hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{model.title}</h3>
                  <Badge variant={model.badgeVariant} size="sm">
                    {model.badge}
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 mb-6 min-h-[40px] leading-relaxed">
                  {model.tagline}
                </p>

                <div className="py-4 border-y border-border/70 mb-6">
                  <span className="text-xs font-mono uppercase tracking-wider text-accent-cyan font-semibold block mb-1">
                    Custom Quote Basis
                  </span>
                  <span className="text-sm text-slate-300">
                    Calculated after reviewing footage & style brief
                  </span>
                </div>

                <div className="space-y-3 mb-8">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    What&apos;s Included:
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    {model.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-accent-cyan flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <Button
                  href="/contact"
                  variant={model.ctaVariant}
                  size="md"
                  className="w-full justify-center"
                >
                  <span>{model.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          <p>
            Every project is different. Share your requirements and receive a detailed quotation based on your specific needs within 24 business hours.
          </p>
        </div>
      </Container>
    </section>
  );
}
