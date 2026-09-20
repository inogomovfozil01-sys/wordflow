import React from 'react';
import Link from 'next/link';
import { Search, Filter, BookOpen, Layers } from 'lucide-react';
import { getCurrentSession } from '@/lib/auth';
import { searchWords, getAllTopics } from '@/services/vocab-service';
import { WordCard } from '@/components/word-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CefrLevel } from '@/types';

interface DictionaryPageProps {
  searchParams: Promise<{
    q?: string;
    level?: string;
    topic?: string;
    pos?: string;
    page?: string;
  }>;
}

const CEFR_LEVELS = ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const POS_LIST = ['ALL', 'noun', 'verb', 'adjective', 'adverb'];

export const dynamic = 'force-dynamic';

export default async function DictionaryPage({ searchParams }: DictionaryPageProps) {
  const resolvedParams = await searchParams;
  const session = await getCurrentSession();

  const query = resolvedParams.q || '';
  const level = (resolvedParams.level || 'ALL') as CefrLevel | 'ALL';
  const topic = resolvedParams.topic || 'ALL';
  const pos = resolvedParams.pos || 'ALL';
  const page = parseInt(resolvedParams.page || '1', 10);

  const [topics, result] = await Promise.all([
    getAllTopics(),
    searchWords({
      query,
      cefr: level,
      topic,
      partOfSpeech: pos,
      page,
      limit: 12,
      userId: session?.userId,
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          <Layers size={16} />
          <span>Curated Lexicon</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          English Vocabulary Dictionary
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl">
          Search thousands of verified words with native IPA phonetics, Russian & Uzbek translations, contextual examples, and Gemini AI breakdowns.
        </p>
      </div>

      {/* Search & Filter Form */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6">
        {/* Search Bar */}
        <form method="GET" action="/dictionary" className="relative flex items-center">
          <Search size={20} className="absolute left-4 text-slate-400" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search English word, translation, or definition (e.g. algorithm, путешествие, bardoshli)..."
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
          />
          {level !== 'ALL' && <input type="hidden" name="level" value={level} />}
          {topic !== 'ALL' && <input type="hidden" name="topic" value={topic} />}
          {pos !== 'ALL' && <input type="hidden" name="pos" value={pos} />}
          <Button type="submit" size="sm" variant="primary" className="absolute right-2.5">
            Search
          </Button>
        </form>

        {/* Filters */}
        <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* CEFR Level pills */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
              CEFR Level:
            </span>
            {CEFR_LEVELS.map((lvl) => {
              const isSelected = level === lvl;
              const href = `/dictionary?q=${encodeURIComponent(query)}&level=${lvl}&topic=${topic}&pos=${pos}`;
              return (
                <Link
                  key={lvl}
                  href={href}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {lvl}
                </Link>
              );
            })}
          </div>

          {/* Topic & Part of Speech dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Topic Select */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Topic:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <Link
                  href={`/dictionary?q=${encodeURIComponent(query)}&level=${level}&topic=ALL&pos=${pos}`}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                    topic === 'ALL'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  All Topics
                </Link>
                {topics.map((t) => {
                  const isSelected = topic === t.slug;
                  return (
                    <Link
                      key={t.id}
                      href={`/dictionary?q=${encodeURIComponent(query)}&level=${level}&topic=${t.slug}&pos=${pos}`}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {t.icon} {t.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <p>
          Found <strong>{result.total}</strong> {result.total === 1 ? 'word' : 'words'}
          {query && <span> matching &quot;{query}&quot;</span>}
        </p>
        <p>
          Page {result.page} of {Math.max(1, result.totalPages)}
        </p>
      </div>

      {/* Word Cards Grid */}
      {result.words.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.words.map((w) => (
            <WordCard key={w.id} word={w} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <BookOpen size={36} className="mx-auto text-slate-400" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">No words found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, or clear active filters to explore more vocabulary.
          </p>
          <Link href="/dictionary">
            <Button variant="outline" size="sm">
              Clear All Filters
            </Button>
          </Link>
        </div>
      )}

      {/* Pagination Controls */}
      {result.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          {result.page > 1 && (
            <Link
              href={`/dictionary?q=${encodeURIComponent(query)}&level=${level}&topic=${topic}&pos=${pos}&page=${result.page - 1}`}
            >
              <Button variant="outline" size="sm">
                Previous Page
              </Button>
            </Link>
          )}

          <span className="px-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
            {result.page} / {result.totalPages}
          </span>

          {result.page < result.totalPages && (
            <Link
              href={`/dictionary?q=${encodeURIComponent(query)}&level=${level}&topic=${topic}&pos=${pos}&page=${result.page + 1}`}
            >
              <Button variant="outline" size="sm">
                Next Page
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
