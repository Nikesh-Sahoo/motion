import { NextRequest, NextResponse } from 'next/server';
import type { ObjectId } from 'mongodb';
import { requireEditor } from '@/lib/auth/session';
import { withDatabase } from '@/lib/mongodb';
import { serializeEditorTask, type TaskDocument } from '@/lib/admin/analytics';

export const dynamic = 'force-dynamic';

/**
 * GET /api/editor/tasks
 * Returns all tasks assigned to the currently authenticated registered editor.
 */
export async function GET(request: NextRequest) {
  const auth = await requireEditor(request);
  if (!auth.ok) return auth.response;

  const editor = auth.user;

  try {
    const docs = await withDatabase((db) =>
      db
        .collection<TaskDocument>('tasks')
        .find({
          $or: [
            { assignedEditorId: editor.id },
            { assignedEditorEmail: editor.email.toLowerCase() },
          ],
        })
        .sort({ createdAt: -1 })
        .toArray()
    );

    const tasks = docs.map((doc) =>
      serializeEditorTask(doc as TaskDocument & { _id: ObjectId })
    );

    const totalAssigned = tasks.length;
    const completedCount = tasks.filter((t) => t.status === 'completed').length;
    const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
    const reviewCount = tasks.filter((t) => t.status === 'review').length;
    const pendingCount = tasks.filter((t) => t.status === 'pending').length;

    return NextResponse.json({
      success: true,
      tasks,
      stats: {
        totalAssigned,
        completedCount,
        inProgressCount,
        reviewCount,
        pendingCount,
      },
    });
  } catch (error: unknown) {
    console.error('[Editor Tasks GET Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load assigned tasks.' },
      { status: 500 }
    );
  }
}
