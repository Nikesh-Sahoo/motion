import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { requireEditor } from '@/lib/auth/session';
import { withDatabase } from '@/lib/mongodb';
import {
  resolveTaskProgress,
  serializeEditorTask,
  type TaskDocument,
} from '@/lib/admin/analytics';
import { syncLinkedInquiryStatus } from '@/lib/admin/server';
import { editorTaskUpdateSchema } from '@/lib/validations/admin.schema';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/editor/tasks/[id]
 * Allows the assigned registered editor to update task status, progress, deliverable URL, and notes,
 * keeping MongoDB tasks & linked inquiries synchronized across both Admin and Editor portals.
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireEditor(request);
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
    const parsed = editorTaskUpdateSchema.safeParse(body);
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
    const editor = auth.user;
    const objectId = new ObjectId(id);

    const outcome = await withDatabase(async (db) => {
      const tasks = db.collection<TaskDocument>('tasks');
      const existing = await tasks.findOne({ _id: objectId });
      if (!existing) return { notFound: true as const };

      const ownsTask =
        existing.assignedEditorId === editor.id ||
        existing.assignedEditorEmail?.toLowerCase() === editor.email.toLowerCase();

      if (!ownsTask) {
        return { forbidden: true as const };
      }

      if (existing.status === 'cancelled') {
        return { cancelled: true as const };
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
        status: nextStatus,
        progress: nextProgress,
        deliverableUrl:
          updates.deliverableUrl !== undefined
            ? updates.deliverableUrl || null
            : existing.deliverableUrl,
        editorNotes:
          updates.editorNotes !== undefined
            ? updates.editorNotes || null
            : existing.editorNotes,
        updatedAt: new Date(),
      };

      await tasks.updateOne({ _id: objectId }, { $set: patchFields });
      await syncLinkedInquiryStatus(db, existing.sourceInquiryId, nextStatus, id);

      const refreshed = await tasks.findOne({ _id: objectId });
      return {
        task: serializeEditorTask(refreshed as TaskDocument & { _id: ObjectId }),
      };
    });

    if ('notFound' in outcome) {
      return NextResponse.json(
        { success: false, error: 'Task not found.' },
        { status: 404 }
      );
    }

    if ('forbidden' in outcome) {
      return NextResponse.json(
        { success: false, error: 'You are not assigned to this task.' },
        { status: 403 }
      );
    }

    if ('cancelled' in outcome) {
      return NextResponse.json(
        { success: false, error: 'Cancelled tasks cannot be edited by an editor.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, task: outcome.task });
  } catch (error: unknown) {
    console.error('[Editor Task PATCH Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update task.' },
      { status: 500 }
    );
  }
}
