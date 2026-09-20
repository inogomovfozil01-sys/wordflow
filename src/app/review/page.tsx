import React from 'react';
import { redirect } from 'next/navigation';
import { BrainCircuit } from 'lucide-react';
import { getCurrentSession } from '@/lib/auth';
import { getDueReviewWords } from '@/services/srs-service';
import { SrsReviewPlayer } from '@/components/srs-review-player';

export default async function ReviewPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect('/login?callbackUrl=/review');
  }

  const dueWords = await getDueReviewWords(session.userId, 30);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <BrainCircuit size={14} />
          <span>Spaced Repetition Review</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Scheduled Memory Recall
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          {dueWords.length > 0
            ? `You have ${dueWords.length} words scheduled for review right now.`
            : 'Your spaced repetition queue is clear!'}
        </p>
      </div>

      <SrsReviewPlayer initialWords={dueWords} />
    </div>
  );
}
