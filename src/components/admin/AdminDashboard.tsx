'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard,
  BarChart3,
  Briefcase,
  Mail,
  Users,
  FileBarChart2,
  Clapperboard,
  Plus,
  Download,
  RefreshCw,
  LogOut,
  Search,
  CheckCircle2,
  Pencil,
  Trash2,
  ShieldCheck,
  ArrowUpRight,
  UserPlus,
  AlertCircle,
  Bell,
  Calendar,
  Menu,
  X,
  ExternalLink,
  Home,
} from 'lucide-react';
import type {
  AdminOverviewPayload,
  AdminTask,
  AdminUserPublic,
  EditorApplicationRecord,
  InquiryRecord,
  PaymentVerificationRecord,
  PaymentVerificationStatus,
  TaskStatus,
  UserType,
} from '@/types/admin';
import { formatCurrencyINR } from '@/lib/admin/report';
import { AdminCharts } from '@/components/admin/AdminCharts';
import { TaskModal } from '@/components/admin/TaskModal';
import { ReportModal } from '@/components/admin/ReportModal';
import {
  PaymentVerifyModal,
  type VerifyPaymentTarget,
} from '@/components/admin/PaymentVerifyModal';

interface AdminDashboardProps {
  adminUser: AdminUserPublic;
  onLoggedOut: () => void;
}

type AdminSection =
  | 'dashboard'
  | 'analytics'
  | 'tasks'
  | 'payments'
  | 'inquiries'
  | 'applications'
  | 'team';

const STATUS_BADGE: Record<TaskStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-300 border-amber-500/35',
  in_progress: 'bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/35',
  review: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/35',
  completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35',
  cancelled: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/35',
};

const PAYMENT_BADGE = {
  paid: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35',
  partial: 'bg-amber-500/15 text-amber-300 border-amber-500/35',
  unpaid: 'bg-rose-500/15 text-rose-300 border-rose-500/35',
};

const VERIFICATION_BADGE: Record<
  PaymentVerificationStatus,
  { label: string; cls: string }
> = {
  none: {
    label: 'Unverified',
    cls: 'bg-white/[0.05] text-[#8A94B8] border-white/[0.1]',
  },
  pending_verification: {
    label: 'Pending UTR Verify',
    cls: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  },
  verified: {
    label: 'Verified',
    cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  },
  mismatch_verified: {
    label: 'Adjusted Actual ₹',
    cls: 'bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/40',
  },
  rejected: {
    label: 'Claim Rejected',
    cls: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
  },
};

