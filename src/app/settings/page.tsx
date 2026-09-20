import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import prisma from '@/lib/db';
import { SettingsForm } from '@/components/settings-form';
import { Settings, ShieldCheck, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Account & Learning Settings | WordFlow',
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
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold mb-2">
              <Settings className="w-3.5 h-3.5" />
              Account Settings
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white">
              Preferences & Profile
            </h1>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Customize your learning experience, interface preferences, and privacy controls.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-semibold">
              Role: {user.role}
            </Badge>
            {user.role === 'ADMIN' && (
              <Badge variant="primary" className="text-xs">
                Admin Panel Access
              </Badge>
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
    </div>
  );
}
