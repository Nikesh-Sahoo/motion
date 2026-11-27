'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Lock, AlertCircle, ArrowLeft, Clapperboard } from 'lucide-react';
import type { AdminUserPublic } from '@/types/admin';
import { Input } from '@/components/ui/Input';

interface EditorLoginViewProps {
  onAuthenticated: (user: AdminUserPublic) => void;
}

export function EditorLoginView({ onAuthenticated }: EditorLoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/editor/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
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
    <div className="min-h-screen bg-[#05050A] bg-grid-pattern flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[360px] bg-gradient-to-tr from-[#00F0FF]/15 via-[#9D4EDD]/15 to-[#FF007F]/12 blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md relative z-10 space-y-5">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-[#8A94B8] hover:text-[#F4F6FF] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Website</span>
          </Link>
          <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-[#FF007F]/15 text-[#FF4DA6] border border-[#FF007F]/35 uppercase tracking-wider">
            JWT • REGISTERED EDITORS ONLY
          </span>
        </div>

        <div className="rounded-3xl bg-[#0D0E1A]/95 backdrop-blur-2xl border border-[#00F0FF]/25 p-7 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] space-y-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#FF007F]/60 shadow-[0_0_20px_rgba(255,0,127,0.35)] bg-[#05050A] flex-shrink-0">
              <Image
                src="/motion-logo.jpg"
                alt="Motionxyne"
                width={44}
                height={44}
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#00F0FF] flex items-center gap-1.5">
                <Clapperboard className="w-3.5 h-3.5" />
                <span>MOTIONXYNE CREATIVE WORKSPACE</span>
              </div>
              <h1 className="font-display text-3xl text-[#F4F6FF] uppercase leading-none mt-1">
                Editor Portal Sign In
              </h1>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/25 text-xs text-[#D5DCF5] leading-relaxed">
            Only editors registered by Admin (<code className="text-[#00F0FF]">type: &quot;editor&quot;</code>) can access this portal. Need access? Apply on{' '}
            <Link href="/careers" className="text-[#FF4DA6] underline">
              Careers
            </Link>{' '}
            or contact Admin.
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 flex items-start gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Registered Editor Email"
              type="email"
              required
              autoComplete="email"
              placeholder="editor@motionxyne.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Enter your editor password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#FF007F] text-[#05050A] font-bold text-sm hover:shadow-[0_0_25px_rgba(0,240,255,0.55)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{submitting ? 'Verifying Editor JWT...' : 'Sign In as Registered Editor'}</span>
            </button>
          </form>

          <div className="pt-3 border-t border-white/[0.08] flex items-center gap-2 text-[11px] font-mono text-[#8A94B8]">
            <ShieldCheck className="w-4 h-4 text-[#00F0FF] flex-shrink-0" />
            <span>
              Protected by HS256 JWT + MongoDB <code className="text-[#F4F6FF]">type: &quot;editor&quot;</code> check.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
