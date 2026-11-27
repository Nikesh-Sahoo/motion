import { ObjectId, type Db } from 'mongodb';
import type { TaskStatus } from '@/types/admin';

/**
 * Keeps a linked inquiry's status synchronized with its corresponding task status.
 */
export async function syncLinkedInquiryStatus(
  db: Db,
  sourceInquiryId: string | null | undefined,
  taskStatus: TaskStatus,
  taskId?: string
): Promise<void> {
  if (!sourceInquiryId || !ObjectId.isValid(sourceInquiryId)) return;

  const inquiryStatusMap: Record<TaskStatus, string> = {
    pending: 'assigned',
    in_progress: 'in_progress',
    review: 'in_review',
    completed: 'completed',
    cancelled: 'cancelled',
  };

  const updateFields: Record<string, unknown> = {
    status: inquiryStatusMap[taskStatus] || 'assigned',
    updatedAt: new Date(),
  };
  if (taskId) {
    updateFields.linkedTaskId = taskId;
  }

  await db
    .collection('inquiries')
    .updateOne({ _id: new ObjectId(sourceInquiryId) }, { $set: updateFields });
}
