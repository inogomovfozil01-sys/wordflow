import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import prisma from '@/lib/db';
import { AdminWordsManager } from '@/components/admin-words-manager';
import {
  ShieldAlert,
  Users,
  BookOpen,
  BrainCircuit,
  Activity,
  History,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Admin Control Center | WordFlow',
  description: 'Manage vocabulary dictionary, monitor user retention metrics, view platform activity, and audit logs.',
};

export default async function AdminPage() {
  const session = await getCurrentSession();

  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Load platform analytics and words
  const [
    totalUsers,
    totalWords,
    totalReviews,
    totalSessions,
    cefrGroupCounts,
    recentUsers,
    recentAuditLogs,
    words,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.word.count(),
    prisma.review.count(),
    prisma.learningSession.count(),
    prisma.word.groupBy({
      by: ['cefrLevel'],
      _count: { id: true },
    }),
    prisma.user.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.adminAuditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.word.findMany({
      take: 200,
      orderBy: { createdAt: 'desc' },
      include: {
        translations: true,
        examples: true,
      },
    }),
  ]);

  const cefrMap: Record<string, number> = {};
  cefrGroupCounts.forEach((c) => {
    cefrMap[c.cefrLevel] = c._count.id;
  });

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-xs font-semibold mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              Role: System Administrator
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white">
              Admin Control Center
            </h1>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Manage database vocabulary, monitor live platform activity, and audit modifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              PostgreSQL Connected
            </span>
          </div>
        </div>

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Total Users
              </span>
              <Users className="w-4 h-4 text-primary-600" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
              {totalUsers}
            </div>
            <div className="mt-1 text-xs text-neutral-500">
              Active registered learner accounts
            </div>
          </Card>

          <Card className="p-5 border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Dictionary Words
              </span>
              <BookOpen className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
              {totalWords}
            </div>
            <div className="mt-1 text-xs text-neutral-500">
              A1–C2 bilingual definitions & audio
            </div>
          </Card>

          <Card className="p-5 border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-xs font-semibold uppercase tracking-wider">
                SRS Reviews Completed
              </span>
              <BrainCircuit className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
              {totalReviews}
            </div>
            <div className="mt-1 text-xs text-neutral-500">
              Spaced repetition flashcard ratings
            </div>
          </Card>

          <Card className="p-5 border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Learning Sessions
              </span>
              <Activity className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
              {totalSessions}
            </div>
            <div className="mt-1 text-xs text-neutral-500">
              Multi-exercise quiz completions
            </div>
          </Card>
        </div>

        {/* CEFR Level Breakdown Summary */}
        <Card className="p-6 border-neutral-200 dark:border-neutral-800">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3">
            Dictionary Breakdown by CEFR Level
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
              <div
                key={lvl}
                className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center"
              >
                <div className="text-xs font-bold text-primary-600">{lvl}</div>
                <div className="text-lg font-black text-neutral-900 dark:text-white mt-1">
                  {cefrMap[lvl] || 0}
                </div>
                <div className="text-[10px] text-neutral-500">words</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Audit Log and User Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Registrations */}
          <Card className="p-6 border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-600" />
              Recent Registrations
            </h3>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {recentUsers.map((u) => (
                <div key={u.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white">
                      {u.email}
                    </div>
                    <div className="text-neutral-500">@{u.username}</div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={u.role === 'ADMIN' ? 'primary' : 'outline'}
                      className="text-[10px] py-0 px-1.5"
                    >
                      {u.role}
                    </Badge>
                    <div className="text-[10px] text-neutral-400 mt-1">
                      {new Date(u.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Admin Audit Logs */}
          <Card className="p-6 border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-amber-600" />
              Recent Admin Activity Log
            </h3>
            {recentAuditLogs.length === 0 ? (
              <div className="text-xs text-neutral-500 py-6 text-center">
                No administrative actions logged yet.
              </div>
            ) : (
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {recentAuditLogs.map((log) => (
                  <div key={log.id} className="py-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">
                      {log.details || `${log.action} on ${log.targetType}`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Word Management Section */}
        <div className="pt-4">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Word Management & Dictionary Editor
            </h2>
            <p className="text-xs text-neutral-500">
              Create new vocabulary entries or remove outdated records. Changes take effect across all practice modes immediately.
            </p>
          </div>

          <AdminWordsManager initialWords={words} />
        </div>
      </div>
    </div>
  );
}
