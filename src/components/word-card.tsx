'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Bookmark, Check, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group">
        <div>
          {/* Header with badges and audio */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <Badge variant="cefr" level={word.cefrLevel} />
              <Badge variant="default" className="capitalize text-[11px]">
                {word.partOfSpeech}
              </Badge>
              {word.userWord && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
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
              className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
            >
              {word.word}
            </Link>
            {word.ipa && (
              <span className="ml-2 font-mono text-xs text-slate-500 dark:text-slate-400">
                {word.ipa}
              </span>
            )}
          </div>

          {/* Translations */}
          <div className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2 flex-wrap">
            {ruTr && <span>🇷🇺 {ruTr}</span>}
            {uzTr && <span className="text-slate-400">•</span>}
            {uzTr && <span>🇺🇿 {uzTr}</span>}
          </div>

          {/* Definition */}
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
            {word.definitionEn}
          </p>

          {/* First example */}
          {word.examples && word.examples.length > 0 && (
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 italic mb-4">
              &quot;{word.examples[0].sentenceEn}&quot;
            </div>
          )}
        </div>

        {/* Action buttons */}
        {showActions && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 py-1.5 px-2.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
            >
              <Sparkles size={13} />
              <span>Explain with AI</span>
            </button>

            <Link
              href={`/dictionary/${encodeURIComponent(word.word.toLowerCase())}`}
              className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 py-1.5 px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span>Details</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </div>

      <AiExplainModal
        word={word.word}
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </>
  );
}
