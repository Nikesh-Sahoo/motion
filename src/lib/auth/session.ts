import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { isMongoConfigured, withDatabase } from '@/lib/mongodb';
import { isJwtConfigured, verifyAdminJwt, type AdminJwtPayload } from '@/lib/auth/jwt';
import type { AdminUserPublic, UserType } from '@/types/admin';

export const ADMIN_COOKIE_NAME = 'motionxyne_admin_token';
export const EDITOR_COOKIE_NAME = 'motionxyne_editor_token';
export const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

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

export function extractTokenFromRequest(
  request: NextRequest,
  cookieName: string
): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    const bearer = authHeader.slice(7).trim();
    if (bearer) return bearer;
  }
  return request.cookies.get(cookieName)?.value || null;
}

export function setSessionCookie(
  response: NextResponse,
  cookieName: string,
  token: string
): void {
  response.cookies.set(cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearSessionCookie(
  response: NextResponse,
  cookieName: string
): void {
  response.cookies.set(cookieName, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export function setAdminSessionCookie(response: NextResponse, token: string): void {
  setSessionCookie(response, ADMIN_COOKIE_NAME, token);
}

export function clearAdminSessionCookie(response: NextResponse): void {
  clearSessionCookie(response, ADMIN_COOKIE_NAME);
}

export function setEditorSessionCookie(response: NextResponse, token: string): void {
  setSessionCookie(response, EDITOR_COOKIE_NAME, token);
}

export function clearEditorSessionCookie(response: NextResponse): void {
  clearSessionCookie(response, EDITOR_COOKIE_NAME);
}

export type RoleAuthResult =
  | { ok: true; user: AdminUserPublic; payload: AdminJwtPayload }
  | { ok: false; response: NextResponse };

/**
 * Verifies the incoming request has a valid HS256 JWT and belongs to an active MongoDB user with the required type.
 */
export async function requireRole(
  request: NextRequest,
  requiredType: UserType,
  cookieName: string
): Promise<RoleAuthResult> {
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

  const token = extractTokenFromRequest(request, cookieName);
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

  if (payload.type !== requiredType) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          success: false,
          error: `Access denied: only users with type '${requiredType}' are allowed.`,
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

  if (userDoc.type !== requiredType || userDoc.isActive === false) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          success: false,
          error: `Access denied: only active registered users with type '${requiredType}' are allowed.`,
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

export async function requireAdmin(request: NextRequest): Promise<RoleAuthResult> {
  return requireRole(request, 'admin', ADMIN_COOKIE_NAME);
}

export async function requireEditor(request: NextRequest): Promise<RoleAuthResult> {
  return requireRole(request, 'editor', EDITOR_COOKIE_NAME);
}
