import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Play, Sparkles, BookOpen } from 'lucide-react';
import { getCurrentSession } from '@/lib/auth';
import { getCollectionBySlug } from '@/services/collection-service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WordCard } from '@/components/word-card';

interface CollectionDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CollectionDetailPage({ params }: CollectionDetailPageProps) {
  const { slug } = await params;
  const session = await getCurrentSession();

  const collection = await getCollectionBySlug(slug, session?.userId);

  if (!collection) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 bg-[var(--bg-app)]">
      <div>
        <Link
          href="/collections"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Collections</span>
        </Link>
      </div>

      {/* Collection Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {collection.name}
            </h1>
            {collection.isOfficial && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900">
                Official
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {collection.words.length} vocabulary {collection.words.length === 1 ? 'word' : 'words'} scheduled in this pack
          </p>
          {collection.description && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
              {collection.description}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link href={`/learn?collection=${collection.slug}`}>
            <Button variant="primary" size="md">
              <Play size={14} className="fill-current" />
              <span>Study Deck</span>
            </Button>
          </Link>
          <Link href={`/practice?collection=${collection.slug}`}>
            <Button variant="outline" size="md">
              <BookOpen size={14} />
              <span>Practice</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Words Grid */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Words in this Deck ({collection.words.length})
          </h2>
        </div>

        {collection.words.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collection.words.map((w) => (
              <WordCard key={w.id} word={w} />
            ))}
          </div>
        ) : (
          <div className="p-10 text-center border border-dashed rounded-2xl bg-slate-50/50 dark:bg-slate-900/40">
            <p className="text-xs text-slate-500">No words found in this collection yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
