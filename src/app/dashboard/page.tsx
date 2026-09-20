import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Flame,
  Sparkles,
  BrainCircuit,
  BookOpen,
  Trophy,
  Target,
  ArrowRight,
  Clock,
  CheckCircle2,
  BarChart3,
  Layers,
} from 'lucide-react';
import { getCurrentSession } from '@/lib/auth';
import prisma from '@/lib/db';
import { getUserStats } from '@/services/user-service';
import { getLessonWords } from '@/services/learning-service';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { calculateUserLevel } from '@/lib/xp';

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

  const stats = await getUserStats(user.id);
  const recommendedWords = await getLessonWords(user.id, 3);
  const levelInfo = calculateUserLevel(stats.totalXp);

  const dailyGoal = user.settings?.dailyTargetWords || 10;
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayActivity = stats.weeklyActivity.find((a) => a.date === todayStr);
  const wordsStudiedToday = todayActivity?.wordsStudied || 0;
  const dailyProgress = Math.min(100, Math.round((wordsStudiedToday / dailyGoal) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl z-10">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{user.profile?.avatar || '🌱'}</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user.name || user.username}!
            </h1>
          </div>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Ready to expand your vocabulary today? You are on a <strong>{stats.currentStreak}-day streak</strong>!
          </p>
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <Badge variant="cefr" level={user.settings?.cefrLevel || 'A1'} className="bg-white/20 text-white border-white/30" />
            <span className="text-xs bg-emerald-800/60 px-3 py-1 rounded-full border border-emerald-600/40">
              🎯 Goal: {user.settings?.learningGoal || 'Everyday English'}
            </span>
            <span className="text-xs bg-emerald-800/60 px-3 py-1 rounded-full border border-emerald-600/40">
              Level {levelInfo.level} Learner
            </span>
          </div>
        </div>

        {/* Quick Review Card inside Banner */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex flex-col items-center justify-center text-center min-w-[220px] z-10 space-y-2">
          <BrainCircuit size={28} className="text-emerald-300 animate-pulse" />
          <div>
            <div className="text-3xl font-black">{stats.wordsDueReview}</div>
            <p className="text-xs text-emerald-100 uppercase tracking-wider font-semibold">
              Words Due for Review
            </p>
          </div>
          {stats.wordsDueReview > 0 ? (
            <Link href="/review" className="w-full">
              <Button size="sm" className="w-full bg-white text-emerald-800 hover:bg-emerald-50 font-bold shadow-sm">
                Start Review ({stats.wordsDueReview})
              </Button>
            </Link>
          ) : (
            <p className="text-xs text-emerald-200 italic">All caught up! 🎉</p>
          )}
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <Card className="p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
            <Flame size={24} className="fill-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.currentStreak} <span className="text-xs font-normal text-slate-500">days</span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Current Streak (Best: {stats.longestStreak})
            </p>
          </div>
        </Card>

        {/* Total Words */}
        <Card className="p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.totalWordsLearned}
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Words ({stats.wordsMastered} Mastered)
            </p>
          </div>
        </Card>

        {/* Total XP */}
        <Card className="p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
            <Trophy size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.totalXp} <span className="text-xs font-normal text-slate-500">XP</span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Level {levelInfo.level} Explorer
            </p>
          </div>
        </Card>

        {/* Accuracy */}
        <Card className="p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.accuracyRate}%
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Retention Accuracy
            </p>
          </div>
        </Card>
      </div>

      {/* 3. Daily Target & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Daily Progress & Recommended Lesson */}
        <div className="lg:col-span-8 space-y-6">
          {/* Daily Goal Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Target size={20} className="text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Today&apos;s Learning Goal
                </h3>
              </div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {wordsStudiedToday} / {dailyGoal} words
              </span>
            </div>

            <Progress value={dailyProgress} />

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{dailyProgress >= 100 ? '🎉 Daily goal completed!' : `${dailyGoal - wordsStudiedToday} words left for today`}</span>
              <Link href="/settings" className="hover:underline text-emerald-600">
                Adjust target
              </Link>
            </div>
          </Card>

          {/* Recommended Next Lesson */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Recommended Next Words
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Targeted for your {user.settings?.cefrLevel} level
                </p>
              </div>

              <Link href="/learn">
                <Button variant="primary" size="sm">
                  <span>Start Lesson</span>
                  <ArrowRight size={14} />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {recommendedWords.map((w) => (
                <div
                  key={w.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="cefr" level={w.cefrLevel} />
                    <span className="text-[11px] text-slate-500 uppercase">{w.partOfSpeech}</span>
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">{w.word}</h4>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 truncate">
                    {w.translations[0]?.translation || w.definitionSimple}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Weekly Study Activity */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 size={18} className="text-indigo-600" />
                <span>Recent 7-Day Activity</span>
              </h3>
              <Link href="/stats" className="text-xs font-semibold text-emerald-600 hover:underline">
                View Full Analytics
              </Link>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-2">
              {stats.weeklyActivity.length > 0 ? (
                stats.weeklyActivity.map((day) => {
                  const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
                  const hasActivity = day.wordsStudied > 0 || day.wordsReviewed > 0;
                  return (
                    <div key={day.date} className="flex flex-col items-center space-y-1.5 text-center">
                      <span className="text-[11px] text-slate-400">{dayName}</span>
                      <div
                        className={`w-full h-14 rounded-xl flex flex-col items-center justify-center transition-all ${
                          hasActivity
                            ? 'bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-xs font-bold">{day.wordsStudied + day.wordsReviewed}</span>
                        <span className="text-[9px] opacity-70">words</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="col-span-7 text-xs text-slate-400 text-center py-4">
                  Complete your first lesson today to begin charting weekly progress!
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Quick Action Cards & Gamification */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions Hub */}
          <Card className="p-6 space-y-3.5">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Quick Actions</h3>

            <Link href="/learn" className="block">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/30 transition-all flex items-center justify-between group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 flex items-center justify-center">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600">
                      Learn New Words
                    </h4>
                    <p className="text-xs text-slate-500">Interactive step-by-step lesson</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link href="/review" className="block">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/30 transition-all flex items-center justify-between group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 flex items-center justify-center">
                    <BrainCircuit size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600">
                      Spaced Repetition
                    </h4>
                    <p className="text-xs text-slate-500">{stats.wordsDueReview} words due for review</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link href="/practice" className="block">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/30 transition-all flex items-center justify-between group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 flex items-center justify-center">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600">
                      10 Practice Modes
                    </h4>
                    <p className="text-xs text-slate-500">Quizzes, speed, and listening</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            <Link href="/ai-tutor" className="block">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/30 transition-all flex items-center justify-between group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 flex items-center justify-center">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600">
                      Gemini AI Tutor
                    </h4>
                    <p className="text-xs text-slate-500">Ask grammar, usage, and mnemonics</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </Card>

          {/* Level Progress */}
          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between text-sm font-bold">
              <span>Level {levelInfo.level} Progress</span>
              <span className="text-emerald-600">{levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} XP</span>
            </div>
            <Progress value={levelInfo.progressPercent} color="indigo" />
            <p className="text-xs text-slate-500 text-center">
              Earn XP by learning new words, reviewing on time, and completing perfect lessons.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
