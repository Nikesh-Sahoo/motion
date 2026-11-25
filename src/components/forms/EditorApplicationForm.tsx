'use client';

import React, { useState } from 'react';
import {
  editorApplicationSchema,
  EditorApplicationFormData,
  experienceLevelOptions,
  editingSoftwareOptions,
  preferredProjectTypeOptions,
  weeklyAvailabilityOptions,
} from '@/lib/validations/editor-application.schema';
import { siteConfig } from '@/lib/config';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Mail,
  UserCheck,
  RefreshCw,
} from 'lucide-react';

export function EditorApplicationForm() {
  const [formData, setFormData] = useState<Partial<EditorApplicationFormData>>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    experienceLevel: undefined,
    primarySoftware: undefined,
    portfolioUrl: '',
    sampleWorkUrl: '',
    preferredProjectType: undefined,
    weeklyAvailability: undefined,
    motivation: '',
    consentAgreed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] =
    useState<EditorApplicationFormData | null>(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const validationResult = editorApplicationSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);

      const firstErrorField = Object.keys(fieldErrors)[0];
      const el = document.getElementById(firstErrorField);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const validatedData = validationResult.data;

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmittedData(validatedData);
      setSubmitSuccess(true);
    } catch {
      setErrors({
        form: 'Submission preparation failed. Please email your application directly to our talent desk.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateMailtoUrl = (data: EditorApplicationFormData) => {
    const subject = encodeURIComponent(
      `[Editor Application] ${data.fullName} - ${data.experienceLevel} (${data.primarySoftware})`
    );
    const body = encodeURIComponent(
      `Applicant Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
Location: ${data.location}

Experience Level: ${data.experienceLevel}
Primary Software: ${data.primarySoftware}
Preferred Project Category: ${data.preferredProjectType}
Weekly Availability: ${data.weeklyAvailability}

Portfolio Link:
${data.portfolioUrl}

Secondary Work Link:
${data.sampleWorkUrl || 'N/A'}

Motivation & Why Motion:
${data.motivation}

Consent Confirmed: Yes, authorized to share portfolio samples.
`
    );
    return `mailto:${siteConfig.contact.email}?subject=${subject}&body=${body}`;
  };

  const copySummaryToClipboard = () => {
    if (!submittedData) return;
    const text = `Motion Editor Application:
Name: ${submittedData.fullName}
Email: ${submittedData.email}
Phone: ${submittedData.phone}
Location: ${submittedData.location}
Experience: ${submittedData.experienceLevel}
Software: ${submittedData.primarySoftware}
Portfolio: ${submittedData.portfolioUrl}
Categories: ${submittedData.preferredProjectType}
Availability: ${submittedData.weeklyAvailability}
Motivation: ${submittedData.motivation}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      location: '',
      experienceLevel: undefined,
      primarySoftware: undefined,
      portfolioUrl: '',
      sampleWorkUrl: '',
      preferredProjectType: undefined,
      weeklyAvailability: undefined,
      motivation: '',
      consentAgreed: false,
    });
    setErrors({});
    setSubmitSuccess(false);
    setSubmittedData(null);
  };

  if (submitSuccess && submittedData) {
    return (
      <div className="rounded-2xl bg-surface border border-accent-cyan/40 p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-accent-cyan flex items-center justify-center mx-auto">
          <UserCheck className="w-8 h-8" />
        </div>

        <div className="text-center space-y-2 max-w-lg mx-auto">
          <h3 className="text-2xl font-bold text-white">
            Application Package Formatted!
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Welcome, <span className="text-accent-cyan font-semibold">{submittedData.fullName}</span>. Your application details and portfolio links are ready. Click below to deliver your application directly to our talent recruitment inbox at <span className="text-slate-100 font-mono">{siteConfig.contact.email}</span>.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-border text-xs text-slate-300 space-y-2.5 font-mono max-h-56 overflow-y-auto">
          <div className="flex justify-between border-b border-border/60 pb-1.5">
            <span className="text-slate-500">Applicant:</span>
            <span className="text-white font-sans">{submittedData.fullName} ({submittedData.location})</span>
          </div>
          <div className="flex justify-between border-b border-border/60 pb-1.5">
            <span className="text-slate-500">Experience:</span>
            <span className="text-white font-sans">{submittedData.experienceLevel}</span>
          </div>
          <div className="flex justify-between border-b border-border/60 pb-1.5">
            <span className="text-slate-500">Primary Software:</span>
            <span className="text-accent-cyan font-sans">{submittedData.primarySoftware}</span>
          </div>
          <div className="flex justify-between border-b border-border/60 pb-1.5">
            <span className="text-slate-500">Focus:</span>
            <span className="text-white font-sans">{submittedData.preferredProjectType}</span>
          </div>
          <div className="pt-1">
            <span className="text-slate-500 block mb-1">Portfolio:</span>
            <a
              href={submittedData.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-cyan hover:underline truncate block"
            >
              {submittedData.portfolioUrl}
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <a
            href={generateMailtoUrl(submittedData)}
            className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-accent-cyan to-blue-600 hover:from-accent-cyan-light hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-glow-cyan transition-all"
          >
            <Mail className="w-4 h-4 text-slate-950" />
            <span>Send Application via Email</span>
            <ExternalLink className="w-4 h-4 ml-1 opacity-75" />
          </a>

          <button
            type="button"
            onClick={copySummaryToClipboard}
            className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-border flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>

        <div className="pt-4 border-t border-border/80 flex items-center justify-between text-xs text-slate-400">
          <span>Need to update details?</span>
          <button
            type="button"
            onClick={handleReset}
            className="text-accent-cyan hover:underline flex items-center gap-1 font-medium"
          >
            <RefreshCw className="w-3 h-3" />
            Edit Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      id="apply"
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl bg-surface border border-border p-6 sm:p-10 shadow-2xl space-y-6"
    >
      {errors.form && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 flex items-start gap-3 text-red-200 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <p>{errors.form}</p>
        </div>
      )}

      {/* Basic Personal Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-border/70 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-accent-cyan/20 text-accent-cyan flex items-center justify-center text-xs font-mono">
            01
          </span>
          Personal Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="fullName"
            name="fullName"
            label="Full Name"
            placeholder="e.g. Vikram Joshi"
            required
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
          />

          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="e.g. vikram.edit@example.com"
            required
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="phone"
            name="phone"
            type="tel"
            label="Phone / WhatsApp Number"
            placeholder="e.g. +91 98765 43210"
            required
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />

          <Input
            id="location"
            name="location"
            label="Current Location (City, Country)"
            placeholder="e.g. Mumbai, India"
            required
            value={formData.location}
            onChange={handleChange}
            error={errors.location}
          />
        </div>
      </div>

      {/* Editing Skills & Toolchain */}
      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-border/70 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-accent-purple/20 text-accent-purple-light flex items-center justify-center text-xs font-mono">
            02
          </span>
          Skills & Experience
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            id="experienceLevel"
            name="experienceLevel"
            label="Years of Video Editing Experience"
            required
            options={experienceLevelOptions}
            value={formData.experienceLevel || ''}
            onChange={handleChange}
            error={errors.experienceLevel}
            placeholder="Select experience level..."
          />

          <Select
            id="primarySoftware"
            name="primarySoftware"
            label="Primary Video Editing Tool"
            required
            options={editingSoftwareOptions}
            value={formData.primarySoftware || ''}
            onChange={handleChange}
            error={errors.primarySoftware}
            placeholder="Select software..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            id="preferredProjectType"
            name="preferredProjectType"
            label="Preferred Project Focus"
            required
            options={preferredProjectTypeOptions}
            value={formData.preferredProjectType || ''}
            onChange={handleChange}
            error={errors.preferredProjectType}
            placeholder="Select project category..."
          />

          <Select
            id="weeklyAvailability"
            name="weeklyAvailability"
            label="Estimated Weekly Availability"
            required
            options={weeklyAvailabilityOptions}
            value={formData.weeklyAvailability || ''}
            onChange={handleChange}
            error={errors.weeklyAvailability}
            placeholder="Select hours / week..."
          />
        </div>
      </div>

      {/* Portfolio Links & Motivation */}
      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-border/70 flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-accent-cyan/20 text-accent-cyan flex items-center justify-center text-xs font-mono">
            03
          </span>
          Portfolio & Motivation
        </h3>

        <Input
          id="portfolioUrl"
          name="portfolioUrl"
          label="Primary Portfolio URL (Google Drive / Behance / YouTube / Site)"
          placeholder="https://drive.google.com/drive/folders/... or portfolio website"
          required
          value={formData.portfolioUrl}
          onChange={handleChange}
          error={errors.portfolioUrl}
          helperText="Make sure Google Drive folders have permissions set to 'Anyone with the link can view'."
        />

        <Input
          id="sampleWorkUrl"
          name="sampleWorkUrl"
          label="Secondary Profile / Instagram / YouTube Work URL"
          placeholder="https://instagram.com/your_editor_handle (Optional)"
          value={formData.sampleWorkUrl}
          onChange={handleChange}
          error={errors.sampleWorkUrl}
        />

        <Textarea
          id="motivation"
          name="motivation"
          label="Why do you want to collaborate with Motion?"
          required
          rows={3}
          placeholder="Tell us about the kinds of creators or content styles you love editing, and what you hope to achieve with our team..."
          value={formData.motivation}
          onChange={handleChange}
          error={errors.motivation}
        />
      </div>

      {/* Verification Checkbox */}
      <div className="pt-4 border-t border-border/70 space-y-4">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            id="consentAgreed"
            name="consentAgreed"
            type="checkbox"
            checked={Boolean(formData.consentAgreed)}
            onChange={handleChange}
            className="mt-1 h-4 w-4 rounded border-border bg-slate-900 text-accent-cyan focus:ring-accent-cyan focus:ring-offset-background cursor-pointer"
          />
          <span className="text-xs text-slate-300 leading-relaxed">
            I confirm that I own or have permission to share all portfolio links, video edits, and personal contact details submitted above for the purpose of evaluation by Motion. <span className="text-accent-cyan">*</span>
          </span>
        </label>
        {errors.consentAgreed && (
          <p className="text-xs text-red-400 font-medium">{errors.consentAgreed}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2 space-y-3">
        <Button
          type="submit"
          variant="cyan"
          size="lg"
          isLoading={isSubmitting}
          className="w-full justify-center shadow-glow-cyan"
        >
          <UserCheck className="w-4 h-4 text-slate-950" />
          <span>Apply to Join Motion</span>
        </Button>

        <p className="text-center text-xs text-slate-400 leading-relaxed">
          Application submission initiates skill review. Acceptance is based on client demand, portfolio review, and quality standards. Selected editors receive internal onboarding resources.
        </p>
      </div>
    </form>
  );
}
