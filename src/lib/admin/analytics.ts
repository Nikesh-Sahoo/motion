import type { ObjectId } from 'mongodb';
import type {
  AdminDashboardSummary,
  AdminTask,
  AdminUserPublic,
  EditorApplicationRecord,
  EditorPerformancePoint,
  EditorTaskItem,
  InquiryRecord,
  MonthlyRevenuePoint,
  PaymentStatus,
  PaymentVerificationRecord,
  PaymentVerificationStatus,
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
  assignedEditorId?: string | null;
  assignedEditorEmail?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  progress?: number;
  totalAmount: number;
  amountCollected: number;
  claimedPaidAmount?: number;
  paymentVerificationStatus?: PaymentVerificationStatus;
  utrReference?: string | null;
  verifiedBy?: string | null;
  verifiedAt?: Date | string | null;
  dueDate: string;
  notes?: string | null;
  deliverableUrl?: string | null;
  editorNotes?: string | null;
  sourceInquiryId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function defaultProgressForStatus(status: TaskStatus): number {
  switch (status) {
    case 'completed':
      return 100;
    case 'review':
      return 85;
    case 'in_progress':
      return 50;
    case 'pending':
      return 10;
    case 'cancelled':
      return 0;
  }
}

export function resolveTaskProgress(status: TaskStatus, explicitProgress?: number): number {
  if (status === 'completed') return 100;
  if (status === 'cancelled') return 0;
  if (typeof explicitProgress === 'number' && Number.isFinite(explicitProgress)) {
    return Math.min(100, Math.max(0, Math.round(explicitProgress)));
  }
  return defaultProgressForStatus(status);
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
    assignedTo: doc.assignedTo || 'Unassigned',
    assignedEditorId: doc.assignedEditorId || null,
    assignedEditorEmail: doc.assignedEditorEmail || null,
    status: doc.status,
    priority: doc.priority || 'medium',
    progress: resolveTaskProgress(doc.status, doc.progress),
    ...amounts,
    paymentVerificationStatus: doc.paymentVerificationStatus || 'none',
    claimedPaidAmount:
      typeof doc.claimedPaidAmount === 'number' ? doc.claimedPaidAmount : 0,
    utrReference: doc.utrReference || null,
    verifiedBy: doc.verifiedBy || null,
    verifiedAt:
      doc.verifiedAt instanceof Date
        ? doc.verifiedAt.toISOString()
        : doc.verifiedAt
        ? String(doc.verifiedAt)
        : null,
    dueDate: doc.dueDate,
    notes: doc.notes || null,
    deliverableUrl: doc.deliverableUrl || null,
    editorNotes: doc.editorNotes || null,
    sourceInquiryId: doc.sourceInquiryId || null,
    createdAt:
      doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
    updatedAt:
      doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : String(doc.updatedAt),
  };
}

export function serializeEditorTask(doc: TaskDocument & { _id: ObjectId }): EditorTaskItem {
  return {
    id: doc._id.toHexString(),
    title: doc.title,
    clientName: doc.clientName,
    serviceType: doc.serviceType,
    assignedTo: doc.assignedTo || 'Unassigned',
    assignedEditorId: doc.assignedEditorId || null,
    status: doc.status,
    priority: doc.priority || 'medium',
    progress: resolveTaskProgress(doc.status, doc.progress),
    dueDate: doc.dueDate,
    notes: doc.notes || null,
    deliverableUrl: doc.deliverableUrl || null,
    editorNotes: doc.editorNotes || null,
    sourceInquiryId: doc.sourceInquiryId || null,
    createdAt:
      doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
    updatedAt:
      doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : String(doc.updatedAt),
  };
}

export function serializeInquiry(doc: Record<string, unknown> & { _id: ObjectId }): InquiryRecord {
  const createdAt =
    doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt || '');
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
    paymentMode:
      doc.paymentMode === 'partial' || doc.paymentMode === 'full'
        ? doc.paymentMode
        : 'none',
    totalProjectAmount:
      typeof doc.totalProjectAmount === 'number' ? doc.totalProjectAmount : undefined,
    claimedPaidAmount:
      typeof doc.claimedPaidAmount === 'number' ? doc.claimedPaidAmount : 0,
    paidAmount: typeof doc.paidAmount === 'number' ? doc.paidAmount : 0,
    remainingAmount: typeof doc.remainingAmount === 'number' ? doc.remainingAmount : 0,
    paymentStatus: doc.paymentStatus ? String(doc.paymentStatus) : 'unpaid',
    paymentVerificationStatus:
      doc.paymentVerificationStatus === 'pending_verification' ||
      doc.paymentVerificationStatus === 'verified' ||
      doc.paymentVerificationStatus === 'mismatch_verified' ||
      doc.paymentVerificationStatus === 'rejected'
        ? doc.paymentVerificationStatus
        : 'none',
    utrReference: doc.utrReference ? String(doc.utrReference) : null,
    verifiedBy: doc.verifiedBy ? String(doc.verifiedBy) : null,
    verifiedAt:
      doc.verifiedAt instanceof Date
        ? doc.verifiedAt.toISOString()
        : doc.verifiedAt
        ? String(doc.verifiedAt)
        : null,
    verificationNotes: doc.verificationNotes ? String(doc.verificationNotes) : null,
    status: String(doc.status || 'new'),
    linkedTaskId: doc.linkedTaskId ? String(doc.linkedTaskId) : null,
    createdAt,
  };
}

