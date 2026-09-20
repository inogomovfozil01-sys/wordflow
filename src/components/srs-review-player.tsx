'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BrainCircuit,
  Volume2,
  CheckCircle2,
  Trophy,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Flame,
  Check,
  Clock,
} from 'lucide-react';
import { WordItem, ReviewRating } from '@/types';
import { AudioButton } from '@/components/audio-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';

interface SrsReviewPlayerProps {
  initialWords: WordItem[];
}

export function SrsReviewPlayer({ initialWords }: SrsReviewPlayerProps) {
  const { error } = useToast();
  const [words] = useState<WordItem[]>(initialWords);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  // Completed session metrics
  const [isCompleted, setIsCompleted] = useState(false);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [ratingsCount, setRatingsCount] = useState({ again: 0, hard: 0, good: 0, easy: 0 });
  const [hardestWords, setHardestWords] = useState<WordItem[]>([]);

  const currentWord = words[currentIndex];

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentIndex]);

  // Keyboard shortcuts: Space = flip, 1-4 = rate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted || isSubmitting) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (isFlipped) {
        if (e.key === '1') handleRate(1);
        if (e.key === '2') handleRate(2);
        if (e.key === '3') handleRate(3);
        if (e.key === '4') handleRate(4);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, isCompleted, isSubmitting, currentIndex]);

  const handleRate = async (rating: ReviewRating) => {
    if (!currentWord || isSubmitting) return;
    setIsSubmitting(true);

    const timeSpentMs = Date.now() - startTime;

    try {
      const res = await fetch('/api/srs/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wordId: currentWord.id,
          rating,
          timeSpentMs,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        error(data.error || 'Failed to submit review');
        setIsSubmitting(false);
        return;
      }

      const xp = data.result.xpEarned || 0;
      setTotalXpEarned((prev) => prev + xp);

      // Track ratings
      setRatingsCount((prev) => ({
        again: rating === 1 ? prev.again + 1 : prev.again,
        hard: rating === 2 ? prev.hard + 1 : prev.hard,
        good: rating === 3 ? prev.good + 1 : prev.good,
        easy: rating === 4 ? prev.easy + 1 : prev.easy,
      }));

      if (rating === 1 || rating === 2) {
        setHardestWords((prev) => [...prev, currentWord]);
      }

      if (currentIndex + 1 < words.length) {
        setIsFlipped(false);
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsCompleted(true);
      }
    } catch {
      error('Network error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (words.length === 0) {
    return (
      <Card className="p-10 text-center max-w-lg mx-auto space-y-4 border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
          <CheckCircle2 size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Review Queue is Clear
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
          There are no words due for spaced repetition recall right now. Words will automatically re-appear when their SM-2 memory intervals expire.
        </p>
        <div className="pt-2 flex justify-center gap-2.5">
          <Link href="/learn">
            <Button variant="primary" size="md">
              <span>Learn New Words</span>
              <ArrowRight size={14} />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="md">
              <span>Dashboard</span>
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  // Session Completed Summary
  if (isCompleted) {
    const total = words.length;
    const recalledSuccessfully = ratingsCount.good + ratingsCount.easy + ratingsCount.hard;
    const accuracy = total > 0 ? Math.round((recalledSuccessfully / total) * 100) : 100;

    return (
      <Card className="max-w-2xl mx-auto p-8 border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Trophy size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Spaced Repetition Session Complete
          </h2>
          <p className="text-xs text-slate-500">
            {total} words scheduled and updated via SuperMemo SM-2 algorithm.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Reviewed</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{total}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Retention Rate</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{accuracy}%</div>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900">
            <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block mb-0.5">XP Earned</span>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-300">+{totalXpEarned}</div>
          </div>
        </div>

        {/* Breakdown by Rating */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Recall Quality Breakdown
          </span>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-900/60 text-rose-700 dark:text-rose-300">
              <span className="text-[10px] font-bold block">Again (1d)</span>
              <span className="text-base font-bold">{ratingsCount.again}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/60 text-amber-700 dark:text-amber-300">
              <span className="text-[10px] font-bold block">Hard (3d)</span>
              <span className="text-base font-bold">{ratingsCount.hard}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/60 text-blue-700 dark:text-blue-300">
              <span className="text-[10px] font-bold block">Good (6d)</span>
              <span className="text-base font-bold">{ratingsCount.good}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300">
              <span className="text-[10px] font-bold block">Easy (15d+)</span>
              <span className="text-base font-bold">{ratingsCount.easy}</span>
            </div>
          </div>
        </div>

        {/* Lapsed words if any */}
        {hardestWords.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Words Scheduled for Repeat Review Tomorrow
            </span>
            <div className="flex flex-wrap gap-1.5">
              {hardestWords.map((hw, i) => (
                <span key={i} className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                  {hw.word}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <Link href="/practice">
            <Button variant="outline" size="md">
              <span>Practice Modalities</span>
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" size="md">
              <span>Return to Dashboard</span>
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / words.length) * 100);
  const ruTr = currentWord.translations.find((t) => t.language === 'ru')?.translation;
  const uzTr = currentWord.translations.find((t) => t.language === 'uz')?.translation;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header & Progress */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Word {currentIndex + 1} of {words.length}
          </span>
          <span>•</span>
          <span className="font-mono">SM-2 Interval Review</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <span>Shortcuts:</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Space</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">1-4</kbd>
        </div>
      </div>

      <Progress value={progressPercent} className="h-1.5" />

      {/* Main Flashcard */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-7 sm:p-10 shadow-sm min-h-[400px] flex flex-col justify-between transition-all">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="cefr" level={currentWord.cefrLevel} />
            <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {currentWord.partOfSpeech}
            </span>
          </div>
          <AudioButton text={currentWord.word} size="md" />
        </div>

        {/* Word Center Display */}
        <div className="my-6 text-center space-y-3">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            {currentWord.word}
          </h2>
          {currentWord.ipa && (
            <p className="font-mono text-sm text-slate-500 dark:text-slate-400">
              {currentWord.ipa}
            </p>
          )}

          {!isFlipped ? (
            <div className="pt-6 max-w-sm mx-auto">
              <button
                type="button"
                onClick={() => setIsFlipped(true)}
                className="w-full py-3.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 font-medium text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Click or Press Space to Reveal</span>
              </button>
            </div>
          ) : (
            <div className="pt-4 space-y-4 text-left max-w-lg mx-auto animate-in fade-in duration-200">
              {/* Definition */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                  Definition
                </span>
                <p className="text-xs font-normal text-slate-800 dark:text-slate-200 leading-relaxed">
                  {currentWord.definitionEn}
                </p>
              </div>

              {/* Dual Translations */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {ruTr && (
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 block mb-0.5">🇷🇺 Russian</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{ruTr}</span>
                  </div>
                )}
                {uzTr && (
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 block mb-0.5">🇺🇿 Uzbek</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{uzTr}</span>
                  </div>
                )}
              </div>

              {/* Context Example */}
              {currentWord.examples && currentWord.examples.length > 0 && (
                <p className="text-xs text-slate-600 dark:text-slate-400 italic px-1">
                  &ldquo;{currentWord.examples[0].sentenceEn}&rdquo;
                </p>
              )}
            </div>
          )}
        </div>

        {/* Rating Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          {isFlipped ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Rate your recall quality</span>
                <span>Keyboard: 1 • 2 • 3 • 4</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleRate(1)}
                  className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 transition-colors text-center cursor-pointer disabled:opacity-50"
                >
                  <span className="block font-bold">Again [1]</span>
                  <span className="block text-[10px] opacity-75">&lt; 10 min</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleRate(2)}
                  className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100 transition-colors text-center cursor-pointer disabled:opacity-50"
                >
                  <span className="block font-bold">Hard [2]</span>
                  <span className="block text-[10px] opacity-75">1 day</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleRate(3)}
                  className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold hover:bg-blue-100 transition-colors text-center cursor-pointer disabled:opacity-50"
                >
                  <span className="block font-bold">Good [3]</span>
                  <span className="block text-[10px] opacity-75">3 days</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleRate(4)}
                  className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors text-center cursor-pointer disabled:opacity-50"
                >
                  <span className="block font-bold">Easy [4]</span>
                  <span className="block text-[10px] opacity-75">7 days</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-slate-400">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[11px]">Space</kbd> or click the button to flip
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
