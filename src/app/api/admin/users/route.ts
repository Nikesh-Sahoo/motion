import { NextRequest, NextResponse } from 'next/server';
import type { ObjectId } from 'mongodb';
import {
  requireAdmin,
  sanitizeUser,
  type UserDocument,
} from '@/lib/auth/session';
import { hashPassword } from '@/lib/auth/password';
import { withDatabase } from '@/lib/mongodb';
import { userCreateSchema } from '@/lib/validations/admin.schema';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/users
 * Allows an authenticated admin to create a new user account with an explicit user type.
 */
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const parsed = userCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || 'Invalid user data.',
        },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const passwordHash = await hashPassword(parsed.data.password);
    const now = new Date();

    const created = await withDatabase(async (db) => {
      const users = db.collection<UserDocument>('users');
      const existing = await users.findOne({ email });
      if (existing) {
        return { conflict: 'A user with this email already exists.' as const };
      }

      const doc: UserDocument = {
        name: parsed.data.name,
        email,
        passwordHash,
        type: parsed.data.type,
        isActive: true,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: null,
      };

      const res = await users.insertOne(doc);
      return {
        user: sanitizeUser({ ...doc, _id: res.insertedId } as UserDocument & {
          _id: ObjectId;
        }),
      };
    });

    if ('conflict' in created) {
      return NextResponse.json(
        { success: false, error: created.conflict },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: true, user: created.user },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('[Admin Users POST Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user.' },
      { status: 500 }
    );
  }
}
