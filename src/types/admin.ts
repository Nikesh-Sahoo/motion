export type UserType = 'admin' | 'editor' | 'client';

export type TaskStatus =
  | 'pending'
  | 'in_progress'
  | 'review'
  | 'completed'
  | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type PaymentStatus = 'unpaid' | 'partial' | 'paid';

export type PaymentVerificationStatus =
  | 'none'
  | 'pending_verification'
  | 'verified'
  | 'mismatch_verified'
  | 'rejected';

export interface PaymentVerificationRecord {
  id: string;
  inquiryId?: string | null;
  taskId?: string | null;
  clientName: string;
  utrReference: string;
  claimedAmount: number;
  actualAmountVerified: number;
  previousCollected: number;
  newCollected: number;
  totalProjectAmount: number;
  remainingAmount: number;
  verificationStatus: PaymentVerificationStatus;
  notes?: string | null;
  verifiedBy: string;
  verifiedAt: string;
}

export interface AdminUserPublic {
  id: string;
  name: string;
  email: string;
  type: UserType;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
}

export interface AdminTask {
  id: string;
  title: string;
  clientName: string;
  clientEmail?: string | null;
  serviceType: string;
  assignedTo: string;
  assignedEditorId?: string | null;
  assignedEditorEmail?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number;
  totalAmount: number;
  amountCollected: number;
  amountToReceive: number;
  paymentStatus: PaymentStatus;
  paymentVerificationStatus?: PaymentVerificationStatus;
  claimedPaidAmount?: number;
  utrReference?: string | null;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  dueDate: string;
  notes?: string | null;
  deliverableUrl?: string | null;
  editorNotes?: string | null;
  sourceInquiryId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EditorTaskItem {
  id: string;
  title: string;
  clientName: string;
  serviceType: string;
  assignedTo: string;
  assignedEditorId?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number;
  dueDate: string;
  notes?: string | null;
  deliverableUrl?: string | null;
  editorNotes?: string | null;
  sourceInquiryId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryRecord {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  companyName?: string | null;
  serviceType: string;
  platform: string;
  approximateDuration?: string | null;
  numberOfVideos?: string | null;
  budgetRange: string;
  deadline: string;
  projectDescription: string;
  referenceVideoUrl?: string | null;
  paymentMode?: 'none' | 'partial' | 'full';
  totalProjectAmount?: number;
  claimedPaidAmount?: number;
  paidAmount?: number;
  remainingAmount?: number;
  paymentStatus?: string;
  paymentVerificationStatus?: PaymentVerificationStatus;
  utrReference?: string | null;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  verificationNotes?: string | null;
  status: string;
  linkedTaskId?: string | null;
  createdAt: string;
}

export interface EditorApplicationRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  experienceLevel: string;
  primarySoftware: string;
  portfolioUrl: string;
  sampleWorkUrl?: string | null;
  preferredProjectType: string;
  weeklyAvailability: string;
  motivation: string;
  status: string;
  registeredUserId?: string | null;
  createdAt: string;
}

export interface MonthlyRevenuePoint {
  month: string;
  label: string;
  totalBilled: number;
  collected: number;
  toReceive: number;
  taskCount: number;
}

export interface ServiceBreakdownPoint {
  serviceType: string;
  shortLabel: string;
  taskCount: number;
  totalBilled: number;
  collected: number;
  toReceive: number;
}

export interface StatusBreakdownPoint {
  status: TaskStatus;
  label: string;
  count: number;
  amount: number;
}

export interface EditorPerformancePoint {
  editorId: string;
  name: string;
  email: string;
  assignedCount: number;
  completedCount: number;
  avgProgress: number;
  completionRate: number;
}

export interface AdminDashboardSummary {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  overallProgressRate: number;
  totalBilled: number;
  totalCollected: number;
  totalToReceive: number;
  collectionRate: number;
  totalInquiries: number;
  totalApplications: number;
  pendingVerificationCount: number;
  pendingVerificationAmount: number;
  monthlySeries: MonthlyRevenuePoint[];
  serviceBreakdown: ServiceBreakdownPoint[];
  statusBreakdown: StatusBreakdownPoint[];
  editorPerformance: EditorPerformancePoint[];
}

export interface AdminOverviewPayload {
  tasks: AdminTask[];
  inquiries: InquiryRecord[];
  applications: EditorApplicationRecord[];
  users: AdminUserPublic[];
  paymentVerifications: PaymentVerificationRecord[];
  summary: AdminDashboardSummary;
}
