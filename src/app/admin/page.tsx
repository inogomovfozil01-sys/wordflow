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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 bg-[var(--bg-app)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900 text-xs font-semibold mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            System Administration
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Manage vocabulary repository, review active learner accounts, and inspect platform telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Neon PostgreSQL Active
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 space-y-2 border-slate-200/90 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Registered Users</span>
            <Users size={16} className="text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {totalUsers}
          </div>
          <p className="text-xs text-slate-500">Active platform learners</p>
        </Card>

        <Card className="p-5 space-y-2 border-slate-200/90 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Dictionary Lexicon</span>
            <BookOpen size={16} className="text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {totalWords}
          </div>
          <p className="text-xs text-slate-500">Words with IPA & Translations</p>
        </Card>

        <Card className="p-5 space-y-2 border-slate-200/90 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>SRS Reviews</span>
            <BrainCircuit size={16} className="text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {totalReviews}
          </div>
          <p className="text-xs text-slate-500">SuperMemo algorithm submissions</p>
        </Card>

        <Card className="p-5 space-y-2 border-slate-200/90 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Completed Lessons</span>
            <Activity size={16} className="text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {totalSessions}
          </div>
          <p className="text-xs text-slate-500">Interactive study workflows</p>
        </Card>
      </div>

      {/* Two columns: Recent Users & CEFR Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Recent Registered Users
          </h3>
          <Card className="p-4 border-slate-200/90 dark:border-slate-800">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentUsers.map((u) => (
                <div key={u.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{u.username}</span>
                    <span className="text-slate-400 ml-2">{u.email}</span>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Lexicon CEFR Breakdown
          </h3>
          <Card className="p-5 border-slate-200/90 dark:border-slate-800 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
                <div key={lvl} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center">
                  <span className="text-xs font-bold text-slate-400 block">{lvl}</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{cefrMap[lvl] || 0}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Admin Words Manager Client Component */}
      <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Vocabulary Lexicon Management
        </h3>
        <AdminWordsManager initialWords={words} />
      </div>
    </div>
  );
}
