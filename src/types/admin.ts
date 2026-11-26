export type UserType = 'admin' | 'editor' | 'client';

export type TaskStatus =
  | 'pending'
  | 'in_progress'
  | 'review'
  | 'completed'
  | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type PaymentStatus = 'unpaid' | 'partial' | 'paid';

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
  status: TaskStatus;
  priority: TaskPriority;
  totalAmount: number;
  amountCollected: number;
  amountToReceive: number;
  paymentStatus: PaymentStatus;
  dueDate: string;
  notes?: string | null;
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
  status: string;
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

export interface AdminDashboardSummary {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  totalBilled: number;
  totalCollected: number;
  totalToReceive: number;
  collectionRate: number;
  totalInquiries: number;
  totalApplications: number;
  monthlySeries: MonthlyRevenuePoint[];
  serviceBreakdown: ServiceBreakdownPoint[];
  statusBreakdown: StatusBreakdownPoint[];
}

export interface AdminOverviewPayload {
  tasks: AdminTask[];
  inquiries: InquiryRecord[];
  applications: EditorApplicationRecord[];
  users: AdminUserPublic[];
  summary: AdminDashboardSummary;
}
