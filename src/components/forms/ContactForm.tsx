'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  contactFormSchema,
  ContactFormData,
  parseBudgetAmount,
  type PaymentMode,
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
  QrCode,
  ShieldCheck,
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
    paymentMode: 'none',
    totalProjectAmount: 500,
    paidAmount: 0,
    utrReference: '',
    paymentConfirmed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<ContactFormData | null>(null);
  const [copied, setCopied] = useState(false);

  const selectPaymentMode = (mode: PaymentMode, budgetVal?: string) => {
    const budgetStr = budgetVal ?? formData.budgetRange ?? '';
    const baseTotal = parseBudgetAmount(budgetStr);
    const nextPaid =
      mode === 'full' ? baseTotal : mode === 'partial' ? Math.max(100, Math.round(baseTotal * 0.5)) : 0;

    setFormData((prev) => ({
      ...prev,
      paymentMode: mode,
      totalProjectAmount: baseTotal,
      paidAmount: nextPaid,
      utrReference: mode === 'none' ? '' : prev.utrReference || '',
      paymentConfirmed: mode === 'none' ? false : Boolean(prev.paymentConfirmed),
    }));

    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.paidAmount;
      delete updated.utrReference;
      delete updated.paymentConfirmed;
      return updated;
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'budgetRange') {
      const parsed = parseBudgetAmount(value);
      setFormData((prev) => {
        const mode = prev.paymentMode || 'none';
        const nextPaid =
          mode === 'full'
            ? parsed
            : mode === 'partial'
            ? Math.max(100, Math.round(parsed * 0.5))
            : 0;
        return {
          ...prev,
          budgetRange: value,
          totalProjectAmount: parsed,
          paidAmount: mode === 'none' ? 0 : nextPaid,
        };
      });
    } else if (name === 'totalProjectAmount') {
      const numTotal = Math.max(0, Number(value) || 0);
      setFormData((prev) => ({
        ...prev,
        totalProjectAmount: numTotal,
        paidAmount:
          prev.paymentMode === 'full'
            ? numTotal
            : prev.paymentMode === 'partial'
            ? Math.min(numTotal, Math.max(100, Math.round(numTotal * 0.5)))
            : 0,
      }));
    } else if (name === 'paidAmount') {
      setFormData((prev) => ({ ...prev, paidAmount: Math.max(0, Number(value) || 0) }));
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
Payment Mode: ${data.paymentMode || 'none'}
Paid Now: ₹${data.paymentMode !== 'none' ? data.paidAmount || 0 : 0}${data.utrReference ? ` (UTR: ${data.utrReference})` : ''}

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
Payment: ${submittedData.paymentMode !== 'none' ? `${submittedData.paymentMode} - ₹${submittedData.paidAmount} (UTR: ${submittedData.utrReference || 'N/A'})` : 'Pay After Quote'}
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
      paymentMode: 'none',
      totalProjectAmount: 500,
      paidAmount: 0,
      utrReference: '',
      paymentConfirmed: false,
    });
    setErrors({});
    setSubmitSuccess(false);
    setSubmittedData(null);
  };

  if (submitSuccess && submittedData) {
    const paidNow =
      submittedData.paymentMode !== 'none' ? Number(submittedData.paidAmount || 0) : 0;
    const totalAmt = Number(
      submittedData.totalProjectAmount || parseBudgetAmount(submittedData.budgetRange)
    );
    const remainingAmt = Math.max(0, totalAmt - paidNow);

    return (
      <div className="rounded-2xl bg-[#0D0E1A] border border-[#00F0FF]/45 p-6 sm:p-8 shadow-[0_0_40px_rgba(0,240,255,0.15)] space-y-6">
        <div className="w-12 h-12 rounded-xl bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <div className="text-center space-y-2 max-w-lg mx-auto">
          <h3 className="font-display text-2xl text-[#F4F6FF] uppercase">
            {paidNow > 0 ? 'Inquiry & UTR Submitted!' : 'Inquiry Saved & Brief Ready!'}
          </h3>
          <p className="text-xs sm:text-sm text-[#8A94B8] leading-relaxed">
            Thank you, <span className="text-[#FF007F] font-semibold">{submittedData.fullName}</span>.{' '}
            {paidNow > 0
              ? 'Your brief and UPI UTR reference have been queued for payment verification. Once our team verifies the actual ₹ received against your UTR, your confirmed paid and remaining balance will update.'
              : 'Your project brief has been recorded in our database. Sayan will review your requirements and respond within 24–48 hours.'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#05050A] border border-[#00F0FF]/20 text-xs text-[#8A94B8] space-y-2 font-mono">
          <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
            <span>Service:</span>
            <span className="text-[#F4F6FF] font-sans">{submittedData.serviceType}</span>
          </div>
          <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
            <span>Platform:</span>
            <span className="text-[#F4F6FF] font-sans">{submittedData.platform}</span>
          </div>
          <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
            <span>Budget:</span>
            <span className="text-[#00F0FF] font-sans">{submittedData.budgetRange}</span>
          </div>
          <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
            <span>Deadline:</span>
            <span className="text-[#F4F6FF] font-sans">{submittedData.deadline}</span>
          </div>
          {paidNow > 0 && (
            <>
              <div className="flex justify-between border-b border-white/[0.06] pb-1.5">
                <span>Payment Claim ({submittedData.paymentMode?.toUpperCase()}):</span>
                <span className="text-amber-300 font-semibold">₹{paidNow} Pending Verification (UTR: {submittedData.utrReference})</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Balance After Verification:</span>
                <span className="text-[#00F0FF] font-semibold">₹{remainingAmt}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <a
            href={generateMailtoUrl(submittedData)}
            className="w-full sm:flex-1 py-3 px-5 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF007F] text-[#05050A] font-bold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_25px_rgba(0,240,255,0.55)]"
          >
            <Mail className="w-4 h-4" />
            <span>Send via Email Client</span>
            <ExternalLink className="w-4 h-4 ml-1 opacity-75" />
          </a>

          <button
            type="button"
            onClick={copySummaryToClipboard}
            className="w-full sm:w-auto py-3 px-5 rounded-full bg-[#141528] hover:bg-[#1C1E38] text-[#F4F6FF] text-sm font-medium border border-[#00F0FF]/25 flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#00F0FF]" />
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

        <div className="pt-3 border-t border-[#00F0FF]/15 flex items-center justify-between text-xs text-[#8A94B8]">
          <span>Need to submit another project?</span>
          <button
            type="button"
            onClick={handleReset}
            className="text-[#00F0FF] hover:underline flex items-center gap-1 font-medium"
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      {/* Approximate Budget Range starting from ₹500 + manual entry */}
      <div className="space-y-2.5">
        <Input
          id="budgetRange"
          name="budgetRange"
          label="Approximate Budget (Starting ₹500 — Select Preset or Enter Manually)"
          required
          placeholder="e.g. ₹500, ₹1,200, or choose a preset below"
          value={formData.budgetRange || ''}
          onChange={handleChange}
          error={errors.budgetRange}
          helperText="Minimum budget starts at ₹500. Type any custom amount or click a quick preset."
        />
        <div className="flex flex-wrap gap-2">
          {budgetRangeOptions.map((preset) => {
            const active = formData.budgetRange === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  const parsed = parseBudgetAmount(preset);
                  setFormData((prev) => {
                    const mode = prev.paymentMode || 'none';
                    const nextPaid =
                      mode === 'full'
                        ? parsed
                        : mode === 'partial'
                        ? Math.max(100, Math.round(parsed * 0.5))
                        : 0;
                    return {
                      ...prev,
                      budgetRange: preset,
                      totalProjectAmount: parsed,
                      paidAmount: mode === 'none' ? 0 : nextPaid,
                    };
                  });
                  if (errors.budgetRange) {
                    setErrors((prev) => {
                      const updated = { ...prev };
                      delete updated.budgetRange;
                      return updated;
                    });
                  }
                }}
                className={`px-3 py-1 rounded-full font-mono text-[11px] border transition-all ${
                  active
                    ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                    : 'bg-[#060710] border-[#00F0FF]/20 text-[#8A94B8] hover:border-[#FF007F]/60 hover:text-[#F4F6FF]'
                }`}
              >
                {preset}
              </button>
            );
          })}
        </div>
      </div>

      {/* Partial or Full Payment via Attached UPI QR */}
      {Boolean(formData.budgetRange && formData.budgetRange.trim().length > 0) && (
        <div className="rounded-2xl bg-[#060710] border border-[#00F0FF]/30 p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-[#00F0FF]" />
              <span className="font-mono text-xs uppercase tracking-wider text-[#F4F6FF] font-semibold">
                Payment Option (Partial Advance or Full Payment)
              </span>
            </div>
            <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-[#FF007F]/15 text-[#FF4DA6] border border-[#FF007F]/35">
              UTR ADMIN VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {(
              [
                { id: 'none', title: 'Pay After Quote', sub: 'Submit brief first' },
                { id: 'partial', title: 'Partial Advance', sub: 'Pay 50% or custom now' },
                { id: 'full', title: 'Full Payment', sub: 'Pay 100% upfront' },
              ] as const
            ).map((opt) => {
              const selected = (formData.paymentMode || 'none') === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => selectPaymentMode(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selected
                      ? 'bg-[#00F0FF]/15 border-[#00F0FF] text-[#F4F6FF] shadow-[0_0_16px_rgba(0,240,255,0.2)]'
                      : 'bg-[#0D0E1A] border-white/[0.08] text-[#8A94B8] hover:border-[#00F0FF]/40'
                  }`}
                >
                  <div className="text-xs font-bold">{opt.title}</div>
                  <div className="font-mono text-[10px] opacity-80 mt-0.5">{opt.sub}</div>
                </button>
              );
            })}
          </div>

          {(formData.paymentMode === 'partial' || formData.paymentMode === 'full') && (
            <div className="pt-3 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-5 flex flex-col items-center">
                <div className="bg-[#0A0D15] p-2 rounded-2xl shadow-[0_0_25px_rgba(0,240,255,0.2)] border-2 border-[#00F0FF]/60 w-52 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/payment-qr.jpg"
                    alt="Sayan Sahu PhonePe UPI Payment QR Code"
                    width={220}
                    height={280}
                    className="w-full h-auto object-contain rounded-xl"
                  />
                </div>
                <span className="font-mono text-[10px] text-[#00F0FF] uppercase tracking-wider mt-2 text-center">
                  Scan via PhonePe / GPay / Paytm / Any UPI
                </span>
              </div>

              <div className="md:col-span-7 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    id="totalProjectAmount"
                    name="totalProjectAmount"
                    type="number"
                    min="500"
                    label="Agreed / Total Budget (₹)"
                    value={String(formData.totalProjectAmount ?? 500)}
                    onChange={handleChange}
                  />
                  <Input
                    id="paidAmount"
                    name="paidAmount"
                    type="number"
                    min="100"
                    label={
                      formData.paymentMode === 'full'
                        ? 'Full Amount Paying Now (₹)'
                        : 'Partial Amount Paying Now (₹)'
                    }
                    required
                    readOnly={formData.paymentMode === 'full'}
                    value={String(formData.paidAmount ?? 0)}
                    onChange={handleChange}
                    error={errors.paidAmount}
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-[#0D0E1A] border border-white/[0.08] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#8A94B8]">Remaining Balance:</span>
                  <span className="text-[#FF007F] font-bold">
                    ₹
                    {Math.max(
                      0,
                      Number(formData.totalProjectAmount || 0) -
                        Number(formData.paidAmount || 0)
                    )}
                  </span>
                </div>

                <Input
                  id="utrReference"
                  name="utrReference"
                  label="UPI Transaction ID / UTR Reference"
                  required
                  placeholder="e.g. 432198765432"
                  value={formData.utrReference || ''}
                  onChange={handleChange}
                  error={errors.utrReference}
                />

                <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
                  <input
                    id="paymentConfirmed"
                    name="paymentConfirmed"
                    type="checkbox"
                    checked={Boolean(formData.paymentConfirmed)}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 rounded border-[#00F0FF]/40 bg-[#0D0E1A] text-[#00F0FF]"
                  />
                  <span className="text-xs text-[#D5DCF5] leading-relaxed flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00F0FF] flex-shrink-0" />
                    <span>
                      I confirm I have completed the ₹{formData.paidAmount || 0} UPI payment using the QR code above.
                    </span>
                  </span>
                </label>
                {errors.paymentConfirmed && (
                  <p className="text-xs text-red-400 font-medium">{errors.paymentConfirmed}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <Textarea
        id="projectDescription"
        name="projectDescription"
        label="Project Brief & Goals"
        required
        rows={3}
        placeholder="Tell Sayan about your footage, desired tone, pacing, self-reference style, or specific music/SFX vibes..."
        value={formData.projectDescription}
        onChange={handleChange}
        error={errors.projectDescription}
      />

      <Input
        id="referenceVideoUrl"
        name="referenceVideoUrl"
        label="Self-Reference Video URL / Footage Drive Link"
        placeholder="https://youtube.com/watch?v=... or Instagram/Drive self-reference link"
        value={formData.referenceVideoUrl}
        onChange={handleChange}
        error={errors.referenceVideoUrl}
        helperText="Self Reference Service available: paste any reference edit URL whose pacing, cuts, or vibe you want matched."
      />

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF007F] text-[#05050A] font-bold text-sm sm:text-base hover:shadow-[0_0_28px_rgba(0,240,255,0.55)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Formatting Brief...' : 'Send Project Brief to Sayan'}</span>
        </button>
      </div>
    </form>
  );
}
