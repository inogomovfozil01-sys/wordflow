import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth';
import prisma from '@/lib/db';
import { AiTutorChat } from '@/components/ai-tutor-chat';
import { Sparkles, Bot, Compass, Award, ShieldCheck, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CefrLevel } from '@/types';

export const metadata: Metadata = {
  title: 'AI English Tutor | WordFlow',
  description: 'Practice English conversation, ask grammar questions, and get instant level-calibrated feedback powered by Google Gemini.',
};

export default async function AiTutorPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect('/login?from=/ai-tutor');
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: { userId: session.userId },
    select: { cefrLevel: true },
  });

  const userLevel = (userSettings?.cefrLevel as CefrLevel) || 'B1';

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
                <Bot className="w-6 h-6" />
              </span>
              <Badge variant="primary">Powered by Gemini 3.8 Flash</Badge>
              <Badge variant="outline" className="font-semibold uppercase tracking-wider">
                Target: {userLevel}
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              AI English Tutor
            </h1>
            <p className="mt-1 text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
              Personalized vocabulary coaching, grammar disambiguation, and conversational practice.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex items-center gap-3 text-xs sm:text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-neutral-600 dark:text-neutral-400">Model ready</span>
              <span className="text-neutral-300 dark:text-neutral-700">|</span>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">Adaptive Feedback</span>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Tutor Capabilities & Tips */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
              <h3 className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-primary-600" />
                What can you ask?
              </h3>
              <ul className="mt-3 space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400">
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 font-bold">•</span>
                  <span><strong>Nuance:</strong> "What is the subtle difference between <em>comprise</em> and <em>compose</em>?"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 font-bold">•</span>
                  <span><strong>Mnemonics:</strong> "Help me memorize <em>tenacious</em> with a fun story or visual."</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 font-bold">•</span>
                  <span><strong>Context:</strong> "How do native speakers use <em>leverage</em> in business meetings?"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 font-bold">•</span>
                  <span><strong>Quizzes:</strong> "Give me a quick 3-question fill-in-the-blank test for B2 words."</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-indigo-50/50 dark:from-primary-950/20 dark:to-indigo-950/20 p-5 rounded-2xl border border-primary-100 dark:border-primary-900/40 text-xs text-neutral-700 dark:text-neutral-300 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-primary-700 dark:text-primary-300">
                <Zap className="w-4 h-4" />
                <span>Active CEFR Adaptation</span>
              </div>
              <p>
                The tutor automatically explains words using grammar and vocabulary appropriate for your <strong>{userLevel}</strong> level. You can change your level anytime in Settings.
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Dual Translation
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                You can ask questions or request explanations in <strong>Russian</strong> or <strong>Uzbek</strong> if you get stuck on difficult concepts.
              </p>
            </div>
          </div>

          {/* Right Column: Chat Interface */}
          <div className="lg:col-span-3">
            <AiTutorChat userLevel={userLevel} />
          </div>
        </div>
      </div>
    </div>
  );
}