function VerificationAuditTable({
  verifications,
  emptyText,
}: {
  verifications: PaymentVerificationRecord[];
  emptyText: string;
}) {
  if (verifications.length === 0) {
    return <div className="text-xs text-[#8A94B8] py-4 font-mono">{emptyText}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-white/[0.06] font-mono text-[10px] uppercase text-[#8A94B8]">
            <th className="py-2 pr-4">Verified At</th>
            <th className="py-2 pr-4">Client</th>
            <th className="py-2 pr-4">UTR Reference</th>
            <th className="py-2 pr-4 text-right">Claimed</th>
            <th className="py-2 pr-4 text-right">Verified ₹</th>
            <th className="py-2 pr-4 text-right">Total Paid</th>
            <th className="py-2 pr-4 text-right">Remaining</th>
            <th className="py-2 pr-4">Outcome</th>
            <th className="py-2">Admin</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.05]">
          {verifications.map((v) => (
            <tr key={v.id}>
              <td className="py-2 pr-4 font-mono text-[11px] text-[#8A94B8] whitespace-nowrap">
                {v.verifiedAt ? new Date(v.verifiedAt).toLocaleString() : ''}
              </td>
              <td className="py-2 pr-4 text-[#F4F6FF]">{v.clientName}</td>
              <td className="py-2 pr-4 font-mono text-[#00F0FF]">{v.utrReference}</td>
              <td className="py-2 pr-4 text-right font-mono text-[#8A94B8]">
                {v.claimedAmount > 0 ? formatCurrencyINR(v.claimedAmount) : '—'}
              </td>
              <td className="py-2 pr-4 text-right font-mono text-emerald-400 font-semibold">
                {formatCurrencyINR(v.actualAmountVerified)}
              </td>
              <td className="py-2 pr-4 text-right font-mono text-[#F4F6FF]">
                {formatCurrencyINR(v.newCollected)}
              </td>
              <td className="py-2 pr-4 text-right font-mono text-amber-400">
                {formatCurrencyINR(v.remainingAmount)}
              </td>
              <td className="py-2 pr-4">
                <span
                  className={`inline-block px-2 py-0.5 rounded border text-[9px] font-mono uppercase ${VERIFICATION_BADGE[v.verificationStatus].cls}`}
                >
                  {VERIFICATION_BADGE[v.verificationStatus].label}
                </span>
              </td>
              <td className="py-2 font-mono text-[11px] text-[#8A94B8]">
                {v.verifiedBy}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MiniSparkline({ color, points }: { color: string; points: string }) {
  return (
    <svg viewBox="0 0 84 30" className="w-20 h-8 flex-shrink-0 overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function AdminDashboard({ adminUser, onLoggedOut }: AdminDashboardProps) {
  const [overview, setOverview] = useState<AdminOverviewPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  // Modals
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<AdminTask | null>(null);
  const [taskPrefill, setTaskPrefill] = useState<{
    title?: string;
    clientName?: string;
    clientEmail?: string;
    serviceType?: string;
    totalAmount?: number;
    notes?: string;
    sourceInquiryId?: string;
  } | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [verifyTarget, setVerifyTarget] = useState<VerifyPaymentTarget | null>(null);

  // Approve & Register Editor modal state
  const [approvingApp, setApprovingApp] = useState<EditorApplicationRecord | null>(null);
  const [approvePassword, setApprovePassword] = useState('');
  const [approvingSubmitting, setApprovingSubmitting] = useState(false);
  const [approveError, setApproveError] = useState<string | null>(null);

  // User creation form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserType, setNewUserType] = useState<UserType>('editor');
  const [userFormMsg, setUserFormMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [creatingUser, setCreatingUser] = useState(false);

  const loadOverview = useCallback(
    async (isManual = false) => {
      if (isManual) setRefreshing(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/overview', { cache: 'no-store' });
        if (res.status === 401 || res.status === 403) {
          onLoggedOut();
          return;
        }
        const json = (await res.json()) as {
          success?: boolean;
          data?: AdminOverviewPayload;
          error?: string;
        };
        if (!res.ok || !json.success || !json.data) {
          setError(json.error || 'Failed to load dashboard data.');
          return;
        }
        setOverview(json.data);
      } catch {
        setError('Network error loading admin dashboard data.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [onLoggedOut]
  );

  useEffect(() => {
    void loadOverview(false);
  }, [loadOverview]);

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    onLoggedOut();
  };

  const handleQuickStatusChange = async (task: AdminTask, nextStatus: TaskStatus) => {
    try {
      const res = await fetch(`/api/admin/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) await loadOverview(false);
    } catch {
      setError('Failed to update task status.');
    }
  };

  const handleQuickEditorAssign = async (task: AdminTask, editorId: string) => {
    try {
      const res = await fetch(`/api/admin/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedEditorId: editorId || null }),
      });
      if (res.ok) await loadOverview(false);
    } catch {
      setError('Failed to assign editor.');
    }
  };

  const handleDeleteTask = async (task: AdminTask) => {
    try {
      const res = await fetch(`/api/admin/tasks/${task.id}`, { method: 'DELETE' });
      if (res.ok) await loadOverview(false);
    } catch {
      setError('Failed to delete task.');
    }
  };

  const handleConvertInquiry = (inq: InquiryRecord) => {
    setEditingTask(null);
    setTaskPrefill({
      title: `${inq.platform} — ${inq.serviceType.split('(')[0].trim()}`,
      clientName: inq.companyName ? `${inq.fullName} (${inq.companyName})` : inq.fullName,
      clientEmail: inq.email,
      serviceType: inq.serviceType,
      totalAmount: inq.totalProjectAmount,
      notes: `Budget: ${inq.budgetRange} | Deadline: ${inq.deadline}\n${inq.projectDescription}`,
      sourceInquiryId: inq.id,
    });
    setTaskModalOpen(true);
  };

  const handleApproveApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvingApp) return;
    setApproveError(null);
    setApprovingSubmitting(true);

    try {
      const res = await fetch('/api/admin/applications/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: approvingApp.id,
          password: approvePassword,
        }),
      });
      const json = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !json.success) {
        setApproveError(json.error || 'Failed to register editor.');
        return;
      }
      setApprovingApp(null);
      setApprovePassword('');
      await loadOverview(false);
    } catch {
      setApproveError('Network error registering editor.');
    } finally {
      setApprovingSubmitting(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormMsg(null);
    setCreatingUser(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          type: newUserType,
        }),
      });
      const json = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !json.success) {
        setUserFormMsg({ type: 'err', text: json.error || 'Failed to create user.' });
        return;
      }
      setUserFormMsg({
        type: 'ok',
        text:
          newUserType === 'editor'
            ? `Registered Editor (${newUserEmail}). They can now log into /editor and receive task assignments.`
            : `Created ${newUserType} account (${newUserEmail}).`,
      });
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      await loadOverview(false);
    } catch {
      setUserFormMsg({ type: 'err', text: 'Network error creating user.' });
    } finally {
      setCreatingUser(false);
    }
  };

  const registeredEditors = useMemo(
    () => (overview?.users || []).filter((u) => u.type === 'editor' && u.isActive),
    [overview?.users]
  );

  const filteredTasks = useMemo(() => {
    const tasks = overview?.tasks || [];
    const q = searchQuery.trim().toLowerCase();
    return tasks.filter((t) => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (paymentFilter !== 'all' && t.paymentStatus !== paymentFilter) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.clientName.toLowerCase().includes(q) ||
        t.assignedTo.toLowerCase().includes(q) ||
        t.serviceType.toLowerCase().includes(q)
      );
    });
  }, [overview?.tasks, searchQuery, statusFilter, paymentFilter]);

  const summary = overview?.summary;
  const currentMonthLabel = new Date().toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Active tasks circular ring values
  const ringR = 22;
  const ringCirc = 2 * Math.PI * ringR;
  const ringPct = summary?.overallProgressRate ?? 0;
  const ringDash = (ringPct / 100) * ringCirc;

  const navItems: Array<{
    id: AdminSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'tasks', label: 'Tasks & Billing', icon: Briefcase, badge: overview?.tasks.length },
    {
      id: 'payments',
      label: 'Payment Verify',
      icon: ShieldCheck,
      badge:
        summary && summary.pendingVerificationCount > 0
          ? summary.pendingVerificationCount
          : overview?.paymentVerifications.length || undefined,
    },
    { id: 'inquiries', label: 'Inquiries', icon: Mail, badge: overview?.inquiries.length },
    { id: 'applications', label: 'Applications', icon: UserPlus, badge: overview?.applications.length },
    { id: 'team', label: 'Team & Editors', icon: Users, badge: registeredEditors.length },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4">
      <div className="space-y-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 px-2 py-1">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-emerald-400/50 bg-[#05070E] flex-shrink-0">
            <Image
              src="/motion-logo.jpg"
              alt="Motionxyne"
              width={32}
              height={32}
              className="w-full h-full object-cover scale-110"
            />
          </div>
          <div>
            <div className="text-sm font-bold tracking-wide text-[#F4F6FF]">Motionxyne</div>
            <div className="text-[10px] font-mono text-emerald-400 uppercase">Admin Cockpit</div>
          </div>
        </Link>

        {/* Main Nav */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveSection(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_16px_rgba(16,185,129,0.12)]'
                    : 'text-[#8A94B8] hover:text-[#F4F6FF] hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </span>
                {typeof item.badge === 'number' && (
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-[#D5DCF5]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setReportModalOpen(true);
              setMobileSidebarOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-[#8A94B8] hover:text-[#F4F6FF] hover:bg-white/[0.04] transition-all"
          >
            <FileBarChart2 className="w-4 h-4" />
            <span>Reports</span>
          </button>

          <Link
            href="/editor"
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-all"
          >
            <span className="flex items-center gap-2.5">
              <Clapperboard className="w-4 h-4" />
              <span>Editor Portal</span>
            </span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </nav>

        {/* Quick Actions */}
        <div className="pt-3 border-t border-white/[0.08] space-y-2">
          <div className="px-2 text-[11px] font-medium text-[#64748B]">Quick Actions</div>
          <button
            type="button"
            onClick={() => {
              setEditingTask(null);
              setTaskPrefill(null);
              setTaskModalOpen(true);
              setMobileSidebarOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-[#131826] hover:bg-[#192033] border border-white/[0.08] text-xs font-medium text-[#F4F6FF] transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>New Task</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSection('team');
              setNewUserType('editor');
              setMobileSidebarOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-[#131826] hover:bg-[#192033] border border-white/[0.08] text-xs font-medium text-[#F4F6FF] transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Register Editor</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSection('payments');
              setMobileSidebarOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-[#131826] hover:bg-[#192033] border border-white/[0.08] text-xs font-medium text-[#F4F6FF] transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verify Payment</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setReportModalOpen(true);
              setMobileSidebarOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-[#131826] hover:bg-[#192033] border border-white/[0.08] text-xs font-medium text-[#F4F6FF] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-4 border-t border-white/[0.08] space-y-1.5">
        <Link
          href="/"
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#8A94B8] hover:text-[#F4F6FF] hover:bg-white/[0.04]"
        >
          <Home className="w-4 h-4" />
          <span>Public Website</span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-300 hover:bg-rose-500/10"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#07090F] text-[#F4F6FF] flex">
      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:block w-60 flex-shrink-0 bg-[#0A0D15] border-r border-white/[0.08] sticky top-[3px] h-[calc(100vh-3px)] overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative z-10 w-64 bg-[#0A0D15] border-r border-white/[0.1] h-full overflow-y-auto">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-[#8A94B8] hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Search & Profile Bar */}
        <header className="sticky top-[3px] z-30 bg-[#0A0D15]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-7 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-[#0E111B] border border-white/[0.08] text-[#D5DCF5]"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tasks, clients, or editors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-[#0E111B] border border-white/[0.08] text-xs text-[#F4F6FF] placeholder:text-[#64748B] focus:outline-none focus:border-[#00F0FF]/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0E111B] border border-white/[0.08] text-xs text-[#D5DCF5]">
              <Calendar className="w-3.5 h-3.5 text-[#8A94B8]" />
              <span>{currentMonthLabel}</span>
            </div>

            <button
              type="button"
              onClick={() => setActiveSection('inquiries')}
              className="relative p-2 rounded-xl bg-[#0E111B] border border-white/[0.08] text-[#D5DCF5] hover:border-[#00F0FF]/40"
              title="Client Inquiries"
            >
              <Bell className="w-4 h-4" />
              {(overview?.inquiries.length || 0) > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center">
                  {overview?.inquiries.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => void loadOverview(true)}
              disabled={refreshing}
              className="p-2 rounded-xl bg-[#0E111B] border border-white/[0.08] text-[#D5DCF5] hover:border-[#00F0FF]/40"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-white/[0.08]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-[#00F0FF] text-[#05070E] font-bold text-xs flex items-center justify-center">
                {adminUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-xs font-semibold text-[#F4F6FF]">{adminUser.name}</div>
                <div className="text-[10px] font-mono text-emerald-400 uppercase">
                  {adminUser.type} (JWT)
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <div className="p-4 sm:p-7 space-y-6 max-w-[1440px] w-full mx-auto">
          {/* Section Title Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#F4F6FF] tracking-tight font-sans normal-case">
                {activeSection === 'dashboard' && 'Dashboard'}
                {activeSection === 'analytics' && 'Analytics & Insights'}
                {activeSection === 'tasks' && 'Tasks & Billing Ledger'}
                {activeSection === 'payments' && 'Payment Verification Desk'}
                {activeSection === 'inquiries' && 'Client Inquiries'}
                {activeSection === 'applications' && 'Editor Applications'}
                {activeSection === 'team' && 'Team & Registered Editors'}
              </h1>
              <p className="text-xs sm:text-sm text-[#8A94B8] mt-0.5">
                {activeSection === 'dashboard' &&
                  'Overview of your studio collections, receivables, and assigned editor tasks'}
                {activeSection === 'analytics' &&
                  'Deep financial trends, cash flow, and service category performance'}
                {activeSection === 'tasks' &&
                  'Register tasks, assign registered editors, and track payments synced across portals'}
                {activeSection === 'payments' &&
                  'Verify UTR claims manually, confirm actual ₹ received, and update paid or remaining balances'}
                {activeSection === 'inquiries' &&
                  'Incoming website briefs — convert any inquiry into a tracked editor task'}
                {activeSection === 'applications' &&
                  'Approve applicants and register them with Editor Portal login access'}
                {activeSection === 'team' &&
                  'Manage registered editors and admin accounts with strict role enforcement'}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setEditingTask(null);
                  setTaskPrefill(null);
                  setTaskModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#05070E] font-semibold text-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Task</span>
              </button>
              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E111B] border border-white/[0.12] hover:border-[#00F0FF]/50 text-xs font-medium text-[#F4F6FF] transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 flex items-center gap-2.5 text-sm text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading || !summary || !overview ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-28 rounded-2xl bg-[#0E111B] border border-white/[0.08] animate-pulse"
                />
              ))}
            </div>
          ) : (
            <>
              {/* Pending UPI QR Verification Alert */}
              {summary.pendingVerificationCount > 0 && (
                <div className="rounded-2xl bg-amber-500/10 border border-amber-500/40 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-amber-200">
                    <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <div>
                      <strong className="text-amber-300">
                        {summary.pendingVerificationCount} UPI QR Payment{' '}
                        {summary.pendingVerificationCount === 1 ? 'Claim' : 'Claims'} (
                        {formatCurrencyINR(summary.pendingVerificationAmount)})
                      </strong>{' '}
                      awaiting PhonePe / bank verification before crediting collected revenue.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSection('payments')}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#05070E] font-bold text-xs whitespace-nowrap"
                  >
                    Open Payment Verify →
                  </button>
                </div>
              )}

              {/* KPI ROW 1 (Visible on Dashboard & Analytics) */}
              {(activeSection === 'dashboard' || activeSection === 'analytics') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                  {/* Card 1: Amount Collected */}
                  <div className="rounded-2xl bg-[#0E111B] border border-white/[0.08] p-5 flex items-center justify-between gap-3 shadow-[0_12px_28px_rgba(0,0,0,0.4)]">
                    <div className="space-y-1 min-w-0">
                      <div className="text-xs text-[#8A94B8]">Amount Collected</div>
                      <div className="text-2xl font-bold text-[#F4F6FF] truncate">
                        {formatCurrencyINR(summary.totalCollected)}
                      </div>
                      <div className="text-[11px] font-mono text-emerald-400">
                        ↑ {summary.collectionRate}% collected
                      </div>
                    </div>
                    <MiniSparkline color="#10B981" points="2,24 18,20 32,22 46,12 64,15 82,4" />
                  </div>

                  {/* Card 2: Amount To Be Received */}
                  <div className="rounded-2xl bg-[#0E111B] border border-white/[0.08] p-5 flex items-center justify-between gap-3 shadow-[0_12px_28px_rgba(0,0,0,0.4)]">
                    <div className="space-y-1 min-w-0">
                      <div className="text-xs text-[#8A94B8]">Amount To Receive</div>
                      <div className="text-2xl font-bold text-[#F4F6FF] truncate">
                        {formatCurrencyINR(summary.totalToReceive)}
                      </div>
                      <div className="text-[11px] font-mono text-amber-400">
                        {(100 - summary.collectionRate).toFixed(1)}% pending due
                      </div>
                    </div>
                    <MiniSparkline color="#F97316" points="2,18 18,22 34,14 50,19 66,9 82,13" />
                  </div>

                  {/* Card 3: Total Billed */}
                  <div className="rounded-2xl bg-[#0E111B] border border-white/[0.08] p-5 flex items-center justify-between gap-3 shadow-[0_12px_28px_rgba(0,0,0,0.4)]">
                    <div className="space-y-1 min-w-0">
                      <div className="text-xs text-[#8A94B8]">Total Project Value</div>
                      <div className="text-2xl font-bold text-[#F4F6FF] truncate">
                        {formatCurrencyINR(summary.totalBilled)}
                      </div>
                      <div className="text-[11px] font-mono text-emerald-400">
                        {summary.totalTasks} total tasks
                      </div>
                    </div>
                    <MiniSparkline color="#00F0FF" points="2,25 18,21 36,19 52,14 68,10 82,3" />
                  </div>

                  {/* Card 4: Active Tasks with Circular Ring */}
                  <div className="rounded-2xl bg-gradient-to-br from-[#0E111B] to-[#0E1826] border border-[#00F0FF]/20 p-5 flex items-center justify-between gap-3 shadow-[0_12px_28px_rgba(0,0,0,0.4)]">
                    <div className="space-y-1">
                      <div className="text-xs text-[#8A94B8]">Active Tasks</div>
                      <div className="text-3xl font-bold text-[#F4F6FF]">{summary.activeTasks}</div>
                      <div className="text-[11px] font-mono text-[#00F0FF]">
                        {summary.completedTasks} completed
                      </div>
                    </div>

                    <div className="relative w-16 h-16 flex-shrink-0">
                      <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
                        <circle
                          cx="28"
                          cy="28"
                          r={ringR}
                          fill="none"
                          stroke="rgba(255,255,255,0.08)"
                          strokeWidth="5"
                        />
                        <circle
                          cx="28"
                          cy="28"
                          r={ringR}
                          fill="none"
                          stroke="#00F0FF"
                          strokeWidth="5"
                          strokeLinecap="round"
                          strokeDasharray={`${ringDash} ${ringCirc}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#F4F6FF] font-mono">
                        {ringPct}%
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DASHBOARD & ANALYTICS CHARTS */}
              {(activeSection === 'dashboard' || activeSection === 'analytics') && (
                <AdminCharts
                  summary={summary}
                  tasks={overview.tasks}
                  onViewTasks={() => setActiveSection('tasks')}
                />
              )}

              {/* TASKS & BILLING LEDGER */}
              {activeSection === 'tasks' && (
                <div className="rounded-2xl bg-[#0E111B] border border-white/[0.08] overflow-hidden shadow-xl">
                  <div className="p-4 sm:p-5 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                      <span className="text-[#8A94B8]">
                        Showing <strong className="text-[#F4F6FF]">{filteredTasks.length}</strong> tasks
                      </span>
                      <span className="text-emerald-400">
                        Collected: {formatCurrencyINR(summary.totalCollected)}
                      </span>
                      <span className="text-amber-400">
                        To Receive: {formatCurrencyINR(summary.totalToReceive)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-9 px-3 rounded-xl bg-[#080A12] border border-white/[0.1] text-xs font-mono text-[#D5DCF5]"
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">In Review</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <select
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                        className="h-9 px-3 rounded-xl bg-[#080A12] border border-white/[0.1] text-xs font-mono text-[#D5DCF5]"
                      >
                        <option value="all">All Payments</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="partial">Partial</option>
                        <option value="paid">Paid</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-white/[0.08] bg-[#121625] font-mono text-[10px] uppercase tracking-wider text-[#8A94B8]">
                          <th className="py-3 px-4">Task &amp; Service</th>
                          <th className="py-3 px-4">Client</th>
                          <th className="py-3 px-4">Assigned Editor</th>
                          <th className="py-3 px-4">Status &amp; Progress</th>
                          <th className="py-3 px-4">Due</th>
                          <th className="py-3 px-4 text-right">Total</th>
                          <th className="py-3 px-4 text-right">Collected</th>
                          <th className="py-3 px-4 text-right">To Receive</th>
                          <th className="py-3 px-4">Payment</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.06]">
                        {filteredTasks.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="py-12 text-center text-sm text-[#8A94B8]">
                              No tasks match your filters. Click <strong className="text-emerald-400">New Task</strong> to register and assign a task.
                            </td>
                          </tr>
                        ) : (
                          filteredTasks.map((task) => (
                            <tr key={task.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3.5 px-4 max-w-[210px]">
                                <div className="font-semibold text-[#F4F6FF] truncate">{task.title}</div>
                                <div className="font-mono text-[11px] text-[#8A94B8] truncate">
                                  {task.serviceType}
                                </div>
                                {task.deliverableUrl && (
                                  <a
                                    href={task.deliverableUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] font-mono text-[#00F0FF] hover:underline mt-0.5"
                                  >
                                    <span>Deliverable</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="text-[#D5DCF5] text-xs font-medium">{task.clientName}</div>
                                {task.clientEmail && (
                                  <div className="font-mono text-[10px] text-[#8A94B8]">
                                    {task.clientEmail}
                                  </div>
                                )}
                              </td>
                              <td className="py-3.5 px-4">
                                <select
                                  value={task.assignedEditorId || ''}
                                  onChange={(e) => void handleQuickEditorAssign(task, e.target.value)}
                                  className="px-2.5 py-1 rounded-lg bg-[#080A12] border border-white/[0.12] text-xs text-[#F4F6FF]"
                                >
                                  <option value="">
                                    {task.assignedEditorId ? 'Unassign' : task.assignedTo || 'Unassigned'}
                                  </option>
                                  {registeredEditors.map((ed) => (
                                    <option key={ed.id} value={ed.id}>
                                      {ed.name}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="py-3.5 px-4 space-y-1.5">
                                <select
                                  value={task.status}
                                  onChange={(e) =>
                                    void handleQuickStatusChange(task, e.target.value as TaskStatus)
                                  }
                                  className={`px-2.5 py-1 rounded-full border text-[10px] font-mono uppercase bg-[#080A12] ${STATUS_BADGE[task.status]}`}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="in_progress">In Progress</option>
                                  <option value="review">In Review</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                                    <div
                                      className="h-full bg-[#00F0FF] rounded-full"
                                      style={{ width: `${task.progress}%` }}
                                    />
                                  </div>
                                  <span className="font-mono text-[10px] text-[#8A94B8]">
                                    {task.progress}%
                                  </span>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 font-mono text-xs text-[#8A94B8] whitespace-nowrap">
                                {task.dueDate}
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono text-xs text-[#F4F6FF] whitespace-nowrap">
                                {formatCurrencyINR(task.totalAmount)}
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono text-xs text-emerald-400 font-semibold whitespace-nowrap">
                                {formatCurrencyINR(task.amountCollected)}
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono text-xs text-amber-400 font-semibold whitespace-nowrap">
                                {formatCurrencyINR(task.amountToReceive)}
                              </td>
                              <td className="py-3.5 px-4 space-y-1">
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-mono uppercase ${PAYMENT_BADGE[task.paymentStatus]}`}
                                >
                                  {task.paymentStatus}
                                </span>
                                {task.paymentVerificationStatus &&
                                  task.paymentVerificationStatus !== 'none' && (
                                    <div>
                                      <span
                                        className={`inline-block px-2 py-0.5 rounded border text-[9px] font-mono uppercase ${VERIFICATION_BADGE[task.paymentVerificationStatus].cls}`}
                                      >
                                        {task.paymentVerificationStatus === 'pending_verification'
                                          ? `Claimed ${formatCurrencyINR(task.claimedPaidAmount || 0)}`
                                          : VERIFICATION_BADGE[task.paymentVerificationStatus].label}
                                      </span>
                                    </div>
                                  )}
                                {task.utrReference && (
                                  <div className="font-mono text-[9px] text-[#8A94B8]">
                                    UTR: {task.utrReference}
                                  </div>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                <div className="inline-flex items-center gap-1.5">
                                  {(task.paymentVerificationStatus === 'pending_verification' ||
                                    task.amountToReceive > 0 ||
                                    task.totalAmount > 0) &&
                                    task.status !== 'cancelled' && (
                                      <button
                                        type="button"
                                        onClick={() => setVerifyTarget({ task })}
                                        title="Verify actual payment & update paid/remaining"
                                        className={`p-1.5 rounded-lg ${
                                          task.paymentVerificationStatus === 'pending_verification'
                                            ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 animate-pulse'
                                            : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                                        }`}
                                      >
                                        <ShieldCheck className="w-4 h-4" />
                                      </button>
                                    )}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setTaskPrefill(null);
                                      setEditingTask(task);
                                      setTaskModalOpen(true);
                                    }}
                                    title="Edit task"
                                    className="p-1.5 rounded-lg bg-white/[0.05] text-[#D5DCF5] hover:bg-white/[0.12]"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => void handleDeleteTask(task)}
                                    title="Delete task"
                                    className="p-1.5 rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Verified Payments & UTR Audit Trail */}
                  <div className="border-t border-white/[0.08] p-4 sm:p-5 bg-[#0A0D15]/60">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h3 className="text-sm font-semibold text-[#F4F6FF] flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Verified Payments &amp; UTR Audit Log</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveSection('payments')}
                        className="font-mono text-[11px] text-[#00F0FF] hover:underline"
                      >
                        Open Verification Desk ({overview.paymentVerifications.length}) →
                      </button>
                    </div>

                    <VerificationAuditTable
                      verifications={overview.paymentVerifications.slice(0, 15)}
                      emptyText="No UTR verifications recorded yet. Open Payment Verify or click the shield icon on any task to confirm actual payment received."
                    />
                  </div>
                </div>
              )}

              {/* PAYMENT VERIFICATION DESK */}
              {activeSection === 'payments' && (() => {
                const pendingTasks = overview.tasks.filter(
                  (t) => t.paymentVerificationStatus === 'pending_verification'
                );
                const pendingTaskInquiryIds = new Set(
                  pendingTasks.map((t) => t.sourceInquiryId).filter(Boolean)
                );
                const standalonePendingInquiries = overview.inquiries.filter(
                  (inq) =>
                    inq.paymentVerificationStatus === 'pending_verification' &&
                    !pendingTaskInquiryIds.has(inq.id)
                );

                const q = searchQuery.trim().toLowerCase();
                const manualConfirmTasks = overview.tasks.filter((t) => {
                  if (t.status === 'cancelled') return false;
                  if (!q) return true;
                  return (
                    t.title.toLowerCase().includes(q) ||
                    t.clientName.toLowerCase().includes(q) ||
                    (t.utrReference || '').toLowerCase().includes(q)
                  );
                });

                const unlinkedInquiriesWithBalance = overview.inquiries.filter(
                  (inq) =>
                    !inq.linkedTaskId &&
                    inq.paymentVerificationStatus !== 'pending_verification' &&
                    (!q ||
                      inq.fullName.toLowerCase().includes(q) ||
                      inq.email.toLowerCase().includes(q) ||
                      (inq.utrReference || '').toLowerCase().includes(q))
                );

                return (
                  <div className="space-y-6">
                    {/* Summary KPI Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="rounded-2xl bg-[#0E111B] border border-amber-500/30 p-5 space-y-1">
                        <div className="text-xs text-[#8A94B8]">Pending UTR Claims</div>
                        <div className="text-2xl font-bold text-amber-300">
                          {formatCurrencyINR(summary.pendingVerificationAmount)}
                        </div>
                        <div className="text-[11px] font-mono text-amber-400">
                          {summary.pendingVerificationCount + standalonePendingInquiries.length} claims awaiting verify
                        </div>
                      </div>
                      <div className="rounded-2xl bg-[#0E111B] border border-emerald-500/30 p-5 space-y-1">
                        <div className="text-xs text-[#8A94B8]">Verified Amount Collected</div>
                        <div className="text-2xl font-bold text-emerald-400">
                          {formatCurrencyINR(summary.totalCollected)}
                        </div>
                        <div className="text-[11px] font-mono text-emerald-300">
                          {overview.paymentVerifications.length} logged verifications
                        </div>
                      </div>
                      <div className="rounded-2xl bg-[#0E111B] border border-white/[0.08] p-5 space-y-1">
                        <div className="text-xs text-[#8A94B8]">Remaining Balance To Collect</div>
                        <div className="text-2xl font-bold text-[#F4F6FF]">
                          {formatCurrencyINR(summary.totalToReceive)}
                        </div>
                        <div className="text-[11px] font-mono text-[#00F0FF]">
                          {summary.collectionRate}% collection rate
                        </div>
                      </div>
                    </div>

                    {/* 1. Pending UPI QR Claims Queue */}
                    <div className="rounded-2xl bg-[#0E111B] border border-amber-500/30 overflow-hidden shadow-xl">
                      <div className="p-4 sm:p-5 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-[#F4F6FF] flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-amber-400" />
                            <span>Pending UPI QR Payment Claims</span>
                          </h3>
                          <p className="text-xs text-[#8A94B8] mt-0.5">
                            Check your PhonePe / bank statement against each UTR, then confirm the exact ₹ received.
                          </p>
                        </div>
                        <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/35">
                          {pendingTasks.length + standalonePendingInquiries.length} Pending
                        </span>
                      </div>

                      {pendingTasks.length === 0 && standalonePendingInquiries.length === 0 ? (
                        <div className="p-8 text-center text-xs font-mono text-[#8A94B8]">
                          No unverified UPI QR payment claims pending right now.
                        </div>
                      ) : (
                        <div className="divide-y divide-white/[0.06]">
                          {pendingTasks.map((task) => (
                            <div
                              key={task.id}
                              className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-white/[0.02]"
                            >
                              <div className="space-y-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-semibold text-sm text-[#F4F6FF]">
                                    {task.clientName}
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/35 text-amber-300 font-mono text-[10px] uppercase">
                                    Claimed {formatCurrencyINR(task.claimedPaidAmount || 0)}
                                  </span>
                                  {task.utrReference && (
                                    <span className="px-2 py-0.5 rounded bg-[#00F0FF]/15 text-[#00F0FF] font-mono text-[10px]">
                                      UTR: {task.utrReference}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-[#8A94B8] truncate">
                                  {task.title} · Agreed Total: {formatCurrencyINR(task.totalAmount)} · Due {task.dueDate}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => setVerifyTarget({ task })}
                                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#05070E] font-bold text-xs inline-flex items-center gap-1.5"
                              >
                                <ShieldCheck className="w-4 h-4" />
                                <span>Verify &amp; Confirm ₹</span>
                              </button>
                            </div>
                          ))}

                          {standalonePendingInquiries.map((inq) => (
                            <div
                              key={inq.id}
                              className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-white/[0.02]"
                            >
                              <div className="space-y-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-semibold text-sm text-[#F4F6FF]">
                                    {inq.fullName}
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/35 text-amber-300 font-mono text-[10px] uppercase">
                                    Claimed {formatCurrencyINR(inq.claimedPaidAmount || 0)}
                                  </span>
                                  {inq.utrReference && (
                                    <span className="px-2 py-0.5 rounded bg-[#00F0FF]/15 text-[#00F0FF] font-mono text-[10px]">
                                      UTR: {inq.utrReference}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-[#8A94B8]">
                                  {inq.serviceType} · Budget: {inq.budgetRange}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => setVerifyTarget({ inquiry: inq })}
                                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#05070E] font-bold text-xs inline-flex items-center gap-1.5"
                              >
                                <ShieldCheck className="w-4 h-4" />
                                <span>Verify &amp; Confirm ₹</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 2. Manual Payment Confirmation Across All Projects */}
                    <div className="rounded-2xl bg-[#0E111B] border border-white/[0.08] overflow-hidden shadow-xl">
                      <div className="p-4 sm:p-5 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-[#F4F6FF]">
                            Manual Payment Confirmation &amp; Balance Update
                          </h3>
                          <p className="text-xs text-[#8A94B8] mt-0.5">
                            Manually verify direct UPI/bank payments, log follow-up installments, or adjust paid vs remaining amounts.
                          </p>
                        </div>
                        <span className="font-mono text-xs text-[#8A94B8]">
                          {manualConfirmTasks.length} tasks · {unlinkedInquiriesWithBalance.length} unlinked inquiries
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                          <thead>
                            <tr className="border-b border-white/[0.08] bg-[#121625] font-mono text-[10px] uppercase tracking-wider text-[#8A94B8]">
                              <th className="py-3 px-4">Project / Client</th>
                              <th className="py-3 px-4 text-right">Agreed Total</th>
                              <th className="py-3 px-4 text-right">Verified Paid</th>
                              <th className="py-3 px-4 text-right">Remaining Due</th>
                              <th className="py-3 px-4">Verification</th>
                              <th className="py-3 px-4">UTR Reference</th>
                              <th className="py-3 px-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/[0.06]">
                            {manualConfirmTasks.map((task) => (
                              <tr key={task.id} className="hover:bg-white/[0.02]">
                                <td className="py-3 px-4">
                                  <div className="font-semibold text-[#F4F6FF]">{task.clientName}</div>
                                  <div className="text-[11px] text-[#8A94B8] truncate max-w-[240px]">
                                    {task.title}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right font-mono text-xs text-[#F4F6FF]">
                                  {formatCurrencyINR(task.totalAmount)}
                                </td>
                                <td className="py-3 px-4 text-right font-mono text-xs text-emerald-400 font-semibold">
                                  {formatCurrencyINR(task.amountCollected)}
                                </td>
                                <td className="py-3 px-4 text-right font-mono text-xs text-amber-400 font-semibold">
                                  {formatCurrencyINR(task.amountToReceive)}
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded border text-[10px] font-mono uppercase ${
                                      VERIFICATION_BADGE[task.paymentVerificationStatus || 'none'].cls
                                    }`}
                                  >
                                    {VERIFICATION_BADGE[task.paymentVerificationStatus || 'none'].label}
                                  </span>
                                </td>
                                <td className="py-3 px-4 font-mono text-xs text-[#00F0FF]">
                                  {task.utrReference || '—'}
                                </td>
                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => setVerifyTarget({ task })}
                                    className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] inline-flex items-center gap-1.5"
                                  >
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>
                                      {task.amountToReceive > 0 ? 'Update Payment' : 'Adjust / Verify'}
                                    </span>
                                  </button>
                                </td>
                              </tr>
                            ))}

                            {unlinkedInquiriesWithBalance.map((inq) => (
                              <tr key={`inq-${inq.id}`} className="hover:bg-white/[0.02] bg-white/[0.01]">
                                <td className="py-3 px-4">
                                  <div className="font-semibold text-[#F4F6FF]">{inq.fullName}</div>
                                  <div className="text-[11px] text-[#8A94B8]">
                                    Inquiry · {inq.serviceType}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right font-mono text-xs text-[#F4F6FF]">
                                  {inq.totalProjectAmount
                                    ? formatCurrencyINR(inq.totalProjectAmount)
                                    : inq.budgetRange}
                                </td>
                                <td className="py-3 px-4 text-right font-mono text-xs text-emerald-400 font-semibold">
                                  {formatCurrencyINR(inq.paidAmount || 0)}
                                </td>
                                <td className="py-3 px-4 text-right font-mono text-xs text-amber-400 font-semibold">
                                  {formatCurrencyINR(inq.remainingAmount || 0)}
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded border text-[10px] font-mono uppercase ${
                                      VERIFICATION_BADGE[inq.paymentVerificationStatus || 'none'].cls
                                    }`}
                                  >
                                    {VERIFICATION_BADGE[inq.paymentVerificationStatus || 'none'].label}
                                  </span>
                                </td>
                                <td className="py-3 px-4 font-mono text-xs text-[#00F0FF]">
                                  {inq.utrReference || '—'}
                                </td>
                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => setVerifyTarget({ inquiry: inq })}
                                    className="px-3 py-1.5 rounded-xl bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 border border-[#00F0FF]/40 text-[#00F0FF] font-mono text-[11px] inline-flex items-center gap-1.5"
                                  >
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>Record &amp; Verify ₹</span>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* 3. Verified Payments & UTR Audit Log */}
                    <div className="rounded-2xl bg-[#0E111B] border border-white/[0.08] p-4 sm:p-5 shadow-xl">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <h3 className="text-base font-semibold text-[#F4F6FF] flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Payment Confirmation &amp; UTR Audit History</span>
                        </h3>
                        <span className="font-mono text-xs text-[#8A94B8]">
                          {overview.paymentVerifications.length} entries
                        </span>
                      </div>

                      <VerificationAuditTable
                        verifications={overview.paymentVerifications}
                        emptyText="No payment confirmations logged yet."
                      />
                    </div>
                  </div>
                );
              })()}

              {/* CLIENT INQUIRIES */}
              {activeSection === 'inquiries' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {overview.inquiries.length === 0 ? (
                    <div className="md:col-span-2 p-10 rounded-2xl bg-[#0E111B] border border-white/[0.08] text-center text-sm text-[#8A94B8]">
                      No client inquiries in MongoDB yet.
                    </div>
                  ) : (
                    overview.inquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="rounded-2xl bg-[#0E111B] border border-white/[0.08] p-5 flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="text-lg font-bold text-[#F4F6FF]">{inq.fullName}</h4>
                              <div className="font-mono text-xs text-[#8A94B8]">
                                {inq.email} {inq.companyName ? `· ${inq.companyName}` : ''}
                              </div>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 font-mono text-[10px]">
                              {inq.budgetRange}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                            <span className="px-2 py-0.5 rounded bg-[#00F0FF]/15 text-[#00F0FF]">
                              Status: {inq.status}
                            </span>
                            {inq.paymentVerificationStatus &&
                            inq.paymentVerificationStatus !== 'none' ? (
                              <span
                                className={`px-2 py-0.5 rounded border ${VERIFICATION_BADGE[inq.paymentVerificationStatus].cls}`}
                              >
                                {inq.paymentVerificationStatus === 'pending_verification'
                                  ? `Claimed ${formatCurrencyINR(inq.claimedPaidAmount || 0)} (Pending Verify)`
                                  : `${VERIFICATION_BADGE[inq.paymentVerificationStatus].label}: Paid ${formatCurrencyINR(inq.paidAmount || 0)} / Due ${formatCurrencyINR(inq.remainingAmount || 0)}`}
                              </span>
                            ) : inq.paidAmount && inq.paidAmount > 0 ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/35">
                                Paid {formatCurrencyINR(inq.paidAmount)} ({inq.paymentMode?.toUpperCase()})
                              </span>
                            ) : null}
                            {inq.utrReference && (
                              <span className="px-2 py-0.5 rounded bg-white/[0.06] text-[#F4F6FF]">
                                UTR: {inq.utrReference}
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[#D5DCF5]">
                              {inq.serviceType}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[#8A94B8]">
                              {inq.platform}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-[#D5DCF5] leading-relaxed">
                            {inq.projectDescription}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono text-[11px] text-[#8A94B8]">
                            {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : ''}
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            {(inq.paymentVerificationStatus === 'pending_verification' ||
                              inq.paymentMode !== 'none' ||
                              (inq.remainingAmount ?? 0) > 0) && (
                              <button
                                type="button"
                                onClick={() => setVerifyTarget({ inquiry: inq })}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono ${
                                  inq.paymentVerificationStatus === 'pending_verification'
                                    ? 'bg-amber-500/20 border-amber-500/45 text-amber-200 hover:bg-amber-500/30'
                                    : 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300 hover:bg-emerald-500/25'
                                }`}
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>
                                  {inq.paymentVerificationStatus === 'pending_verification'
                                    ? 'Verify UTR & Actual ₹'
                                    : 'Verify / Update Paid'}
                                </span>
                              </button>
                            )}
                            {inq.linkedTaskId ? (
                              <button
                                type="button"
                                onClick={() => setActiveSection('tasks')}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-mono"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Linked to Task →</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleConvertInquiry(inq)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/35 text-[#00F0FF] text-xs font-mono hover:bg-[#00F0FF]/25"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Convert &amp; Assign Task</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* EDITOR APPLICATIONS */}
              {activeSection === 'applications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {overview.applications.length === 0 ? (
                    <div className="md:col-span-2 p-10 rounded-2xl bg-[#0E111B] border border-white/[0.08] text-center text-sm text-[#8A94B8]">
                      No editor applications found in MongoDB yet.
                    </div>
                  ) : (
                    overview.applications.map((app) => (
                      <div
                        key={app.id}
                        className="rounded-2xl bg-[#0E111B] border border-white/[0.08] p-5 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="text-lg font-bold text-[#F4F6FF]">{app.fullName}</h4>
                              <div className="font-mono text-xs text-[#8A94B8]">
                                {app.email} · {app.location}
                              </div>
                            </div>
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase border ${
                                app.status === 'approved'
                                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
                                  : 'bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/35'
                              }`}
                            >
                              {app.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                            <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[#D5DCF5]">
                              {app.primarySoftware}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[#8A94B8]">
                              {app.experienceLevel}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[#8A94B8]">
                              {app.weeklyAvailability}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-[#D5DCF5] leading-relaxed">
                            {app.motivation}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                          <a
                            href={app.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#00F0FF] hover:underline"
                          >
                            <span>Portfolio</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>

                          {app.registeredUserId || app.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1.5 text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Registered Editor</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setApproveError(null);
                                setApprovePassword('');
                                setApprovingApp(app);
                              }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25"
                            >
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>Approve &amp; Register Editor</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TEAM & REGISTERED EDITORS */}
              {activeSection === 'team' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 rounded-2xl bg-[#0E111B] border border-white/[0.08] overflow-hidden">
                    <div className="p-5 border-b border-white/[0.08]">
                      <h3 className="text-base font-semibold text-[#F4F6FF]">
                        Registered Portal Accounts
                      </h3>
                      <p className="text-xs text-[#8A94B8] mt-1">
                        <code className="text-emerald-400">type: &quot;admin&quot;</code> accesses <code className="text-[#F4F6FF]">/admin</code>. Only registered <code className="text-[#00F0FF]">type: &quot;editor&quot;</code> users can log into <code className="text-[#F4F6FF]">/editor</code>.
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-white/[0.08] bg-[#121625] font-mono text-[10px] uppercase tracking-wider text-[#8A94B8]">
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Type</th>
                            <th className="py-3 px-4">Assigned</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.06]">
                          {overview.users.map((u) => {
                            const assignedCount = overview.tasks.filter(
                              (t) =>
                                t.assignedEditorId === u.id ||
                                t.assignedEditorEmail?.toLowerCase() === u.email.toLowerCase()
                            ).length;
                            return (
                              <tr key={u.id}>
                                <td className="py-3 px-4 font-medium text-[#F4F6FF]">{u.name}</td>
                                <td className="py-3 px-4 font-mono text-xs text-[#8A94B8]">{u.email}</td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase border ${
                                      u.type === 'admin'
                                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
                                        : u.type === 'editor'
                                        ? 'bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/35'
                                        : 'bg-white/[0.06] text-[#8A94B8] border-white/[0.12]'
                                    }`}
                                  >
                                    {u.type}
                                  </span>
                                </td>
                                <td className="py-3 px-4 font-mono text-xs text-[#D5DCF5]">
                                  {u.type === 'editor' ? `${assignedCount} tasks` : '—'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="lg:col-span-5 rounded-2xl bg-[#0E111B] border border-white/[0.08] p-5 space-y-4">
                    <div>
                      <h3 className="text-base font-semibold text-[#F4F6FF]">
                        Register New Editor / User
                      </h3>
                      <p className="text-xs text-[#8A94B8] mt-1">
                        Registered <code className="text-[#00F0FF]">editor</code> users appear immediately in task assignment dropdowns and can sign in at <code className="text-[#F4F6FF]">/editor</code>.
                      </p>
                    </div>

                    {userFormMsg && (
                      <div
                        className={`p-3 rounded-xl text-xs border ${
                          userFormMsg.type === 'ok'
                            ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                            : 'bg-red-950/50 border-red-500/40 text-red-200'
                        }`}
                      >
                        {userFormMsg.text}
                      </div>
                    )}

                    <form onSubmit={handleCreateUser} className="space-y-3">
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl bg-[#060710] border border-white/[0.15] text-sm text-[#F4F6FF]"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Email Address"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl bg-[#060710] border border-white/[0.15] text-sm text-[#F4F6FF]"
                      />
                      <input
                        type="password"
                        required
                        minLength={8}
                        placeholder="Password (min 8 chars)"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl bg-[#060710] border border-white/[0.15] text-sm text-[#F4F6FF]"
                      />
                      <select
                        value={newUserType}
                        onChange={(e) => setNewUserType(e.target.value as UserType)}
                        className="w-full h-10 px-3.5 rounded-xl bg-[#060710] border border-white/[0.15] text-sm text-[#F4F6FF]"
                      >
                        <option value="editor">type: editor (Editor Portal + Task Assignment)</option>
                        <option value="admin">type: admin (Admin Portal Access)</option>
                        <option value="client">type: client (Blocked from portals)</option>
                      </select>
                      <button
                        type="submit"
                        disabled={creatingUser}
                        className="w-full py-2.5 px-5 rounded-xl bg-[#00F0FF] text-[#05070E] font-bold text-xs inline-flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>{creatingUser ? 'Registering...' : 'Register Account'}</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSaved={() => loadOverview(false)}
        registeredEditors={registeredEditors}
        initialTask={editingTask}
        prefill={taskPrefill}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        tasks={overview?.tasks || []}
        adminEmail={adminUser.email}
      />

      {/* Payment Verification Modal */}
      <PaymentVerifyModal
        isOpen={Boolean(verifyTarget)}
        onClose={() => setVerifyTarget(null)}
        onVerified={() => loadOverview(false)}
        target={verifyTarget}
      />

      {/* Approve & Register Editor Modal */}
      {approvingApp && (
        <div className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0D101B] border border-emerald-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
                  REGISTER EDITOR ACCOUNT
                </div>
                <h3 className="text-lg font-bold text-[#F4F6FF]">{approvingApp.fullName}</h3>
                <p className="text-xs font-mono text-[#8A94B8]">{approvingApp.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setApprovingApp(null)}
                className="p-1.5 rounded-lg text-[#8A94B8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {approveError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-xs text-red-200">
                {approveError}
              </div>
            )}

            <form onSubmit={handleApproveApplication} className="space-y-3">
              <div className="space-y-1.5">
                <label className="block font-mono text-[11px] uppercase text-[#8A94B8]">
                  Set Editor Portal Password (min 8 chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="Assign password for /editor login"
                  value={approvePassword}
                  onChange={(e) => setApprovePassword(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#060710] border border-white/[0.15] text-sm text-[#F4F6FF]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setApprovingApp(null)}
                  className="px-4 py-2 rounded-xl border border-white/[0.12] text-xs text-[#D5DCF5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={approvingSubmitting}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-[#05070E] font-bold text-xs disabled:opacity-50"
                >
                  {approvingSubmitting ? 'Registering...' : 'Approve & Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
