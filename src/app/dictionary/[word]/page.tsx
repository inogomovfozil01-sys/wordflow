import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  Volume2,
  BookOpen,
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 bg-[var(--bg-app)]">
      {/* Back Link */}
      <div>
        <Link
          href="/dictionary"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Dictionary</span>
        </Link>
      </div>

      {/* Main Word Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200/90 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <Badge variant="cefr" level={word.cefrLevel} />
              <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {word.partOfSpeech}
              </span>
              {word.userWord && (
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                  Status: {word.userWord.status}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3 pt-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                {word.word}
              </h1>
              <AudioButton text={word.word} size="md" />
            </div>

            {word.ipa && (
              <p className="font-mono text-sm text-slate-400">
                {word.ipa}
              </p>
            )}
          </div>

          {/* Client Interactive Action buttons */}
          <WordDetailClientActions word={word} userId={session?.userId} />
        </div>

        {/* Translations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              🇷🇺 Russian Translation
            </span>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {ruTr?.translation || '—'}
            </p>
            {ruTr?.explanation && (
              <p className="text-xs text-slate-500">{ruTr.explanation}</p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              🇺🇿 Uzbek Translation
            </span>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {uzTr?.translation || '—'}
            </p>
            {uzTr?.explanation && (
              <p className="text-xs text-slate-500">{uzTr.explanation}</p>
            )}
          </div>
        </div>

        {/* English Definition */}
        <div className="space-y-1.5 pt-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            English Definition
          </h3>
          <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            {word.definitionEn}
          </p>
          {word.definitionSimple && (
            <p className="text-xs text-slate-500 italic">
              Simplified: {word.definitionSimple}
            </p>
          )}
        </div>

        {/* Synonyms & Antonyms */}
        {((word.synonyms && word.synonyms.length > 0) || (word.antonyms && word.antonyms.length > 0)) && (
          <div className="space-y-3 pt-2">
            {word.synonyms && word.synonyms.length > 0 && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Synonyms
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {word.synonyms.map((syn, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {syn}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {word.antonyms && word.antonyms.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Antonyms
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {word.antonyms.map((ant, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {ant}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Example Sentences */}
        {word.examples && word.examples.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Graded Context Examples
            </h3>
            <div className="space-y-2">
              {word.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1"
                >
                  <p className="text-slate-900 dark:text-white font-medium italic">
                    &ldquo;{ex.sentenceEn}&rdquo;
                  </p>
                  {ex.sentenceRu && (
                    <p className="text-slate-500">🇷🇺 {ex.sentenceRu}</p>
                  )}
                  {ex.sentenceUz && (
                    <p className="text-slate-500">🇺🇿 {ex.sentenceUz}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
