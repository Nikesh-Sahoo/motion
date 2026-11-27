import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import {
  requireAdmin,
  sanitizeUser,
  type UserDocument,
} from '@/lib/auth/session';
import { hashPassword } from '@/lib/auth/password';
import { withDatabase } from '@/lib/mongodb';
import { approveEditorApplicationSchema } from '@/lib/validations/admin.schema';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/applications/approve
 * Registers an approved editor application as a type:"editor" user account for /editor portal access.
 */
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const parsed = approveEditorApplicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || 'Invalid approval payload.',
        },
        { status: 400 }
      );
    }

    const { applicationId, password } = parsed.data;
    if (!ObjectId.isValid(applicationId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid application ID.' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const now = new Date();

    const result = await withDatabase(async (db) => {
      const appObjId = new ObjectId(applicationId);
      const apps = db.collection('editor_applications');
      const users = db.collection<UserDocument>('users');

      const appDoc = await apps.findOne({ _id: appObjId });
      if (!appDoc) return { notFound: true as const };

      const email = String(appDoc.email || '').trim().toLowerCase();
      const name = String(appDoc.fullName || 'Editor').trim();

      const existingUser = await users.findOne({ email });
      let registeredUser: UserDocument & { _id: ObjectId };

      if (existingUser && existingUser._id) {
        if (existingUser.type !== 'editor') {
          return {
            conflict: `An account with ${email} already exists with type '${existingUser.type}'.` as const,
          };
        }
        registeredUser = existingUser as UserDocument & { _id: ObjectId };
      } else {
        const newUser: UserDocument = {
          name,
          email,
          passwordHash,
          type: 'editor',
          isActive: true,
          createdAt: now,
          updatedAt: now,
          lastLoginAt: null,
        };
        const insert = await users.insertOne(newUser);
        registeredUser = { ...newUser, _id: insert.insertedId };
      }

      const registeredUserId = registeredUser._id.toHexString();
      await apps.updateOne(
        { _id: appObjId },
        {
          $set: {
            status: 'approved',
            registeredUserId,
            updatedAt: now,
          },
        }
      );

      return { user: sanitizeUser(registeredUser) };
    });

    if ('notFound' in result) {
      return NextResponse.json(
        { success: false, error: 'Editor application not found.' },
        { status: 404 }
      );
    }

    if ('conflict' in result) {
      return NextResponse.json(
        { success: false, error: result.conflict },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true, user: result.user }, { status: 201 });
  } catch (error: unknown) {
    console.error('[Approve Editor Application Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to register editor from application.' },
      { status: 500 }
    );
  }
}
