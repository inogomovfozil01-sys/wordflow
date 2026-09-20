'use client';

import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, RotateCw, BookOpen, Volume2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AudioButton } from '@/components/audio-button';

const PREVIEW_CARDS = [
  {
    word: 'accomplish',
    ipa: '/əˈkʌm.plɪʃ/',
    pos: 'verb',
    level: 'B1' as const,
    definition: 'To succeed in doing or completing something, especially after a lot of effort.',
    ru: 'совершать, выполнять, достигать',
    uz: 'bajarmoq, erishmoq',
    example: 'We can accomplish far more when we work collaboratively across teams.',
    collocations: ['accomplish a goal', 'accomplish a mission', 'easily accomplished'],
  },
  {
    word: 'resilient',
    ipa: '/rɪˈzɪl.jənt/',
    pos: 'adj',
    level: 'B2' as const,
    definition: 'Able to withstand or recover quickly from difficult conditions or adversity.',
    ru: 'стойкий, жизнерадостный, упругий',
    uz: 'bardoshli, chidamli',
    example: 'Modern distributed architectures must be resilient to unexpected network partitions.',
    collocations: ['resilient economy', 'resilient infrastructure', 'remain resilient'],
  },
  {
    word: 'ubiquitous',
    ipa: '/juːˈbɪk.wɪ.təs/',
    pos: 'adj',
    level: 'C2' as const,
    definition: 'Present, appearing, or found everywhere at the same time.',
    ru: 'вездесущий, повсеместный',
    uz: 'hamma yerda uchraydigan, keng tarqalgan',
    example: 'Cloud computing has become ubiquitous across enterprise software development.',
    collocations: ['ubiquitous presence', 'ubiquitous computing', 'almost ubiquitous'],
  },
  {
    word: 'pragmatic',
    ipa: '/præɡˈmæt.ɪk/',
    pos: 'adj',
    level: 'C1' as const,
    definition: 'Dealing with things sensibly and realistically in a way based on practical rather than theoretical considerations.',
    ru: 'прагматичный, практичный',
    uz: 'amaliy, pragmatik',
    example: 'We adopted a pragmatic approach to technical debt to ship on schedule.',
    collocations: ['pragmatic approach', 'pragmatic solution', 'pragmatic decision'],
  },
];

export function LandingFlashcardPreview() {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [feedback, setFeedback] = useState<{ title: string; subtitle: string; interval: string } | null>(null);

  const card = PREVIEW_CARDS[index];

  const handleRating = (ratingName: string, interval: string) => {
    setFeedback({
      title: `${ratingName} Recorded`,
      subtitle: 'Next recall scheduled via SuperMemo SM-2',
      interval,
    });

    setTimeout(() => {
      setFeedback(null);
      setIsFlipped(false);
      setIndex((prev) => (prev + 1) % PREVIEW_CARDS.length);
    }, 1400);
  };

  const handleNextWord = () => {
    setFeedback(null);
    setIsFlipped(false);
    setIndex((prev) => (prev + 1) % PREVIEW_CARDS.length);
  };

  return (
    <div className="w-full max-w-md">
      {/* Interactive header bar */}
      <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
        <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
          Interactive Learning Card
        </span>
        <button
          onClick={handleNextWord}
          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer text-xs font-medium"
          title="Try another word"
        >
          <RotateCw size={13} />
          <span>Next Word ({index + 1}/{PREVIEW_CARDS.length})</span>
        </button>
      </div>

      {/* The Flashcard Container */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/80 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 flex flex-col justify-between min-h-[380px] transition-all">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="cefr" level={card.level} />
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wide">
              {card.pos}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AudioButton text={card.word} size="md" />
          </div>
        </div>

        {/* Card Body */}
        <div className="my-4">
          <div className="text-center space-y-1 mb-4">
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {card.word}
            </h3>
            <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
              {card.ipa}
            </p>
          </div>

          {!isFlipped ? (
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setIsFlipped(true)}
                className="w-full py-3.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer text-center flex items-center justify-center gap-2 group"
              >
                <span>Click to reveal definition & translations</span>
                <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                <span>Space key to flip</span>
                <span>•</span>
                <span>Natural audio included</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-left animate-in fade-in duration-200">
              {/* English Definition */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold mb-0.5">
                  Definition
                </p>
                <p className="text-xs font-normal text-slate-800 dark:text-slate-200 leading-relaxed">
                  {card.definition}
                </p>
              </div>

              {/* Dual Translations */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-400 font-bold block mb-0.5">🇷🇺 RU</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{card.ru}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs">
                  <span className="text-[10px] text-slate-400 font-bold block mb-0.5">🇺🇿 UZ</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{card.uz}</span>
                </div>
              </div>

              {/* Example sentence */}
              <div className="text-xs text-slate-600 dark:text-slate-400 italic px-1">
                &ldquo;{card.example}&rdquo;
              </div>
            </div>
          )}
        </div>

        {/* Card Footer / Rating Actions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {feedback ? (
            <div className="py-3 px-4 rounded-xl bg-blue-600 text-white text-center animate-in fade-in">
              <p className="text-xs font-semibold">{feedback.title} — Next in {feedback.interval}</p>
              <p className="text-[11px] text-blue-100">{feedback.subtitle}</p>
            </div>
          ) : isFlipped ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 dark:text-slate-500">
                <span>Evaluate your recall</span>
                <span>Keyboard: 1 • 2 • 3 • 4</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleRating('Again', '< 10 min')}
                  className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200/70 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 transition-colors text-center cursor-pointer"
                >
                  <span className="block font-bold">Again</span>
                  <span className="block text-[10px] opacity-75">&lt; 10m</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRating('Hard', '1 day')}
                  className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100 transition-colors text-center cursor-pointer"
                >
                  <span className="block font-bold">Hard</span>
                  <span className="block text-[10px] opacity-75">1 day</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRating('Good', '3 days')}
                  className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold hover:bg-blue-100 transition-colors text-center cursor-pointer"
                >
                  <span className="block font-bold">Good</span>
                  <span className="block text-[10px] opacity-75">3 days</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRating('Easy', '7 days')}
                  className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors text-center cursor-pointer"
                >
                  <span className="block font-bold">Easy</span>
                  <span className="block text-[10px] opacity-75">7 days</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <BookOpen size={13} className="text-slate-400" />
                Oxford 3000 & IELTS
              </span>
              <span className="text-[11px] font-mono text-slate-400">SM-2 Algorithm</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
