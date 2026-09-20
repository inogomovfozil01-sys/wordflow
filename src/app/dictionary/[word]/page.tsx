import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  Volume2,
  Bookmark,
  BookOpen,
  Share2,
  HelpCircle,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { getCurrentSession } from '@/lib/auth';
import { getWordDetail } from '@/services/vocab-service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AudioButton } from '@/components/audio-button';
import { WordDetailClientActions } from '@/components/word-detail-client-actions';

interface WordDetailPageProps {
  params: Promise<{
    word: string;
  }>;
}

export default async function WordDetailPage({ params }: WordDetailPageProps) {
  const { word: rawWord } = await params;
  const decodedWord = decodeURIComponent(rawWord);
  const session = await getCurrentSession();

  const word = await getWordDetail(decodedWord, session?.userId);

  if (!word) {
    notFound();
  }

  const ruTr = word.translations.find((t) => t.language === 'ru');
  const uzTr = word.translations.find((t) => t.language === 'uz');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href="/dictionary"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Dictionary</span>
        </Link>
      </div>

      {/* Main Word Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
              <Badge variant="cefr" level={word.cefrLevel} />
              <Badge variant="default" className="capitalize text-xs font-bold">
                {word.partOfSpeech}
              </Badge>
              {word.userWord && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Status: {word.userWord.status}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3 pt-1">
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {word.word}
              </h1>
              <AudioButton text={word.word} size="lg" />
            </div>

            {word.ipa && (
              <p className="font-mono text-base text-slate-500 dark:text-slate-400">
                {word.ipa}
              </p>
            )}
          </div>

          {/* Client Interactive Action buttons */}
          <WordDetailClientActions word={word} userId={session?.userId} />
        </div>

        {/* Translations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 space-y-1">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              🇷🇺 Russian Translation
            </span>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {ruTr?.translation || '—'}
            </p>
            {ruTr?.explanation && (
              <p className="text-xs text-slate-600 dark:text-slate-400">{ruTr.explanation}</p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/80 space-y-1">
            <span className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider">
              🇺🇿 Uzbek Translation
            </span>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {uzTr?.translation || '—'}
            </p>
            {uzTr?.explanation && (
              <p className="text-xs text-slate-600 dark:text-slate-400">{uzTr.explanation}</p>
            )}
          </div>
        </div>

        {/* English Definitions */}
        <div className="space-y-4 pt-2">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Standard English Definition
            </h3>
            <p className="text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {word.definitionEn}
            </p>
          </div>

          {word.definitionSimple && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Simplified Explanation
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {word.definitionSimple}
              </p>
            </div>
          )}
        </div>

        {/* Example Sentences */}
        {word.examples && word.examples.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Example Sentences in Context
            </h3>
            <div className="space-y-3">
              {word.examples.map((ex, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/30 dark:bg-slate-900/30"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-slate-900 dark:text-white text-base">
                      &quot;{ex.sentenceEn}&quot;
                    </p>
                    <AudioButton text={ex.sentenceEn} size="sm" />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                    {ex.sentenceRu && <p>🇷🇺 {ex.sentenceRu}</p>}
                    {ex.sentenceUz && <p>🇺🇿 {ex.sentenceUz}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Synonyms, Antonyms, Topics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {word.synonyms && word.synonyms.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Synonyms</h4>
              <div className="flex flex-wrap gap-1.5">
                {word.synonyms.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {word.antonyms && word.antonyms.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Antonyms</h4>
              <div className="flex flex-wrap gap-1.5">
                {word.antonyms.map((a, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-xs font-medium border border-rose-200 dark:border-rose-800"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
