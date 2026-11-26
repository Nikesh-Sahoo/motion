import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  return NextResponse.json({
    authenticated: true,
    user: auth.user,
  });
}
