import { z } from 'zod';

export const userTypeValues = ['admin', 'editor', 'client'] as const;

export const taskStatusValues = [
  'pending',
  'in_progress',
  'review',
  'completed',
  'cancelled',
] as const;

export const taskPriorityValues = ['low', 'medium', 'high', 'urgent'] as const;

export const taskServiceTypeOptions = [
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

export const adminLoginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export const editorLoginSchema = adminLoginSchema;

export const adminSetupSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(80),
  email: z.string().trim().email('Please enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(128),
});

export const userCreateSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(80),
  email: z.string().trim().email('Please enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(128),
  type: z.enum(userTypeValues),
});

export const approveEditorApplicationSchema = z.object({
  applicationId: z.string().trim().min(1, 'Application ID is required.'),
  password: z
    .string()
    .min(8, 'Temporary password must be at least 8 characters.')
    .max(128),
});

const taskBaseSchema = z.object({
  title: z.string().trim().min(2, 'Task title is required.').max(150),
  clientName: z.string().trim().min(2, 'Client name is required.').max(120),
  clientEmail: z
    .string()
    .trim()
    .email('Invalid client email address.')
    .optional()
    .or(z.literal('')),
  serviceType: z.string().trim().min(1, 'Service type is required.').max(120),
  assignedTo: z.string().trim().max(80).optional().or(z.literal('')),
  assignedEditorId: z.string().trim().optional().nullable(),
  status: z.enum(taskStatusValues),
  priority: z.enum(taskPriorityValues),
  progress: z.coerce.number().finite().min(0).max(100).optional(),
  totalAmount: z.coerce
    .number()
    .finite()
    .min(0, 'Total amount cannot be negative.')
    .max(100000000),
  amountCollected: z.coerce
    .number()
    .finite()
    .min(0, 'Amount collected cannot be negative.')
    .max(100000000),
  dueDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be YYYY-MM-DD.'),
  notes: z.string().trim().max(2000).optional().or(z.literal('')),
  deliverableUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || /^https?:\/\/.+/.test(val), {
      message: 'Deliverable URL must start with http:// or https://',
    }),
  editorNotes: z.string().trim().max(2000).optional().or(z.literal('')),
  sourceInquiryId: z.string().trim().optional().nullable(),
});

export const taskCreateSchema = taskBaseSchema.refine(
  (data) => data.amountCollected <= data.totalAmount,
  {
    message: 'Amount collected cannot exceed total project amount.',
    path: ['amountCollected'],
  }
);

export const taskUpdateSchema = taskBaseSchema
  .partial()
  .refine(
    (data) => {
      if (
        typeof data.totalAmount === 'number' &&
        typeof data.amountCollected === 'number'
      ) {
        return data.amountCollected <= data.totalAmount;
      }
      return true;
    },
    {
      message: 'Amount collected cannot exceed total project amount.',
      path: ['amountCollected'],
    }
  );

export const editorTaskUpdateSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'review', 'completed'] as const).optional(),
  progress: z.coerce.number().finite().min(0).max(100).optional(),
  deliverableUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || /^https?:\/\/.+/.test(val), {
      message: 'Deliverable URL must start with http:// or https://',
    }),
  editorNotes: z.string().trim().max(2000).optional().or(z.literal('')),
});

export const paymentVerificationActionValues = ['verify', 'reject'] as const;
export const paymentVerificationUpdateModeValues = [
  'add_payment',
  'set_exact_total',
] as const;

export const paymentVerifySchema = z
  .object({
    inquiryId: z.string().trim().optional().nullable(),
    taskId: z.string().trim().optional().nullable(),
    action: z.enum(paymentVerificationActionValues).default('verify'),
    updateMode: z.enum(paymentVerificationUpdateModeValues).default('add_payment'),
    actualAmountPaid: z.coerce
      .number()
      .finite()
      .min(0, 'Actual amount received cannot be negative.')
      .max(100000000),
    totalProjectAmount: z.coerce
      .number()
      .finite()
      .min(0, 'Total project amount cannot be negative.')
      .max(100000000)
      .optional(),
    utrReference: z.string().trim().max(120).optional().or(z.literal('')),
    verificationNotes: z.string().trim().max(500).optional().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (!data.inquiryId && !data.taskId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['inquiryId'],
        message: 'Either inquiryId or taskId is required for verification.',
      });
    }
    if (data.action === 'verify') {
      const normalizedUtr = (data.utrReference || '').trim().replace(/\s+/g, '').toUpperCase();
      if (normalizedUtr.length < 4 || !/^[A-Z0-9_-]{4,64}$/.test(normalizedUtr)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['utrReference'],
          message: 'Enter a valid UPI Transaction ID / UTR Reference (4–64 chars).',
        });
      }
      if (data.actualAmountPaid <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['actualAmountPaid'],
          message: 'Verified payment amount must be greater than ₹0.',
        });
      }
    }
  });
