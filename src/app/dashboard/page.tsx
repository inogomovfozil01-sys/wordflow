import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Flame,
  BrainCircuit,
  BookOpen,
  Trophy,
  ArrowRight,
  Clock,
  CheckCircle2,
  BarChart3,
  Layers,
  Sparkles,
  Play,
  RotateCw,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { getCurrentSession } from '@/lib/auth';
import prisma from '@/lib/db';
import { getUserStats } from '@/services/user-service';
import { getLessonWords } from '@/services/learning-service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { calculateUserLevel } from '@/lib/xp';
import { AudioButton } from '@/components/audio-button';

export default async function DashboardPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect('/login?callbackUrl=/dashboard');
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

  const [stats, recommendedWords, difficultUserWords, officialCollections] = await Promise.all([
    getUserStats(user.id),
    getLessonWords(user.id, 4),
    prisma.userWord.findMany({
      where: { userId: user.id },
      orderBy: [{ lapses: 'desc' }, { easeFactor: 'asc' }],
      take: 5,
      include: {
        word: {
          include: {
            translations: true,
          },
        },
      },
    }),
    prisma.collection.findMany({
      where: { isOfficial: true },
      take: 3,
      include: {
        _count: {
          select: { words: true },
        },
      },
    }),
  ]);

  const levelInfo = calculateUserLevel(stats.totalXp);
  const dailyGoal = user.settings?.dailyTargetWords || 10;
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayActivity = stats.weeklyActivity.find((a) => a.date === todayStr);
  const wordsStudiedToday = todayActivity?.wordsStudied || 0;
  const dailyProgress = Math.min(100, Math.round((wordsStudiedToday / dailyGoal) * 100));

  // Determine greeting based on local hour
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const currentDateFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  // Estimate review time (approx 20 seconds per word)
  const estimatedReviewMins = Math.max(1, Math.ceil((stats.wordsDueReview * 20) / 60));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 bg-[var(--bg-app)]">
      {/* 1. Header Command Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>{currentDateFormatted}</span>
            <span>•</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">Learning Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            {greeting}, {user.name || user.username}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Badge variant="cefr" level={user.settings?.cefrLevel || 'A1'} />
          <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
            Level {levelInfo.level} ({stats.totalXp} XP)
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
            Goal: {user.settings?.learningGoal || 'Everyday English'}
          </span>
        </div>
      </div>

      {/* 2. Urgent Scheduled Review Hero Callout */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900 text-blue-700 dark:text-blue-400 text-xs font-semibold">
            <BrainCircuit size={14} />
            <span>SUPERMEMO SM-2 QUEUE</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {stats.wordsDueReview > 0
              ? `${stats.wordsDueReview} words due for spaced repetition review`
              : 'Your spaced repetition queue is fully clear'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {stats.wordsDueReview > 0
              ? `Reviewing right before the memory decay threshold locks words into long-term recall. Estimated session time: ~${estimatedReviewMins} min.`
              : 'Excellent consistency! All your previously learned vocabulary is safely scheduled for future intervals. You can acquire new words or practice skills.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {stats.wordsDueReview > 0 ? (
            <Link href="/review">
              <Button size="lg" variant="primary" className="font-semibold text-sm shadow-sm">
                <Play size={16} className="fill-current" />
                <span>Start Review ({stats.wordsDueReview})</span>
              </Button>
            </Link>
          ) : (
            <Link href="/learn">
              <Button size="lg" variant="primary" className="font-semibold text-sm">
                <BookOpen size={16} />
                <span>Learn New Words</span>
              </Button>
            </Link>
          )}

          <Link href="/practice">
            <Button size="lg" variant="outline" className="font-medium text-sm">
              <span>Practice Engine</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 3. Core Progress & Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Goal */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Daily Goal</span>
            <span className="font-bold text-slate-900 dark:text-white">{wordsStudiedToday}/{dailyGoal} words</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {dailyProgress}%
          </div>
          <Progress value={dailyProgress} className="h-2" />
          <p className="text-[11px] text-slate-400">
            {wordsStudiedToday >= dailyGoal ? 'Goal completed today' : `${dailyGoal - wordsStudiedToday} more words to reach goal`}
          </p>
        </Card>

        {/* Streak */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Study Streak</span>
            <Flame size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.currentStreak} <span className="text-sm font-normal text-slate-500">days</span>
          </div>
          <p className="text-xs text-slate-500">
            Personal best: <strong className="text-slate-700 dark:text-slate-300">{stats.longestStreak} days</strong>
          </p>
          <p className="text-[11px] text-slate-400">
            Daily consistency beats cramming
          </p>
        </Card>

        {/* Mastered Vocabulary */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Active Lexicon</span>
            <BookOpen size={16} className="text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.totalWordsLearned} <span className="text-sm font-normal text-slate-500">words</span>
          </div>
          <p className="text-xs text-slate-500">
            <strong className="text-slate-700 dark:text-slate-300">{stats.wordsMastered}</strong> reached permanent mastery
          </p>
          <p className="text-[11px] text-slate-400">
            {stats.wordsLearning} currently in active learning cycle
          </p>
        </Card>

        {/* Retention & XP */}
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Accuracy & Level</span>
            <Trophy size={16} className="text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.accuracyRate}% <span className="text-sm font-normal text-slate-500">accuracy</span>
          </div>
          <p className="text-xs text-slate-500">
            Level {levelInfo.level} • {levelInfo.progressPercent}% to next rank
          </p>
          <Progress value={levelInfo.progressPercent} className="h-1.5" />
        </Card>
      </div>

      {/* 4. Primary Workspaces (4 Cards) */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Learning Workspaces
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/review" className="group">
            <Card hoverEffect className="p-5 h-full space-y-3 border-slate-200/90 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <BrainCircuit size={20} />
              </div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Spaced Repetition
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Review words scheduled for today via the mathematical SM-2 algorithm to prevent memory decay.
              </p>
              <div className="pt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <span>Start Review Queue</span>
                <ArrowRight size={13} />
              </div>
            </Card>
          </Link>

          <Link href="/learn" className="group">
            <Card hoverEffect className="p-5 h-full space-y-3 border-slate-200/90 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <BookOpen size={20} />
              </div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Acquire New Vocabulary
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Step-by-step lexical lessons with phonetic audio, spelling drills, and cloze context tests.
              </p>
              <div className="pt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <span>Begin Lesson</span>
                <ArrowRight size={13} />
              </div>
            </Card>
          </Link>

          <Link href="/practice" className="group">
            <Card hoverEffect className="p-5 h-full space-y-3 border-slate-200/90 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Layers size={20} />
              </div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Practice Engine
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                10 training modes: listening dictation, timed speed rounds, sentence filling, and pair matching.
              </p>
              <div className="pt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <span>Select Modality</span>
                <ArrowRight size={13} />
              </div>
            </Card>
          </Link>

          <Link href="/ai-tutor" className="group">
            <Card hoverEffect className="p-5 h-full space-y-3 border-slate-200/90 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Sparkles size={20} />
              </div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                AI Language Tutor
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Personalized Gemini 3.8 Flash tutoring: grammar nuance, collocation checks, and memory mnemonics.
              </p>
              <div className="pt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <span>Ask AI Mentor</span>
                <ArrowRight size={13} />
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* 5. Two-Column Analytics & Challenging Words Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: 7-Day Consistency Activity Chart */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              7-Day Study Consistency
            </h3>
            <Link href="/stats" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
              Detailed Analytics →
            </Link>
          </div>

          <Card className="p-6 border-slate-200/90 dark:border-slate-800 space-y-6">
            <div className="grid grid-cols-7 gap-2 text-center">
              {stats.weeklyActivity.length > 0 ? (
                stats.weeklyActivity.map((day, idx) => {
                  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(day.date));
                  const maxWords = Math.max(10, ...stats.weeklyActivity.map((d) => d.wordsStudied + d.wordsReviewed));
                  const totalWords = day.wordsStudied + day.wordsReviewed;
                  const heightPercent = Math.min(100, Math.max(15, Math.round((totalWords / maxWords) * 100)));

                  return (
                    <div key={idx} className="space-y-2 flex flex-col items-center">
                      <div className="h-28 w-full bg-slate-100 dark:bg-slate-800 rounded-lg flex items-end justify-center p-1 relative group">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded transition-all ${
                            totalWords > 0 ? 'bg-blue-600 dark:bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                        />
                        <div className="absolute -top-8 hidden group-hover:block bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded whitespace-nowrap z-10">
                          {totalWords} words ({day.xpEarned} XP)
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase">{dayName}</span>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-7 py-8 text-center text-xs text-slate-400">
                  Complete your first session today to populate your 7-day consistency chart.
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-blue-600" />
                Studied & Reviewed
              </span>
              <span>Total study time: <strong className="text-slate-700 dark:text-slate-300">{stats.studyTimeMinutes} min</strong></span>
            </div>
          </Card>
        </div>

        {/* Right: Words Requiring Focus (Lowest Ease Factor / Highest Lapses) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Attention Required
            </h3>
            <span className="text-xs text-slate-400">Lowest Ease Factor</span>
          </div>

          <Card className="p-4 border-slate-200/90 dark:border-slate-800 space-y-2">
            {difficultUserWords.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {difficultUserWords.map((uw) => {
                  const ruTr = uw.word.translations.find((t) => t.language === 'ru')?.translation;
                  return (
                    <div key={uw.id} className="py-2.5 flex items-center justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/dictionary/${encodeURIComponent(uw.word.word.toLowerCase())}`}
                            className="font-bold text-xs text-slate-900 dark:text-white hover:text-blue-600 truncate"
                          >
                            {uw.word.word}
                          </Link>
                          <Badge variant="cefr" level={uw.word.cefrLevel} />
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          {ruTr || uw.word.definitionSimple}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900">
                          {uw.lapses} lapse{uw.lapses !== 1 ? 's' : ''}
                        </span>
                        <AudioButton text={uw.word.word} size="sm" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 space-y-1">
                <CheckCircle2 size={24} className="mx-auto text-emerald-600 mb-2" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">No high-lapse words detected</p>
                <p>Your recall stability across all active vocabulary is strong.</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* 6. Curated Collections Preview */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Curated Lexicon Collections
          </h3>
          <Link href="/collections" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
            View All Collections →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {officialCollections.map((col) => (
            <Link key={col.id} href={`/collections/${col.slug}`} className="group">
              <Card hoverEffect className="p-5 space-y-2.5 border-slate-200/90 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900">
                    Official
                  </span>
                  <span className="text-xs font-mono text-slate-400">{col._count.words} words</span>
                </div>
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {col.name}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {col.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
