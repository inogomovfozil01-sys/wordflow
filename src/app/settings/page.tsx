import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import prisma from '@/lib/db';
import { SettingsForm } from '@/components/settings-form';
import { Settings, ShieldCheck, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Preferences & Learning Settings | WordFlow',
  description: 'Manage your WordFlow profile, target CEFR level, daily goals, translation preferences, and audio options.',
};

export default async function SettingsPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect('/login?from=/settings');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      profile: true,
      settings: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 bg-[var(--bg-app)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>Preferences</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Account & Learning Settings
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Configure your target CEFR level, daily vocabulary targets, audio pronunciation, and profile privacy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-semibold">
            Role: {user.role}
          </Badge>
          {user.role === 'ADMIN' && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900">
              Admin Access
            </span>
          )}
        </div>
      </div>

      {/* Settings Form Client Component */}
      <SettingsForm
        user={{
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
        }}
        profile={user.profile}
        settings={user.settings}
      />
    </div>
  );
}
