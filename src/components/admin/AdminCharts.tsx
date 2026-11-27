'use client';

import React, { useState } from 'react';
import { ArrowRight, DollarSign, FileText, CreditCard, TrendingUp } from 'lucide-react';
import type { AdminDashboardSummary, AdminTask, TaskStatus } from '@/types/admin';
import { formatCurrencyINR } from '@/lib/admin/report';

interface AdminChartsProps {
  summary: AdminDashboardSummary;
  tasks: AdminTask[];
  onViewTasks: () => void;
}

const DONUT_PALETTE = ['#10B981', '#F97316', '#3B82F6', '#A855F7', '#00F0FF', '#EC4899'];

const STATUS_PILL: Record<TaskStatus, { label: string; cls: string; bar: string }> = {
  completed: {
    label: 'Completed',
    cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35',
    bar: 'bg-emerald-400',
  },
  review: {
    label: 'In Review',
    cls: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/35',
    bar: 'bg-indigo-400',
  },
  in_progress: {
    label: 'In Progress',
    cls: 'bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/35',
    bar: 'bg-[#00F0FF]',
  },
  pending: {
    label: 'Pending',
    cls: 'bg-amber-500/15 text-amber-300 border-amber-500/35',
    bar: 'bg-amber-400',
  },
  cancelled: {
    label: 'Cancelled',
    cls: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/35',
    bar: 'bg-zinc-500',
  },
};

