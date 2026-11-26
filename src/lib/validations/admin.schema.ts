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
  assignedTo: z.string().trim().min(1, 'Assignee is required.').max(80),
  status: z.enum(taskStatusValues),
  priority: z.enum(taskPriorityValues),
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
