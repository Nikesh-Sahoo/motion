import { z } from 'zod';

export const serviceTypeOptions = [
  'Vlog Edits',
  'Instagram & TikTok Reel Edit',
  'YouTube Shorts & Long Video Edit',
  'Motion Graphics Edit',
  'App Promotion Editing',
  'Brand Promotion Edit',
  'Product Promotion Edit',
  'Cinematic Video Edit',
  'Titlecard Video Edit',
  'Premium Photo Edit',
  'Self Reference Service (Custom Reference Style)',
  'Other',
] as const;

export const platformOptions = [
  'YouTube',
  'Instagram',
  'TikTok',
  'LinkedIn',
  'App Store / Play Store',
  'Website / Brand Channel',
  'Multiple Platforms',
  'Other',
] as const;

export const budgetRangeOptions = [
  '₹500',
  '₹500 – ₹1,500',
  '₹1,500 – ₹5,000',
  '₹5,000 – ₹15,000',
  '₹15,000 – ₹35,000',
  'Above ₹35,000',
] as const;

export const videoDurationOptions = [
  'Under 60 seconds (Shorts / Reels / TikTok)',
  '1 to 5 minutes',
  '5 to 15 minutes',
  '15 to 30 minutes',
  'Over 30 minutes',
  'Multiple formats / Batch',
] as const;

export const videoQuantityOptions = [
  'Single video (One-off project)',
  '2 to 4 videos',
  '5 to 10 videos',
  '10+ videos (Monthly batch)',
  'Ongoing weekly / monthly retainer',
] as const;

export const deadlineOptions = [
  'Within 24 to 48 hours (Urgent)',
  'Within 48 to 72 hours (Standard)',
  'Within 1 to 2 weeks',
  'Flexible timeline',
] as const;

export function parseBudgetAmount(budgetRange: string): number {
  const match = budgetRange.replace(/,/g, '').match(/\d+(\.\d+)?/);
  if (!match) return 500;
  const parsed = Math.round(Number(match[0]));
  return Number.isFinite(parsed) && parsed >= 500 ? parsed : 500;
}

export function normalizeUtrReference(utr: string): string {
  return utr.trim().replace(/\s+/g, '').toUpperCase();
}

export const paymentModeValues = ['none', 'partial', 'full'] as const;
export type PaymentMode = (typeof paymentModeValues)[number];

export const contactFormSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: 'Full name must be at least 2 characters.' })
      .max(100, { message: 'Full name cannot exceed 100 characters.' }),
    email: z
      .string()
      .email({ message: 'Please enter a valid email address.' }),
    phone: z
      .string()
      .optional()
      .refine((val) => !val || /^[\d\s+\-()]{7,20}$/.test(val), {
        message: 'Please provide a valid phone number or leave it blank.',
      }),
    companyName: z.string().max(100).optional(),
    serviceType: z.string().min(1, { message: 'Please select a service type.' }),
    platform: z.string().min(1, { message: 'Please select a primary platform.' }),
    approximateDuration: z.string().min(1, { message: 'Please select an approximate video duration.' }),
    numberOfVideos: z.string().min(1, { message: 'Please select the number of videos needed.' }),
    budgetRange: z
      .string()
      .trim()
      .min(1, { message: 'Please select or enter your budget (starting from ₹500).' })
      .refine(
        (val) => {
          const cleaned = val.replace(/[₹,\s]/g, '');
          if (/^\d+(\.\d+)?$/.test(cleaned)) {
            return Number(cleaned) >= 500;
          }
          return true;
        },
        { message: 'Minimum budget starts from ₹500.' }
      ),
    deadline: z.string().min(1, { message: 'Please select your target deadline.' }),
    projectDescription: z
      .string()
      .min(10, { message: 'Please describe your project (minimum 10 characters).' })
      .max(3000, { message: 'Description cannot exceed 3000 characters.' }),
    referenceVideoUrl: z
      .string()
      .optional()
      .refine((val) => !val || /^https?:\/\/.+/.test(val), {
        message: 'Reference video URL must start with http:// or https://',
      }),
    additionalRequirements: z.string().max(2000).optional(),
    paymentMode: z.enum(paymentModeValues).default('none'),
    totalProjectAmount: z.coerce.number().finite().min(0).max(100000000).optional(),
    paidAmount: z.coerce.number().finite().min(0).max(100000000).default(0),
    utrReference: z.string().trim().max(120).optional(),
    paymentConfirmed: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMode === 'partial' || data.paymentMode === 'full') {
      if (!data.paidAmount || data.paidAmount < 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['paidAmount'],
          message: 'Please enter the amount paid (minimum ₹100).',
        });
      }
      if (
        typeof data.totalProjectAmount === 'number' &&
        data.totalProjectAmount > 0 &&
        data.paidAmount > data.totalProjectAmount
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['paidAmount'],
          message: 'Paid amount cannot exceed total project amount.',
        });
      }
      const normalizedUtr = data.utrReference ? normalizeUtrReference(data.utrReference) : '';
      if (normalizedUtr.length < 6 || !/^[A-Z0-9_-]{6,64}$/.test(normalizedUtr)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['utrReference'],
          message:
            'Please enter a valid UPI Transaction ID / UTR Reference (6–64 alphanumeric characters).',
        });
      }
      if (!data.paymentConfirmed) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['paymentConfirmed'],
          message: 'Please confirm that you completed the UPI payment via the QR code.',
        });
      }
    }
  });

export type ContactFormData = z.infer<typeof contactFormSchema>;
