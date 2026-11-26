'use client';

import React, { useState } from 'react';
import {
  contactFormSchema,
  ContactFormData,
  serviceTypeOptions,
  platformOptions,
  budgetRangeOptions,
  videoDurationOptions,
  videoQuantityOptions,
  deadlineOptions,
} from '@/lib/validations/contact.schema';
import { siteConfig } from '@/lib/config';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Mail,
  RefreshCw,
} from 'lucide-react';

export function ContactForm() {
  const [formData, setFormData] = useState<Partial<ContactFormData>>({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    serviceType: '',
    platform: '',
    approximateDuration: '',
    numberOfVideos: '',
    budgetRange: '',
    deadline: '',
    projectDescription: '',
    referenceVideoUrl: '',
    additionalRequirements: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<ContactFormData | null>(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

    const validationResult = contactFormSchema.safeParse(formData);

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
      // Submit inquiry data to MongoDB API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      const result = (await response.json()) as {
        success?: boolean;
        fieldErrors?: Record<string, string>;
        details?: string;
        error?: string;
        simulated?: boolean;
        message?: string;
      };

      if (!response.ok || !result.success) {
        if (result.fieldErrors) {
          setErrors(result.fieldErrors);
        } else {
          setErrors({
            form:
              result.details ||
              result.error ||
              'Failed to save inquiry. Please try again or email us directly.',
          });
        }
        return;
      }

      if (result.simulated) {
        setErrors({
          form:
            result.message ||
            'MongoDB is not configured yet; inquiry was not persisted.',
        });
        return;
      }

      setSubmittedData(validatedData);
      setSubmitSuccess(true);
    } catch (err: unknown) {
      console.error('Network submission error:', err);
      setErrors({
        form: 'An unexpected error occurred while submitting. Please try again or email us directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateMailtoUrl = (data: ContactFormData) => {
    const subject = encodeURIComponent(
      `[Motionxyne Project Enquiry] ${data.serviceType} - ${data.fullName}`
    );
    const body = encodeURIComponent(
      `Client Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone || 'N/A'}
Company / Brand: ${data.companyName || 'N/A'}

Service Required: ${data.serviceType}
Target Platform: ${data.platform}
Approximate Duration: ${data.approximateDuration}
Number of Videos: ${data.numberOfVideos}
Budget Range: ${data.budgetRange}
Target Deadline: ${data.deadline}

Project Description:
${data.projectDescription}

Reference Video URL:
${data.referenceVideoUrl || 'N/A'}

Additional Requirements:
${data.additionalRequirements || 'N/A'}
`
    );
    return `mailto:${siteConfig.contact.email}?subject=${subject}&body=${body}`;
  };

  const copySummaryToClipboard = () => {
    if (!submittedData) return;
    const text = `Motionxyne Project Enquiry:
Name: ${submittedData.fullName}
Email: ${submittedData.email}
Phone: ${submittedData.phone || 'N/A'}
Service: ${submittedData.serviceType}
Platform: ${submittedData.platform}
Duration: ${submittedData.approximateDuration}
Videos: ${submittedData.numberOfVideos}
Budget: ${submittedData.budgetRange}
Deadline: ${submittedData.deadline}
Description: ${submittedData.projectDescription}
Reference: ${submittedData.referenceVideoUrl || 'None'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      companyName: '',
      serviceType: '',
      platform: '',
      approximateDuration: '',
      numberOfVideos: '',
      budgetRange: '',
      deadline: '',
      projectDescription: '',
      referenceVideoUrl: '',
      additionalRequirements: '',
    });
    setErrors({});
    setSubmitSuccess(false);
    setSubmittedData(null);
  };

  if (submitSuccess && submittedData) {
    return (
      <div className="rounded-2xl bg-[#15151B] border border-[#FF6B35]/40 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="w-12 h-12 rounded-xl bg-[#19C3B8]/10 border border-[#19C3B8]/30 text-[#19C3B8] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <div className="text-center space-y-2 max-w-lg mx-auto">
          <h3 className="font-display text-2xl text-[#F3EFE7] uppercase">
            Inquiry Saved & Brief Ready!
          </h3>
          <p className="text-xs sm:text-sm text-[#97959F] leading-relaxed">
            Thank you, <span className="text-[#FF9933] font-semibold">{submittedData.fullName}</span>. Your project brief has been recorded in our database. Sayan will review your requirements and respond within 24–48 hours. You may also send an email copy directly below.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0B0B0D] border border-[rgba(243,239,231,0.10)] text-xs text-[#97959F] space-y-2 font-mono">
          <div className="flex justify-between border-b border-[rgba(243,239,231,0.06)] pb-1.5">
            <span>Service:</span>
            <span className="text-[#F3EFE7] font-sans">{submittedData.serviceType}</span>
          </div>
          <div className="flex justify-between border-b border-[rgba(243,239,231,0.06)] pb-1.5">
            <span>Platform:</span>
            <span className="text-[#F3EFE7] font-sans">{submittedData.platform}</span>
          </div>
          <div className="flex justify-between border-b border-[rgba(243,239,231,0.06)] pb-1.5">
            <span>Budget:</span>
            <span className="text-[#19C3B8] font-sans">{submittedData.budgetRange}</span>
          </div>
          <div className="flex justify-between border-b border-[rgba(243,239,231,0.06)] pb-1.5">
            <span>Deadline:</span>
            <span className="text-[#F3EFE7] font-sans">{submittedData.deadline}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <a
            href={generateMailtoUrl(submittedData)}
            className="w-full sm:flex-1 py-3 px-5 rounded-full bg-[#FF6B35] hover:bg-[#FF8859] text-[#0B0B0D] font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-glow-orange"
          >
            <Mail className="w-4 h-4" />
            <span>Send via Email Client</span>
            <ExternalLink className="w-4 h-4 ml-1 opacity-75" />
          </a>

          <button
            type="button"
            onClick={copySummaryToClipboard}
            className="w-full sm:w-auto py-3 px-5 rounded-full bg-[#1B1B22] hover:bg-[#252530] text-[#F3EFE7] text-sm font-medium border border-[rgba(243,239,231,0.10)] flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#19C3B8]" />
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

        <div className="pt-3 border-t border-[rgba(243,239,231,0.10)] flex items-center justify-between text-xs text-[#97959F]">
          <span>Need to submit another project?</span>
          <button
            type="button"
            onClick={handleReset}
            className="text-[#FF6B35] hover:underline flex items-center gap-1 font-medium"
          >
            <RefreshCw className="w-3 h-3" />
            Reset Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 text-left"
    >
      {errors.form && (
        <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/50 flex items-start gap-2.5 text-red-200 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
          <p>{errors.form}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="fullName"
          name="fullName"
          label="Your Name"
          placeholder="e.g. Sarah Mitchell"
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
          placeholder="e.g. sarah@example.com"
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
          placeholder="e.g. +91 98765 43210 (Optional)"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
        />

        <Input
          id="companyName"
          name="companyName"
          label="Channel / Brand Name"
          placeholder="e.g. @sarahvlogs or Mitchell Cafe"
          value={formData.companyName}
          onChange={handleChange}
          error={errors.companyName}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          id="serviceType"
          name="serviceType"
          label="Type of Content Needed"
          required
          options={serviceTypeOptions}
          value={formData.serviceType || ''}
          onChange={handleChange}
          error={errors.serviceType}
          placeholder="Select content type..."
        />

        <Select
          id="platform"
          name="platform"
          label="Primary Platform"
          required
          options={platformOptions}
          value={formData.platform || ''}
          onChange={handleChange}
          error={errors.platform}
          placeholder="Select platform..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          id="approximateDuration"
          name="approximateDuration"
          label="Video Duration"
          required
          options={videoDurationOptions}
          value={formData.approximateDuration || ''}
          onChange={handleChange}
          error={errors.approximateDuration}
          placeholder="Select duration..."
        />

        <Select
          id="numberOfVideos"
          name="numberOfVideos"
          label="Video Quantity"
          required
          options={videoQuantityOptions}
          value={formData.numberOfVideos || ''}
          onChange={handleChange}
          error={errors.numberOfVideos}
          placeholder="Select quantity..."
        />

        <Select
          id="budgetRange"
          name="budgetRange"
          label="Approximate Budget Range"
          required
          options={budgetRangeOptions}
          value={formData.budgetRange || ''}
          onChange={handleChange}
          error={errors.budgetRange}
          placeholder="Select budget range..."
        />

        <Select
          id="deadline"
          name="deadline"
          label="Target Urgency"
          required
          options={deadlineOptions}
          value={formData.deadline || ''}
          onChange={handleChange}
          error={errors.deadline}
          placeholder="Select deadline..."
        />
      </div>

      <Textarea
        id="projectDescription"
        name="projectDescription"
        label="Project Brief & Goals"
        required
        rows={3}
        placeholder="Tell Sayan about your footage, desired tone, pacing, references, or specific music/SFX vibes..."
        value={formData.projectDescription}
        onChange={handleChange}
        error={errors.projectDescription}
      />

      <Input
        id="referenceVideoUrl"
        name="referenceVideoUrl"
        label="Reference Video URL / Footage Drive Link"
        placeholder="https://youtube.com/watch?v=... or Google Drive link"
        value={formData.referenceVideoUrl}
        onChange={handleChange}
        error={errors.referenceVideoUrl}
        helperText="Link to a video whose style, humor, or pacing you want to emulate."
      />

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-full bg-[#FF6B35] text-[#0B0B0D] font-semibold text-sm sm:text-base hover:shadow-glow-orange transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Formatting Brief...' : 'Send Project Brief to Sayan'}</span>
        </button>
      </div>
    </form>
  );
}
