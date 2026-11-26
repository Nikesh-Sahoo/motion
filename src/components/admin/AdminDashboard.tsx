'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
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
  Users,
  Briefcase,
  Mail,
  UserPlus,
  AlertCircle,
} from 'lucide-react';
import type {
  AdminOverviewPayload,
  AdminTask,
  AdminUserPublic,
  InquiryRecord,
  TaskStatus,
  UserType,
} from '@/types/admin';
import { formatCurrencyINR } from '@/lib/admin/report';
import { Tilt3D } from '@/components/ui/Tilt3D';
import { AdminCharts } from '@/components/admin/AdminCharts';
import { TaskModal } from '@/components/admin/TaskModal';
import { ReportModal } from '@/components/admin/ReportModal';

interface AdminDashboardProps {
  adminUser: AdminUserPublic;
  onLoggedOut: () => void;
}

type AdminTab = 'tasks' | 'inquiries' | 'applications' | 'users';

const STATUS_BADGE: Record<TaskStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-300 border-amber-500/35',
  in_progress: 'bg-[#19C3B8]/15 text-[#19C3B8] border-[#19C3B8]/35',
  review: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/35',
  completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35',
  cancelled: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/35',
};

const PAYMENT_BADGE = {
  paid: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35',
  partial: 'bg-[#FF9933]/15 text-[#FF9933] border-[#FF9933]/35',
  unpaid: 'bg-red-500/15 text-red-300 border-red-500/35',
};

