'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import type { AdminTask, TaskPriority, TaskStatus } from '@/types/admin';
import { taskServiceTypeOptions } from '@/lib/validations/admin.schema';
import { formatCurrencyINR } from '@/lib/admin/report';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
  initialTask?: AdminTask | null;
  prefill?: {
    title?: string;
    clientName?: string;
    clientEmail?: string;
    serviceType?: string;
    notes?: string;
    sourceInquiryId?: string;
  } | null;
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'In Review' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

function defaultDueDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  return d.toISOString().slice(0, 10);
}

export function TaskModal({
  isOpen,
  onClose,
  onSaved,
  initialTask,
  prefill,
}: TaskModalProps) {
  const isEditing = Boolean(initialTask);

  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [serviceType, setServiceType] = useState<string>(taskServiceTypeOptions[0]);
  const [assignedTo, setAssignedTo] = useState('Sayan');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [totalAmount, setTotalAmount] = useState('0');
  const [amountCollected, setAmountCollected] = useState('0');
  const [dueDate, setDueDate] = useState(defaultDueDate());
  const [notes, setNotes] = useState('');
  const [sourceInquiryId, setSourceInquiryId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);

    if (initialTask) {
      setTitle(initialTask.title);
      setClientName(initialTask.clientName);
      setClientEmail(initialTask.clientEmail || '');
      setServiceType(initialTask.serviceType);
      setAssignedTo(initialTask.assignedTo);
      setStatus(initialTask.status);
      setPriority(initialTask.priority);
      setTotalAmount(String(initialTask.totalAmount));
      setAmountCollected(String(initialTask.amountCollected));
      setDueDate(initialTask.dueDate);
      setNotes(initialTask.notes || '');
      setSourceInquiryId(initialTask.sourceInquiryId || null);
    } else if (prefill) {
      setTitle(prefill.title || '');
      setClientName(prefill.clientName || '');
      setClientEmail(prefill.clientEmail || '');
      setServiceType(prefill.serviceType || taskServiceTypeOptions[0]);
      setAssignedTo('Sayan');
      setStatus('pending');
      setPriority('medium');
      setTotalAmount('0');
      setAmountCollected('0');
      setDueDate(defaultDueDate());
      setNotes(prefill.notes || '');
      setSourceInquiryId(prefill.sourceInquiryId || null);
    } else {
      setTitle('');
      setClientName('');
      setClientEmail('');
      setServiceType(taskServiceTypeOptions[0]);
      setAssignedTo('Sayan');
      setStatus('pending');
      setPriority('medium');
      setTotalAmount('0');
      setAmountCollected('0');
      setDueDate(defaultDueDate());
      setNotes('');
      setSourceInquiryId(null);
    }
  }, [isOpen, initialTask, prefill]);

  if (!isOpen) return null;

  const numericTotal = Math.max(0, Number(totalAmount) || 0);
  const numericCollected = Math.max(0, Number(amountCollected) || 0);
  const previewDue = Math.max(0, numericTotal - numericCollected);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (numericCollected > numericTotal) {
      setError('Amount collected cannot exceed total project amount.');
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = isEditing && initialTask
        ? `/api/admin/tasks/${initialTask.id}`
        : '/api/admin/tasks';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          clientName,
          clientEmail,
          serviceType,
          assignedTo,
          status,
          priority,
          totalAmount: numericTotal,
          amountCollected: numericCollected,
          dueDate,
          notes,
          sourceInquiryId,
        }),
      });

      const json = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !json.success) {
        setError(json.error || 'Failed to save task.');
        return;
      }

      await onSaved();
      onClose();
    } catch {
      setError('Network error while saving task.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-[#14141B] border border-white/[0.12] shadow-2xl overflow-hidden my-8">
        <div className="px-6 py-4 bg-[#181822] border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#19C3B8]">
              {isEditing ? 'UPDATE TASK & BILLING' : 'CREATE PRODUCTION TASK'}
            </div>
            <h3 className="font-display text-2xl text-[#F3EFE7] uppercase">
              {isEditing ? 'Edit Task & Payments' : 'New Studio Task'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#97959F] hover:text-[#F3EFE7] hover:bg-white/[0.06]"
            aria-label="Close task modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 flex items-center gap-2 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Task / Project Title"
              required
              placeholder="e.g. Q4 Brand Promo Cut"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              label="Assigned Editor"
              required
              placeholder="e.g. Sayan"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Client Name"
              required
              placeholder="e.g. Aarav Studios"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
            <Input
              label="Client Email"
              type="email"
              placeholder="client@example.com (Optional)"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Service Type"
              required
              options={taskServiceTypeOptions}
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
            />

            <div className="w-full space-y-1.5">
              <label className="block font-mono text-[11px] uppercase tracking-wider text-[#97959F]">
                Task Status <span className="text-[#FF6B35]">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="flex h-11 w-full rounded-xl border border-[rgba(243,239,231,0.15)] bg-[#0B0B0D] px-3.5 py-2 text-sm text-[#F3EFE7] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#15151B]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full space-y-1.5">
              <label className="block font-mono text-[11px] uppercase tracking-wider text-[#97959F]">
                Priority <span className="text-[#FF6B35]">*</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="flex h-11 w-full rounded-xl border border-[rgba(243,239,231,0.15)] bg-[#0B0B0D] px-3.5 py-2 text-sm text-[#F3EFE7] focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
              >
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#15151B]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Total Project Fee (INR)"
              type="number"
              min="0"
              step="1"
              required
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
            />
            <Input
              label="Amount Collected (INR)"
              type="number"
              min="0"
              step="1"
              required
              value={amountCollected}
              onChange={(e) => setAmountCollected(e.target.value)}
            />
            <Input
              label="Due Date"
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0B0D] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div>
              <span className="text-[#97959F]">TOTAL FEE: </span>
              <span className="text-[#F3EFE7] font-bold">{formatCurrencyINR(numericTotal)}</span>
            </div>
            <div>
              <span className="text-[#97959F]">COLLECTED: </span>
              <span className="text-[#19C3B8] font-bold">{formatCurrencyINR(numericCollected)}</span>
            </div>
            <div>
              <span className="text-[#97959F]">TO BE RECEIVED: </span>
              <span className="text-[#FF9933] font-bold">{formatCurrencyINR(previewDue)}</span>
            </div>
          </div>

          <Textarea
            label="Notes / Deliverables"
            rows={2}
            placeholder="Footage links, revisions, milestone payment notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-white/[0.15] text-sm text-[#DDD8CE] hover:border-white/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FF9933] text-[#0B0B0D] font-bold text-sm hover:shadow-[0_0_20px_rgba(255,153,51,0.5)] disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
