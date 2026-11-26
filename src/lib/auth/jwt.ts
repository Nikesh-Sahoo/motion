import type { UserType } from '@/types/admin';

export interface AdminJwtPayload {
  sub: string;
  email: string;
  name: string;
  type: UserType;
  iat: number;
  exp: number;
}

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export function isJwtConfigured(): boolean {
  const secret = process.env.JWT_SECRET;
  return Boolean(secret && secret.trim().length >= 16);
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length < 16) {
    throw new Error(
      'JWT_SECRET is not configured. Set a strong JWT_SECRET (at least 16 chars) in .env.local or Cloudflare Worker secrets.'
    );
  }
  return secret.trim();
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(input: string): Uint8Array {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function importHmacKey(secret: string, usage: KeyUsage[]): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    usage
  );
}

/**
 * Signs an HS256 JWT using Web Crypto (works in Node.js and Cloudflare Workers).
 */
export async function signAdminJwt(
  claims: Omit<AdminJwtPayload, 'iat' | 'exp'>,
  expiresInSeconds = 60 * 60 * 24
): Promise<string> {
  const secret = getJwtSecret();
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminJwtPayload = {
    ...claims,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const headerSegment = toBase64Url(
    textEncoder.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  );
  const payloadSegment = toBase64Url(
    textEncoder.encode(JSON.stringify(payload))
  );
  const signingInput = `${headerSegment}.${payloadSegment}`;

  const key = await importHmacKey(secret, ['sign']);
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    textEncoder.encode(signingInput)
  );
  const signatureSegment = toBase64Url(new Uint8Array(signatureBuffer));

  return `${signingInput}.${signatureSegment}`;
}

/**
 * Verifies an HS256 JWT signature, expiration, and strict admin claim.
 */
export async function verifyAdminJwt(token: string): Promise<AdminJwtPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerSegment, payloadSegment, signatureSegment] = parts;
    const header = JSON.parse(
      textDecoder.decode(fromBase64Url(headerSegment))
    ) as { alg?: string; typ?: string };
    if (header.alg !== 'HS256') return null;

    const secret = getJwtSecret();
    const key = await importHmacKey(secret, ['verify']);
    const signatureBytes = fromBase64Url(signatureSegment);
    const signingBytes = textEncoder.encode(`${headerSegment}.${payloadSegment}`);

    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as BufferSource,
      signingBytes as BufferSource
    );
    if (!valid) return null;

    const payload = JSON.parse(
      textDecoder.decode(fromBase64Url(payloadSegment))
    ) as AdminJwtPayload;

    const now = Math.floor(Date.now() / 1000);
    if (!payload.sub || !payload.email || typeof payload.exp !== 'number') {
      return null;
    }
    if (now >= payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}
