'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AudioButton } from '@/components/audio-button';
import { AiExplainModal } from '@/components/ai-explain-modal';
import { WordItem } from '@/types';

interface WordCardProps {
  word: WordItem;
  showActions?: boolean;
}

export function WordCard({ word, showActions = true }: WordCardProps) {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const ruTr = word.translations.find((t) => t.language === 'ru')?.translation;
  const uzTr = word.translations.find((t) => t.language === 'uz')?.translation;

  return (
    <>
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group">
        <div>
          {/* Header with badges and audio */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="cefr" level={word.cefrLevel} />
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {word.partOfSpeech}
              </span>
              {word.userWord && (
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    word.userWord.status === 'MASTERED'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : word.userWord.status === 'LEARNING'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {word.userWord.status}
                </span>
              )}
            </div>

            <AudioButton text={word.word} size="sm" />
          </div>

          {/* Word & IPA */}
          <div className="mb-2">
            <Link
              href={`/dictionary/${encodeURIComponent(word.word.toLowerCase())}`}
              className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            >
              {word.word}
            </Link>
            {word.ipa && (
              <span className="ml-2 font-mono text-xs text-slate-400">
                {word.ipa}
              </span>
            )}
          </div>

          {/* Bilingual Translations */}
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2 flex-wrap">
            {ruTr && (
              <span className="px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-800">
                🇷🇺 {ruTr}
              </span>
            )}
            {uzTr && (
              <span className="px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-800">
                🇺🇿 {uzTr}
              </span>
            )}
          </div>

          {/* English Definition */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
            {word.definitionEn}
          </p>

          {/* Graded Example Sentence */}
          {word.examples && word.examples.length > 0 && (
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 italic mb-4">
              &ldquo;{word.examples[0].sentenceEn}&rdquo;
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        {showActions && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="inline-flex items-center space-x-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 py-1 px-2 rounded hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
            >
              <Sparkles size={12} />
              <span>AI Explanation</span>
            </button>

            <Link
              href={`/dictionary/${encodeURIComponent(word.word.toLowerCase())}`}
              className="inline-flex items-center space-x-1 text-[11px] font-medium text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <span>Details</span>
              <ArrowRight size={11} />
            </Link>
          </div>
        )}
      </div>

      <AiExplainModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        word={word.word}
      />
    </>
  );
}
