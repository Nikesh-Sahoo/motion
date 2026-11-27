'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Clapperboard,
  RefreshCw,
  LogOut,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Save,
  Home,
  ShieldCheck,
} from 'lucide-react';
import type { AdminUserPublic, EditorTaskItem, TaskStatus } from '@/types/admin';

interface EditorDashboardProps {
  editorUser: AdminUserPublic;
  onLoggedOut: () => void;
}

interface EditorStats {
  totalAssigned: number;
  completedCount: number;
  inProgressCount: number;
  reviewCount: number;
  pendingCount: number;
}

const STATUS_BADGE: Record<TaskStatus, string> = {
  pending: 'bg-amber-500/15 text-amber-300 border-amber-500/35',
  in_progress: 'bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/35',
  review: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/35',
  completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35',
  cancelled: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/35',
};

const PRIORITY_BADGE: Record<string, string> = {
  urgent: 'bg-rose-500/15 text-rose-300 border-rose-500/35',
  high: 'bg-amber-500/15 text-amber-300 border-amber-500/35',
  medium: 'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/30',
  low: 'bg-white/[0.06] text-[#8A94B8] border-white/[0.12]',
};

export function EditorDashboard({ editorUser, onLoggedOut }: EditorDashboardProps) {
  const [tasks, setTasks] = useState<EditorTaskItem[]>([]);
  const [stats, setStats] = useState<EditorStats>({
    totalAssigned: 0,
    completedCount: 0,
    inProgressCount: 0,
    reviewCount: 0,
    pendingCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Per-task edit drafts
  const [drafts, setDrafts] = useState<
    Record<
      string,
      {
        status: TaskStatus;
        progress: number;
        deliverableUrl: string;
        editorNotes: string;
      }
    >
  >({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedNoticeId, setSavedNoticeId] = useState<string | null>(null);

  const loadTasks = useCallback(
    async (isManual = false) => {
      if (isManual) setRefreshing(true);
      setError(null);
      try {
        const res = await fetch('/api/editor/tasks', { cache: 'no-store' });
        if (res.status === 401 || res.status === 403) {
          onLoggedOut();
          return;
        }
        const json = (await res.json()) as {
          success?: boolean;
          tasks?: EditorTaskItem[];
          stats?: EditorStats;
          error?: string;
        };
        if (!res.ok || !json.success || !json.tasks) {
          setError(json.error || 'Failed to load assigned tasks.');
          return;
        }
        setTasks(json.tasks);
        if (json.stats) setStats(json.stats);

        const nextDrafts: typeof drafts = {};
        for (const t of json.tasks) {
          nextDrafts[t.id] = {
            status: t.status,
            progress: t.progress,
            deliverableUrl: t.deliverableUrl || '',
            editorNotes: t.editorNotes || '',
          };
        }
        setDrafts(nextDrafts);
      } catch {
        setError('Network error loading assigned tasks.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [onLoggedOut]
  );

  useEffect(() => {
    void loadTasks(false);
  }, [loadTasks]);

  const handleLogout = async () => {
    await fetch('/api/editor/auth/logout', { method: 'POST' });
    onLoggedOut();
  };

  const handleSaveTask = async (taskId: string) => {
    const draft = drafts[taskId];
    if (!draft) return;

    setError(null);
    setSavingId(taskId);
    try {
      const res = await fetch(`/api/editor/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: draft.status === 'cancelled' ? undefined : draft.status,
          progress: draft.progress,
          deliverableUrl: draft.deliverableUrl,
          editorNotes: draft.editorNotes,
        }),
      });
      const json = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !json.success) {
        setError(json.error || 'Failed to save task update.');
        return;
      }
      setSavedNoticeId(taskId);
      setTimeout(() => setSavedNoticeId(null), 2500);
      await loadTasks(false);
    } catch {
      setError('Network error saving task update.');
    } finally {
      setSavingId(null);
    }
  };

  const visibleTasks = tasks.filter((t) =>
    statusFilter === 'all' ? true : t.status === statusFilter
  );

  const completionPct =
    stats.totalAssigned > 0
      ? Math.round((stats.completedCount / stats.totalAssigned) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#07090F] text-[#F4F6FF] pb-20">
      {/* Top Bar */}
      <header className="sticky top-[3px] z-40 bg-[#0A0D15]/90 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="w-[min(78rem,calc(100%-2rem))] mx-auto py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#00F0FF]/50 bg-[#05070E]">
                <Image
                  src="/motion-logo.jpg"
                  alt="Motionxyne"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover scale-110"
                />
              </div>
              <div>
                <div className="font-display text-xl tracking-wider text-[#F4F6FF] leading-none">
                  MOTIONXYNE EDITOR
                </div>
                <div className="font-mono text-[10px] text-[#00F0FF] uppercase tracking-widest">
                  ASSIGNED TASK WORKSPACE
                </div>
              </div>
            </Link>

            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 font-mono text-[10px] text-[#00F0FF]">
              <ShieldCheck className="w-3.5 h-3.5" />
              REGISTERED EDITOR · {editorUser.name.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0E111B] border border-white/[0.08] text-xs text-[#D5DCF5] hover:border-white/25"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <button
              type="button"
              onClick={() => void loadTasks(true)}
              disabled={refreshing}
              className="p-2 rounded-xl bg-[#0E111B] border border-white/[0.08] text-[#D5DCF5] hover:border-[#00F0FF]/40"
              title="Refresh tasks"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0E111B] border border-white/[0.08] text-xs font-mono text-rose-300 hover:border-rose-500/40"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="w-[min(78rem,calc(100%-2rem))] mx-auto pt-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F4F6FF] font-sans normal-case">
              Welcome back, {editorUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#8A94B8] mt-1">
              Tasks assigned to <span className="font-mono text-[#00F0FF]">{editorUser.email}</span> by Admin sync automatically across portals.
            </p>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3.5 rounded-xl bg-[#0E111B] border border-white/[0.12] text-xs font-mono text-[#D5DCF5]"
          >
            <option value="all">All Assigned ({stats.totalAssigned})</option>
            <option value="pending">Pending ({stats.pendingCount})</option>
            <option value="in_progress">In Progress ({stats.inProgressCount})</option>
            <option value="review">In Review ({stats.reviewCount})</option>
            <option value="completed">Completed ({stats.completedCount})</option>
          </select>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 flex items-center gap-2.5 text-sm text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-[#0E111B] border border-white/[0.08] p-5">
            <div className="text-xs text-[#8A94B8]">Total Assigned</div>
            <div className="text-3xl font-bold text-[#F4F6FF] mt-1">{stats.totalAssigned}</div>
            <div className="text-[11px] font-mono text-[#00F0FF] mt-1">Active queue</div>
          </div>

          <div className="rounded-2xl bg-[#0E111B] border border-white/[0.08] p-5">
            <div className="text-xs text-[#8A94B8]">In Progress</div>
            <div className="text-3xl font-bold text-[#00F0FF] mt-1">{stats.inProgressCount}</div>
            <div className="text-[11px] font-mono text-[#8A94B8] mt-1">{stats.pendingCount} pending start</div>
          </div>

          <div className="rounded-2xl bg-[#0E111B] border border-white/[0.08] p-5">
            <div className="text-xs text-[#8A94B8]">In Review</div>
            <div className="text-3xl font-bold text-indigo-300 mt-1">{stats.reviewCount}</div>
            <div className="text-[11px] font-mono text-[#8A94B8] mt-1">Awaiting Admin sign-off</div>
          </div>

          <div className="rounded-2xl bg-[#0E111B] border border-emerald-500/25 p-5">
            <div className="text-xs text-[#8A94B8]">Completed</div>
            <div className="text-3xl font-bold text-emerald-400 mt-1">{stats.completedCount}</div>
            <div className="text-[11px] font-mono text-emerald-300 mt-1">{completionPct}% completion rate</div>
          </div>
        </div>

        {/* Assigned Tasks List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-44 rounded-2xl bg-[#0E111B] border border-white/[0.08] animate-pulse" />
            ))}
          </div>
        ) : visibleTasks.length === 0 ? (
          <div className="rounded-2xl bg-[#0E111B] border border-white/[0.08] p-12 text-center space-y-2">
            <Clapperboard className="w-8 h-8 text-[#00F0FF] mx-auto opacity-80" />
            <div className="text-base font-semibold text-[#F4F6FF]">No tasks assigned yet</div>
            <p className="text-xs text-[#8A94B8] max-w-md mx-auto">
              Once Admin assigns a task to <span className="font-mono text-[#00F0FF]">{editorUser.name}</span> in the Admin Portal, it will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {visibleTasks.map((task) => {
              const draft = drafts[task.id] || {
                status: task.status,
                progress: task.progress,
                deliverableUrl: task.deliverableUrl || '',
                editorNotes: task.editorNotes || '',
              };
              const isCancelled = task.status === 'cancelled';

              return (
                <div
                  key={task.id}
                  className="rounded-2xl bg-[#0E111B] border border-white/[0.08] p-5 sm:p-6 space-y-4 shadow-[0_14px_34px_rgba(0,0,0,0.45)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-mono uppercase ${STATUS_BADGE[task.status]}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-mono uppercase ${PRIORITY_BADGE[task.priority] || PRIORITY_BADGE.medium}`}>
                          {task.priority}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#F4F6FF]">{task.title}</h3>
                      <div className="text-xs font-mono text-[#8A94B8]">
                        Client: <span className="text-[#D5DCF5]">{task.clientName}</span> · {task.serviceType}
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs text-[#8A94B8] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#00F0FF]" />
                      <span>Due {task.dueDate}</span>
                    </div>
                  </div>

                  {task.notes && (
                    <div className="p-3.5 rounded-xl bg-[#07090F] border border-white/[0.06] text-xs text-[#D5DCF5] leading-relaxed whitespace-pre-line">
                      <div className="font-mono text-[10px] uppercase text-[#00F0FF] mb-1">
                        Admin / Client Brief
                      </div>
                      {task.notes}
                    </div>
                  )}

                  {/* Interactive Editor Update Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/[0.06]">
                    <div className="space-y-1">
                      <label className="block font-mono text-[10px] uppercase text-[#8A94B8]">
                        Workflow Status
                      </label>
                      <select
                        disabled={isCancelled}
                        value={draft.status}
                        onChange={(e) => {
                          const next = e.target.value as TaskStatus;
                          let nextProg = draft.progress;
                          if (next === 'completed') nextProg = 100;
                          else if (next === 'review') nextProg = Math.max(85, draft.progress);
                          else if (next === 'in_progress' && draft.progress < 25) nextProg = 50;
                          setDrafts((prev) => ({
                            ...prev,
                            [task.id]: { ...draft, status: next, progress: nextProg },
                          }));
                        }}
                        className="w-full h-10 px-3 rounded-xl bg-[#060710] border border-white/[0.12] text-xs text-[#F4F6FF] disabled:opacity-50"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">In Review</option>
                        <option value="completed">Completed</option>
                        {isCancelled && <option value="cancelled">Cancelled</option>}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between font-mono text-[10px] uppercase text-[#8A94B8]">
                        <span>Progress</span>
                        <span className="text-[#00F0FF] font-bold">{draft.progress}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        disabled={isCancelled}
                        value={draft.progress}
                        onChange={(e) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [task.id]: { ...draft, progress: Number(e.target.value) },
                          }))
                        }
                        className="w-full accent-[#00F0FF] h-9 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <label className="block font-mono text-[10px] uppercase text-[#8A94B8]">
                        Deliverable Link (Google Drive / Frame.io / Unlisted YouTube)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          disabled={isCancelled}
                          placeholder="https://drive.google.com/..."
                          value={draft.deliverableUrl}
                          onChange={(e) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [task.id]: { ...draft, deliverableUrl: e.target.value },
                            }))
                          }
                          className="flex-1 h-9 px-3 rounded-xl bg-[#060710] border border-white/[0.12] text-xs text-[#F4F6FF]"
                        />
                        {draft.deliverableUrl && (
                          <a
                            href={draft.deliverableUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center text-xs text-[#00F0FF]"
                            title="Open deliverable link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block font-mono text-[10px] uppercase text-[#8A94B8]">
                        Editor Notes (Synced to Admin Portal)
                      </label>
                      <textarea
                        rows={2}
                        disabled={isCancelled}
                        placeholder="Add export notes, cut version, or blockers for Admin..."
                        value={draft.editorNotes}
                        onChange={(e) =>
                          setDrafts((prev) => ({
                            ...prev,
                            [task.id]: { ...draft, editorNotes: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 rounded-xl bg-[#060710] border border-white/[0.12] text-xs text-[#F4F6FF]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <span className="font-mono text-[10px] text-[#8A94B8]">
                      Updated {new Date(task.updatedAt).toLocaleString()}
                    </span>

                    <div className="flex items-center gap-2">
                      {savedNoticeId === task.id && (
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Synced</span>
                        </span>
                      )}
                      <button
                        type="button"
                        disabled={isCancelled || savingId === task.id}
                        onClick={() => void handleSaveTask(task.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00F0FF] text-[#05070E] font-bold text-xs hover:shadow-[0_0_16px_rgba(0,240,255,0.45)] disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{savingId === task.id ? 'Syncing...' : 'Update & Sync'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
