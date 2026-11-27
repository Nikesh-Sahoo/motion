import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { requireAdmin, type UserDocument } from '@/lib/auth/session';
import { withDatabase } from '@/lib/mongodb';
import {
  resolveTaskProgress,
  serializeTask,
  type TaskDocument,
} from '@/lib/admin/analytics';
import { syncLinkedInquiryStatus } from '@/lib/admin/server';
import { taskUpdateSchema } from '@/lib/validations/admin.schema';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid task ID.' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const parsed = taskUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || 'Invalid update payload.',
        },
        { status: 400 }
      );
    }

    const updates = parsed.data;
    const objectId = new ObjectId(id);

    const outcome = await withDatabase(async (db) => {
      const tasks = db.collection<TaskDocument>('tasks');
      const existing = await tasks.findOne({ _id: objectId });
      if (!existing) return { notFound: true as const };

      const nextTotal =
        typeof updates.totalAmount === 'number'
          ? updates.totalAmount
          : existing.totalAmount;
      const nextCollected =
        typeof updates.amountCollected === 'number'
          ? updates.amountCollected
          : existing.amountCollected;

      if (nextCollected > nextTotal) {
        return {
          invalidAmounts:
            'Amount collected cannot exceed total project amount.' as const,
        };
      }

      let assignedEditorId = existing.assignedEditorId ?? null;
      let assignedEditorEmail = existing.assignedEditorEmail ?? null;
      let assignedTo =
        updates.assignedTo !== undefined
          ? updates.assignedTo || 'Unassigned'
          : existing.assignedTo;

      if (updates.assignedEditorId !== undefined) {
        if (!updates.assignedEditorId) {
          assignedEditorId = null;
          assignedEditorEmail = null;
          if (!updates.assignedTo) assignedTo = 'Unassigned';
        } else {
          if (!ObjectId.isValid(updates.assignedEditorId)) {
            return { invalidEditor: 'Invalid assigned editor ID.' as const };
          }
          const editorDoc = await db
            .collection<UserDocument>('users')
            .findOne({ _id: new ObjectId(updates.assignedEditorId), type: 'editor' });
          if (!editorDoc) {
            return { invalidEditor: 'Selected registered editor not found.' as const };
          }
          assignedEditorId = editorDoc._id!.toHexString();
          assignedEditorEmail = editorDoc.email;
          assignedTo = editorDoc.name;
        }
      }

      const nextStatus = updates.status ?? existing.status;
      const nextProgress = resolveTaskProgress(
        nextStatus,
        updates.progress !== undefined
          ? updates.progress
          : updates.status !== undefined && updates.status !== existing.status
          ? undefined
          : existing.progress
      );

      const patchFields: Partial<TaskDocument> = {
        ...updates,
        assignedTo,
        assignedEditorId,
        assignedEditorEmail,
        status: nextStatus,
        progress: nextProgress,
        clientEmail:
          updates.clientEmail !== undefined
            ? updates.clientEmail || null
            : existing.clientEmail,
        notes:
          updates.notes !== undefined ? updates.notes || null : existing.notes,
        deliverableUrl:
          updates.deliverableUrl !== undefined
            ? updates.deliverableUrl || null
            : existing.deliverableUrl,
        editorNotes:
          updates.editorNotes !== undefined
            ? updates.editorNotes || null
            : existing.editorNotes,
        totalAmount: nextTotal,
        amountCollected: nextCollected,
        updatedAt: new Date(),
      };

      await tasks.updateOne({ _id: objectId }, { $set: patchFields });
      await syncLinkedInquiryStatus(db, existing.sourceInquiryId, nextStatus, id);

      const refreshed = await tasks.findOne({ _id: objectId });
      return {
        task: serializeTask(refreshed as TaskDocument & { _id: ObjectId }),
      };
    });

    if ('notFound' in outcome) {
      return NextResponse.json(
        { success: false, error: 'Task not found.' },
        { status: 404 }
      );
    }

    if ('invalidAmounts' in outcome) {
      return NextResponse.json(
        { success: false, error: outcome.invalidAmounts },
        { status: 400 }
      );
    }

    if ('invalidEditor' in outcome) {
      return NextResponse.json(
        { success: false, error: outcome.invalidEditor },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, task: outcome.task });
  } catch (error: unknown) {
    console.error('[Admin Task PATCH Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update task.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid task ID.' },
      { status: 400 }
    );
  }

  try {
    const deleted = await withDatabase(async (db) => {
      const tasks = db.collection<TaskDocument>('tasks');
      const existing = await tasks.findOne({ _id: new ObjectId(id) });
      if (!existing) return 0;

      const res = await tasks.deleteOne({ _id: new ObjectId(id) });
      if (res.deletedCount > 0 && existing.sourceInquiryId && ObjectId.isValid(existing.sourceInquiryId)) {
        await db.collection('inquiries').updateOne(
          { _id: new ObjectId(existing.sourceInquiryId) },
          { $set: { status: 'new', linkedTaskId: null, updatedAt: new Date() } }
        );
      }
      return res.deletedCount;
    });

    if (deleted === 0) {
      return NextResponse.json(
        { success: false, error: 'Task not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('[Admin Task DELETE Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete task.' },
      { status: 500 }
    );
  }
}
