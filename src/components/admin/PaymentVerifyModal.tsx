'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  X,
  XCircle,
} from 'lucide-react';
import type { AdminTask, InquiryRecord } from '@/types/admin';
import { formatCurrencyINR } from '@/lib/admin/report';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

export interface VerifyPaymentTarget {
  inquiry?: InquiryRecord | null;
  task?: AdminTask | null;
}

interface PaymentVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => Promise<void> | void;
  target: VerifyPaymentTarget | null;
}

export function PaymentVerifyModal({
  isOpen,
  onClose,
  onVerified,
  target,
}: PaymentVerifyModalProps) {
  const inquiry = target?.inquiry ?? null;
  const task = target?.task ?? null;

  const isPendingClaim =
    task?.paymentVerificationStatus === 'pending_verification' ||
    inquiry?.paymentVerificationStatus === 'pending_verification';

  const claimedAmount = isPendingClaim
    ? Number(task?.claimedPaidAmount ?? inquiry?.claimedPaidAmount ?? 0)
    : 0;

  const previousCollected = Number(
    task?.amountCollected ?? inquiry?.paidAmount ?? 0
  );

  const initialTotal = Number(
    task?.totalAmount ?? inquiry?.totalProjectAmount ?? 500
  );

  const initialRemaining = Math.max(0, initialTotal - previousCollected);

  const [utrReference, setUtrReference] = useState('');
  const [actualAmountPaid, setActualAmountPaid] = useState('0');
  const [totalProjectAmount, setTotalProjectAmount] = useState('500');
  const [updateMode, setUpdateMode] = useState<'add_payment' | 'set_exact_total'>(
    'add_payment'
  );
  const [verificationNotes, setVerificationNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !target) return;
    setError(null);
    setVerificationNotes('');

    const defaultUtr = task?.utrReference || inquiry?.utrReference || '';
    const defaultTotal = Number(
      task?.totalAmount ?? inquiry?.totalProjectAmount ?? 500
    );
    const prevPaid = Number(task?.amountCollected ?? inquiry?.paidAmount ?? 0);
    const pendingAmt = isPendingClaim
      ? Number(task?.claimedPaidAmount ?? inquiry?.claimedPaidAmount ?? 0)
      : 0;
    const rem = Math.max(0, defaultTotal - prevPaid);

    setUtrReference(defaultUtr);
    setTotalProjectAmount(String(defaultTotal > 0 ? defaultTotal : 500));
    setUpdateMode('add_payment');
    setActualAmountPaid(
      String(pendingAmt > 0 ? pendingAmt : rem > 0 ? rem : 0)
    );
  }, [isOpen, target, task, inquiry, isPendingClaim]);

  if (!isOpen || !target) return null;

  const clientName =
    task?.clientName ||
    (inquiry?.companyName
      ? `${inquiry.fullName} (${inquiry.companyName})`
      : inquiry?.fullName || 'Client');
  const projectLabel =
    task?.title ||
    `${inquiry?.platform || 'Project'} — ${inquiry?.serviceType || ''}`;

  const parsedActual = Math.max(0, Number(actualAmountPaid) || 0);
  const parsedTotal = Math.max(0, Number(totalProjectAmount) || 0);
  const previewCollected =
    updateMode === 'set_exact_total'
      ? parsedActual
      : previousCollected + parsedActual;
  const previewRemaining = Math.max(0, parsedTotal - previewCollected);
  const exceedsTotal = previewCollected > parsedTotal;
  const hasMismatch = isPendingClaim && claimedAmount > 0 && parsedActual !== claimedAmount;

  const submitVerification = async (action: 'verify' | 'reject') => {
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId: inquiry?.id || task?.sourceInquiryId || null,
          taskId: task?.id || inquiry?.linkedTaskId || null,
          action,
          updateMode,
          actualAmountPaid: action === 'reject' ? 0 : parsedActual,
          totalProjectAmount: parsedTotal,
          utrReference,
          verificationNotes,
        }),
      });

      const json = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !json.success) {
        setError(json.error || 'Failed to verify payment.');
        return;
      }

      await onVerified();
      onClose();
    } catch {
      setError('Network error communicating with verification API.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[75] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl bg-[#0D101B] border border-emerald-500/35 shadow-[0_0_50px_rgba(16,185,129,0.2)] overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Payment Verification Desk</span>
            </div>
            <h3 className="text-lg font-bold text-[#F4F6FF] mt-0.5">{clientName}</h3>
            <p className="text-xs text-[#8A94B8] truncate max-w-md">{projectLabel}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#8A94B8] hover:text-white hover:bg-white/[0.06]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Claim vs Current Status Summary */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#070911] border border-white/[0.08] text-xs font-mono">
            <div>
              <div className="text-[#8A94B8] text-[10px] uppercase">Claimed Now</div>
              <div className="text-[#00F0FF] font-bold text-sm mt-0.5">
                {isPendingClaim ? formatCurrencyINR(claimedAmount) : '—'}
              </div>
            </div>
            <div>
              <div className="text-[#8A94B8] text-[10px] uppercase">Verified Paid</div>
              <div className="text-emerald-400 font-bold text-sm mt-0.5">
                {formatCurrencyINR(previousCollected)}
              </div>
            </div>
            <div>
              <div className="text-[#8A94B8] text-[10px] uppercase">Due Balance</div>
              <div className="text-amber-400 font-bold text-sm mt-0.5">
                {formatCurrencyINR(initialRemaining)}
              </div>
            </div>
          </div>

          {previousCollected > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setUpdateMode('add_payment')}
                className={`flex-1 py-2 px-3 rounded-xl border font-mono transition-colors ${
                  updateMode === 'add_payment'
                    ? 'bg-emerald-500/15 border-emerald-500/45 text-emerald-300'
                    : 'bg-[#070911] border-white/[0.08] text-[#8A94B8]'
                }`}
              >
                + Add Installment Receipt
              </button>
              <button
                type="button"
                onClick={() => setUpdateMode('set_exact_total')}
                className={`flex-1 py-2 px-3 rounded-xl border font-mono transition-colors ${
                  updateMode === 'set_exact_total'
                    ? 'bg-[#00F0FF]/15 border-[#00F0FF]/45 text-[#00F0FF]'
                    : 'bg-[#070911] border-white/[0.08] text-[#8A94B8]'
                }`}
              >
                Set Exact Total Paid
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="verifyUtr"
              label="UPI Transaction ID / UTR Reference"
              required
              placeholder="e.g. 432198765432"
              value={utrReference}
              onChange={(e) => setUtrReference(e.target.value)}
            />
            <Input
              id="verifyActualAmount"
              type="number"
              min="0"
              label={
                updateMode === 'set_exact_total'
                  ? 'Exact Total Received in Bank (₹)'
                  : 'Actual ₹ Received for This UTR'
              }
              required
              value={actualAmountPaid}
              onChange={(e) => setActualAmountPaid(e.target.value)}
            />
          </div>

          <Input
            id="verifyTotalAmount"
            type="number"
            min="0"
            label="Agreed Total Project Value (₹)"
            value={totalProjectAmount}
            onChange={(e) => setTotalProjectAmount(e.target.value)}
          />

          <Textarea
            id="verifyNotes"
            rows={2}
            label="Bank / PhonePe Verification Note (Optional)"
            placeholder="e.g. Matched ₹1,200 on PhonePe merchant history; ₹800 remaining on delivery."
            value={verificationNotes}
            onChange={(e) => setVerificationNotes(e.target.value)}
          />

          {hasMismatch && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/35 text-xs text-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                Amount mismatch: customer claimed{' '}
                <strong>{formatCurrencyINR(claimedAmount)}</strong>, but you entered{' '}
                <strong>{formatCurrencyINR(parsedActual)}</strong>. Database will store
                the verified <strong>{formatCurrencyINR(parsedActual)}</strong> and adjust
                remaining balance accordingly.
              </span>
            </div>
          )}

          {/* Live DB Impact Preview */}
          <div className="p-3.5 rounded-xl bg-[#070911] border border-white/[0.08] space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[#8A94B8]">New Verified Paid in DB:</span>
              <span
                className={`font-bold ${
                  exceedsTotal ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {formatCurrencyINR(previewCollected)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A94B8]">New Remaining Balance:</span>
              <span className="text-amber-400 font-bold">
                {formatCurrencyINR(previewRemaining)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A94B8]">Updated Payment Status:</span>
              <span className="text-[#F4F6FF] uppercase">
                {previewRemaining === 0 && parsedTotal > 0
                  ? 'PAID'
                  : previewCollected > 0
                  ? 'PARTIAL'
                  : 'UNPAID'}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2.5">
            {isPendingClaim ? (
              <button
                type="button"
                disabled={submitting}
                onClick={() => void submitVerification('reject')}
                className="px-4 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 hover:bg-rose-500/25 text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Claim</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-white/[0.12] text-xs font-medium text-[#D5DCF5] hover:bg-white/[0.05]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting || exceedsTotal || parsedActual <= 0}
                onClick={() => void submitVerification('verify')}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#05070E] font-bold text-xs inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{submitting ? 'Verifying...' : 'Verify Actual ₹ & Update DB'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
