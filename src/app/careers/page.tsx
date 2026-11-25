import React from 'react';
import { Metadata } from 'next';
import { EditorApplicationForm } from '@/components/forms/EditorApplicationForm';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  CheckCircle,
  Briefcase,
  Layers,
  GraduationCap,
  Clock,
  Shield,
  FileCheck,
  UserCheck,
  Award,
  Video,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Become an Editor | Join the Motion Creative Network',
  description:
    'Join Motion as a video editor. Work on client projects across YouTube, Reels, and brand campaigns. Clear briefs, internal onboarding, and project-based compensation.',
};

const whyJoinPerks = [
  {
    icon: Briefcase,
    title: 'Real Client Projects',
    description:
      'Work on genuine video campaigns for content creators, podcasts, and digital brands without spending hours pitching on gig marketplaces.',
  },
  {
    icon: Layers,
    title: 'Diverse Editing Styles',
    description:
      'Gain exposure to vertical short-form retention edits, long-form documentary storytelling, multi-cam talk shows, and brand marketing.',
  },
  {
    icon: Clock,
    title: 'Flexible Collaboration',
    description:
      'Project-based workflow tailored to your availability. You choose which assigned projects you have capacity to take on.',
  },
  {
    icon: FileCheck,
    title: 'Clear Project Briefs',
    description:
      'No vague client instructions. Our team defines reference edits, brand typography, assets, and milestones before you cut footage.',
  },
  {
    icon: Award,
    title: 'Constructive Senior Feedback',
    description:
      'Sharpen your craft with actionable editorial reviews from senior post-production leads on pacing, color balance, and sound mixing.',
  },
  {
    icon: GraduationCap,
    title: 'Internal Onboarding & Resources',
    description:
      'Selected editors receive access to internal onboarding documentation, workflow templates, and project guidelines to ensure success.',
  },
];

const collaborationSteps = [
  {
    step: '01',
    title: 'Submit Application',
    desc: 'Share your background, primary tools, and links to your best video edits.',
  },
  {
    step: '02',
    title: 'Portfolio Review',
    desc: 'Our senior team assesses your narrative pacing, cut choices, and technical polish.',
  },
  {
    step: '03',
    title: 'Selection & Onboarding',
    desc: 'Selected candidates are welcomed with our workflow guide and editorial guidelines.',
  },
  {
    step: '04',
    title: 'Evaluation & Orientation',
    desc: 'Internal orientation helps align on our quality standards and communication channels.',
  },
  {
    step: '05',
    title: 'Project Assignment',
    desc: 'As suitable client projects arise, you are matched based on your skills and availability.',
  },
  {
    step: '06',
    title: 'Editing & Quality Review',
    desc: 'You cut the footage according to the brief; our senior lead coordinates feedback.',
  },
  {
    step: '07',
    title: 'Project Compensation',
    desc: 'Prompt payment upon approval according to agreed project terms communicated upfront.',
  },
];

const editingTools = [
  'Adobe Premiere Pro',
  'DaVinci Resolve Studio',
  'Final Cut Pro',
  'Adobe After Effects',
  'CapCut Desktop / Pro',
];

