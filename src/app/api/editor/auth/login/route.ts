import { NextRequest, NextResponse } from 'next/server';
import { isMongoConfigured, withDatabase } from '@/lib/mongodb';
import { isJwtConfigured, signAdminJwt } from '@/lib/auth/jwt';
import { verifyPassword } from '@/lib/auth/password';
import {
  sanitizeUser,
  setEditorSessionCookie,
  type UserDocument,
} from '@/lib/auth/session';
import { editorLoginSchema } from '@/lib/validations/admin.schema';
import type { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

/**
 * POST /api/editor/auth/login
 * Authenticates registered editors ONLY (user.type === 'editor') and issues an HS256 JWT.
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
    const parsed = editorLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || 'Invalid credentials payload.',
        },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();
    const password = parsed.data.password;

    const userDoc = await withDatabase(async (db) => {
      const users = db.collection<UserDocument>('users');
      const found = await users.findOne({ email });
      if (!found || !found._id) return null;

      const passwordMatches = await verifyPassword(password, found.passwordHash);
      if (!passwordMatches) return null;

      if (found.type === 'editor' && found.isActive !== false) {
        await users.updateOne(
          { _id: found._id },
          { $set: { lastLoginAt: new Date(), updatedAt: new Date() } }
        );
      }

      return found as UserDocument & { _id: ObjectId };
    });

    if (!userDoc) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password, or editor is not registered.' },
        { status: 401 }
      );
    }

    if (userDoc.type !== 'editor') {
      return NextResponse.json(
        {
          success: false,
          error: `Access denied: user type '${userDoc.type}' is not allowed in the Editor Portal. Only registered editors (type: 'editor') can log in.`,
        },
        { status: 403 }
      );
    }

    if (userDoc.isActive === false) {
      return NextResponse.json(
        { success: false, error: 'This editor account has been deactivated.' },
        { status: 403 }
      );
    }

    const publicUser = sanitizeUser(userDoc);
    const token = await signAdminJwt({
      sub: publicUser.id,
      email: publicUser.email,
      name: publicUser.name,
      type: 'editor',
    });

    const response = NextResponse.json({
      success: true,
      user: publicUser,
      token,
    });
    setEditorSessionCookie(response, token);
    return response;
  } catch (error: unknown) {
    console.error('[Editor Login Error]:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed.' },
      { status: 500 }
    );
  }
}
