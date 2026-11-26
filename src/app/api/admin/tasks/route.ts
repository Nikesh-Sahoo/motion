import { NextRequest, NextResponse } from 'next/server';
import type { ObjectId } from 'mongodb';
import { requireAdmin } from '@/lib/auth/session';
import { withDatabase } from '@/lib/mongodb';
import {
  buildDashboardSummary,
  computePaymentFields,
  serializeTask,
  type TaskDocument,
} from '@/lib/admin/analytics';
import { taskCreateSchema } from '@/lib/validations/admin.schema';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const docs = await withDatabase((db) =>
      db.collection<TaskDocument>('tasks').find({}).sort({ createdAt: -1 }).toArray()
    );
    const serialized = docs.map((doc) =>
      serializeTask(doc as TaskDocument & { _id: ObjectId })
    );
    const summary = buildDashboardSummary(serialized);

    return NextResponse.json({
      success: true,
      tasks: serialized,
      summary,
    });
  } catch (error: unknown) {
    console.error('[Admin Tasks GET Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load tasks.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const parsed = taskCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || 'Invalid task data.',
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const amounts = computePaymentFields(data.totalAmount, data.amountCollected);
    const now = new Date();

    const doc: TaskDocument = {
      title: data.title,
      clientName: data.clientName,
      clientEmail: data.clientEmail || null,
      serviceType: data.serviceType,
      assignedTo: data.assignedTo,
      status: data.status,
      priority: data.priority,
      totalAmount: amounts.totalAmount,
      amountCollected: amounts.amountCollected,
      dueDate: data.dueDate,
      notes: data.notes || null,
      sourceInquiryId: data.sourceInquiryId || null,
      createdAt: now,
      updatedAt: now,
    };

    const inserted = await withDatabase(async (db) => {
      const tasks = db.collection<TaskDocument>('tasks');
      const res = await tasks.insertOne(doc);
      return serializeTask({ ...doc, _id: res.insertedId });
    });

    return NextResponse.json({ success: true, task: inserted }, { status: 201 });
  } catch (error: unknown) {
    console.error('[Admin Tasks POST Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create task.' },
      { status: 500 }
    );
  }
}
