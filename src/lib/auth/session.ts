import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { isMongoConfigured, withDatabase } from '@/lib/mongodb';
import { isJwtConfigured, verifyAdminJwt, type AdminJwtPayload } from '@/lib/auth/jwt';
import type { AdminUserPublic, UserType } from '@/types/admin';

export const ADMIN_COOKIE_NAME = 'motionxyne_admin_token';
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

export interface UserDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  type: UserType;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date | null;
}

export function sanitizeUser(doc: UserDocument & { _id: ObjectId }): AdminUserPublic {
  return {
    id: doc._id.toHexString(),
    name: doc.name,
    email: doc.email,
    type: doc.type,
    isActive: doc.isActive !== false,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
    lastLoginAt: doc.lastLoginAt
      ? doc.lastLoginAt instanceof Date
        ? doc.lastLoginAt.toISOString()
        : String(doc.lastLoginAt)
      : null,
  };
}

export function extractTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    const bearer = authHeader.slice(7).trim();
    if (bearer) return bearer;
  }
  return request.cookies.get(ADMIN_COOKIE_NAME)?.value || null;
}

export function setAdminSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE,
  });
}

export function clearAdminSessionCookie(response: NextResponse): void {
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export type AdminAuthResult =
  | { ok: true; user: AdminUserPublic; payload: AdminJwtPayload }
  | { ok: false; response: NextResponse };

/**
 * Verifies the incoming request has a valid JWT AND belongs to an active user with type === 'admin'.
 */
export async function requireAdmin(request: NextRequest): Promise<AdminAuthResult> {
  if (!isMongoConfigured()) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: 'MONGODB_URI is not configured.' },
        { status: 500 }
      ),
    };
  }

  if (!isJwtConfigured()) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: 'JWT_SECRET is not configured.' },
        { status: 500 }
      ),
    };
  }

  const token = extractTokenFromRequest(request);
  if (!token) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: 'Authentication required. Please log in.' },
        { status: 401 }
      ),
    };
  }

  const payload = await verifyAdminJwt(token);
  if (!payload) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: 'Invalid or expired JWT session.' },
        { status: 401 }
      ),
    };
  }

  if (payload.type !== 'admin') {
    return {
      ok: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Access denied: only users with type 'admin' are allowed.",
        },
        { status: 403 }
      ),
    };
  }

  if (!ObjectId.isValid(payload.sub)) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: 'Invalid user identifier in token.' },
        { status: 401 }
      ),
    };
  }

  const userDoc = await withDatabase((db) =>
    db.collection<UserDocument>('users').findOne({ _id: new ObjectId(payload.sub) })
  );

  if (!userDoc || !userDoc._id) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: 'Account no longer exists.' },
        { status: 401 }
      ),
    };
  }

  if (userDoc.type !== 'admin' || userDoc.isActive === false) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Access denied: only active users with type 'admin' are allowed.",
        },
        { status: 403 }
      ),
    };
  }

  return {
    ok: true,
    user: sanitizeUser(userDoc as UserDocument & { _id: ObjectId }),
    payload,
  };
}
