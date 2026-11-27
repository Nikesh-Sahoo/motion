import { NextResponse } from 'next/server';
import { clearEditorSessionCookie } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearEditorSessionCookie(response);
  return response;
}
