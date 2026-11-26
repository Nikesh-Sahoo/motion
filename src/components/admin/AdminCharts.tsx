'use client';

import React, { useState } from 'react';
import type { AdminDashboardSummary, TaskStatus } from '@/types/admin';
import { formatCurrencyINR } from '@/lib/admin/report';

interface AdminChartsProps {
  summary: AdminDashboardSummary;
}

const STATUS_COLORS: Record<TaskStatus, { bar: string; text: string }> = {
  pending: { bar: '#F59E0B', text: 'text-amber-300' },
  in_progress: { bar: '#19C3B8', text: 'text-[#19C3B8]' },
  review: { bar: '#818CF8', text: 'text-indigo-300' },
  completed: { bar: '#10B981', text: 'text-emerald-400' },
  cancelled: { bar: '#6B7280', text: 'text-zinc-400' },
};

export function AdminCharts({ summary }: AdminChartsProps) {
  const [hoveredMonthIdx, setHoveredMonthIdx] = useState<number | null>(null);
  const [hoveredServiceIdx, setHoveredServiceIdx] = useState<number | null>(null);

  const monthly = summary.monthlySeries;
  const maxMonthlyValue = Math.max(
    1,
    ...monthly.map((m) => Math.max(m.totalBilled, m.collected, m.toReceive))
  );

  const services = summary.serviceBreakdown;
  const maxServiceValue = Math.max(
    1,
    ...services.map((s) => Math.max(s.collected, s.toReceive, s.totalBilled))
  );

  // Donut calculations
  const donutRadius = 62;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const totalNonZero = summary.totalCollected + summary.totalToReceive;
  const collectedShare = totalNonZero > 0 ? summary.totalCollected / totalNonZero : 0;
  const collectedStroke = collectedShare * donutCircumference;
  const receivableStroke = Math.max(0, donutCircumference - collectedStroke);

  // Trend chart SVG geometry
  const trendW = 540;
  const trendH = 210;
  const padL = 48;
  const padR = 18;
  const padT = 18;
  const padB = 34;
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
    values.map((v, idx) => {
      const pt = getPoint(idx, v);
      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    }).join(' ');

  const buildAreaPath = (values: number[]) => {
    if (values.length === 0) return '';
    const pts = values.map((v, idx) => getPoint(idx, v));
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const baseY = (padT + plotH).toFixed(1);
    return `${line} L${pts[pts.length - 1].x.toFixed(1)},${baseY} L${pts[0].x.toFixed(1)},${baseY} Z`;
  };

  const maxStatusCount = Math.max(1, ...summary.statusBreakdown.map((s) => s.count));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Monthly Revenue & Collection Trend Area Chart */}
      <div className="lg:col-span-7 rounded-2xl bg-[#14141B]/95 border border-white/[0.08] p-5 sm:p-6 shadow-[0_12px_32px_rgba(0,0,0,0.45)]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#19C3B8]">
              CASHFLOW ANALYTICS
            </div>
            <h3 className="font-display text-xl sm:text-2xl text-[#F3EFE7] uppercase">
              Billed vs. Collected vs. Receivable Trend
            </h3>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-[#19C3B8]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#19C3B8]" />
              Collected
            </span>
            <span className="flex items-center gap-1.5 text-[#FF9933]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF9933]" />
              To Receive
            </span>
          </div>
        </div>

        {monthly.length === 0 ? (
          <div className="h-[210px] flex items-center justify-center text-xs font-mono text-[#97959F] border border-dashed border-white/[0.08] rounded-xl">
            Add tasks with billing amounts to see monthly revenue trends.
          </div>
        ) : (
          <div className="relative">
            <svg viewBox={`0 0 ${trendW} ${trendH}`} className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="collectedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#19C3B8" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#19C3B8" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="receivableGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF9933" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#FF9933" stopOpacity="0" />
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
                      stroke="rgba(243,239,231,0.07)"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={padL - 8}
                      y={y + 3}
                      textAnchor="end"
                      fill="#97959F"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {val >= 1000 ? `${Math.round(val / 1000)}k` : val}
                    </text>
                  </g>
                );
              })}

              <path
                d={buildAreaPath(monthly.map((m) => m.collected))}
                fill="url(#collectedGrad)"
              />
              <path
                d={buildAreaPath(monthly.map((m) => m.toReceive))}
                fill="url(#receivableGrad)"
              />

              {monthly.length > 1 && (
                <>
                  <polyline
                    fill="none"
                    stroke="#19C3B8"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    points={buildPolyline(monthly.map((m) => m.collected))}
                  />
                  <polyline
                    fill="none"
                    stroke="#FF9933"
                    strokeWidth="2.5"
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
                    <rect
                      x={colPt.x - 18}
                      y={padT}
                      width={36}
                      height={plotH}
                      fill="transparent"
                    />
                    {active && (
                      <line
                        x1={colPt.x}
                        y1={padT}
                        x2={colPt.x}
                        y2={padT + plotH}
                        stroke="rgba(243,239,231,0.22)"
                        strokeWidth="1"
                      />
                    )}
                    <circle
                      cx={colPt.x}
                      cy={colPt.y}
                      r={active ? 5.5 : 3.8}
                      fill="#19C3B8"
                      stroke="#0B0B0D"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={recPt.x}
                      cy={recPt.y}
                      r={active ? 5.5 : 3.8}
                      fill="#FF9933"
                      stroke="#0B0B0D"
                      strokeWidth="1.5"
                    />
                    <text
                      x={colPt.x}
                      y={trendH - 10}
                      textAnchor="middle"
                      fill={active ? '#F3EFE7' : '#97959F'}
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      {m.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {hoveredMonthIdx !== null && monthly[hoveredMonthIdx] && (
              <div className="mt-2 px-3.5 py-2 rounded-xl bg-[#0B0B0D] border border-white/[0.12] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <span className="text-[#F3EFE7] font-semibold">
                  {monthly[hoveredMonthIdx].label} ({monthly[hoveredMonthIdx].taskCount} tasks)
                </span>
                <span className="text-[#19C3B8]">
                  Collected: {formatCurrencyINR(monthly[hoveredMonthIdx].collected)}
                </span>
                <span className="text-[#FF9933]">
                  To Receive: {formatCurrencyINR(monthly[hoveredMonthIdx].toReceive)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Collection Ratio Donut Chart */}
      <div className="lg:col-span-5 rounded-2xl bg-[#14141B]/95 border border-white/[0.08] p-5 sm:p-6 shadow-[0_12px_32px_rgba(0,0,0,0.45)] flex flex-col justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-[#FF9933]">
            PAYMENT RATIO
          </div>
          <h3 className="font-display text-xl sm:text-2xl text-[#F3EFE7] uppercase mb-4">
            Collected vs. Pending Receivables
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 my-auto">
          <div className="relative w-44 h-44 flex-shrink-0">
            <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={donutRadius}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="18"
              />
              {totalNonZero > 0 && (
                <>
                  <circle
                    cx="80"
                    cy="80"
                    r={donutRadius}
                    fill="none"
                    stroke="#FF9933"
                    strokeWidth="18"
                    strokeDasharray={`${receivableStroke} ${donutCircumference}`}
                    strokeDashoffset={-collectedStroke}
                    strokeLinecap="butt"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r={donutRadius}
                    fill="none"
                    stroke="#19C3B8"
                    strokeWidth="18"
                    strokeDasharray={`${collectedStroke} ${donutCircumference}`}
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-display text-3xl text-[#F3EFE7]">
                {summary.collectionRate}%
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#97959F]">
                Collected
              </span>
            </div>
          </div>

          <div className="flex-1 w-full space-y-3">
            <div className="p-3 rounded-xl bg-[#0B0B0D] border border-white/[0.08]">
              <div className="flex items-center justify-between text-xs font-mono text-[#97959F] mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#19C3B8]" />
                  Amount Collected
                </span>
              </div>
              <div className="font-display text-xl text-[#19C3B8]">
                {formatCurrencyINR(summary.totalCollected)}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0B0B0D] border border-white/[0.08]">
              <div className="flex items-center justify-between text-xs font-mono text-[#97959F] mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF9933]" />
                  To Be Received
                </span>
              </div>
              <div className="font-display text-xl text-[#FF9933]">
                {formatCurrencyINR(summary.totalToReceive)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Revenue by Service Category Grouped Bar Chart */}
      <div className="lg:col-span-7 rounded-2xl bg-[#14141B]/95 border border-white/[0.08] p-5 sm:p-6 shadow-[0_12px_32px_rgba(0,0,0,0.45)]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#19C3B8]">
              SERVICE REVENUE MIX
            </div>
            <h3 className="font-display text-xl sm:text-2xl text-[#F3EFE7] uppercase">
              Collected &amp; Receivable by Service
            </h3>
          </div>
        </div>

        {services.length === 0 ? (
          <div className="h-44 flex items-center justify-center text-xs font-mono text-[#97959F] border border-dashed border-white/[0.08] rounded-xl">
            No service billing data available yet.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end h-44 pt-4 border-b border-white/[0.08] pb-2">
              {services.slice(0, 4).map((srv, idx) => {
                const colPct = Math.max(4, Math.round((srv.collected / maxServiceValue) * 100));
                const recPct = Math.max(4, Math.round((srv.toReceive / maxServiceValue) * 100));
                const active = hoveredServiceIdx === idx;
                return (
                  <div
                    key={srv.serviceType}
                    onMouseEnter={() => setHoveredServiceIdx(idx)}
                    onMouseLeave={() => setHoveredServiceIdx(null)}
                    className={`h-full flex flex-col justify-end items-center gap-2 rounded-xl px-2 py-1 transition-colors ${
                      active ? 'bg-white/[0.04]' : ''
                    }`}
                  >
                    <div className="w-full flex-1 flex items-end justify-center gap-2">
                      <div
                        className="w-5 sm:w-6 rounded-t-md bg-gradient-to-t from-[#19C3B8]/70 to-[#19C3B8] transition-all duration-300"
                        style={{ height: `${srv.collected > 0 ? colPct : 2}%` }}
                        title={`Collected: ${formatCurrencyINR(srv.collected)}`}
                      />
                      <div
                        className="w-5 sm:w-6 rounded-t-md bg-gradient-to-t from-[#FF9933]/70 to-[#FF9933] transition-all duration-300"
                        style={{ height: `${srv.toReceive > 0 ? recPct : 2}%` }}
                        title={`To Receive: ${formatCurrencyINR(srv.toReceive)}`}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-[#DDD8CE] text-center truncate w-full">
                      {srv.shortLabel}
                    </span>
                  </div>
                );
              })}
            </div>

            {hoveredServiceIdx !== null && services[hoveredServiceIdx] ? (
              <div className="px-3.5 py-2 rounded-xl bg-[#0B0B0D] border border-white/[0.12] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <span className="text-[#F3EFE7] font-semibold">
                  {services[hoveredServiceIdx].serviceType} ({services[hoveredServiceIdx].taskCount} tasks)
                </span>
                <span className="text-[#19C3B8]">
                  Collected: {formatCurrencyINR(services[hoveredServiceIdx].collected)}
                </span>
                <span className="text-[#FF9933]">
                  To Receive: {formatCurrencyINR(services[hoveredServiceIdx].toReceive)}
                </span>
              </div>
            ) : (
              <div className="text-[11px] font-mono text-[#97959F]">
                Hover any service bar group to inspect collected vs. pending receivable amounts.
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Tasks by Status Pipeline Breakdown */}
      <div className="lg:col-span-5 rounded-2xl bg-[#14141B]/95 border border-white/[0.08] p-5 sm:p-6 shadow-[0_12px_32px_rgba(0,0,0,0.45)]">
        <div className="mb-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-[#FF9933]">
            WORKLOAD PIPELINE
          </div>
          <h3 className="font-display text-xl sm:text-2xl text-[#F3EFE7] uppercase">
            Tasks by Production Status
          </h3>
        </div>

        <div className="space-y-3.5">
          {summary.statusBreakdown.map((item) => {
            const widthPct =
              item.count > 0 ? Math.max(8, Math.round((item.count / maxStatusCount) * 100)) : 0;
            const palette = STATUS_COLORS[item.status];
            return (
              <div key={item.status} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={`font-semibold ${palette.text}`}>{item.label}</span>
                  <span className="text-[#DDD8CE]">
                    {item.count} {item.count === 1 ? 'task' : 'tasks'} · {formatCurrencyINR(item.amount)}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: palette.bar,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
