'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Volume2,
  HelpCircle,
  Flame,
  Award,
} from 'lucide-react';
import { WordItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AudioButton } from '@/components/audio-button';
import { useToast } from '@/components/ui/toast';

interface LearningSessionPlayerProps {
  words: WordItem[];
  collectionTitle?: string;
}

type QuestionStep =
  | { type: 'INTRO'; word: WordItem }
  | { type: 'QUIZ_TRANSLATION'; word: WordItem; options: string[]; correctOption: string }
  | { type: 'TYPE_SPELLING'; word: WordItem }
  | { type: 'FILL_BLANK'; word: WordItem; sentenceWithBlank: string };

export function LearningSessionPlayer({ words, collectionTitle }: LearningSessionPlayerProps) {
  const { error } = useToast();
  const [steps, setSteps] = useState<QuestionStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedInput, setTypedInput] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());
  const [sessionSummary, setSessionSummary] = useState<{
    xpEarned: number;
    currentStreak: number;
    unlockedAchievements: Array<{ id: string; title: string; icon: string; xpReward: number }>;
  } | null>(null);

  // Generate interactive multi-step lesson questions from the words
  useEffect(() => {
    if (!words || words.length === 0) return;

    const generatedSteps: QuestionStep[] = [];

    // All available translations to use as distractors
    const allTranslations = words
      .map((w) => w.translations[0]?.translation)
      .filter((t): t is string => !!t);

    words.forEach((word) => {
      // Step 1: Word Introduction & Pronunciation
      generatedSteps.push({
        type: 'INTRO',
        word,
      });

      // Step 2: Multiple Choice Quiz
      const correctTr = word.translations[0]?.translation || word.definitionSimple;
      const otherTrs = allTranslations.filter((t) => t !== correctTr);
      const shuffledDistractors = [...otherTrs].sort(() => 0.5 - Math.random()).slice(0, 3);
      const options = [...shuffledDistractors, correctTr].sort(() => 0.5 - Math.random());

      generatedSteps.push({
        type: 'QUIZ_TRANSLATION',
        word,
        options,
        correctOption: correctTr,
      });

      // Step 3: Type spelling drill
      generatedSteps.push({
        type: 'TYPE_SPELLING',
        word,
      });

      // Step 4: Fill in the blank (if examples exist)
      if (word.examples && word.examples.length > 0) {
        const sentence = word.examples[0].sentenceEn;
        const regex = new RegExp(`\\b${word.word}\\b`, 'gi');
        if (regex.test(sentence)) {
          const blanked = sentence.replace(regex, '_______');
          generatedSteps.push({
            type: 'FILL_BLANK',
            word,
            sentenceWithBlank: blanked,
          });
        }
      }
    });

    setSteps(generatedSteps);
  }, [words]);

  const currentStep = steps[stepIndex];

  const handleNextStep = () => {
    setSelectedOption(null);
    setTypedInput('');
    setIsAnswered(false);
    setIsCorrect(false);

    if (stepIndex + 1 < steps.length) {
      setStepIndex((prev) => prev + 1);
    } else {
      finishSession();
    }
  };

  const handleSelectQuizOption = (opt: string) => {
    if (isAnswered || currentStep?.type !== 'QUIZ_TRANSLATION') return;
    setSelectedOption(opt);
    const correct = opt === currentStep.correctOption;
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) setCorrectCount((prev) => prev + 1);
  };

  const handleCheckSpelling = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered || currentStep?.type !== 'TYPE_SPELLING') return;
    const clean = typedInput.trim().toLowerCase();
    const target = currentStep.word.word.toLowerCase();
    const correct = clean === target;
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) setCorrectCount((prev) => prev + 1);
  };

  const handleCheckBlank = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered || currentStep?.type !== 'FILL_BLANK') return;
    const clean = typedInput.trim().toLowerCase();
    const target = currentStep.word.word.toLowerCase();
    const correct = clean === target;
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) setCorrectCount((prev) => prev + 1);
  };

  const finishSession = async () => {
    setIsSubmitting(true);
    const durationSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    try {
      const res = await fetch('/api/learn/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wordsCount: words.length,
          correctCount,
          durationSeconds,
          wordIds: words.map((w) => w.id),
          mode: 'INTERACTIVE_LESSON',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        error(data.error || 'Failed to record lesson completion');
      } else {
        setSessionSummary({
          xpEarned: data.summary.xpEarned,
          currentStreak: data.summary.currentStreak,
          unlockedAchievements: data.summary.unlockedAchievements || [],
        });
      }

      setIsCompleted(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {
      error('Network error finalizing session');
      setIsCompleted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentStep) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-sm text-slate-500">Preparing your interactive lesson...</p>
      </div>
    );
  }

  // Summary Screen
  if (isCompleted) {
    return (
      <Card className="p-8 max-w-xl mx-auto text-center space-y-6 shadow-2xl border-emerald-200 dark:border-emerald-800 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
          <Trophy size={36} className="text-emerald-600 animate-bounce" />
        </div>

        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            Lesson Completed!
          </h2>
          <p className="text-sm text-slate-500">
            {words.length} new words have been added to your Spaced Repetition queue.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border">
            <span className="text-2xl font-black text-emerald-600">
              +{sessionSummary?.xpEarned || words.length * 15}
            </span>
            <p className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">XP Earned</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border">
            <span className="text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
              <Flame size={20} className="fill-amber-500" />
              {sessionSummary?.currentStreak || 1}
            </span>
            <p className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">Day Streak</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border">
            <span className="text-2xl font-black text-indigo-600">{words.length}</span>
            <p className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">Words Learned</p>
          </div>
        </div>

        {/* Unlocked Achievements */}
        {sessionSummary?.unlockedAchievements && sessionSummary.unlockedAchievements.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2 text-left">
            <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
              <Award size={16} />
              <span>Achievement Unlocked!</span>
            </div>
            {sessionSummary.unlockedAchievements.map((ach) => (
              <div key={ach.id} className="flex items-center space-x-3 pt-1">
                <span className="text-2xl">{ach.icon}</span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{ach.title}</h4>
                  <p className="text-xs text-slate-500">+{ach.xpReward} Bonus XP</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 flex justify-center gap-3">
          <Link href="/dashboard">
            <Button variant="primary" size="md">
              <span>Go to Dashboard</span>
              <ArrowRight size={16} />
            </Button>
          </Link>
          <Link href="/review">
            <Button variant="outline" size="md">
              Review Due Words
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  const progressPercent = Math.round(((stepIndex + 1) / steps.length) * 100);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <span className="flex items-center gap-1.5">
          <Sparkles size={14} className="text-emerald-600" />
          <span>
            {collectionTitle ? `${collectionTitle} • ` : ''}Step {stepIndex + 1} of {steps.length}
          </span>
        </span>
        <span>{progressPercent}%</span>
      </div>
      <Progress value={progressPercent} />

      {/* STEP 1: INTRO FLASHCARD */}
      {currentStep.type === 'INTRO' && (
        <Card className="p-6 sm:p-10 shadow-xl border-slate-200/90 dark:border-slate-800 space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="cefr" level={currentStep.word.cefrLevel} />
              <Badge variant="default" className="text-xs uppercase font-bold">
                {currentStep.word.partOfSpeech}
              </Badge>
            </div>
            <AudioButton text={currentStep.word.word} size="md" />
          </div>

          <div className="text-center space-y-2 py-4">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentStep.word.word}
            </h2>
            {currentStep.word.ipa && (
              <p className="font-mono text-sm text-slate-500">{currentStep.word.ipa}</p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Meaning</p>
            <p className="text-base font-medium text-slate-900 dark:text-white">
              {currentStep.word.definitionEn}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-emerald-900 dark:text-emerald-200">
              🇷🇺 {currentStep.word.translations.find((t) => t.language === 'ru')?.translation || '—'}
            </div>
            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 text-teal-900 dark:text-teal-200">
              🇺🇿 {currentStep.word.translations.find((t) => t.language === 'uz')?.translation || '—'}
            </div>
          </div>

          {currentStep.word.examples && currentStep.word.examples.length > 0 && (
            <p className="text-xs text-slate-500 italic">
              &quot;{currentStep.word.examples[0].sentenceEn}&quot;
            </p>
          )}

          <div className="pt-4">
            <Button size="lg" variant="primary" onClick={handleNextStep} className="w-full font-bold">
              <span>Got it, continue</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: MULTIPLE CHOICE */}
      {currentStep.type === 'QUIZ_TRANSLATION' && (
        <Card className="p-6 sm:p-10 shadow-xl border-slate-200/90 dark:border-slate-800 space-y-6 animate-in fade-in duration-150">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Select Correct Translation
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              {currentStep.word.word}
            </h2>
            <div className="flex justify-center">
              <AudioButton text={currentStep.word.word} size="sm" />
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            {currentStep.options.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const isCorrectOpt = opt === currentStep.correctOption;

              let style = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800';
              if (isAnswered) {
                if (isCorrectOpt) {
                  style = 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-100 font-bold';
                } else if (isSelected) {
                  style = 'border-rose-500 bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-100';
                }
              }

              return (
                <button
                  key={i}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectQuizOption(opt)}
                  className={`w-full p-4 rounded-2xl border-2 text-sm font-semibold text-left flex items-center justify-between transition-all cursor-pointer ${style}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrectOpt && <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />}
                  {isAnswered && isSelected && !isCorrectOpt && <XCircle size={18} className="text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="pt-4 animate-in fade-in">
              <Button size="lg" variant="primary" onClick={handleNextStep} className="w-full font-bold">
                <span>Continue</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* STEP 3: TYPE SPELLING */}
      {currentStep.type === 'TYPE_SPELLING' && (
        <Card className="p-6 sm:p-10 shadow-xl border-slate-200/90 dark:border-slate-800 space-y-6 animate-in fade-in duration-150">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Spell the English Word
            </span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {currentStep.word.translations[0]?.translation || currentStep.word.definitionSimple}
            </h3>
            <p className="text-xs text-slate-500">
              Hint: starts with &quot;{currentStep.word.word[0].toUpperCase()}&quot; ({currentStep.word.word.length} letters)
            </p>
          </div>

          <form onSubmit={handleCheckSpelling} className="space-y-4 pt-2">
            <input
              type="text"
              autoFocus
              disabled={isAnswered}
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="Type English word..."
              className="w-full px-4 py-3.5 text-center text-lg font-bold rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-emerald-500"
            />

            {!isAnswered ? (
              <Button type="submit" size="lg" variant="primary" className="w-full font-bold">
                Check Spelling
              </Button>
            ) : (
              <div className="space-y-4 animate-in fade-in">
                <div
                  className={`p-3 rounded-xl border text-sm text-center font-bold ${
                    isCorrect
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                      : 'border-rose-300 bg-rose-50 text-rose-800'
                  }`}
                >
                  {isCorrect ? 'Correct spelling!' : `Correct answer: "${currentStep.word.word}"`}
                </div>
                <Button type="button" size="lg" variant="primary" onClick={handleNextStep} className="w-full font-bold">
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </Button>
              </div>
            )}
          </form>
        </Card>
      )}

      {/* STEP 4: FILL IN THE BLANK */}
      {currentStep.type === 'FILL_BLANK' && (
        <Card className="p-6 sm:p-10 shadow-xl border-slate-200/90 dark:border-slate-800 space-y-6 animate-in fade-in duration-150">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Fill in the Blank
            </span>
            <p className="text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
              &quot;{currentStep.sentenceWithBlank}&quot;
            </p>
          </div>

          <form onSubmit={handleCheckBlank} className="space-y-4 pt-2">
            <input
              type="text"
              autoFocus
              disabled={isAnswered}
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="Missing word..."
              className="w-full px-4 py-3.5 text-center text-lg font-bold rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-emerald-500"
            />

            {!isAnswered ? (
              <Button type="submit" size="lg" variant="primary" className="w-full font-bold">
                Check Answer
              </Button>
            ) : (
              <div className="space-y-4 animate-in fade-in">
                <div
                  className={`p-3 rounded-xl border text-sm text-center font-bold ${
                    isCorrect
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                      : 'border-rose-300 bg-rose-50 text-rose-800'
                  }`}
                >
                  {isCorrect ? 'Well done!' : `Target word: "${currentStep.word.word}"`}
                </div>
                <Button type="button" size="lg" variant="primary" onClick={handleNextStep} className="w-full font-bold">
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </Button>
              </div>
            )}
          </form>
        </Card>
      )}
    </div>
  );
}
