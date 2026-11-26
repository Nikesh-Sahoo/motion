'use client';

import React, { useMemo, useState } from 'react';
import {
  X,
  FileSpreadsheet,
  FileText,
  FileJson,
  Printer,
  Download,
} from 'lucide-react';
import type { AdminTask } from '@/types/admin';
import { buildDashboardSummary } from '@/lib/admin/analytics';
import {
  buildCsvReport,
  buildHtmlReport,
  buildJsonReport,
  filterTasksForReport,
  formatCurrencyINR,
  triggerFileDownload,
  type ReportFilterOptions,
} from '@/lib/admin/report';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: AdminTask[];
  adminEmail: string;
}

export function ReportModal({
  isOpen,
  onClose,
  tasks,
  adminEmail,
}: ReportModalProps) {
  const [scope, setScope] = useState<ReportFilterOptions['scope']>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filterOptions: ReportFilterOptions = useMemo(
    () => ({
      scope,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    }),
    [scope, fromDate, toDate]
  );

  const filteredTasks = useMemo(
    () => filterTasksForReport(tasks, filterOptions),
    [tasks, filterOptions]
  );

  const summary = useMemo(
    () => buildDashboardSummary(filteredTasks),
    [filteredTasks]
  );

  if (!isOpen) return null;

  const dateStamp = new Date().toISOString().slice(0, 10);

  const handleDownloadCsv = () => {
    const csv = buildCsvReport(filteredTasks, adminEmail, filterOptions);
    triggerFileDownload(csv, `motionxyne-report-${scope}-${dateStamp}.csv`, 'text/csv;charset=utf-8;');
  };

  const handleDownloadJson = () => {
    const json = buildJsonReport(filteredTasks, adminEmail, filterOptions);
    triggerFileDownload(
      json,
      `motionxyne-report-${scope}-${dateStamp}.json`,
      'application/json;charset=utf-8;'
    );
  };

  const handleDownloadHtml = () => {
    const html = buildHtmlReport(filteredTasks, adminEmail, filterOptions);
    triggerFileDownload(
      html,
      `motionxyne-report-${scope}-${dateStamp}.html`,
      'text/html;charset=utf-8;'
    );
  };

  const handlePrintPdf = () => {
    const html = buildHtmlReport(filteredTasks, adminEmail, filterOptions);
    const win = window.open('', '_blank', 'width=1024,height=768');
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-[#14141B] border border-white/[0.12] shadow-2xl overflow-hidden my-8">
        <div className="px-6 py-4 bg-[#181822] border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#FF9933]">
              DETAILED REPORT GENERATOR
            </div>
            <h3 className="font-display text-2xl text-[#F3EFE7] uppercase">
              Export Financial &amp; Task Audit
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#97959F] hover:text-[#F3EFE7] hover:bg-white/[0.06]"
            aria-label="Close report generator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block font-mono text-[11px] uppercase tracking-wider text-[#97959F]">
                Report Scope
              </label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value as ReportFilterOptions['scope'])}
                className="flex h-11 w-full rounded-xl border border-[rgba(243,239,231,0.15)] bg-[#0B0B0D] px-3.5 py-2 text-sm text-[#F3EFE7] focus:outline-none focus:ring-1 focus:ring-[#19C3B8]"
              >
                <option value="all" className="bg-[#15151B]">All Tasks &amp; Billing</option>
                <option value="receivables" className="bg-[#15151B]">Pending Receivables Only</option>
                <option value="active" className="bg-[#15151B]">Active Tasks Only</option>
                <option value="completed" className="bg-[#15151B]">Completed Tasks Only</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-[11px] uppercase tracking-wider text-[#97959F]">
                Due Date From
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-[rgba(243,239,231,0.15)] bg-[#0B0B0D] px-3.5 py-2 text-sm text-[#F3EFE7] focus:outline-none focus:ring-1 focus:ring-[#19C3B8]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-[11px] uppercase tracking-wider text-[#97959F]">
                Due Date To
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-[rgba(243,239,231,0.15)] bg-[#0B0B0D] px-3.5 py-2 text-sm text-[#F3EFE7] focus:outline-none focus:ring-1 focus:ring-[#19C3B8]"
              />
            </div>
          </div>

          {/* Live Summary Preview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#0B0B0D] border border-white/[0.08]">
            <div>
              <div className="font-mono text-[10px] text-[#97959F] uppercase">Tasks</div>
              <div className="font-display text-2xl text-[#F3EFE7]">{summary.totalTasks}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-[#97959F] uppercase">Total Billed</div>
              <div className="font-display text-2xl text-[#F3EFE7]">
                {formatCurrencyINR(summary.totalBilled)}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-[#97959F] uppercase">Collected</div>
              <div className="font-display text-2xl text-[#19C3B8]">
                {formatCurrencyINR(summary.totalCollected)}
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-[#97959F] uppercase">To Receive</div>
              <div className="font-display text-2xl text-[#FF9933]">
                {formatCurrencyINR(summary.totalToReceive)}
              </div>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="flex items-center justify-between p-4 rounded-xl bg-[#19C3B8]/10 hover:bg-[#19C3B8]/20 border border-[#19C3B8]/35 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-[#19C3B8]" />
                <div>
                  <div className="text-sm font-semibold text-[#F3EFE7]">Download CSV Ledger</div>
                  <div className="text-[11px] font-mono text-[#97959F]">Excel / Google Sheets ready</div>
                </div>
              </div>
              <Download className="w-4 h-4 text-[#19C3B8]" />
            </button>

            <button
              type="button"
              onClick={handlePrintPdf}
              className="flex items-center justify-between p-4 rounded-xl bg-[#FF9933]/10 hover:bg-[#FF9933]/20 border border-[#FF9933]/35 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <Printer className="w-5 h-5 text-[#FF9933]" />
                <div>
                  <div className="text-sm font-semibold text-[#F3EFE7]">Print / Save as PDF</div>
                  <div className="text-[11px] font-mono text-[#97959F]">Formatted executive summary</div>
                </div>
              </div>
              <Download className="w-4 h-4 text-[#FF9933]" />
            </button>

            <button
              type="button"
              onClick={handleDownloadHtml}
              className="flex items-center justify-between p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#DDD8CE]" />
                <div>
                  <div className="text-sm font-semibold text-[#F3EFE7]">Download HTML Report</div>
                  <div className="text-[11px] font-mono text-[#97959F]">Standalone shareable document</div>
                </div>
              </div>
              <Download className="w-4 h-4 text-[#97959F]" />
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="flex items-center justify-between p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileJson className="w-5 h-5 text-[#DDD8CE]" />
                <div>
                  <div className="text-sm font-semibold text-[#F3EFE7]">Download JSON Audit</div>
                  <div className="text-[11px] font-mono text-[#97959F]">Structured full snapshot</div>
                </div>
              </div>
              <Download className="w-4 h-4 text-[#97959F]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
