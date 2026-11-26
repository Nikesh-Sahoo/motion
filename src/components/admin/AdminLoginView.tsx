'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Lock, AlertCircle, UserPlus, ArrowLeft } from 'lucide-react';
import type { AdminUserPublic } from '@/types/admin';
import { Input } from '@/components/ui/Input';

interface AdminLoginViewProps {
  onAuthenticated: (user: AdminUserPublic) => void;
}

interface SetupState {
  loading: boolean;
  mongoConfigured: boolean;
  jwtConfigured: boolean;
  needsSetup: boolean;
  checkError?: string;
}

export function AdminLoginView({ onAuthenticated }: AdminLoginViewProps) {
  const [setupState, setSetupState] = useState<SetupState>({
    loading: true,
    mongoConfigured: true,
    jwtConfigured: true,
    needsSetup: false,
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/auth/setup')
      .then((res) =>
        res.json() as Promise<{
          mongoConfigured?: boolean;
          jwtConfigured?: boolean;
          needsSetup?: boolean;
          error?: string;
        }>
      )
      .then((data) => {
        if (!active) return;
        setSetupState({
          loading: false,
          mongoConfigured: Boolean(data.mongoConfigured),
          jwtConfigured: Boolean(data.jwtConfigured),
          needsSetup: Boolean(data.needsSetup),
          checkError: data.error,
        });
      })
      .catch(() => {
        if (!active) return;
        setSetupState({
          loading: false,
          mongoConfigured: true,
          jwtConfigured: true,
          needsSetup: false,
          checkError: 'Failed to inspect admin portal setup status.',
        });
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const endpoint = setupState.needsSetup
        ? '/api/admin/auth/setup'
        : '/api/admin/auth/login';
      const payload = setupState.needsSetup
        ? { name, email, password }
        : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as {
        success?: boolean;
        user?: AdminUserPublic;
        error?: string;
      };

      if (!res.ok || !data.success || !data.user) {
        setError(data.error || 'Authentication failed.');
        return;
      }

      onAuthenticated(data.user);
    } catch {
      setError('Network error while authenticating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D] bg-grid-pattern flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[360px] bg-gradient-to-tr from-[#19C3B8]/15 via-[#FF9933]/12 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md relative z-10 space-y-5">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-[#97959F] hover:text-[#F3EFE7] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Website</span>
          </Link>
          <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-[#19C3B8]/15 text-[#19C3B8] border border-[#19C3B8]/30 uppercase tracking-wider">
            JWT • TYPE: ADMIN ONLY
          </span>
        </div>

        <div className="rounded-3xl bg-[#14141B]/95 backdrop-blur-2xl border border-white/[0.12] p-7 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] space-y-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#19C3B8]/50 shadow-[0_0_20px_rgba(25,195,184,0.35)] bg-[#0B0B0D] flex-shrink-0">
              <Image
                src="/motion-logo.jpg"
                alt="Motionxyne"
                width={44}
                height={44}
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#FF9933]">
                MOTIONXYNE EXECUTIVE PORTAL
              </div>
              <h1 className="font-display text-3xl text-[#F3EFE7] uppercase leading-none mt-1">
                {setupState.needsSetup ? 'Initialize Admin' : 'Admin JWT Sign In'}
              </h1>
            </div>
          </div>

          {!setupState.loading && (!setupState.mongoConfigured || !setupState.jwtConfigured) && (
            <div className="p-3.5 rounded-xl bg-amber-950/50 border border-amber-500/40 text-xs text-amber-200 space-y-1">
              <div className="font-semibold">Configuration Required</div>
              {!setupState.mongoConfigured && (
                <p>MONGODB_URI is not configured in environment variables/secrets.</p>
              )}
              {!setupState.jwtConfigured && (
                <p>JWT_SECRET (min 16 characters) is not configured in environment variables/secrets.</p>
              )}
            </div>
          )}

          {setupState.checkError && (
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/50 text-xs text-red-200">
              {setupState.checkError}
            </div>
          )}

          {setupState.needsSetup && (
            <div className="p-3.5 rounded-xl bg-[#19C3B8]/10 border border-[#19C3B8]/30 text-xs text-[#DDD8CE] leading-relaxed">
              No <code className="text-[#19C3B8]">type: &quot;admin&quot;</code> user exists in MongoDB yet. Create your primary administrator account below to issue your first JWT session.
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 flex items-start gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {setupState.needsSetup && (
              <Input
                label="Admin Name"
                required
                placeholder="e.g. Sayan"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <Input
              label="Admin Email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@motionxyne.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              required
              autoComplete={setupState.needsSetup ? 'new-password' : 'current-password'}
              placeholder={setupState.needsSetup ? 'Minimum 8 characters' : 'Enter your password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={submitting || setupState.loading}
              className="w-full py-3.5 px-6 rounded-full bg-[#FF9933] text-[#0B0B0D] font-bold text-sm hover:shadow-[0_0_25px_rgba(255,153,51,0.55)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {setupState.needsSetup ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>{submitting ? 'Creating Admin...' : 'Create Admin Account & Sign In'}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{submitting ? 'Verifying JWT...' : 'Sign In as Admin'}</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-white/[0.08] flex items-center gap-2 text-[11px] font-mono text-[#97959F]">
            <ShieldCheck className="w-4 h-4 text-[#19C3B8] flex-shrink-0" />
            <span>
              Protected by HS256 JWT + MongoDB <code className="text-[#F3EFE7]">type: &quot;admin&quot;</code> role verification.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
