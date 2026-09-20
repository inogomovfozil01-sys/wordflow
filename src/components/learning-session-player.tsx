'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Volume2,
  Check,
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
  const [sessionSummary, setSessionSummary] = useState<{
    xpEarned: number;
    currentStreak: number;
  } | null>(null);

  // Generate interactive multi-step lesson steps from words
  useEffect(() => {
    if (!words || words.length === 0) return;

    const generatedSteps: QuestionStep[] = [];
    const allTranslations = words
      .map((w) => w.translations[0]?.translation)
      .filter((t): t is string => !!t);

    words.forEach((word) => {
      // Step 1: Multi-sensory Introduction
      generatedSteps.push({
        type: 'INTRO',
        word,
      });

      // Step 2: Recognition Multiple Choice Quiz
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

      // Step 3: Orthographic spelling drill
      generatedSteps.push({
        type: 'TYPE_SPELLING',
        word,
      });

      // Step 4: Cloze in-context test (if examples exist)
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

  const handleCheckFillBlank = (e: React.FormEvent) => {
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
    try {
      const res = await fetch('/api/learn/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wordIds: words.map((w) => w.id),
          correctCount,
          totalQuestions: steps.filter((s) => s.type !== 'INTRO').length,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSessionSummary({
          xpEarned: data.xpEarned || 35,
          currentStreak: data.currentStreak || 1,
        });
      }
      setIsCompleted(true);
    } catch {
      setIsCompleted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (words.length === 0) {
    return (
      <Card className="p-10 text-center max-w-lg mx-auto space-y-4 border-slate-200/90 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          No New Words Available
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          You have acquired all current words in this category. Visit the dictionary or collections to explore more vocabulary.
        </p>
        <div className="pt-2 flex justify-center gap-2.5">
          <Link href="/collections">
            <Button variant="primary" size="md">
              <span>Explore Collections</span>
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="md">
              <span>Return to Dashboard</span>
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  // Completed Screen
  if (isCompleted) {
    const quizSteps = steps.filter((s) => s.type !== 'INTRO').length;
    const accuracy = quizSteps > 0 ? Math.round((correctCount / quizSteps) * 100) : 100;

    return (
      <Card className="max-w-2xl mx-auto p-8 border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Trophy size={24} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Lesson Completed
          </h2>
          <p className="text-xs text-slate-500">
            {words.length} new words initialized into your SuperMemo SM-2 spaced repetition queue.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">New Words</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white">+{words.length}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Quiz Score</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{accuracy}%</div>
          </div>
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900">
            <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block mb-0.5">XP Earned</span>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-300">+{sessionSummary?.xpEarned || 40}</div>
          </div>
        </div>

        {/* Word Chips */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Added to Scheduled Review Queue
          </span>
          <div className="flex flex-wrap gap-1.5">
            {words.map((w) => (
              <span key={w.id} className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                {w.word} ({w.cefrLevel})
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <Link href="/practice">
            <Button variant="outline" size="md">
              <span>Practice Engine</span>
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

  const progressPercent = steps.length > 0 ? Math.round(((stepIndex + 1) / steps.length) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {collectionTitle ? `${collectionTitle} • ` : ''}Step {stepIndex + 1} of {steps.length}
        </span>
        <span className="font-mono text-[11px]">Active Lesson</span>
      </div>

      <Progress value={progressPercent} className="h-1.5" />

      {/* Dynamic Question Step Rendering */}
      {currentStep?.type === 'INTRO' && (
        <Card className="p-7 sm:p-10 border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="cefr" level={currentStep.word.cefrLevel} />
              <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {currentStep.word.partOfSpeech}
              </span>
            </div>
            <AudioButton text={currentStep.word.word} size="md" />
          </div>

          <div className="text-center space-y-2 py-2">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              01 • Word Introduction
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {currentStep.word.word}
            </h2>
            {currentStep.word.ipa && (
              <p className="font-mono text-xs text-slate-500">{currentStep.word.ipa}</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">English Definition</span>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                {currentStep.word.definitionEn}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {currentStep.word.translations.map((t, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                    {t.language === 'ru' ? '🇷🇺 Russian' : '🇺🇿 Uzbek'}
                  </span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{t.translation}</span>
                </div>
              ))}
            </div>

            {currentStep.word.examples && currentStep.word.examples.length > 0 && (
              <p className="text-xs text-slate-600 dark:text-slate-400 italic px-1 pt-1">
                &ldquo;{currentStep.word.examples[0].sentenceEn}&rdquo;
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="button"
              variant="primary"
              size="md"
              className="w-full font-semibold text-xs"
              onClick={handleNextStep}
            >
              <span>Continue to Recall Check</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        </Card>
      )}

      {currentStep?.type === 'QUIZ_TRANSLATION' && (
        <Card className="p-7 sm:p-10 border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              02 • Select Target Meaning
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {currentStep.word.word}
            </h2>
            <p className="text-xs text-slate-500">Choose the matching translation or meaning</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentStep.options.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const isOptionCorrect = opt === currentStep.correctOption;

              let btnStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 hover:bg-slate-100';

              if (isAnswered) {
                if (isOptionCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold';
                } else if (isSelected) {
                  btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300';
                }
              }

              return (
                <button
                  key={i}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectQuizOption(opt)}
                  className={`p-3.5 rounded-xl border text-xs text-left transition-all cursor-pointer disabled:cursor-default flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isOptionCorrect && <Check size={14} className="text-emerald-600" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="pt-2 animate-in fade-in">
              <Button
                type="button"
                variant="primary"
                size="md"
                className="w-full font-semibold text-xs"
                onClick={handleNextStep}
              >
                <span>Continue</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          )}
        </Card>
      )}

      {currentStep?.type === 'TYPE_SPELLING' && (
        <Card className="p-7 sm:p-10 border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              03 • Spelling & Recall
            </span>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 max-w-md mx-auto">
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                {currentStep.word.translations[0]?.translation || currentStep.word.definitionSimple}
              </p>
            </div>
            <p className="text-xs text-slate-500">Type the correct English spelling:</p>
          </div>

          <form onSubmit={handleCheckSpelling} className="space-y-4 max-w-md mx-auto">
            <input
              type="text"
              autoFocus
              disabled={isAnswered}
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="Type in English..."
              className="w-full text-center text-xl font-bold py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            {!isAnswered ? (
              <Button type="submit" variant="primary" size="md" className="w-full font-semibold text-xs">
                <span>Verify Spelling</span>
              </Button>
            ) : (
              <div className="space-y-3 animate-in fade-in">
                <div className={`p-3 rounded-xl text-xs font-semibold text-center ${
                  isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200'
                }`}>
                  {isCorrect ? 'Correct spelling!' : `Target: ${currentStep.word.word}`}
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  className="w-full font-semibold text-xs"
                  onClick={handleNextStep}
                >
                  <span>Next Step</span>
                  <ArrowRight size={14} />
                </Button>
              </div>
            )}
          </form>
        </Card>
      )}

      {currentStep?.type === 'FILL_BLANK' && (
        <Card className="p-7 sm:p-10 border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              04 • Cloze Context
            </span>
            <p className="text-xs text-slate-500">Restore the missing word in this sentence:</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center text-sm font-medium text-slate-800 dark:text-slate-200 max-w-md mx-auto leading-relaxed">
            &ldquo;{currentStep.sentenceWithBlank}&rdquo;
          </div>

          <form onSubmit={handleCheckFillBlank} className="space-y-4 max-w-md mx-auto">
            <input
              type="text"
              autoFocus
              disabled={isAnswered}
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="Enter missing word..."
              className="w-full text-center text-lg font-bold py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            {!isAnswered ? (
              <Button type="submit" variant="primary" size="md" className="w-full font-semibold text-xs">
                <span>Check Answer</span>
              </Button>
            ) : (
              <div className="space-y-3 animate-in fade-in">
                <div className={`p-3 rounded-xl text-xs font-semibold text-center ${
                  isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200'
                }`}>
                  {isCorrect ? 'Accurate context recall!' : `Missing word: ${currentStep.word.word}`}
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  className="w-full font-semibold text-xs"
                  onClick={handleNextStep}
                >
                  <span>Finish Step</span>
                  <ArrowRight size={14} />
                </Button>
              </div>
            )}
          </form>
        </Card>
      )}
    </div>
  );
}
