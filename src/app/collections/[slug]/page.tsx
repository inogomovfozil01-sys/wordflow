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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <Link
          href="/collections"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Collections</span>
        </Link>
      </div>

      {/* Collection Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{collection.icon}</span>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {collection.name}
                </h1>
                {collection.isOfficial && <Badge variant="primary">Official</Badge>}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {collection.words.length} vocabulary {collection.words.length === 1 ? 'word' : 'words'}
              </p>
            </div>
          </div>
          {collection.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              {collection.description}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-3 flex-wrap gap-y-2">
          <Link href={`/learn?collection=${collection.slug}`}>
            <Button variant="primary" size="md">
              <Play size={16} />
              <span>Study Deck</span>
            </Button>
          </Link>
          <Link href={`/practice?collection=${collection.slug}`}>
            <Button variant="outline" size="md">
              <BookOpen size={16} />
              <span>Practice</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Words Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Words in this Deck ({collection.words.length})
        </h2>

        {collection.words.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collection.words.map((w) => (
              <WordCard key={w.id} word={w} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border border-dashed rounded-3xl bg-slate-50 dark:bg-slate-900/50">
            <p className="text-sm text-slate-500">No words in this collection yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