export default function CareersPage() {
  return (
    <div className="py-12 sm:py-20 bg-background">
      <Container>
        {/* Page Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border shadow-sm">
            <UserCheck className="w-3.5 h-3.5 text-accent-cyan" />
            <span className="text-xs font-medium text-slate-300">
              Talent Recruitment & Onboarding
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Turn Your Editing Skills Into{' '}
            <span className="bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent">
              Real Opportunities.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Join the Motion editor network, collaborate on creative projects, and grow your skills while working with creators and brands.
          </p>

          <div className="pt-2">
            <Button href="#apply" variant="cyan" size="lg">
              <span>Apply to Join Motion</span>
              <Sparkles className="w-4 h-4 ml-1 text-slate-950" />
            </Button>
          </div>
        </div>

        {/* Section A: Why Join Motion? */}
        <div className="mb-24 pb-20 border-b border-border">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="purple" className="mb-3">Section A</Badge>
            <h2 className="text-3xl font-extrabold text-white">
              Why Join the Motion Network?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              We empower video editors to focus on what they do best—editing—without the administrative headaches of chasing invoices or deciphering chaotic client briefs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyJoinPerks.map((perk) => {
              const Icon = perk.icon;
              return (
                <div
                  key={perk.title}
                  className="p-6 rounded-2xl bg-surface border border-border space-y-3 hover:border-slate-500 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-border flex items-center justify-center text-accent-cyan">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {perk.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-surface/60 border border-border text-center max-w-2xl mx-auto text-xs text-slate-400">
            <span className="text-slate-200 font-semibold">Important Notice:</span>{' '}
            Project assignments are awarded on a project-to-project basis depending on client demand and demonstrated editing proficiency. We do not make false claims of guaranteed monthly retainers.
          </div>
        </div>

        {/* Section B: How Collaboration Works */}
        <div className="mb-24 pb-20 border-b border-border" id="process">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="cyan" className="mb-3">Section B</Badge>
            <h2 className="text-3xl font-extrabold text-white">
              How Editor Collaboration Works
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              A transparent, structured path from your initial application to approved client deliverables.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {collaborationSteps.map((stepItem) => (
              <div
                key={stepItem.step}
                className="p-4 rounded-xl bg-surface border border-border/80 flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs font-bold text-accent-cyan block mb-2">
                    STEP {stepItem.step}
                  </span>
                  <h4 className="text-xs font-bold text-white mb-1.5 leading-snug">
                    {stepItem.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {stepItem.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center text-xs text-slate-400">
            <p>
              * All project compensation, milestones, and revision terms are communicated and mutually accepted before you commit to any edit.
            </p>
          </div>
        </div>

        {/* Section C: Editor Requirements */}
        <div className="mb-24 pb-20 border-b border-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <Badge variant="purple">Section C</Badge>
              <h2 className="text-3xl font-extrabold text-white">
                What We Look For in an Editor
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                You do not need a decade of Hollywood experience, but you must take genuine pride in craftsmanship, visual storytelling, and respecting deadlines.
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-accent-cyan flex-shrink-0 mt-0.5" />
                  <span>Practical editing experience with a verifiable portfolio or work reel.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-accent-cyan flex-shrink-0 mt-0.5" />
                  <span>Strong sense of pacing, narrative flow, rhythm, and viewer engagement.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-accent-cyan flex-shrink-0 mt-0.5" />
                  <span>Familiarity with dialogue cleanup, sound design, and subtitle synchronization.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-accent-cyan flex-shrink-0 mt-0.5" />
                  <span>Reliable communication and commitment to agreed project milestones.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-accent-cyan flex-shrink-0 mt-0.5" />
                  <span>Openness to constructive feedback and revision adjustments.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-7 rounded-2xl bg-surface border border-border space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  Preferred Creative Toolchain
                </h3>
                <p className="text-xs text-slate-400">
                  We welcome editors proficient in any industry-standard NLE. Knowledge of multiple tools is a plus, but not mandatory:
                </p>

                <div className="flex flex-wrap gap-2.5">
                  {editingTools.map((tool) => (
                    <span
                      key={tool}
                      className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-border text-slate-200"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-border/60 text-xs text-slate-400">
                  <strong className="text-slate-200 block mb-1">
                    Internal Training Notice:
                  </strong>
                  Motion is an agency, not a course seller. Selected editors receive free internal onboarding guidelines, templates, and project-specific support. We never charge editors for training or materials.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section D: Editor Application Form */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-3">
            <Badge variant="cyan">Section D • Application Form</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Apply to Join Motion
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              Complete the form below with your portfolio links. Our team reviews submissions regularly and contacts shortlisted editors for an introductory discussion.
            </p>
          </div>

          <EditorApplicationForm />
        </div>
      </Container>
    </div>
  );
}
