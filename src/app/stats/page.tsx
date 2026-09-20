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
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { CefrLevel } from '@/types';

export const metadata: Metadata = {
  title: 'My Learning Statistics & Analytics | WordFlow',
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
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-2">
              <BarChart3 className="w-3.5 h-3.5 text-primary-600" />
              Retention & Progress Analytics
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white">
              Learning Statistics
            </h1>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Deep dive into your vocabulary mastery, memory strength, and study habits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/review"
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2"
            >
              <BrainCircuit className="w-4 h-4" />
              Start SRS Review
            </Link>
          </div>
        </div>

        {/* Primary KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Total Words
              </span>
              <BookOpen className="w-4 h-4 text-primary-600" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
              {stats.totalWordsLearned}
            </div>
            <div className="mt-1 text-xs text-neutral-500 flex items-center gap-1.5">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {stats.wordsMastered} mastered
              </span>
              <span>•</span>
              <span>{stats.wordsLearning} learning</span>
            </div>
          </Card>

          <Card className="p-5 border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Accuracy Rate
              </span>
              <Target className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
              {stats.accuracyRate}%
            </div>
            <div className="mt-1 text-xs text-neutral-500">
              Across all flashcard & quiz reviews
            </div>
          </Card>

          <Card className="p-5 border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Daily Streak
              </span>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
              {stats.currentStreak} <span className="text-sm font-semibold text-neutral-500">days</span>
            </div>
            <div className="mt-1 text-xs text-neutral-500">
              Longest streak: <strong>{stats.longestStreak} days</strong>
            </div>
          </Card>

          <Card className="p-5 border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Total XP & Level
              </span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
              {stats.totalXp.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-neutral-500">
              Current Rank: <strong>Level {stats.level}</strong>
            </div>
          </Card>
        </div>

        {/* Breakdown Section: CEFR Mastery & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CEFR Level Breakdown */}
          <Card className="p-6 border-neutral-200 dark:border-neutral-800 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white text-base">
                  CEFR Vocabulary Distribution
                </h3>
                <p className="text-xs text-neutral-500">
                  Number of active vocabulary words in your personal lexicon by CEFR difficulty
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                A1 - C2
              </Badge>
            </div>

            <div className="space-y-4">
              {cefrLevels.map((lvl) => {
                const count = stats.cefrDistribution[lvl] || 0;
                const percentage = Math.round((count / maxCefrCount) * 100);

                return (
                  <div key={lvl} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="flex items-center gap-2">
                        <span className="w-8 font-bold text-neutral-900 dark:text-white">{lvl}</span>
                        <span className="text-neutral-500">
                          {lvl === 'A1'
                            ? 'Beginner'
                            : lvl === 'A2'
                            ? 'Elementary'
                            : lvl === 'B1'
                            ? 'Intermediate'
                            : lvl === 'B2'
                            ? 'Upper-Intermediate'
                            : lvl === 'C1'
                            ? 'Advanced'
                            : 'Proficiency'}
                        </span>
                      </span>
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {count} {count === 1 ? 'word' : 'words'}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Memory Strength & SRS Status */}
          <Card className="p-6 border-neutral-200 dark:border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-neutral-900 dark:text-white text-base">
                  Memory Retention
                </h3>
                <BrainCircuit className="w-4 h-4 text-primary-600" />
              </div>

              <p className="text-xs text-neutral-500 mb-6">
                Calculated by the SuperMemo SM-2 algorithm based on your intervals and recall quality.
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30">
                  <div className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
                    Mastered Words (Interval &gt; 21d)
                  </div>
                  <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                    {stats.wordsMastered}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/30">
                  <div className="text-xs font-medium text-primary-800 dark:text-primary-300">
                    Actively Learning Words
                  </div>
                  <div className="text-2xl font-black text-primary-700 dark:text-primary-400 mt-1">
                    {stats.wordsLearning}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/30">
                  <div className="text-xs font-medium text-amber-800 dark:text-amber-300">
                    Due for Spaced Review Today
                  </div>
                  <div className="text-2xl font-black text-amber-700 dark:text-amber-400 mt-1">
                    {stats.wordsDueReview}
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/review"
              className="mt-6 w-full text-center py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Review Due Words
            </Link>
          </Card>
        </div>

        {/* 7-Day Activity Table */}
        <Card className="p-6 border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-white text-base">
                Recent Daily Activity
              </h3>
              <p className="text-xs text-neutral-500">
                Log of your study sessions and reviews over the past 7 days
              </p>
            </div>
            <Clock className="w-4 h-4 text-neutral-400" />
          </div>

          {stats.weeklyActivity.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-xs">
              No activity logged yet. Start a learning session or review to see your daily breakdown!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {stats.weeklyActivity.map((day, i) => {
                const dateStr = new Date(day.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 text-center space-y-1"
                  >
                    <div className="text-[11px] font-semibold text-neutral-500 truncate">
                      {dateStr}
                    </div>
                    <div className="text-base font-bold text-neutral-900 dark:text-white">
                      +{day.xpEarned} <span className="text-[10px] text-amber-500">XP</span>
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      {day.wordsReviewed} rev / {day.wordsStudied} new
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Achievements Section */}
        <Card className="p-6 border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-neutral-900 dark:text-white text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Achievements ({unlockedCount} / {achievements.length} Unlocked)
              </h3>
              <p className="text-xs text-neutral-500">
                Milestones awarded for consistency, mastery, and dedication
              </p>
            </div>
            <Badge variant="primary" className="text-xs font-semibold">
              {Math.round((unlockedCount / Math.max(achievements.length, 1)) * 100)}% Completed
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((ach) => {
              const isUnlocked = ach.unlockedAt !== null;

              return (
                <div
                  key={ach.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isUnlocked
                      ? 'bg-amber-50/40 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/40 shadow-xs'
                      : 'bg-neutral-50 dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                        isUnlocked
                          ? 'bg-amber-100 dark:bg-amber-900/40'
                          : 'bg-neutral-200 dark:bg-neutral-800 grayscale'
                      }`}
                    >
                      {ach.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <div className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                          {ach.title}
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 px-1.5 text-amber-600 dark:text-amber-400 shrink-0 font-semibold"
                        >
                          +{ach.xpReward} XP
                        </Badge>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                        {ach.description}
                      </p>
                      <div className="mt-2 text-[10px] text-neutral-500 flex items-center gap-1">
                        {isUnlocked ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>
                              Unlocked{' '}
                              {new Date(ach.unlockedAt!).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </>
                        ) : (
                          <span>Locked</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
