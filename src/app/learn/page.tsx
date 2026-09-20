import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import { getLessonWords } from '@/services/learning-service';
import { getCollectionBySlug } from '@/services/collection-service';
import { LearningSessionPlayer } from '@/components/learning-session-player';
import { WordItem } from '@/types';

interface LearnPageProps {
  searchParams: Promise<{
    collection?: string;
  }>;
}

export default async function LearnPage({ searchParams }: LearnPageProps) {
  const resolvedParams = await searchParams;
  const session = await getCurrentSession();

  if (!session) {
    redirect('/login?callbackUrl=/learn');
  }

  let words: WordItem[] = [];
  let collectionTitle: string | undefined;

  if (resolvedParams.collection) {
    const col = await getCollectionBySlug(resolvedParams.collection, session.userId);
    if (col && col.words.length > 0) {
      words = col.words.slice(0, 5);
      collectionTitle = col.name;
    }
  }

  if (words.length === 0) {
    words = await getLessonWords(session.userId, 5);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <LearningSessionPlayer words={words} collectionTitle={collectionTitle} />
    </div>
  );
}
