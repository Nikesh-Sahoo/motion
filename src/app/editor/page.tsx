'use client';

import React, { useEffect, useState } from 'react';
import type { AdminUserPublic } from '@/types/admin';
import { EditorLoginView } from '@/components/editor/EditorLoginView';
import { EditorDashboard } from '@/components/editor/EditorDashboard';

export default function EditorPortalPage() {
  const [checking, setChecking] = useState(true);
  const [editorUser, setEditorUser] = useState<AdminUserPublic | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/editor/auth/me', { cache: 'no-store' })
      .then(async (res) => {
        if (!active) return;
        if (!res.ok) {
          setEditorUser(null);
          return;
        }
        const json = (await res.json()) as {
          authenticated?: boolean;
          user?: AdminUserPublic;
        };
        if (json.authenticated && json.user && json.user.type === 'editor') {
          setEditorUser(json.user);
        } else {
          setEditorUser(null);
        }
      })
      .catch(() => {
        if (active) setEditorUser(null);
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#05050A] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#00F0FF] border-t-transparent animate-spin mx-auto" />
          <div className="font-mono text-xs text-[#8A94B8] uppercase tracking-widest">
            Verifying Editor JWT Session...
          </div>
        </div>
      </div>
    );
  }

  if (!editorUser) {
    return <EditorLoginView onAuthenticated={(user) => setEditorUser(user)} />;
  }

  return (
    <EditorDashboard
      editorUser={editorUser}
      onLoggedOut={() => setEditorUser(null)}
    />
  );
}
