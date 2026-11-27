import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { requireAdmin } from '@/lib/auth/session';
import { withDatabase } from '@/lib/mongodb';
import {
  computePaymentFields,
  serializeInquiry,
  serializePaymentVerification,
  serializeTask,
  type TaskDocument,
} from '@/lib/admin/analytics';
import { paymentVerifySchema } from '@/lib/validations/admin.schema';
import { normalizeUtrReference, parseBudgetAmount } from '@/lib/validations/contact.schema';
import type { PaymentVerificationStatus } from '@/types/admin';

export const dynamic = 'force-dynamic';

function deriveDueDateFromDeadline(deadline: string): string {
  const d = new Date();
  if (deadline.includes('24 to 48')) d.setDate(d.getDate() + 2);
  else if (deadline.includes('48 to 72')) d.setDate(d.getDate() + 3);
  else if (deadline.includes('1 to 2 weeks')) d.setDate(d.getDate() + 10);
  else d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

/**
 * POST /api/admin/payments/verify
 * Verifies the actual amount received (from PhonePe/bank statement against UTR),
 * prevents duplicate UTR verification reuse, updates paid & remaining amounts across
 * `tasks` and `inquiries`, and writes an immutable record to `payment_verifications`.
 */
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const parsed = paymentVerifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || 'Invalid verification payload.',
        },
        { status: 400 }
      );
    }

    const input = parsed.data;
    if (input.inquiryId && !ObjectId.isValid(input.inquiryId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid inquiryId.' },
        { status: 400 }
      );
    }
    if (input.taskId && !ObjectId.isValid(input.taskId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid taskId.' },
        { status: 400 }
      );
    }

    const normalizedUtr = input.utrReference
      ? normalizeUtrReference(input.utrReference)
      : '';

    const outcome = await withDatabase(async (db) => {
      const tasksCol = db.collection<TaskDocument>('tasks');
      const inquiriesCol = db.collection('inquiries');
      const verificationsCol = db.collection('payment_verifications');

      let taskDoc: (TaskDocument & { _id: ObjectId }) | null = null;
      let inquiryDoc: (Record<string, unknown> & { _id: ObjectId }) | null = null;

      if (input.taskId) {
        taskDoc = (await tasksCol.findOne({
          _id: new ObjectId(input.taskId),
        })) as (TaskDocument & { _id: ObjectId }) | null;
      }
      if (input.inquiryId) {
        inquiryDoc = (await inquiriesCol.findOne({
          _id: new ObjectId(input.inquiryId),
        })) as (Record<string, unknown> & { _id: ObjectId }) | null;
      }

      // Cross-link lookup if only one ID was passed
      if (!taskDoc && inquiryDoc?.linkedTaskId && ObjectId.isValid(String(inquiryDoc.linkedTaskId))) {
        taskDoc = (await tasksCol.findOne({
          _id: new ObjectId(String(inquiryDoc.linkedTaskId)),
        })) as (TaskDocument & { _id: ObjectId }) | null;
      }
      if (!inquiryDoc && taskDoc?.sourceInquiryId && ObjectId.isValid(taskDoc.sourceInquiryId)) {
        inquiryDoc = (await inquiriesCol.findOne({
          _id: new ObjectId(taskDoc.sourceInquiryId),
        })) as (Record<string, unknown> & { _id: ObjectId }) | null;
      }

      if (!taskDoc && !inquiryDoc) {
        return { notFound: true as const };
      }

      const effectiveUtr =
        normalizedUtr ||
        normalizeUtrReference(
          String(taskDoc?.utrReference || inquiryDoc?.utrReference || 'MANUAL')
        );

      // Block reusing a UTR that was already verified on a different task/inquiry
      if (input.action === 'verify' && effectiveUtr && effectiveUtr !== 'MANUAL') {
        const duplicateVerified = await verificationsCol.findOne({
          utrNormalized: effectiveUtr,
          verificationStatus: { $in: ['verified', 'mismatch_verified'] },
        });
        if (duplicateVerified) {
          return {
            duplicateUtr: `UTR ${effectiveUtr} has already been verified on ${new Date(
              duplicateVerified.verifiedAt as Date
            ).toLocaleDateString()}. Duplicate UTR reuse is blocked.` as const,
          };
        }
      }

      const existingTotal =
        typeof taskDoc?.totalAmount === 'number'
          ? taskDoc.totalAmount
          : typeof inquiryDoc?.totalProjectAmount === 'number'
          ? Number(inquiryDoc.totalProjectAmount)
          : parseBudgetAmount(String(inquiryDoc?.budgetRange || ''));

      const nextTotal =
        typeof input.totalProjectAmount === 'number' && input.totalProjectAmount > 0
          ? input.totalProjectAmount
          : existingTotal;

      const previousCollected = Number(
        taskDoc?.amountCollected ?? inquiryDoc?.paidAmount ?? 0
      );
      const isPendingClaim =
        taskDoc?.paymentVerificationStatus === 'pending_verification' ||
        inquiryDoc?.paymentVerificationStatus === 'pending_verification';
      const claimedAmount = isPendingClaim
        ? Number(taskDoc?.claimedPaidAmount ?? inquiryDoc?.claimedPaidAmount ?? 0)
        : 0;

      const now = new Date();
      let nextCollected = previousCollected;
      let actualAmountVerified = 0;
      let verificationStatus: PaymentVerificationStatus = 'verified';

      if (input.action === 'reject') {
        actualAmountVerified = 0;
        nextCollected = previousCollected;
        verificationStatus = 'rejected';
      } else {
        actualAmountVerified = Math.round(input.actualAmountPaid * 100) / 100;
        nextCollected =
          input.updateMode === 'set_exact_total'
            ? actualAmountVerified
            : previousCollected + actualAmountVerified;

        if (nextCollected > nextTotal) {
          return {
            exceedsTotal: `Total verified paid amount (₹${nextCollected}) exceeds Agreed Project Total (₹${nextTotal}). Increase Total Project Value first if client upgraded scope.` as const,
          };
        }

        verificationStatus =
          claimedAmount > 0 && actualAmountVerified !== claimedAmount
            ? 'mismatch_verified'
            : 'verified';
      }

      const amounts = computePaymentFields(nextTotal, nextCollected);
      const clientName =
        taskDoc?.clientName ||
        (inquiryDoc?.companyName
          ? `${String(inquiryDoc.fullName)} (${String(inquiryDoc.companyName)})`
          : String(inquiryDoc?.fullName || 'Client'));

      // Create linked task automatically if verifying a payment on a standalone inquiry
      let resolvedTaskId = taskDoc?._id?.toHexString() || null;
      if (!taskDoc && inquiryDoc && input.action === 'verify' && amounts.amountCollected > 0) {
        const deadlineStr = String(inquiryDoc.deadline || '');
        const newTask: TaskDocument = {
          title: `${String(inquiryDoc.platform || 'Project')} — ${String(
            inquiryDoc.serviceType || 'Edit'
          )
            .split('(')[0]
            .trim()}`,
          clientName,
          clientEmail: inquiryDoc.email ? String(inquiryDoc.email) : null,
          serviceType: String(inquiryDoc.serviceType || 'Other'),
          assignedTo: 'Unassigned',
          assignedEditorId: null,
          assignedEditorEmail: null,
          status: 'pending',
          priority: deadlineStr.includes('24 to 48') ? 'urgent' : 'medium',
          progress: 10,
          totalAmount: amounts.totalAmount,
          amountCollected: amounts.amountCollected,
          claimedPaidAmount: claimedAmount,
          paymentVerificationStatus: verificationStatus,
          utrReference: effectiveUtr,
          verifiedBy: auth.user.email,
          verifiedAt: now,
          dueDate: deriveDueDateFromDeadline(deadlineStr),
          notes: [
            `Verified UPI Payment | UTR: ${effectiveUtr} | Verified Paid: ₹${amounts.amountCollected} | Remaining: ₹${amounts.amountToReceive}`,
            `Budget: ${String(inquiryDoc.budgetRange || '')} | Deadline: ${deadlineStr}`,
            String(inquiryDoc.projectDescription || ''),
          ]
            .filter(Boolean)
            .join('\n'),
          deliverableUrl: null,
          editorNotes: null,
          sourceInquiryId: inquiryDoc._id.toHexString(),
          createdAt: now,
          updatedAt: now,
        };
        const insertedTask = await tasksCol.insertOne(newTask);
        resolvedTaskId = insertedTask.insertedId.toHexString();
        taskDoc = { ...newTask, _id: insertedTask.insertedId };
      } else if (taskDoc) {
        const noteLine =
          input.action === 'reject'
            ? `[${now.toISOString().slice(0, 10)}] UTR ${effectiveUtr} REJECTED by ${auth.user.email}${input.verificationNotes ? `: ${input.verificationNotes}` : ''}`
            : `[${now.toISOString().slice(0, 10)}] Verified +₹${actualAmountVerified} (UTR: ${effectiveUtr}) by ${auth.user.email} -> Paid: ₹${amounts.amountCollected} / Remaining: ₹${amounts.amountToReceive}`;

        const nextNotes = [taskDoc.notes, noteLine].filter(Boolean).join('\n');

        await tasksCol.updateOne(
          { _id: taskDoc._id },
          {
            $set: {
              totalAmount: amounts.totalAmount,
              amountCollected: amounts.amountCollected,
              paymentVerificationStatus: verificationStatus,
              utrReference: effectiveUtr,
              verifiedBy: auth.user.email,
              verifiedAt: now,
              notes: nextNotes,
              updatedAt: now,
            },
          }
        );
        taskDoc = (await tasksCol.findOne({ _id: taskDoc._id })) as TaskDocument & {
          _id: ObjectId;
        };
      }

      if (inquiryDoc) {
        const currentInquiryStatus = String(inquiryDoc.status || 'new');
        const shouldUpdateInquiryStatus =
          currentInquiryStatus === 'new' ||
          currentInquiryStatus === 'payment_received' ||
          currentInquiryStatus === 'payment_pending_verification' ||
          currentInquiryStatus === 'payment_verified' ||
          currentInquiryStatus === 'payment_rejected';

        const nextInquiryStatus = shouldUpdateInquiryStatus
          ? input.action === 'reject'
            ? amounts.amountCollected > 0
              ? 'payment_verified'
              : 'payment_rejected'
            : 'payment_verified'
          : currentInquiryStatus;

        await inquiriesCol.updateOne(
          { _id: inquiryDoc._id },
          {
            $set: {
              totalProjectAmount: amounts.totalAmount,
              paidAmount: amounts.amountCollected,
              verifiedPaidAmount: amounts.amountCollected,
              remainingAmount: amounts.amountToReceive,
              paymentStatus: amounts.paymentStatus,
              paymentVerificationStatus: verificationStatus,
              utrReference: effectiveUtr,
              utrNormalized: effectiveUtr,
              verifiedBy: auth.user.email,
              verifiedAt: now,
              verificationNotes: input.verificationNotes || null,
              linkedTaskId: resolvedTaskId,
              status: nextInquiryStatus,
              updatedAt: now,
            },
          }
        );
        inquiryDoc = (await inquiriesCol.findOne({ _id: inquiryDoc._id })) as
          | (Record<string, unknown> & { _id: ObjectId })
          | null;
      }

      const auditDoc = {
        inquiryId: inquiryDoc ? inquiryDoc._id.toHexString() : null,
        taskId: resolvedTaskId,
        clientName,
        utrReference: effectiveUtr,
        utrNormalized: effectiveUtr,
        claimedAmount,
        actualAmountVerified,
        previousCollected,
        newCollected: amounts.amountCollected,
        totalProjectAmount: amounts.totalAmount,
        remainingAmount: amounts.amountToReceive,
        verificationStatus,
        notes: input.verificationNotes || null,
        verifiedBy: auth.user.email,
        verifiedAt: now,
      };

      const auditRes = await verificationsCol.insertOne(auditDoc);

      return {
        task: taskDoc ? serializeTask(taskDoc) : null,
        inquiry: inquiryDoc ? serializeInquiry(inquiryDoc) : null,
        verification: serializePaymentVerification({
          ...auditDoc,
          _id: auditRes.insertedId,
        }),
      };
    });

    if ('notFound' in outcome) {
      return NextResponse.json(
        { success: false, error: 'Target inquiry or task not found.' },
        { status: 404 }
      );
    }

    if ('duplicateUtr' in outcome) {
      return NextResponse.json(
        { success: false, error: outcome.duplicateUtr },
        { status: 409 }
      );
    }

    if ('exceedsTotal' in outcome) {
      return NextResponse.json(
        { success: false, error: outcome.exceedsTotal },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      ...outcome,
    });
  } catch (error: unknown) {
    console.error('[Admin Payment Verify Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment.' },
      { status: 500 }
    );
  }
}
