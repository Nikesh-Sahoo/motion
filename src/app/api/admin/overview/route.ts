import { NextRequest, NextResponse } from 'next/server';
import type { ObjectId } from 'mongodb';
import { requireAdmin, sanitizeUser, type UserDocument } from '@/lib/auth/session';
import { withDatabase } from '@/lib/mongodb';
import {
  buildDashboardSummary,
  serializeApplication,
  serializeInquiry,
  serializePaymentVerification,
  serializeTask,
  type TaskDocument,
} from '@/lib/admin/analytics';
import type { AdminOverviewPayload } from '@/types/admin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/overview
 * Returns all tasks, inquiries, editor applications, users, and computed KPI/chart analytics.
 */
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const payload: AdminOverviewPayload = await withDatabase(async (db) => {
      const [taskDocs, inquiryDocs, appDocs, userDocs, verificationDocs] = await Promise.all([
        db.collection<TaskDocument>('tasks').find({}).sort({ createdAt: -1 }).toArray(),
        db.collection('inquiries').find({}).sort({ createdAt: -1 }).limit(100).toArray(),
        db
          .collection('editor_applications')
          .find({})
          .sort({ createdAt: -1 })
          .limit(100)
          .toArray(),
        db.collection<UserDocument>('users').find({}).sort({ createdAt: -1 }).toArray(),
        db
          .collection('payment_verifications')
          .find({})
          .sort({ verifiedAt: -1 })
          .limit(60)
          .toArray(),
      ]);

      const tasks = taskDocs.map((doc) =>
        serializeTask(doc as TaskDocument & { _id: ObjectId })
      );
      const inquiries = inquiryDocs.map((doc) =>
        serializeInquiry(doc as Record<string, unknown> & { _id: ObjectId })
      );
      const applications = appDocs.map((doc) =>
        serializeApplication(doc as Record<string, unknown> & { _id: ObjectId })
      );
      const users = userDocs.map((doc) =>
        sanitizeUser(doc as UserDocument & { _id: ObjectId })
      );
      const paymentVerifications = verificationDocs.map((doc) =>
        serializePaymentVerification(doc as Record<string, unknown> & { _id: ObjectId })
      );

      const summary = buildDashboardSummary(
        tasks,
        inquiries.length,
        applications.length,
        users
      );

      return {
        tasks,
        inquiries,
        applications,
        users,
        paymentVerifications,
        summary,
      };
    });

    return NextResponse.json({ success: true, data: payload });
  } catch (error: unknown) {
    console.error('[Admin Overview Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load admin overview data.' },
      { status: 500 }
    );
  }
}
