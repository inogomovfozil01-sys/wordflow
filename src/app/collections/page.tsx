import React from 'react';
import Link from 'next/link';
import { Layers, Plus, BookOpen, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { getCurrentSession } from '@/lib/auth';
import { getCollections } from '@/services/collection-service';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreateCollectionModalButton } from '@/components/create-collection-modal-button';

export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
  const session = await getCurrentSession();
  const collections = await getCollections(session?.userId);

  const officialCollections = collections.filter((c) => c.isOfficial);
  const customCollections = collections.filter((c) => !c.isOfficial);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10 bg-[var(--bg-app)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <Layers size={14} />
            <span>Curated Decks</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Vocabulary Collections
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
            Study curated themed packs or create your own custom decks tailored to your field, technical exams, or career goals.
          </p>
        </div>

        {session && <CreateCollectionModalButton />}
      </div>

      {/* Official Collections Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-slate-900 dark:text-white">
          <ShieldCheck size={18} className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-bold">
            Official Curated Collections
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {officialCollections.map((col) => (
            <Link key={col.id} href={`/collections/${col.slug}`} className="block group">
              <Card hoverEffect className="p-5 h-full flex flex-col justify-between space-y-3 border-slate-200/90 dark:border-slate-800">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Official</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900">
                      Curated
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {col.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {col.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>{col.wordCount} words</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>Study Deck</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Custom User Collections Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center space-x-2 text-slate-900 dark:text-white">
          <BookOpen size={18} className="text-slate-700 dark:text-slate-300" />
          <h2 className="text-lg font-bold">
            Custom & Community Decks
          </h2>
        </div>

        {customCollections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {customCollections.map((col) => (
              <Link key={col.id} href={`/collections/${col.slug}`} className="block group">
                <Card hoverEffect className="p-5 h-full flex flex-col justify-between space-y-3 border-slate-200/90 dark:border-slate-800">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400">Custom</span>
                      {col.isCreator && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60">
                          Your Deck
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {col.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {col.description || 'Custom learner collection.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-500">
                    <span>{col.wordCount} words</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      <span>View Deck</span>
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
            <p className="text-xs text-slate-500">You haven&apos;t created any custom collections yet.</p>
            {session && <CreateCollectionModalButton />}
          </div>
        )}
      </div>
    </div>
  );
}
