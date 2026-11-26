import type { ObjectId } from 'mongodb';
import type {
  AdminDashboardSummary,
  AdminTask,
  EditorApplicationRecord,
  InquiryRecord,
  MonthlyRevenuePoint,
  PaymentStatus,
  ServiceBreakdownPoint,
  StatusBreakdownPoint,
  TaskPriority,
  TaskStatus,
} from '@/types/admin';

export interface TaskDocument {
  _id?: ObjectId;
  title: string;
  clientName: string;
  clientEmail?: string | null;
  serviceType: string;
  assignedTo: string;
  status: TaskStatus;
  priority: TaskPriority;
  totalAmount: number;
  amountCollected: number;
  dueDate: string;
  notes?: string | null;
  sourceInquiryId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function computePaymentFields(totalAmount: number, amountCollected: number): {
  totalAmount: number;
  amountCollected: number;
  amountToReceive: number;
  paymentStatus: PaymentStatus;
} {
  const safeTotal = Math.max(0, Number(totalAmount) || 0);
  const safeCollected = Math.min(safeTotal, Math.max(0, Number(amountCollected) || 0));
  const amountToReceive = Math.max(0, safeTotal - safeCollected);

  let paymentStatus: PaymentStatus = 'unpaid';
  if (safeTotal > 0 && amountToReceive === 0) {
    paymentStatus = 'paid';
  } else if (safeTotal === 0 && safeCollected === 0) {
    paymentStatus = 'paid';
  } else if (safeCollected > 0) {
    paymentStatus = 'partial';
  }

  return {
    totalAmount: safeTotal,
    amountCollected: safeCollected,
    amountToReceive,
    paymentStatus,
  };
}

export function serializeTask(doc: TaskDocument & { _id: ObjectId }): AdminTask {
  const amounts = computePaymentFields(doc.totalAmount, doc.amountCollected);
  return {
    id: doc._id.toHexString(),
    title: doc.title,
    clientName: doc.clientName,
    clientEmail: doc.clientEmail || null,
    serviceType: doc.serviceType,
    assignedTo: doc.assignedTo,
    status: doc.status,
    priority: doc.priority || 'medium',
    ...amounts,
    dueDate: doc.dueDate,
    notes: doc.notes || null,
    sourceInquiryId: doc.sourceInquiryId || null,
    createdAt:
      doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
    updatedAt:
      doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : String(doc.updatedAt),
  };
}

export function serializeInquiry(doc: Record<string, unknown> & { _id: ObjectId }): InquiryRecord {
  const createdAt = doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt || '');
  return {
    id: doc._id.toHexString(),
    fullName: String(doc.fullName || ''),
    email: String(doc.email || ''),
    phone: doc.phone ? String(doc.phone) : null,
    companyName: doc.companyName ? String(doc.companyName) : null,
    serviceType: String(doc.serviceType || ''),
    platform: String(doc.platform || ''),
    approximateDuration: doc.approximateDuration ? String(doc.approximateDuration) : null,
    numberOfVideos: doc.numberOfVideos ? String(doc.numberOfVideos) : null,
    budgetRange: String(doc.budgetRange || ''),
    deadline: String(doc.deadline || ''),
    projectDescription: String(doc.projectDescription || ''),
    referenceVideoUrl: doc.referenceVideoUrl ? String(doc.referenceVideoUrl) : null,
    status: String(doc.status || 'new'),
    createdAt,
  };
}

