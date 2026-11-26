import React from 'react';
import { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/lib/config';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Motionxyne',
  description:
    'Privacy Policy for Motionxyne. Explains how client project enquiries and communication data are collected, used, and safeguarded.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'November 15, 2026';

  return (
    <div className="py-12 sm:py-20 bg-background">
      <Container size="narrow">
        {/* Header */}
        <div className="mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Data Transparency</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Legal Review Note Alert */}
        <div className="mb-10 p-4 rounded-xl bg-surface border border-border/80 flex items-start gap-3 text-xs text-slate-300">
          <AlertCircle className="w-4 h-4 text-accent-cyan flex-shrink-0 mt-0.5" />
          <p>
            <strong className="text-white">Notice for Users and Counsel:</strong> This starter privacy policy outlines our preliminary data collection practices for marketing enquiries and editor recruitment. Formal legal review should be conducted prior to commercial high-volume transaction processing.
          </p>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-10 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Overview</h2>
            <p>
              Motionxyne (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) operates the website at{' '}
              <span className="text-accent-cyan font-mono">{siteConfig.url}</span>. This Privacy Policy informs visitors and users regarding our policies with the collection, use, and disclosure of personal data when using our website and contacting our agency.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Information We Collect</h2>
            <p>We collect information voluntarily submitted through two primary channels:</p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-slate-400">
              <li>
                <strong className="text-slate-200">Client Project Inquiries:</strong> Full name, email address, phone number (optional), company or brand name, video preferences, approximate budget range, target deadline, project brief, and reference links.
              </li>
              <li>
                <strong className="text-slate-200">Editor Applications:</strong> Full name, email address, phone number, location, editing tool experience, portfolio URL, sample video links, and availability details.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. How Your Information Is Used</h2>
            <p>Collected data is used strictly for legitimate business operations:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400">
              <li>To evaluate project scopes and deliver accurate commercial quotations.</li>
              <li>To contact potential clients to discuss creative editing requirements.</li>
              <li>To assess editor candidate portfolios for collaboration opportunities.</li>
              <li>To coordinate internal project onboarding and editorial review.</li>
            </ul>
            <p>
              We do not sell, rent, or trade your personal information or submitted video materials to data brokers or advertising networks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Data Sharing and Disclosure</h2>
            <p>
              Information is only shared on a strict need-to-know basis:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400">
              <li>
                <strong className="text-slate-200">Assigned Video Editors:</strong> Approved project briefs and client-supplied footage links are shared only with the video editor assigned to execute your project under confidentiality obligations.
              </li>
              <li>
                <strong className="text-slate-200">Hosting & Infrastructure:</strong> Technical hosting providers (e.g. Vercel) that transmit and host web traffic in accordance with standard internet infrastructure protocols.
              </li>
              <li>
                <strong className="text-slate-200">Legal Compliance:</strong> If required by law, subpoena, or governmental authority.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Video Footage and Intellectual Property</h2>
            <p>
              Client footage provided via cloud storage links (e.g., Google Drive, Dropbox, Frame.io) remains the exclusive property of the client. Motionxyne does not use raw footage for external promotional purposes without written consent.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">6. Data Retention and Security</h2>
            <p>
              We retain contact inquiries for reasonable operational periods to facilitate continued collaboration or re-engagement. We implement industry-standard encryption in transit (HTTPS) and restrict access to internal project files.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">7. Your Rights and Inquiries</h2>
            <p>
              You have the right to request access to, correction of, or deletion of your personal data submitted to Motionxyne. For any privacy-related questions or deletion requests, please contact us at:
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
