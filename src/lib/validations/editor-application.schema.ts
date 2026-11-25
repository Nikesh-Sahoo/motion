import { z } from 'zod';

export const experienceLevelOptions = [
  'Beginner',
  'Less than 1 year',
  '1–2 years',
  '2–4 years',
  '4+ years',
] as const;

export const editingSoftwareOptions = [
  'Adobe Premiere Pro',
  'DaVinci Resolve',
  'Final Cut Pro',
  'CapCut Pro / Desktop',
  'Adobe After Effects',
  'Multiple Tools (Premiere + After Effects / Resolve)',
  'Other',
] as const;

export const preferredProjectTypeOptions = [
  'Short-Form (Reels, TikTok, Shorts)',
  'Long-Form (YouTube, Documentaries)',
  'Podcast & Show Editing',
  'Business & Brand Videos',
  'Motion Graphics & Visual Effects',
  'Multiple Categories',
] as const;

export const weeklyAvailabilityOptions = [
  '10–20 hours / week',
  '20–30 hours / week',
  '30–40 hours / week',
  'Flexible project-by-project',
] as const;

export const editorApplicationSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters.' })
    .max(100, { message: 'Full name cannot exceed 100 characters.' }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' }),
  phone: z
    .string()
    .min(7, { message: 'Please enter a valid phone number with country code.' })
    .max(25, { message: 'Phone number cannot exceed 25 characters.' }),
  location: z
    .string()
    .min(2, { message: 'Please specify your city and country.' })
    .max(100),
  experienceLevel: z.string().min(1, { message: 'Please select your experience level.' }),
  primarySoftware: z.string().min(1, { message: 'Please select your primary editing software.' }),
  portfolioUrl: z
    .string()
    .min(5, { message: 'Portfolio link is required (Drive, Behance, YouTube, Website, etc.).' })
    .refine((val) => /^https?:\/\/.+/.test(val), {
      message: 'Portfolio URL must be a valid link starting with http:// or https://',
    }),
  sampleWorkUrl: z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\/.+/.test(val), {
      message: 'Work URL must start with http:// or https://',
    }),
  preferredProjectType: z.string().min(1, { message: 'Please select your preferred project type.' }),
  weeklyAvailability: z.string().min(1, { message: 'Please select your weekly availability.' }),
  motivation: z
    .string()
    .min(20, { message: 'Please provide a brief answer (minimum 20 characters).' })
    .max(2000, { message: 'Response cannot exceed 2000 characters.' }),
  consentAgreed: z.boolean().refine((val) => val === true, {
    message: 'You must confirm that you have permission to share submitted links and details.',
  }),
});

export type EditorApplicationFormData = z.infer<typeof editorApplicationSchema>;