export function AdminDashboard({ adminUser, onLoggedOut }: AdminDashboardProps) {
  const [overview, setOverview] = useState<AdminOverviewPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('tasks');

  // Task filters
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
    notes?: string;
    sourceInquiryId?: string;
  } | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // User creation form state (Access tab)
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserType, setNewUserType] = useState<UserType>('editor');
  const [userFormMsg, setUserFormMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [creatingUser, setCreatingUser] = useState(false);

  const loadOverview = useCallback(async (isManual = false) => {
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
  }, [onLoggedOut]);

  useEffect(() => {
    void loadOverview(false);
  }, [loadOverview]);

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    onLoggedOut();
  };

  const handleQuickMarkPaid = async (task: AdminTask) => {
    try {
      const res = await fetch(`/api/admin/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountCollected: task.totalAmount }),
      });
      if (res.ok) {
        await loadOverview(false);
      }
    } catch {
      setError('Failed to mark task as paid.');
    }
  };

  const handleQuickStatusChange = async (task: AdminTask, nextStatus: TaskStatus) => {
    try {
      const res = await fetch(`/api/admin/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        await loadOverview(false);
      }
    } catch {
      setError('Failed to update task status.');
    }
  };

  const handleDeleteTask = async (task: AdminTask) => {
    try {
      const res = await fetch(`/api/admin/tasks/${task.id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadOverview(false);
      }
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
      notes: `Budget: ${inq.budgetRange} | Deadline: ${inq.deadline}\n${inq.projectDescription}`,
      sourceInquiryId: inq.id,
    });
    setTaskModalOpen(true);
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
        text: `Created ${newUserType} user (${newUserEmail}). Only type 'admin' can access /admin.`,
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

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#F3EFE7] pb-20">
      {/* Top Admin Header */}
      <header className="sticky top-[3px] z-40 bg-[#0B0B0D]/90 backdrop-blur-2xl border-b border-white/[0.08]">
        <div className="w-[min(82rem,calc(100%-2rem))] mx-auto py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#19C3B8]/50 bg-[#0B0B0D]">
                <Image
                  src="/motion-logo.jpg"
                  alt="Motionxyne"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover scale-110"
                />
              </div>
              <div>
                <div className="font-display text-xl tracking-wider text-[#F3EFE7] leading-none">
                  MOTIONXYNE ADMIN
                </div>
                <div className="font-mono text-[10px] text-[#19C3B8] tracking-widest uppercase">
                  OPERATIONS &amp; BILLING PORTAL
                </div>
              </div>
            </Link>

            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 font-mono text-[10px] text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              JWT VERIFIED · TYPE: {adminUser.type.toUpperCase()}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="hidden sm:block text-right mr-2">
              <div className="text-xs font-semibold text-[#F3EFE7]">{adminUser.name}</div>
              <div className="font-mono text-[10px] text-[#97959F]">{adminUser.email}</div>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingTask(null);
                setTaskPrefill(null);
                setTaskModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF9933] text-[#0B0B0D] font-bold text-xs hover:shadow-[0_0_20px_rgba(255,153,51,0.5)] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>

            <button
              type="button"
              onClick={() => setReportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#19C3B8]/15 border border-[#19C3B8]/40 text-[#19C3B8] font-semibold text-xs hover:bg-[#19C3B8]/25 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Generate Report</span>
            </button>

            <button
              type="button"
              onClick={() => void loadOverview(true)}
              disabled={refreshing}
              className="p-2 rounded-full border border-white/[0.12] text-[#97959F] hover:text-[#F3EFE7] hover:border-white/30 transition-colors"
              title="Refresh data"
              aria-label="Refresh dashboard data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/[0.12] text-xs font-mono text-[#DDD8CE] hover:border-red-500/50 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="w-[min(82rem,calc(100%-2rem))] mx-auto pt-8 space-y-8">
        {error && (
          <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 flex items-center gap-2.5 text-sm text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading || !summary ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-32 rounded-2xl bg-[#14141B] border border-white/[0.08] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 perspective-stage">
              <Tilt3D maxTilt={7} scale={1.02} glareColor="rgba(25, 195, 184, 0.14)" className="rounded-2xl">
                <div className="p-6 rounded-2xl bg-[#14141B]/95 border border-white/[0.08] shadow-[0_12px_30px_rgba(0,0,0,0.45)] space-y-2">
                  <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-[#97959F]">
                    <span>Total Tasks</span>
                    <span className="px-2 py-0.5 rounded bg-white/[0.06] text-[#F3EFE7]">
                      {summary.activeTasks} active
                    </span>
                  </div>
                  <div className="font-display text-4xl text-[#F3EFE7]">{summary.totalTasks}</div>
                  <div className="font-mono text-xs text-[#97959F]">
                    {summary.completedTasks} completed · {summary.totalInquiries} inquiries
                  </div>
                </div>
              </Tilt3D>

              <Tilt3D maxTilt={7} scale={1.02} glareColor="rgba(243, 239, 231, 0.12)" className="rounded-2xl">
                <div className="p-6 rounded-2xl bg-[#14141B]/95 border border-white/[0.08] shadow-[0_12px_30px_rgba(0,0,0,0.45)] space-y-2">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-[#97959F]">
                    Total Billed Value
                  </div>
                  <div className="font-display text-4xl text-[#F3EFE7]">
                    {formatCurrencyINR(summary.totalBilled)}
                  </div>
                  <div className="font-mono text-xs text-[#97959F]">
                    Across active &amp; completed projects
                  </div>
                </div>
              </Tilt3D>

              <Tilt3D maxTilt={7} scale={1.02} glareColor="rgba(25, 195, 184, 0.18)" className="rounded-2xl">
                <div className="p-6 rounded-2xl bg-[#14141B]/95 border border-[#19C3B8]/30 shadow-[0_12px_30px_rgba(0,0,0,0.45)] space-y-2">
                  <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-[#19C3B8]">
                    <span>Amount Collected</span>
                    <span className="px-2 py-0.5 rounded bg-[#19C3B8]/15 text-[#19C3B8]">
                      {summary.collectionRate}%
                    </span>
                  </div>
                  <div className="font-display text-4xl text-[#19C3B8]">
                    {formatCurrencyINR(summary.totalCollected)}
                  </div>
                  <div className="font-mono text-xs text-[#97959F]">
                    Payments received &amp; settled
                  </div>
                </div>
              </Tilt3D>

              <Tilt3D maxTilt={7} scale={1.02} glareColor="rgba(255, 153, 51, 0.18)" className="rounded-2xl">
                <div className="p-6 rounded-2xl bg-[#14141B]/95 border border-[#FF9933]/35 shadow-[0_12px_30px_rgba(0,0,0,0.45)] space-y-2">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-[#FF9933]">
                    Amount To Be Received
                  </div>
                  <div className="font-display text-4xl text-[#FF9933]">
                    {formatCurrencyINR(summary.totalToReceive)}
                  </div>
                  <div className="font-mono text-xs text-[#97959F]">
                    Outstanding receivables pending
                  </div>
                </div>
              </Tilt3D>
            </div>

            {/* Data Graphs */}
            <AdminCharts summary={summary} />

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-3">
              <button
                type="button"
                onClick={() => setActiveTab('tasks')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-colors ${
                  activeTab === 'tasks'
                    ? 'bg-[#FF9933] text-[#0B0B0D] font-bold'
                    : 'bg-[#14141B] text-[#97959F] border border-white/[0.08] hover:text-[#F3EFE7]'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Tasks &amp; Billing ({overview?.tasks.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('inquiries')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-colors ${
                  activeTab === 'inquiries'
                    ? 'bg-[#19C3B8] text-[#0B0B0D] font-bold'
                    : 'bg-[#14141B] text-[#97959F] border border-white/[0.08] hover:text-[#F3EFE7]'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Client Inquiries ({overview?.inquiries.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('applications')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-colors ${
                  activeTab === 'applications'
                    ? 'bg-[#19C3B8] text-[#0B0B0D] font-bold'
                    : 'bg-[#14141B] text-[#97959F] border border-white/[0.08] hover:text-[#F3EFE7]'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Editor Applications ({overview?.applications.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-colors ${
                  activeTab === 'users'
                    ? 'bg-[#19C3B8] text-[#0B0B0D] font-bold'
                    : 'bg-[#14141B] text-[#97959F] border border-white/[0.08] hover:text-[#F3EFE7]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Access &amp; Users ({overview?.users.length || 0})</span>
              </button>
            </div>

            {/* TAB 1: Tasks & Billing Ledger */}
            {activeTab === 'tasks' && (
              <div className="rounded-2xl bg-[#14141B]/95 border border-white/[0.08] overflow-hidden shadow-xl">
                <div className="p-4 sm:p-5 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                  <div className="relative flex-1 min-w-[220px]">
                    <Search className="w-4 h-4 text-[#97959F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search tasks, clients, assignees, or services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#0B0B0D] border border-white/[0.12] text-sm text-[#F3EFE7] placeholder:text-[#97959F]/60 focus:outline-none focus:border-[#19C3B8]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="h-10 px-3 rounded-xl bg-[#0B0B0D] border border-white/[0.12] text-xs font-mono text-[#DDD8CE]"
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
                      className="h-10 px-3 rounded-xl bg-[#0B0B0D] border border-white/[0.12] text-xs font-mono text-[#DDD8CE]"
                    >
                      <option value="all">All Payments</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="partial">Partial</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.08] bg-[#181822] font-mono text-[10px] uppercase tracking-wider text-[#97959F]">
                        <th className="py-3 px-4">Task &amp; Service</th>
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">Assignee</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Due Date</th>
                        <th className="py-3 px-4 text-right">Total Fee</th>
                        <th className="py-3 px-4 text-right">Collected</th>
                        <th className="py-3 px-4 text-right">To Receive</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                      {filteredTasks.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="py-12 text-center text-sm text-[#97959F]">
                            No tasks match your filters. Click <strong className="text-[#FF9933]">New Task</strong> or convert an inquiry to start tracking tasks and payments.
                          </td>
                        </tr>
                      ) : (
                        filteredTasks.map((task) => (
                          <tr key={task.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3.5 px-4 max-w-[230px]">
                              <div className="font-semibold text-[#F3EFE7] truncate">{task.title}</div>
                              <div className="font-mono text-[11px] text-[#97959F] truncate">
                                {task.serviceType}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="text-[#DDD8CE]">{task.clientName}</div>
                              {task.clientEmail && (
                                <div className="font-mono text-[11px] text-[#97959F]">
                                  {task.clientEmail}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-xs text-[#DDD8CE]">
                              {task.assignedTo}
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={task.status}
                                onChange={(e) =>
                                  void handleQuickStatusChange(task, e.target.value as TaskStatus)
                                }
                                className={`px-2.5 py-1 rounded-full border text-[11px] font-mono uppercase bg-[#0B0B0D] ${STATUS_BADGE[task.status]}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="review">In Review</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-xs text-[#97959F] whitespace-nowrap">
                              {task.dueDate}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono text-xs text-[#F3EFE7] whitespace-nowrap">
                              {formatCurrencyINR(task.totalAmount)}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono text-xs text-[#19C3B8] font-semibold whitespace-nowrap">
                              {formatCurrencyINR(task.amountCollected)}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono text-xs text-[#FF9933] font-semibold whitespace-nowrap">
                              {formatCurrencyINR(task.amountToReceive)}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-mono uppercase ${PAYMENT_BADGE[task.paymentStatus]}`}
                              >
                                {task.paymentStatus}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                {task.amountToReceive > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => void handleQuickMarkPaid(task)}
                                    title="Mark fully paid"
                                    className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
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
                                  className="p-1.5 rounded-lg bg-white/[0.05] text-[#DDD8CE] hover:bg-white/[0.12]"
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
              </div>
            )}

            {/* TAB 2: Client Inquiries */}
            {activeTab === 'inquiries' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {(overview?.inquiries || []).length === 0 ? (
                  <div className="md:col-span-2 p-10 rounded-2xl bg-[#14141B] border border-white/[0.08] text-center text-sm text-[#97959F]">
                    No client inquiries found in MongoDB <code className="text-[#F3EFE7]">inquiries</code> collection yet.
                  </div>
                ) : (
                  overview?.inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="rounded-2xl bg-[#14141B]/95 border border-white/[0.08] p-5 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-display text-xl text-[#F3EFE7] uppercase">
                              {inq.fullName}
                            </h4>
                            <div className="font-mono text-xs text-[#97959F]">
                              {inq.email} {inq.companyName ? `· ${inq.companyName}` : ''}
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FF9933]/15 border border-[#FF9933]/35 text-[#FF9933] font-mono text-[10px]">
                            {inq.budgetRange}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                          <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[#19C3B8]">
                            {inq.platform}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[#DDD8CE]">
                            {inq.serviceType}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[#97959F]">
                            {inq.deadline}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-[#DDD8CE] leading-relaxed">
                          {inq.projectDescription}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                        <span className="font-mono text-[11px] text-[#97959F]">
                          {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : ''}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleConvertInquiry(inq)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#19C3B8]/15 border border-[#19C3B8]/35 text-[#19C3B8] text-xs font-mono hover:bg-[#19C3B8]/25"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Convert to Task</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: Editor Applications */}
            {activeTab === 'applications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {(overview?.applications || []).length === 0 ? (
                  <div className="md:col-span-2 p-10 rounded-2xl bg-[#14141B] border border-white/[0.08] text-center text-sm text-[#97959F]">
                    No editor applications found in MongoDB <code className="text-[#F3EFE7]">editor_applications</code> collection yet.
                  </div>
                ) : (
                  overview?.applications.map((app) => (
                    <div
                      key={app.id}
                      className="rounded-2xl bg-[#14141B]/95 border border-white/[0.08] p-5 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-display text-xl text-[#F3EFE7] uppercase">
                            {app.fullName}
                          </h4>
                          <div className="font-mono text-xs text-[#97959F]">
                            {app.email} · {app.location}
                          </div>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#19C3B8]/15 border border-[#19C3B8]/35 text-[#19C3B8] font-mono text-[10px]">
                          {app.experienceLevel}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[#DDD8CE]">
                          {app.primarySoftware}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[#97959F]">
                          {app.weeklyAvailability}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-[#DDD8CE] leading-relaxed">
                        {app.motivation}
                      </p>

                      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
                        <span className="text-[#97959F]">{app.phone}</span>
                        <a
                          href={app.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#FF9933] hover:underline"
                        >
                          <span>View Portfolio</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 4: Access Control & Users */}
            {activeTab === 'users' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 rounded-2xl bg-[#14141B]/95 border border-white/[0.08] overflow-hidden">
                  <div className="p-5 border-b border-white/[0.08]">
                    <h3 className="font-display text-xl text-[#F3EFE7] uppercase">
                      Portal User Accounts
                    </h3>
                    <p className="text-xs text-[#97959F] mt-1">
                      Only users with <code className="text-[#19C3B8]">type: &quot;admin&quot;</code> are permitted to sign in via JWT to this portal.
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-white/[0.08] bg-[#181822] font-mono text-[10px] uppercase tracking-wider text-[#97959F]">
                          <th className="py-3 px-4">Name</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">Type</th>
                          <th className="py-3 px-4">Portal Access</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.06]">
                        {(overview?.users || []).map((u) => (
                          <tr key={u.id}>
                            <td className="py-3 px-4 font-medium text-[#F3EFE7]">{u.name}</td>
                            <td className="py-3 px-4 font-mono text-xs text-[#97959F]">{u.email}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase border ${
                                  u.type === 'admin'
                                    ? 'bg-[#19C3B8]/15 text-[#19C3B8] border-[#19C3B8]/35'
                                    : 'bg-white/[0.06] text-[#97959F] border-white/[0.12]'
                                }`}
                              >
                                {u.type}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-xs">
                              {u.type === 'admin' ? (
                                <span className="text-emerald-400">Allowed</span>
                              ) : (
                                <span className="text-red-400">Blocked (403)</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="lg:col-span-5 rounded-2xl bg-[#14141B]/95 border border-white/[0.08] p-5 space-y-4">
                  <div>
                    <h3 className="font-display text-xl text-[#F3EFE7] uppercase">
                      Create User Account
                    </h3>
                    <p className="text-xs text-[#97959F] mt-1">
                      Assign <code className="text-[#19C3B8]">admin</code>, <code className="text-[#DDD8CE]">editor</code>, or <code className="text-[#DDD8CE]">client</code> type. Non-admin logins are blocked with HTTP 403.
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
                      className="w-full h-10 px-3.5 rounded-xl bg-[#0B0B0D] border border-white/[0.15] text-sm text-[#F3EFE7]"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl bg-[#0B0B0D] border border-white/[0.15] text-sm text-[#F3EFE7]"
                    />
                    <input
                      type="password"
                      required
                      minLength={8}
                      placeholder="Password (min 8 chars)"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl bg-[#0B0B0D] border border-white/[0.15] text-sm text-[#F3EFE7]"
                    />
                    <select
                      value={newUserType}
                      onChange={(e) => setNewUserType(e.target.value as UserType)}
                      className="w-full h-10 px-3.5 rounded-xl bg-[#0B0B0D] border border-white/[0.15] text-sm text-[#F3EFE7]"
                    >
                      <option value="editor">type: editor (Blocked from /admin)</option>
                      <option value="client">type: client (Blocked from /admin)</option>
                      <option value="admin">type: admin (Full Admin Access)</option>
                    </select>
                    <button
                      type="submit"
                      disabled={creatingUser}
                      className="w-full py-2.5 px-5 rounded-full bg-[#19C3B8] text-[#0B0B0D] font-bold text-xs inline-flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>{creatingUser ? 'Creating...' : 'Create User'}</span>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSaved={() => loadOverview(false)}
        initialTask={editingTask}
        prefill={taskPrefill}
      />

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        tasks={overview?.tasks || []}
        adminEmail={adminUser.email}
      />
    </div>
  );
}