export function AdminCharts({ summary, tasks, onViewTasks }: AdminChartsProps) {
  const [hoveredMonthIdx, setHoveredMonthIdx] = useState<number | null>(null);
  const [trendRange, setTrendRange] = useState<'monthly' | 'all'>('monthly');

  const monthly = trendRange === 'monthly' ? summary.monthlySeries.slice(-6) : summary.monthlySeries;
  const maxMonthlyValue = Math.max(
    1,
    ...monthly.map((m) => Math.max(m.totalBilled, m.collected, m.toReceive))
  );

  // Trend chart SVG geometry
  const trendW = 540;
  const trendH = 210;
  const padL = 46;
  const padR = 16;
  const padT = 16;
  const padB = 30;
  const plotW = trendW - padL - padR;
  const plotH = trendH - padT - padB;

  const getPoint = (idx: number, val: number) => {
    const x =
      monthly.length <= 1
        ? padL + plotW / 2
        : padL + (idx / (monthly.length - 1)) * plotW;
    const y = padT + plotH - (val / maxMonthlyValue) * plotH;
    return { x, y };
  };

  const buildPolyline = (values: number[]) =>
    values
      .map((v, idx) => {
        const pt = getPoint(idx, v);
        return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
      })
      .join(' ');

  const buildAreaPath = (values: number[]) => {
    if (values.length === 0) return '';
    const pts = values.map((v, idx) => getPoint(idx, v));
    const line = pts
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ');
    const baseY = (padT + plotH).toFixed(1);
    return `${line} L${pts[pts.length - 1].x.toFixed(1)},${baseY} L${pts[0].x.toFixed(1)},${baseY} Z`;
  };

  // Multi-segment donut by Service Category
  const topServices = summary.serviceBreakdown.slice(0, 5);
  const serviceTotal = Math.max(
    1,
    topServices.reduce((sum, s) => sum + s.totalBilled, 0)
  );
  const donutRadius = 50;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let runningOffset = 0;
  const donutSegments = topServices.map((srv, idx) => {
    const pct = srv.totalBilled / serviceTotal;
    const len = pct * donutCircumference;
    const seg = {
      ...srv,
      color: DONUT_PALETTE[idx % DONUT_PALETTE.length],
      dashArray: `${len} ${donutCircumference}`,
      dashOffset: -runningOffset,
    };
    runningOffset += len;
    return seg;
  });

  // Upcoming / pending receivables list
  const upcomingReceivables = tasks
    .filter((t) => t.amountToReceive > 0 && t.status !== 'cancelled')
    .slice(0, 4);

  // Recent tasks for Project/Task Status table
  const recentTasks = tasks.slice(0, 5);

  // Cash flow columns (mirroring stacked incoming/outgoing style in reference dashboard)
  const cashFlowBars = (monthly.length > 0 ? monthly : [{ label: 'Now', collected: summary.totalCollected, toReceive: summary.totalToReceive }]).slice(-6);
  const cashFlowMax = Math.max(
    1,
    ...cashFlowBars.map((b) => Math.max(b.collected, b.toReceive))
  );

  return (
    <div className="space-y-5">
      {/* ROW 2: Revenue Trend (6) + Cash Flow (3) + Upcoming Payments (3) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Revenue & Collections Chart */}
        <div className="xl:col-span-6 rounded-2xl bg-[#0E111B] border border-white/[0.08] p-5 shadow-[0_14px_34px_rgba(0,0,0,0.45)] flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="text-base font-semibold text-[#F4F6FF]">
              Collections &amp; Receivables
            </h3>
            <div className="inline-flex items-center rounded-lg bg-[#080A12] border border-white/[0.08] p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setTrendRange('monthly')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  trendRange === 'monthly'
                    ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                    : 'text-[#8A94B8] hover:text-[#F4F6FF]'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setTrendRange('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  trendRange === 'all'
                    ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                    : 'text-[#8A94B8] hover:text-[#F4F6FF]'
                }`}
              >
                All Months
              </button>
            </div>
          </div>

          {monthly.length === 0 ? (
            <div className="h-[210px] flex items-center justify-center text-xs font-mono text-[#8A94B8] border border-dashed border-white/[0.08] rounded-xl">
              Add tasks with billing amounts to visualize revenue &amp; collection trends.
            </div>
          ) : (
            <div className="relative">
              <svg viewBox={`0 0 ${trendW} ${trendH}`} className="w-full h-auto overflow-visible">
                <defs>
                  <linearGradient id="proCollectedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="proReceivableGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                  const y = padT + plotH - ratio * plotH;
                  const val = Math.round(maxMonthlyValue * ratio);
                  return (
                    <g key={ratio}>
                      <line
                        x1={padL}
                        y1={y}
                        x2={trendW - padR}
                        y2={y}
                        stroke="rgba(255,255,255,0.06)"
                        strokeDasharray="3 3"
                      />
                      <text
                        x={padL - 8}
                        y={y + 3}
                        textAnchor="end"
                        fill="#64748B"
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        {val >= 1000 ? `₹${Math.round(val / 1000)}k` : `₹${val}`}
                      </text>
                    </g>
                  );
                })}

                <path d={buildAreaPath(monthly.map((m) => m.collected))} fill="url(#proCollectedGrad)" />
                <path d={buildAreaPath(monthly.map((m) => m.toReceive))} fill="url(#proReceivableGrad)" />

                {monthly.length > 1 && (
                  <>
                    <polyline
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2.4"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      points={buildPolyline(monthly.map((m) => m.collected))}
                    />
                    <polyline
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2.4"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      points={buildPolyline(monthly.map((m) => m.toReceive))}
                    />
                  </>
                )}

                {monthly.map((m, idx) => {
                  const colPt = getPoint(idx, m.collected);
                  const recPt = getPoint(idx, m.toReceive);
                  const active = hoveredMonthIdx === idx;
                  return (
                    <g
                      key={m.month}
                      onMouseEnter={() => setHoveredMonthIdx(idx)}
                      onMouseLeave={() => setHoveredMonthIdx(null)}
                      className="cursor-pointer"
                    >
                      <rect x={colPt.x - 18} y={padT} width={36} height={plotH} fill="transparent" />
                      {active && (
                        <line
                          x1={colPt.x}
                          y1={padT}
                          x2={colPt.x}
                          y2={padT + plotH}
                          stroke="rgba(255,255,255,0.18)"
                          strokeWidth="1"
                        />
                      )}
                      <circle cx={colPt.x} cy={colPt.y} r={active ? 5.5 : 3.8} fill="#10B981" stroke="#0E111B" strokeWidth="1.5" />
                      <circle cx={recPt.x} cy={recPt.y} r={active ? 5.5 : 3.8} fill="#F59E0B" stroke="#0E111B" strokeWidth="1.5" />
                      <text
                        x={colPt.x}
                        y={trendH - 8}
                        textAnchor="middle"
                        fill={active ? '#F4F6FF' : '#64748B'}
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        {m.label}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Collected
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    To Receive
                  </span>
                </div>
                {hoveredMonthIdx !== null && monthly[hoveredMonthIdx] && (
                  <span className="font-mono text-[11px] text-[#D5DCF5]">
                    {monthly[hoveredMonthIdx].label}:{' '}
                    <span className="text-emerald-400">
                      {formatCurrencyINR(monthly[hoveredMonthIdx].collected)}
                    </span>{' '}
                    / Pending{' '}
                    <span className="text-amber-400">
                      {formatCurrencyINR(monthly[hoveredMonthIdx].toReceive)}
                    </span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Cash Flow Card */}
        <div className="xl:col-span-3 rounded-2xl bg-[#0E111B] border border-white/[0.08] p-5 shadow-[0_14px_34px_rgba(0,0,0,0.45)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-[#F4F6FF]">Cash Flow</h3>
            <TrendingUp className="w-4 h-4 text-[#8A94B8]" />
          </div>

          <div className="flex items-center gap-4 my-auto py-3">
            {/* Bidirectional Cashflow Bars */}
            <div className="flex items-center gap-1.5 h-32 flex-1 justify-center">
              {cashFlowBars.map((bar, i) => {
                const upH = Math.max(10, Math.round((bar.collected / cashFlowMax) * 52));
                const downH = Math.max(8, Math.round((bar.toReceive / cashFlowMax) * 44));
                return (
                  <div key={`${bar.label}-${i}`} className="flex flex-col items-center gap-0.5">
                    <div className="h-14 flex items-end">
                      <div
                        className="w-2.5 rounded-t bg-gradient-to-t from-emerald-500/75 to-[#00F0FF]"
                        style={{ height: `${bar.collected > 0 ? upH : 4}px` }}
                        title={`${bar.label} Collected: ${formatCurrencyINR(bar.collected)}`}
                      />
                    </div>
                    <div className="h-12 flex items-start">
                      <div
                        className="w-2.5 rounded-b bg-gradient-to-b from-amber-500/80 to-orange-600"
                        style={{ height: `${bar.toReceive > 0 ? downH : 4}px` }}
                        title={`${bar.label} Pending: ${formatCurrencyINR(bar.toReceive)}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 min-w-[110px]">
              <div>
                <div className="text-lg font-bold text-[#F4F6FF]">
                  {formatCurrencyINR(summary.totalCollected)}
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Collected
                </div>
              </div>

              <div>
                <div className="text-lg font-bold text-amber-400">
                  {formatCurrencyINR(summary.totalToReceive)}
                </div>
                <div className="text-[11px] text-amber-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  To Receive
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onViewTasks}
            className="pt-3 border-t border-white/[0.06] text-xs font-medium text-[#00F0FF] hover:text-[#F4F6FF] inline-flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Upcoming Payments Card */}
        <div className="xl:col-span-3 rounded-2xl bg-[#0E111B] border border-white/[0.08] p-5 shadow-[0_14px_34px_rgba(0,0,0,0.45)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#F4F6FF]">Upcoming Payments</h3>
            <button
              type="button"
              onClick={onViewTasks}
              className="text-xs font-medium text-[#00F0FF] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3 my-auto">
            {upcomingReceivables.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#8A94B8] border border-dashed border-white/[0.08] rounded-xl">
                All billed tasks are settled!
              </div>
            ) : (
              upcomingReceivables.map((t, idx) => {
                const iconPalette =
                  idx % 3 === 0
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : idx % 3 === 1
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
                const IconComp = idx % 3 === 0 ? DollarSign : idx % 3 === 1 ? CreditCard : FileText;
                return (
                  <div key={t.id} className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${iconPalette}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-[#F4F6FF] truncate">
                          {t.clientName}
                        </div>
                        <div className="text-[11px] text-[#8A94B8] font-mono">
                          Due {t.dueDate}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold text-amber-400 whitespace-nowrap">
                      {formatCurrencyINR(t.amountToReceive)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ROW 3: Revenue by Service Donut (3) + Task Status Table (5) + Editor Performance (4) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Service Category Donut */}
        <div className="xl:col-span-3 rounded-2xl bg-[#0E111B] border border-white/[0.08] p-5 shadow-[0_14px_34px_rgba(0,0,0,0.45)]">
          <h3 className="text-base font-semibold text-[#F4F6FF] mb-4">
            Revenue by Service
          </h3>

          {topServices.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-xs text-[#8A94B8] border border-dashed border-white/[0.08] rounded-xl">
              No service billing yet.
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-28 flex-shrink-0">
                <svg viewBox="0 0 130 130" className="w-full h-full -rotate-90">
                  <circle
                    cx="65"
                    cy="65"
                    r={donutRadius}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="16"
                  />
                  {donutSegments.map((seg) => (
                    <circle
                      key={seg.serviceType}
                      cx="65"
                      cy="65"
                      r={donutRadius}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth="16"
                      strokeDasharray={seg.dashArray}
                      strokeDashoffset={seg.dashOffset}
                    />
                  ))}
                </svg>
              </div>

              <div className="flex-1 min-w-0 space-y-2.5">
                {donutSegments.slice(0, 4).map((seg) => (
                  <div key={seg.serviceType} className="min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#8A94B8] truncate">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: seg.color }}
                      />
                      <span className="truncate">{seg.shortLabel}</span>
                    </div>
                    <div className="text-xs font-semibold text-[#F4F6FF] font-mono pl-3.5">
                      {formatCurrencyINR(seg.totalBilled)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Task Status Table */}
        <div className="xl:col-span-5 rounded-2xl bg-[#0E111B] border border-white/[0.08] p-5 shadow-[0_14px_34px_rgba(0,0,0,0.45)] overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-[#F4F6FF]">Task Status</h3>
            <button
              type="button"
              onClick={onViewTasks}
              className="text-xs font-medium text-[#00F0FF] hover:underline"
            >
              Manage All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-[#8A94B8] font-medium">
                  <th className="py-2 pr-3">Task</th>
                  <th className="py-2 px-2">Progress</th>
                  <th className="py-2 px-2 text-right">Budget</th>
                  <th className="py-2 pl-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {recentTasks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[#8A94B8]">
                      No tasks registered yet.
                    </td>
                  </tr>
                ) : (
                  recentTasks.map((t) => {
                    const st = STATUS_PILL[t.status];
                    return (
                      <tr key={t.id}>
                        <td className="py-2.5 pr-3 max-w-[145px]">
                          <div className="font-medium text-[#F4F6FF] truncate">{t.title}</div>
                          <div className="text-[10px] text-[#8A94B8] truncate">{t.assignedTo}</div>
                        </td>
                        <td className="py-2.5 px-2 min-w-[95px]">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                              <div
                                className={`h-full rounded-full ${st.bar}`}
                                style={{ width: `${t.progress}%` }}
                              />
                            </div>
                            <span className="font-mono text-[10px] text-[#D5DCF5] w-7 text-right">
                              {t.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono text-[#F4F6FF] whitespace-nowrap">
                          {formatCurrencyINR(t.totalAmount)}
                        </td>
                        <td className="py-2.5 pl-2 text-right whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-medium ${st.cls}`}>
                            {st.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Registered Editor Performance */}
        <div className="xl:col-span-4 rounded-2xl bg-[#0E111B] border border-white/[0.08] p-5 shadow-[0_14px_34px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#F4F6FF]">Editor Performance</h3>
            <span className="text-[11px] font-mono text-[#8A94B8]">Registered Editors</span>
          </div>

          <div className="space-y-3.5">
            {summary.editorPerformance.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#8A94B8] border border-dashed border-white/[0.08] rounded-xl">
                Register editors in <strong className="text-[#00F0FF]">Team &amp; Editors</strong> or approve applications to track performance.
              </div>
            ) : (
              summary.editorPerformance.slice(0, 4).map((ed, idx) => {
                const barColor =
                  idx % 3 === 0
                    ? 'bg-emerald-400'
                    : idx % 3 === 1
                    ? 'bg-amber-400'
                    : 'bg-[#00F0FF]';
                const initials = ed.name
                  .split(' ')
                  .map((p) => p[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <div key={ed.editorId} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00F0FF]/30 to-[#FF007F]/30 border border-white/15 flex items-center justify-center text-[11px] font-bold text-[#F4F6FF] flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-[#F4F6FF] truncate">{ed.name}</span>
                        <span className="font-mono text-[10px] text-[#8A94B8]">
                          {ed.completedCount}/{ed.assignedCount} done
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barColor}`}
                          style={{ width: `${ed.avgProgress}%` }}
                        />
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold text-[#F4F6FF] w-9 text-right">
                      {ed.avgProgress}%
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
