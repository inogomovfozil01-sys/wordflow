import React from 'react';
import Link from 'next/link';
import { Layers, Plus, BookOpen, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { getCurrentSession } from '@/lib/auth';
import { getCollections } from '@/services/collection-service';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreateCollectionModalButton } from '@/components/create-collection-modal-button';

export default async function CollectionsPage() {
  const session = await getCurrentSession();
  const collections = await getCollections(session?.userId);

  const officialCollections = collections.filter((c) => c.isOfficial);
  const customCollections = collections.filter((c) => !c.isOfficial);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <Layers size={16} />
            <span>Vocabulary Decks</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Word Collections & Decks
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl">
            Study curated themed packs or create your own custom decks tailored to your industry, exams, or projects.
          </p>
        </div>

        {session && <CreateCollectionModalButton />}
      </div>

      {/* Official Collections Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <ShieldCheck size={20} className="text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Official Curated Collections
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {officialCollections.map((col) => (
            <Link key={col.id} href={`/collections/${col.slug}`} className="block group">
              <Card hoverEffect className="p-6 h-full flex flex-col justify-between space-y-4 border-emerald-100 dark:border-emerald-950/80">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{col.icon}</span>
                    <Badge variant="primary" className="text-[10px]">
                      Official Pack
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {col.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {col.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span>{col.wordCount} words</span>
                  <span className="text-emerald-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Study deck <ArrowRight size={12} />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Custom User Collections Section */}
      <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <BookOpen size={20} className="text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Community & Custom Decks
          </h2>
        </div>

        {customCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customCollections.map((col) => (
              <Link key={col.id} href={`/collections/${col.slug}`} className="block group">
                <Card hoverEffect className="p-6 h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{col.icon}</span>
                      {col.isCreator && (
                        <Badge variant="success" className="text-[10px]">
                          Your Deck
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                      {col.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {col.description || 'Personal vocabulary collection'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>{col.wordCount} words</span>
                    <span className="text-emerald-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      View collection <ArrowRight size={12} />
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-10 text-center space-y-3">
            <p className="text-sm text-slate-500">
              You haven&apos;t created any custom collections yet.
            </p>
            {session && <CreateCollectionModalButton />}
          </Card>
        )}
      </div>
    </div>
  );
}
