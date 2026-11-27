import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { requireAdmin, type UserDocument } from '@/lib/auth/session';
import { withDatabase } from '@/lib/mongodb';
import {
  buildDashboardSummary,
  computePaymentFields,
  resolveTaskProgress,
  serializeTask,
  type TaskDocument,
} from '@/lib/admin/analytics';
import { syncLinkedInquiryStatus } from '@/lib/admin/server';
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

    const created = await withDatabase(async (db) => {
      let assignedEditorId: string | null = null;
      let assignedEditorEmail: string | null = null;
      let assignedTo = data.assignedTo?.trim() || 'Unassigned';

      if (data.assignedEditorId) {
        if (!ObjectId.isValid(data.assignedEditorId)) {
          return { invalidEditor: 'Invalid assigned editor ID.' as const };
        }
        const editorDoc = await db
          .collection<UserDocument>('users')
          .findOne({ _id: new ObjectId(data.assignedEditorId), type: 'editor' });
        if (!editorDoc) {
          return { invalidEditor: 'Selected registered editor was not found.' as const };
        }
        if (editorDoc.isActive === false) {
          return { invalidEditor: 'Selected editor account is inactive.' as const };
        }
        assignedEditorId = editorDoc._id!.toHexString();
        assignedEditorEmail = editorDoc.email;
        assignedTo = editorDoc.name;
      }

      const doc: TaskDocument = {
        title: data.title,
        clientName: data.clientName,
        clientEmail: data.clientEmail || null,
        serviceType: data.serviceType,
        assignedTo,
        assignedEditorId,
        assignedEditorEmail,
        status: data.status,
        priority: data.priority,
        progress: resolveTaskProgress(data.status, data.progress),
        totalAmount: amounts.totalAmount,
        amountCollected: amounts.amountCollected,
        dueDate: data.dueDate,
        notes: data.notes || null,
        deliverableUrl: data.deliverableUrl || null,
        editorNotes: data.editorNotes || null,
        sourceInquiryId: data.sourceInquiryId || null,
        createdAt: now,
        updatedAt: now,
      };

      const tasks = db.collection<TaskDocument>('tasks');
      const res = await tasks.insertOne(doc);
      const taskId = res.insertedId.toHexString();

      await syncLinkedInquiryStatus(db, data.sourceInquiryId, data.status, taskId);

      return { task: serializeTask({ ...doc, _id: res.insertedId }) };
    });

    if ('invalidEditor' in created) {
      return NextResponse.json(
        { success: false, error: created.invalidEditor },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, task: created.task }, { status: 201 });
  } catch (error: unknown) {
    console.error('[Admin Tasks POST Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create task.' },
      { status: 500 }
    );
  }
}
