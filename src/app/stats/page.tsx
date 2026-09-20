import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { getUserStats, getUserAchievements } from '@/services/user-service';
import {
  BarChart3,
  Flame,
  Zap,
  Target,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  BrainCircuit,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CefrLevel } from '@/types';

export const metadata: Metadata = {
  title: 'Learning Statistics & Retention | WordFlow',
  description: 'View your comprehensive vocabulary retention metrics, CEFR mastery distribution, study streak, and achievements on WordFlow.',
};

export default async function StatsPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect('/login?from=/stats');
  }

  const [stats, achievements] = await Promise.all([
    getUserStats(session.userId),
    getUserAchievements(session.userId),
  ]);

  const cefrLevels: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const maxCefrCount = Math.max(...Object.values(stats.cefrDistribution), 1);
  const unlockedCount = achievements.filter((a) => a.unlockedAt !== null).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 bg-[var(--bg-app)]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <BarChart3 size={14} />
            <span>Empirical Learning Telemetry</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Learning Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
            Detailed breakdown of your lexical acquisition, SuperMemo SM-2 memory half-lives, CEFR distribution, and consistency.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/review">
            <Button variant="primary" size="md">
              <BrainCircuit size={14} />
              <span>Start SRS Review</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 space-y-2 border-slate-200/90 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Total Words</span>
            <BookOpen size={16} className="text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {stats.totalWordsLearned}
          </div>
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {stats.wordsMastered} mastered
            </span>{' '}
            • {stats.wordsLearning} in cycle
          </p>
        </Card>

        <Card className="p-5 space-y-2 border-slate-200/90 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Recall Accuracy</span>
            <Target size={16} className="text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {stats.accuracyRate}%
          </div>
          <p className="text-xs text-slate-500">
            Based on active SM-2 recall ratings
          </p>
        </Card>

        <Card className="p-5 space-y-2 border-slate-200/90 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Current Streak</span>
            <Flame size={16} className="text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {stats.currentStreak} <span className="text-sm font-normal text-slate-500">days</span>
          </div>
          <p className="text-xs text-slate-500">
            Longest recorded: <strong className="text-slate-800 dark:text-slate-200">{stats.longestStreak} days</strong>
          </p>
        </Card>

        <Card className="p-5 space-y-2 border-slate-200/90 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Study Investment</span>
            <Clock size={16} className="text-slate-500" />
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {stats.studyTimeMinutes} <span className="text-sm font-normal text-slate-500">min</span>
          </div>
          <p className="text-xs text-slate-500">
            {stats.totalXp} XP accumulated
          </p>
        </Card>
      </div>

      {/* Two Columns: CEFR Distribution & SM-2 Stage Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CEFR Level Breakdown */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            CEFR Level Distribution
          </h3>

          <Card className="p-6 border-slate-200/90 dark:border-slate-800 space-y-4">
            <div className="space-y-3">
              {cefrLevels.map((lvl) => {
                const count = stats.cefrDistribution[lvl] || 0;
                const percent = Math.round((count / maxCefrCount) * 100);

                return (
                  <div key={lvl} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <div className="flex items-center gap-2">
                        <Badge variant="cefr" level={lvl} />
                        <span className="text-slate-700 dark:text-slate-300">Level {lvl}</span>
                      </div>
                      <span className="font-mono text-slate-500">{count} words</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className="h-full bg-blue-600 rounded-full transition-all"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* SM-2 Memory Stages */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            SuperMemo SM-2 Memory Stages
          </h3>

          <Card className="p-6 border-slate-200/90 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stage 1 • Learning</span>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.wordsLearning}</div>
                <p className="text-[11px] text-slate-500">Interval &lt; 7 days</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stage 2 • Reviewing</span>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {Math.max(0, stats.totalWordsLearned - stats.wordsLearning - stats.wordsMastered)}
                </div>
                <p className="text-[11px] text-slate-500">Interval 7-30 days</p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900 space-y-1">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Stage 3 • Mastered</span>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.wordsMastered}</div>
                <p className="text-[11px] text-blue-600/80 dark:text-blue-400/80">Interval &gt; 30 days (Permanent)</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-900 space-y-1">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Due Today</span>
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{stats.wordsDueReview}</div>
                <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80">Awaiting recall</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed pt-1">
              Words transition between stages automatically as you submit ratings: Again (resets interval), Hard (+1d), Good (multiplies by Ease Factor), Easy (multiplies with bonus).
            </p>
          </Card>
        </div>
      </div>

      {/* Achievements & Milestones */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Milestones & Achievements ({unlockedCount} / {achievements.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach) => {
            const isUnlocked = ach.unlockedAt !== null;
            return (
              <Card
                key={ach.id}
                className={`p-4 space-y-2 border-slate-200/90 dark:border-slate-800 ${
                  isUnlocked ? 'bg-white dark:bg-slate-900' : 'opacity-60 bg-slate-50/50 dark:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">
                    +{ach.xpReward} XP
                  </span>
                  {isUnlocked && (
                    <CheckCircle2 size={15} className="text-emerald-600" />
                  )}
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  {ach.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {ach.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