export function serializeApplication(
  doc: Record<string, unknown> & { _id: ObjectId }
): EditorApplicationRecord {
  const createdAt = doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt || '');
  return {
    id: doc._id.toHexString(),
    fullName: String(doc.fullName || ''),
    email: String(doc.email || ''),
    phone: String(doc.phone || ''),
    location: String(doc.location || ''),
    experienceLevel: String(doc.experienceLevel || ''),
    primarySoftware: String(doc.primarySoftware || ''),
    portfolioUrl: String(doc.portfolioUrl || ''),
    sampleWorkUrl: doc.sampleWorkUrl ? String(doc.sampleWorkUrl) : null,
    preferredProjectType: String(doc.preferredProjectType || ''),
    weeklyAvailability: String(doc.weeklyAvailability || ''),
    motivation: String(doc.motivation || ''),
    status: String(doc.status || 'pending'),
    createdAt,
  };
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  review: 'In Review',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function shortenServiceLabel(serviceType: string): string {
  const lower = serviceType.toLowerCase();
  if (lower.includes('vlog')) return 'Vlog Edits';
  if (lower.includes('instagram') || lower.includes('tiktok')) return 'IG & TikTok';
  if (lower.includes('youtube')) return 'YT & Shorts';
  if (lower.includes('motion graphics')) return 'Motion GFX';
  if (lower.includes('app promotion')) return 'App Promo';
  if (lower.includes('brand promotion')) return 'Brand Promo';
  if (lower.includes('product promotion')) return 'Product Promo';
  if (lower.includes('cinematic')) return 'Cinematic';
  if (lower.includes('titlecard')) return 'Titlecard';
  if (lower.includes('photo')) return 'Photo Edit';
  if (lower.includes('self reference')) return 'Self Reference';
  if (serviceType.startsWith('Short-Form')) return 'Short-Form';
  if (serviceType.startsWith('YouTube')) return 'YouTube Long';
  if (serviceType.startsWith('Brand')) return 'Brand & Promo';
  if (serviceType.startsWith('Color')) return 'Color & VFX';
  return serviceType.length > 14 ? `${serviceType.slice(0, 12)}…` : serviceType;
}

function formatMonthLabel(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  if (!y || !m) return ym;
  const date = new Date(Date.UTC(y, m - 1, 1));
  return date.toLocaleString('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' });
}

export function buildDashboardSummary(
  tasks: AdminTask[],
  totalInquiries = 0,
  totalApplications = 0
): AdminDashboardSummary {
  const nonCancelled = tasks.filter((t) => t.status !== 'cancelled');
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const activeTasks = tasks.filter(
    (t) => t.status === 'pending' || t.status === 'in_progress' || t.status === 'review'
  ).length;

  const totalBilled = nonCancelled.reduce((sum, t) => sum + t.totalAmount, 0);
  const totalCollected = nonCancelled.reduce((sum, t) => sum + t.amountCollected, 0);
  const totalToReceive = nonCancelled.reduce((sum, t) => sum + t.amountToReceive, 0);
  const collectionRate =
    totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 1000) / 10 : 0;

  // Monthly revenue series (by dueDate YYYY-MM or createdAt YYYY-MM)
  const monthlyMap = new Map<string, MonthlyRevenuePoint>();
  for (const task of nonCancelled) {
    const ym =
      (task.dueDate && /^\d{4}-\d{2}/.test(task.dueDate)
        ? task.dueDate.slice(0, 7)
        : task.createdAt.slice(0, 7)) || 'Unknown';
    const existing = monthlyMap.get(ym) || {
      month: ym,
      label: formatMonthLabel(ym),
      totalBilled: 0,
      collected: 0,
      toReceive: 0,
      taskCount: 0,
    };
    existing.totalBilled += task.totalAmount;
    existing.collected += task.amountCollected;
    existing.toReceive += task.amountToReceive;
    existing.taskCount += 1;
    monthlyMap.set(ym, existing);
  }
  const monthlySeries = Array.from(monthlyMap.values())
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-8);

  // Service breakdown
  const serviceMap = new Map<string, ServiceBreakdownPoint>();
  for (const task of nonCancelled) {
    const key = task.serviceType || 'Other';
    const existing = serviceMap.get(key) || {
      serviceType: key,
      shortLabel: shortenServiceLabel(key),
      taskCount: 0,
      totalBilled: 0,
      collected: 0,
      toReceive: 0,
    };
    existing.taskCount += 1;
    existing.totalBilled += task.totalAmount;
    existing.collected += task.amountCollected;
    existing.toReceive += task.amountToReceive;
    serviceMap.set(key, existing);
  }
  const serviceBreakdown = Array.from(serviceMap.values()).sort(
    (a, b) => b.totalBilled - a.totalBilled
  );

  // Status breakdown
  const statuses: TaskStatus[] = ['pending', 'in_progress', 'review', 'completed', 'cancelled'];
  const statusBreakdown: StatusBreakdownPoint[] = statuses.map((st) => {
    const matching = tasks.filter((t) => t.status === st);
    return {
      status: st,
      label: STATUS_LABELS[st],
      count: matching.length,
      amount: matching.reduce((sum, t) => sum + t.totalAmount, 0),
    };
  });

  return {
    totalTasks,
    completedTasks,
    activeTasks,
    totalBilled,
    totalCollected,
    totalToReceive,
    collectionRate,
    totalInquiries,
    totalApplications,
    monthlySeries,
    serviceBreakdown,
    statusBreakdown,
  };
}
