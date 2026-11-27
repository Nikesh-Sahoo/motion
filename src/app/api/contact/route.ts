import { NextRequest, NextResponse } from 'next/server';
import {
  contactFormSchema,
  normalizeUtrReference,
  parseBudgetAmount,
} from '@/lib/validations/contact.schema';
import { isMongoConfigured, withDatabase } from '@/lib/mongodb';
import { computePaymentFields, type TaskDocument } from '@/lib/admin/analytics';

export const dynamic = 'force-dynamic';

function deriveDueDate(deadline: string): string {
  const d = new Date();
  if (deadline.includes('24 to 48')) d.setDate(d.getDate() + 2);
  else if (deadline.includes('48 to 72')) d.setDate(d.getDate() + 3);
  else if (deadline.includes('1 to 2 weeks')) d.setDate(d.getDate() + 10);
  else d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

/**
 * Health check & status endpoint
 * GET /api/contact
 */
export async function GET() {
  const configured = isMongoConfigured();
  return NextResponse.json({
    status: 'ok',
    service: 'Motionxyne Contact & Inquiry API',
    mongoConfigured: configured,
    database: process.env.MONGODB_DB_NAME || 'motion',
    collection: 'inquiries',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Store project inquiry in MongoDB collection "inquiries" and auto-sync payments into "tasks"
 * POST /api/contact
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validate payload using strict Zod schema
    const validationResult = contactFormSchema.safeParse(body);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // 2. Extract metadata & payment summary
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const hasPaymentClaim =
      (data.paymentMode === 'partial' || data.paymentMode === 'full') &&
      Number(data.paidAmount) > 0;

    const claimedPaidAmount = hasPaymentClaim ? Number(data.paidAmount) : 0;
    const normalizedUtr =
      hasPaymentClaim && data.utrReference
        ? normalizeUtrReference(data.utrReference)
        : null;

    const resolvedTotalAmount = hasPaymentClaim
      ? Math.max(
          claimedPaidAmount,
          Number(data.totalProjectAmount) || parseBudgetAmount(data.budgetRange)
        )
      : Number(data.totalProjectAmount) || parseBudgetAmount(data.budgetRange);

    // Zero-trust: hold claimed UPI payments as pending verification (verified paid = 0 until Admin verifies)
    const paymentFields = computePaymentFields(resolvedTotalAmount, 0);

    const now = new Date();
    const inquiryDocument: Record<string, unknown> = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || null,
      companyName: data.companyName || null,
      serviceType: data.serviceType,
      platform: data.platform,
      approximateDuration: data.approximateDuration || null,
      numberOfVideos: data.numberOfVideos || null,
      budgetRange: data.budgetRange,
      deadline: data.deadline,
      projectDescription: data.projectDescription,
      referenceVideoUrl: data.referenceVideoUrl || null,
      additionalRequirements: data.additionalRequirements || null,
      paymentMode: data.paymentMode || 'none',
      totalProjectAmount: paymentFields.totalAmount,
      claimedPaidAmount,
      paidAmount: 0,
      verifiedPaidAmount: 0,
      remainingAmount: paymentFields.amountToReceive,
      paymentStatus: 'unpaid',
      paymentVerificationStatus: hasPaymentClaim ? 'pending_verification' : 'none',
      utrReference: normalizedUtr,
      utrNormalized: normalizedUtr,
      verifiedBy: null,
      verifiedAt: null,
      verificationNotes: null,
      source: 'website_contact_form',
      status: hasPaymentClaim ? 'payment_pending_verification' : 'new',
      linkedTaskId: null,
      clientIp,
      userAgent,
      createdAt: now,
      updatedAt: now,
    };

    // 3. Store in MongoDB if configured
    if (isMongoConfigured()) {
      try {
        const saved = await withDatabase(async (db) => {
          const inquiriesCollection = db.collection('inquiries');

          // Block duplicate UTR submissions so one transaction ID cannot be reused
          if (normalizedUtr) {
            const [existingInquiryUtr, existingVerifiedUtr] = await Promise.all([
              inquiriesCollection.findOne({
                utrNormalized: normalizedUtr,
                paymentVerificationStatus: { $ne: 'rejected' },
              }),
              db.collection('payment_verifications').findOne({
                utrNormalized: normalizedUtr,
                verificationStatus: { $ne: 'rejected' },
              }),
            ]);

            if (existingInquiryUtr || existingVerifiedUtr) {
              return { duplicateUtr: true as const };
            }
          }

          const insertResult = await inquiriesCollection.insertOne(inquiryDocument);
          const inquiryId = insertResult.insertedId.toHexString();
          let linkedTaskId: string | null = null;

          // Surface payment claim immediately on Admin Dashboard in pending-verification state
          if (hasPaymentClaim) {
            const taskDoc: TaskDocument = {
              title: `${data.platform} — ${data.serviceType.split('(')[0].trim()}`,
              clientName: data.companyName
                ? `${data.fullName} (${data.companyName})`
                : data.fullName,
              clientEmail: data.email,
              serviceType: data.serviceType,
              assignedTo: 'Unassigned',
              assignedEditorId: null,
              assignedEditorEmail: null,
              status: 'pending',
              priority: data.deadline.includes('24 to 48') ? 'urgent' : 'medium',
              progress: 10,
              totalAmount: paymentFields.totalAmount,
              amountCollected: 0,
              claimedPaidAmount,
              paymentVerificationStatus: 'pending_verification',
              utrReference: normalizedUtr,
              verifiedBy: null,
              verifiedAt: null,
              dueDate: deriveDueDate(data.deadline),
              notes: [
                `UPI QR Payment Claim (${data.paymentMode.toUpperCase()}) | Claimed: ₹${claimedPaidAmount} | UTR: ${normalizedUtr || 'N/A'} (Pending Admin Verification)`,
                `Budget: ${data.budgetRange} | Deadline: ${data.deadline}`,
                data.referenceVideoUrl ? `Reference: ${data.referenceVideoUrl}` : null,
                data.projectDescription,
              ]
                .filter(Boolean)
                .join('\n'),
              deliverableUrl: null,
              editorNotes: null,
              sourceInquiryId: inquiryId,
              createdAt: now,
              updatedAt: now,
            };

            const taskResult = await db.collection<TaskDocument>('tasks').insertOne(taskDoc);
            linkedTaskId = taskResult.insertedId.toHexString();

            await inquiriesCollection.updateOne(
              { _id: insertResult.insertedId },
              { $set: { linkedTaskId, updatedAt: new Date() } }
            );
          }

          return { inquiryId, linkedTaskId };
        });

        if ('duplicateUtr' in saved) {
          return NextResponse.json(
            {
              success: false,
              error: 'Duplicate UPI Transaction ID / UTR Reference detected.',
              fieldErrors: {
                utrReference:
                  'This UTR / Transaction Reference has already been submitted. Please enter a unique UTR.',
              },
            },
            { status: 409 }
          );
        }

        return NextResponse.json(
          {
            success: true,
            message: hasPaymentClaim
              ? 'Inquiry and UPI UTR submitted for admin payment verification.'
              : 'Inquiry successfully saved to MongoDB database.',
            id: saved.inquiryId,
            taskId: saved.linkedTaskId,
            paymentRecorded: hasPaymentClaim,
            paymentVerificationStatus: hasPaymentClaim
              ? 'pending_verification'
              : 'none',
            paymentStatus: 'unpaid',
            collection: 'inquiries',
          },
          { status: 201 }
        );
      } catch (dbError: unknown) {
        console.error('[MongoDB Error] Failed to insert inquiry:', dbError);
        return NextResponse.json(
          {
            success: false,
            error: 'Database error: Could not save inquiry to MongoDB.',
            details:
              dbError instanceof Error ? dbError.message : 'Database connection failure',
          },
          { status: 500 }
        );
      }
    } else {
      console.warn(
        '[MongoDB Warning] MONGODB_URI is not configured in .env.local. Simulated inquiry storage.'
      );
      return NextResponse.json(
        {
          success: true,
          message:
            'Inquiry received. Note: MONGODB_URI is not set in .env.local yet; please configure it to persist records in MongoDB Atlas.',
          simulated: true,
        },
        { status: 200 }
      );
    }
  } catch (error: unknown) {
    console.error('[Contact API Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process inquiry request.',
        details: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
