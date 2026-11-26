import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/lib/config';
import { FileText, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Motionxyne',
  description:
    'Terms and Conditions for using the Motionxyne website, submitting project enquiries, and requesting video post-production services.',
};

export default function TermsPage() {
  const lastUpdated = 'November 15, 2026';

  return (
    <div className="py-12 sm:py-20 bg-background">
      <Container size="narrow">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs text-slate-300">
            <FileText className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Service Framework</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Terms and Conditions
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Legal Review Banner */}
        <div className="mb-10 p-4 rounded-xl bg-surface border border-border/80 flex items-start gap-3 text-xs text-slate-300">
          <AlertCircle className="w-4 h-4 text-accent-cyan flex-shrink-0 mt-0.5" />
          <p>
            <strong className="text-white">Editorial Notice:</strong> These Terms and Conditions govern preliminary website usage, project quotation requests, and editor network applications. Individual project scopes, milestone deliverables, revision limits, and payment schedules are governed by separate project proposals and agreements.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, submitting an inquiry form, or applying as a video editor, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please refrain from using the site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Service Enquiries and Quotations</h2>
            <p>
              Submitting a project enquiry through our contact form does not create a binding service agreement. Quotations, turnaround times, and delivery milestones provided in response to enquiries are estimates based on the initial information supplied and become binding only upon mutual written confirmation and agreement on project scope.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Separate Project Agreements & Scope</h2>
            <p>
              Each video editing assignment undertaken by Motionxyne is governed by an agreed project statement of work, which explicitly defines:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400">
              <li>Raw footage inputs and delivery formats.</li>
              <li>Number of rounds of revisions included within the quote.</li>
              <li>Delivery timeline and milestone checkpoints.</li>
              <li>Commercial compensation and payment schedules.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Revisions and Feedback Policy</h2>
            <p>
              Revisions are limited to adjustments within the agreed project brief (such as pacing tweaks, audio balancing, or subtitle corrections). Requests requiring substantial narrative re-shoots, script re-writes, or changes outside the original brief may incur additional scoping fees, which will always be discussed with the client beforehand.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Content Ownership & Intellectual Property</h2>
            <p>
              Clients retain full ownership of all raw footage, proprietary graphics, and finished video deliverables upon completion of agreed payments. Motionxyne retains no ongoing copyright claim to completed client videos. Motionxyne may request written consent to feature non-confidential finished edits within its portfolio.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">6. Service Collaboration</h2>
            <p>
              Submitting an enquiry through our contact form initiates scope review. Project assignments are contingent on scheduling availability and adherence to quality standards.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">7. Non-Course Selling Policy</h2>
            <p>
              Motionxyne is a professional video editing service and not a course seller or vocational school. We do not sell courses or charge fees for training.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">8. Limitation of Liability</h2>
            <p>
              In no event shall Motionxyne, its founders, or contractors be liable for any indirect, incidental, or consequential damages resulting from website downtime, delays resulting from incomplete client raw assets, or external platform copyright actions on client-provided third-party media.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">9. Contact & Inquiries</h2>
            <p>
              For legal inquiries regarding these terms or project agreements, please contact:
            </p>
            <div className="p-4 rounded-xl bg-surface border border-border font-mono text-xs text-accent-cyan">
              Email: {siteConfig.contact.email}
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
