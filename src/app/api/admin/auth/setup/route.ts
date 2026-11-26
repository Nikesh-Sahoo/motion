import { NextRequest, NextResponse } from 'next/server';
import { isMongoConfigured, withDatabase } from '@/lib/mongodb';
import { isJwtConfigured, signAdminJwt } from '@/lib/auth/jwt';
import { hashPassword } from '@/lib/auth/password';
import {
  sanitizeUser,
  setAdminSessionCookie,
  type UserDocument,
} from '@/lib/auth/session';
import { adminSetupSchema } from '@/lib/validations/admin.schema';
import type { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/auth/setup
 * Reports whether an initial type:"admin" user still needs to be created.
 */
export async function GET() {
  const mongoConfigured = isMongoConfigured();
  const jwtConfigured = isJwtConfigured();

  if (!mongoConfigured) {
    return NextResponse.json({
      mongoConfigured: false,
      jwtConfigured,
      needsSetup: false,
    });
  }

  try {
    const adminCount = await withDatabase((db) =>
      db.collection<UserDocument>('users').countDocuments({ type: 'admin' })
    );

    return NextResponse.json({
      mongoConfigured: true,
      jwtConfigured,
      needsSetup: adminCount === 0,
    });
  } catch (error: unknown) {
    console.error('[Admin Setup Check Error]:', error);
    return NextResponse.json(
      {
        mongoConfigured: true,
        jwtConfigured,
        needsSetup: false,
        error: 'Unable to check admin setup state in MongoDB.',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/auth/setup
 * Creates the very first user with type:"admin" when zero admins exist.
 */
export async function POST(request: NextRequest) {
  if (!isMongoConfigured()) {
    return NextResponse.json(
      { success: false, error: 'MONGODB_URI is not configured.' },
      { status: 500 }
    );
  }

  if (!isJwtConfigured()) {
    return NextResponse.json(
      { success: false, error: 'JWT_SECRET is not configured.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const parsed = adminSetupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || 'Validation failed.',
        },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const passwordHash = await hashPassword(parsed.data.password);
    const now = new Date();

    const result = await withDatabase(async (db) => {
      const users = db.collection<UserDocument>('users');
      const existingAdminCount = await users.countDocuments({ type: 'admin' });
      if (existingAdminCount > 0) {
        return { conflict: 'Admin account already exists. Please sign in.' as const };
      }

      const existingEmail = await users.findOne({ email });
      if (existingEmail) {
        return { conflict: 'An account with this email already exists.' as const };
      }

      const doc: UserDocument = {
        name: parsed.data.name,
        email,
        passwordHash,
        type: 'admin',
        isActive: true,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
      };

      const insert = await users.insertOne(doc);
      return {
        user: { ...doc, _id: insert.insertedId } as UserDocument & { _id: ObjectId },
      };
    });

    if ('conflict' in result) {
      return NextResponse.json(
        { success: false, error: result.conflict },
        { status: 403 }
      );
    }

    const publicUser = sanitizeUser(result.user);
    const token = await signAdminJwt({
      sub: publicUser.id,
      email: publicUser.email,
      name: publicUser.name,
      type: 'admin',
    });

    const response = NextResponse.json(
      { success: true, user: publicUser, token },
      { status: 201 }
    );
    setAdminSessionCookie(response, token);
    return response;
  } catch (error: unknown) {
    console.error('[Admin Setup Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create initial admin account.' },
      { status: 500 }
    );
  }
}