export function serializePaymentVerification(
  doc: Record<string, unknown> & { _id: ObjectId }
): PaymentVerificationRecord {
  return {
    id: doc._id.toHexString(),
    inquiryId: doc.inquiryId ? String(doc.inquiryId) : null,
    taskId: doc.taskId ? String(doc.taskId) : null,
    clientName: String(doc.clientName || ''),
    utrReference: String(doc.utrReference || ''),
    claimedAmount: Number(doc.claimedAmount || 0),
    actualAmountVerified: Number(doc.actualAmountVerified || 0),
    previousCollected: Number(doc.previousCollected || 0),
    newCollected: Number(doc.newCollected || 0),
    totalProjectAmount: Number(doc.totalProjectAmount || 0),
    remainingAmount: Number(doc.remainingAmount || 0),
    verificationStatus:
      doc.verificationStatus === 'verified' ||
      doc.verificationStatus === 'mismatch_verified' ||
      doc.verificationStatus === 'rejected' ||
      doc.verificationStatus === 'pending_verification'
        ? doc.verificationStatus
        : 'verified',
    notes: doc.notes ? String(doc.notes) : null,
    verifiedBy: String(doc.verifiedBy || ''),
    verifiedAt:
      doc.verifiedAt instanceof Date
        ? doc.verifiedAt.toISOString()
        : String(doc.verifiedAt || ''),
  };
}

export function serializeApplication(
  doc: Record<string, unknown> & { _id: ObjectId }
): EditorApplicationRecord {
  const createdAt =
    doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt || '');
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
    registeredUserId: doc.registeredUserId ? String(doc.registeredUserId) : null,
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
  totalApplications = 0,
  users: AdminUserPublic[] = []
): AdminDashboardSummary {
  const nonCancelled = tasks.filter((t) => t.status !== 'cancelled');
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const activeTasks = tasks.filter(
    (t) => t.status === 'pending' || t.status === 'in_progress' || t.status === 'review'
  ).length;

  const overallProgressRate =
    nonCancelled.length > 0
      ? Math.round(
          nonCancelled.reduce((sum, t) => sum + t.progress, 0) / nonCancelled.length
        )
      : 0;

  const totalBilled = nonCancelled.reduce((sum, t) => sum + t.totalAmount, 0);
  const totalCollected = nonCancelled.reduce((sum, t) => sum + t.amountCollected, 0);
  const totalToReceive = nonCancelled.reduce((sum, t) => sum + t.amountToReceive, 0);
  const collectionRate =
    totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 1000) / 10 : 0;

  const pendingVerificationTasks = nonCancelled.filter(
    (t) => t.paymentVerificationStatus === 'pending_verification'
  );
  const pendingVerificationCount = pendingVerificationTasks.length;
  const pendingVerificationAmount = pendingVerificationTasks.reduce(
    (sum, t) => sum + Number(t.claimedPaidAmount || 0),
    0
  );

  // Monthly revenue series
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

  // Registered Editor Performance
  const registeredEditors = users.filter((u) => u.type === 'editor' && u.isActive);
  const editorPerformance: EditorPerformancePoint[] = registeredEditors.map((editor) => {
    const editorTasks = nonCancelled.filter(
      (t) =>
        t.assignedEditorId === editor.id ||
        t.assignedEditorEmail?.toLowerCase() === editor.email.toLowerCase()
    );
    const assignedCount = editorTasks.length;
    const edCompleted = editorTasks.filter((t) => t.status === 'completed').length;
    const avgProgress =
      assignedCount > 0
        ? Math.round(
            editorTasks.reduce((sum, t) => sum + t.progress, 0) / assignedCount
          )
        : 0;
    const completionRate =
      assignedCount > 0 ? Math.round((edCompleted / assignedCount) * 100) : 0;

    return {
      editorId: editor.id,
      name: editor.name,
      email: editor.email,
      assignedCount,
      completedCount: edCompleted,
      avgProgress,
      completionRate,
    };
  });

  return {
    totalTasks,
    completedTasks,
    activeTasks,
    overallProgressRate,
    totalBilled,
    totalCollected,
    totalToReceive,
    collectionRate,
    totalInquiries,
    totalApplications,
    pendingVerificationCount,
    pendingVerificationAmount,
    monthlySeries,
    serviceBreakdown,
    statusBreakdown,
    editorPerformance,
  };
}
