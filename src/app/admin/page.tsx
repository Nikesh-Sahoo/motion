'use client';

import React, { useEffect, useState } from 'react';
import type { AdminUserPublic } from '@/types/admin';
import { AdminLoginView } from '@/components/admin/AdminLoginView';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function AdminPortalPage() {
  const [checking, setChecking] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminUserPublic | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/auth/me', { cache: 'no-store' })
      .then(async (res) => {
        if (!active) return;
        if (!res.ok) {
          setAdminUser(null);
          return;
        }
        const json = (await res.json()) as {
          authenticated?: boolean;
          user?: AdminUserPublic;
        };
        if (json.authenticated && json.user && json.user.type === 'admin') {
          setAdminUser(json.user);
        } else {
          setAdminUser(null);
        }
      })
      .catch(() => {
        if (active) setAdminUser(null);
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
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#19C3B8] border-t-transparent animate-spin mx-auto" />
          <div className="font-mono text-xs text-[#97959F] uppercase tracking-widest">
            Verifying Admin JWT Session...
          </div>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return <AdminLoginView onAuthenticated={(user) => setAdminUser(user)} />;
  }

  return (
    <AdminDashboard
      adminUser={adminUser}
      onLoggedOut={() => setAdminUser(null)}
    />
  );
}
