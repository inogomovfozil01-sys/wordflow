import React from 'react';
import { getCurrentSession } from '@/lib/auth';
import { getPracticeSessionWords } from '@/services/learning-service';
import { PracticeEngine } from '@/components/practice-engine';

export default async function PracticePage() {
  const session = await getCurrentSession();
  const words = await getPracticeSessionWords(session?.userId || '', 'MULTIPLE_CHOICE', 15);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <PracticeEngine initialWords={words} />
    </div>
  );
}
