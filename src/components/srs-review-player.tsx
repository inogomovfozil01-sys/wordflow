'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  BrainCircuit,
  Volume2,
  CheckCircle2,
  Trophy,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Flame,
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

  // Keyboard shortcuts (Space = flip, 1-4 = rate)
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
        // Session complete!
        setIsCompleted(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch {
      error('Network error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (words.length === 0) {
    return (
      <Card className="p-12 text-center max-w-lg mx-auto space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 size={36} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          All Caught Up!
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          There are no words due for spaced repetition review right now. Words will appear here automatically when memory intervals expire.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link href="/learn">
            <Button variant="primary" size="md">
              <Sparkles size={16} />
              <span>Learn New Words</span>
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="md">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  // Summary Screen
  if (isCompleted) {
    const totalAnswered = words.length;
    const correctCount = ratingsCount.hard + ratingsCount.good + ratingsCount.easy;
    const accuracy = Math.round((correctCount / (totalAnswered || 1)) * 100);

    return (
      <Card className="p-8 max-w-xl mx-auto text-center space-y-6 shadow-2xl border-emerald-200 dark:border-emerald-800 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
          <Trophy size={36} className="text-emerald-600 animate-bounce" />
        </div>

        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            Review Session Complete!
          </h2>
          <p className="text-sm text-slate-500">
            Your spaced repetition schedule has been calibrated.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border">
            <span className="text-2xl font-black text-emerald-600">+{totalXpEarned}</span>
            <p className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">XP Earned</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border">
            <span className="text-2xl font-black text-indigo-600">{accuracy}%</span>
            <p className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">Accuracy</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border">
            <span className="text-2xl font-black text-amber-600">{totalAnswered}</span>
            <p className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">Reviewed</p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="text-xs flex items-center justify-center gap-4 text-slate-500 py-1">
          <span>Again: <strong>{ratingsCount.again}</strong></span>
          <span>Hard: <strong>{ratingsCount.hard}</strong></span>
          <span>Good: <strong>{ratingsCount.good}</strong></span>
          <span>Easy: <strong>{ratingsCount.easy}</strong></span>
        </div>

        {/* Hardest words */}
        {hardestWords.length > 0 && (
          <div className="text-left space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Words Needing Reinforcement ({hardestWords.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {hardestWords.map((w, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-xs font-semibold border border-rose-200 dark:border-rose-900"
                >
                  {w.word}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 flex justify-center gap-3">
          <Link href="/dashboard">
            <Button variant="primary" size="md">
              <span>Back to Dashboard</span>
              <ArrowRight size={16} />
            </Button>
          </Link>
          <Link href="/practice">
            <Button variant="outline" size="md">
              Practice Modes
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  const ruTr = currentWord.translations.find((t) => t.language === 'ru')?.translation;
  const uzTr = currentWord.translations.find((t) => t.language === 'uz')?.translation;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Top progress bar */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <span className="flex items-center gap-1">
          <BrainCircuit size={14} className="text-emerald-600" />
          <span>Card {currentIndex + 1} of {words.length}</span>
        </span>
        <span>{Math.round(((currentIndex + 1) / words.length) * 100)}%</span>
      </div>
      <Progress value={((currentIndex + 1) / words.length) * 100} />

      {/* Main Flashcard Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-10 flex flex-col justify-between min-h-[400px] transition-all">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="cefr" level={currentWord.cefrLevel} />
            <Badge variant="default" className="text-xs uppercase font-bold">
              {currentWord.partOfSpeech}
            </Badge>
          </div>
          <AudioButton text={currentWord.word} size="md" />
        </div>

        {/* Word Display */}
        <div className="my-8 text-center space-y-3">
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {currentWord.word}
          </h2>
          {currentWord.ipa && (
            <p className="font-mono text-base text-slate-500 dark:text-slate-400">
              {currentWord.ipa}
            </p>
          )}

          {!isFlipped ? (
            <div className="pt-6">
              <button
                type="button"
                onClick={() => setIsFlipped(true)}
                className="w-full py-3.5 px-4 rounded-2xl border border-dashed border-emerald-400 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-bold text-sm hover:bg-emerald-100 transition-all cursor-pointer"
              >
                Reveal Meaning (Space)
              </button>
            </div>
          ) : (
            <div className="pt-4 space-y-4 text-left animate-in fade-in zoom-in-95 duration-200">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-400 uppercase font-bold mb-0.5">Definition</p>
                <p className="text-base font-medium text-slate-800 dark:text-slate-200">
                  {currentWord.definitionEn}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                  🇷🇺 {ruTr || '—'}
                </div>
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200">
                  🇺🇿 {uzTr || '—'}
                </div>
              </div>

              {currentWord.examples && currentWord.examples.length > 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                  &quot;{currentWord.examples[0].sentenceEn}&quot;
                </p>
              )}
            </div>
          )}
        </div>

        {/* Rating Bar */}
        {isFlipped ? (
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-center text-slate-400 uppercase tracking-wider">
              Rate your recall (Keys: 1, 2, 3, 4)
            </p>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleRate(1)}
                className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 transition-all cursor-pointer text-center"
              >
                Again
                <span className="block text-[10px] font-normal opacity-80 mt-0.5">1d [1]</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleRate(2)}
                className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-all cursor-pointer text-center"
              >
                Hard
                <span className="block text-[10px] font-normal opacity-80 mt-0.5">3d [2]</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleRate(3)}
                className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-all cursor-pointer text-center"
              >
                Good
                <span className="block text-[10px] font-normal opacity-80 mt-0.5">6d [3]</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleRate(4)}
                className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-all cursor-pointer text-center"
              >
                Easy
                <span className="block text-[10px] font-normal opacity-80 mt-0.5">15d+ [4]</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
            <span>Press Space or tap button to reveal</span>
            <span>SM-2 Scheduler</span>
          </div>
        )}
      </div>
    </div>
  );
}
