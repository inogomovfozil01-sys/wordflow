'use client';

import React, { useState } from 'react';
import { Volume2, Sparkles, Check, ArrowRight, RotateCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AudioButton } from '@/components/audio-button';

const PREVIEW_CARDS = [
  {
    word: 'collaborate',
    ipa: '/kəˈlæb.ə.reɪt/',
    pos: 'verb',
    level: 'B1' as const,
    definition: 'To work jointly with others on an activity or project.',
    ru: 'сотрудничать',
    uz: 'hamkorlik qilmoq',
    example: 'Software engineers collaborate on GitHub to build apps.',
  },
  {
    word: 'resilient',
    ipa: '/rɪˈzɪl.jənt/',
    pos: 'adj',
    level: 'B2' as const,
    definition: 'Able to withstand or recover quickly from difficult conditions.',
    ru: 'стойкий',
    uz: 'bardoshli',
    example: 'The team stayed resilient despite the tight deadline.',
  },
  {
    word: 'ubiquitous',
    ipa: '/juːˈbɪk.wɪ.təs/',
    pos: 'adj',
    level: 'C2' as const,
    definition: 'Present, appearing, or found everywhere.',
    ru: 'вездесущий',
    uz: 'hamma yerda mavjud',
    example: 'Smartphones have become ubiquitous worldwide.',
  },
];

export function LandingFlashcardPreview() {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [scheduledInterval, setScheduledInterval] = useState<string | null>(null);

  const card = PREVIEW_CARDS[index];

  const handleRating = (ratingText: string, intervalText: string) => {
    setScheduledInterval(`Next review scheduled: ${intervalText}`);
    setTimeout(() => {
      setScheduledInterval(null);
      setIsFlipped(false);
      setIndex((prev) => (prev + 1) % PREVIEW_CARDS.length);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md">
      {/* Decorative frame badge */}
      <div className="flex items-center justify-between mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
        <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
          <Sparkles size={14} /> Interactive Live Demo
        </span>
        <button
          onClick={() => {
            setIsFlipped(false);
            setIndex((prev) => (prev + 1) % PREVIEW_CARDS.length);
          }}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
        >
          <RotateCw size={12} />
          <span>Next Word</span>
        </button>
      </div>

      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between min-h-[360px] transition-all">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="cefr" level={card.level} />
            <Badge variant="default" className="text-xs uppercase">{card.pos}</Badge>
          </div>
          <AudioButton text={card.word} size="md" />
        </div>

        {/* Card Body */}
        <div className="my-6 text-center space-y-3">
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {card.word}
          </h3>
          <p className="font-mono text-sm text-slate-500 dark:text-slate-400">
            {card.ipa}
          </p>

          {!isFlipped ? (
            <div className="pt-4">
              <button
                onClick={() => setIsFlipped(true)}
                className="w-full py-3 px-4 rounded-xl border border-dashed border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-semibold text-sm hover:bg-emerald-100/60 transition-all cursor-pointer"
              >
                Tap to Flip & Reveal Meaning
              </button>
            </div>
          ) : (
            <div className="pt-2 space-y-3 text-left animate-in fade-in zoom-in-95 duration-200">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 uppercase font-bold mb-0.5">English Definition</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{card.definition}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                  🇷🇺 {card.ru}
                </div>
                <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200">
                  🇺🇿 {card.uz}
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                &quot;{card.example}&quot;
              </p>
            </div>
          )}
        </div>

        {/* Bottom review rating buttons */}
        <div>
          {isFlipped ? (
            scheduledInterval ? (
              <div className="py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-center text-xs font-bold animate-in fade-in">
                {scheduledInterval}
              </div>
            ) : (
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-center text-slate-400 uppercase tracking-wider">
                  Rate your recall (SM-2 Algorithm)
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => handleRating('Again', 'Tomorrow (1d)')}
                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    Again
                    <span className="block text-[10px] font-normal opacity-80">1d</span>
                  </button>

                  <button
                    onClick={() => handleRating('Hard', '3 days')}
                    className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    Hard
                    <span className="block text-[10px] font-normal opacity-80">3d</span>
                  </button>

                  <button
                    onClick={() => handleRating('Good', '6 days')}
                    className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    Good
                    <span className="block text-[10px] font-normal opacity-80">6d</span>
                  </button>

                  <button
                    onClick={() => handleRating('Easy', '15 days')}
                    className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
                  >
                    Easy
                    <span className="block text-[10px] font-normal opacity-80">15d</span>
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
              <span>Card {index + 1} of {PREVIEW_CARDS.length}</span>
              <span>Spaced repetition engine</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
