import React from 'react';
import Link from 'next/link';
import { Brain, Repeat, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="primary">THE SCIENCE OF LEARNING</Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          How WordFlow Rewires Your Vocabulary Memory
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          WordFlow was engineered to solve the number one frustration language learners face: forgetting words days after learning them.
        </p>
      </div>

      {/* SM-2 Deep Dive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            The SuperMemo SM-2 Algorithm
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            In 1987, Dr. Piotr Woźniak developed the SM-2 algorithm, analyzing how spacing intervals alter the rate of memory decay. Instead of linear schedules, SM-2 tracks individual ease factors for every single word.
          </p>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Easy words</strong> quickly jump from 1 day to 6 days to 15+ days.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Hard words</strong> trigger frequent intervals and lower ease factors until permanently stored.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Forgotten words (Again)</strong> reset the repetition counter to protect against memory lapses.</span>
            </li>
          </ul>
        </div>

        <Card className="p-6 space-y-4 border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/30 dark:bg-emerald-950/20">
          <div className="flex items-center space-x-3 text-emerald-800 dark:text-emerald-300 font-bold">
            <Brain size={24} />
            <h3 className="text-lg">Interval Progression Example</h3>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border flex justify-between items-center">
              <span className="font-semibold">Repetition 1 (Good)</span>
              <Badge variant="primary">Review in 1 Day</Badge>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border flex justify-between items-center">
              <span className="font-semibold">Repetition 2 (Good)</span>
              <Badge variant="primary">Review in 6 Days</Badge>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border flex justify-between items-center">
              <span className="font-semibold">Repetition 3 (Easy)</span>
              <Badge variant="success">Review in 16 Days</Badge>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border flex justify-between items-center">
              <span className="font-semibold">Repetition 4 (Mastered)</span>
              <Badge variant="purple">Review in 42 Days</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Multilingual Bridge */}
      <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Why Russian and Uzbek Translations?
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          In Central Asia and Eastern Europe, millions of bright students and software engineers are learning English for remote careers, international exams, and academic scholarships. By bridging English with precise Russian and Uzbek equivalents, WordFlow removes cognitive translation friction and builds clear conceptual anchors.
        </p>
      </div>

      {/* Call to action */}
      <div className="text-center space-y-4 pt-4">
        <Link href="/register">
          <Button size="lg" variant="primary">
            <span>Start Your Personalized Journey</span>
            <ArrowRight size={18} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
