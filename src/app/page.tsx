import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Brain,
  Zap,
  Repeat,
  Trophy,
  CheckCircle2,
  Globe,
  BookOpen,
  HelpCircle,
  Volume2,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getCurrentSession } from '@/lib/auth';
import { LandingFlashcardPreview } from '@/components/landing-flashcard-preview';

export default async function HomePage() {
  const session = await getCurrentSession();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-emerald-50/40 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Subtle decorative background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-300/10 dark:bg-emerald-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wide">
                <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400 animate-pulse" />
                <span>SUPERMEMO SM-2 ALGORITHM + GEMINI 3.8 FLASH</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                Learn English words that{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                  actually stay with you.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Stop memorizing and forgetting lists. WordFlow pairs peer-reviewed spaced repetition with an intelligent AI tutor, native audio, and dual Russian/Uzbek translations.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link href={session ? '/dashboard' : '/register'} className="w-full sm:w-auto">
                  <Button size="lg" variant="primary" className="w-full sm:w-auto font-bold text-base shadow-lg shadow-emerald-600/20">
                    <span>{session ? 'Go to Dashboard' : 'Start Learning Free'}</span>
                    <ArrowRight size={18} />
                  </Button>
                </Link>

                <Link href="/dictionary" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto font-medium text-base">
                    <span>Explore Vocabulary</span>
                  </Button>
                </Link>
              </div>

              {/* Trust signals */}
              <div className="pt-4 flex items-center justify-center lg:justify-start space-x-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>A1 to C2 CEFR Paths</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Native Pronunciation</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Zero Ads</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Flashcard Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <LandingFlashcardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Why Spaced Repetition Works (The Science) */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <Badge variant="primary">THE COGNITIVE SCIENCE</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Why Traditional Cramming Fails
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
              According to Hermann Ebbinghaus’s Forgetting Curve, learners forget 70% of new vocabulary within 48 hours without scheduled active recall.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hoverEffect className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Repeat size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                1. The Forgetting Curve
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Passive re-reading tricks your brain into a false sense of mastery. Real retention requires reviewing right before memory decay occurs.
              </p>
            </Card>

            <Card hoverEffect className="space-y-4 border-emerald-300 dark:border-emerald-800 shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Brain size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                2. SM-2 Algorithm
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                WordFlow dynamically adjusts ease factors and intervals based on your answers: Again (1d), Hard (3d), Good (6d), Easy (15d+).
              </p>
            </Card>

            <Card hoverEffect className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                3. Long-Term Mastery
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Studying just 10 minutes a day moves words from short-term memory to automatic, fluent long-term recall for interviews and conversations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. AI Tutor Powered by Gemini */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <Badge variant="purple">INTELLIGENT PEDAGOGY</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                An AI Tutor that understands your exact level.
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Confused by nuances like <em>&quot;say vs tell&quot;</em> or <em>&quot;meticulous vs pragmatic&quot;</em>? The built-in WordFlow AI Tutor breaks down grammar, invents memorable mnemonics, and generates level-appropriate exercises.
              </p>

              <div className="space-y-3.5">
                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">Customized Mnemonics</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Creates vivid associative imagery to remember complex vocabulary instantly.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">Common Pitfalls & False Friends</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Highlights typical mistakes Russian and Uzbek speakers make with English prepositions.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">Instant Mini-Quizzes</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Tests retention on the fly before you finish reviewing.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/ai-tutor">
                  <Button variant="secondary" size="md">
                    <Sparkles size={16} />
                    <span>Try AI Tutor Demo</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mock Chat UI */}
            <div className="lg:col-span-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                <div className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    ✨
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">WordFlow AI Tutor</h4>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Ready • CEFR Level Aware</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  {/* User query */}
                  <div className="flex justify-end">
                    <div className="bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-xs max-w-xs shadow-sm">
                      What is the difference between &quot;say&quot; and &quot;tell&quot;?
                    </div>
                  </div>

                  {/* AI response */}
                  <div className="flex justify-start">
                    <div className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 p-3.5 rounded-2xl rounded-tl-xs max-w-sm space-y-2">
                      <p className="font-semibold text-slate-900 dark:text-white">Here is the key rule:</p>
                      <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                        <li><strong>Tell</strong> requires a personal object: <em>&quot;Tell <u>me</u> the story.&quot;</em></li>
                        <li><strong>Say</strong> does not need an object: <em>&quot;She <u>said</u> hello.&quot;</em></li>
                      </ul>
                      <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-emerald-800 dark:text-emerald-200 text-[11px]">
                        💡 <strong>Memory trick:</strong> You <em>tell someone</em>, but you <em>say something</em>!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Ten Practice Modes */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <Badge variant="success">PRACTICE VARIETY</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              10 Practice Modes to Test Every Angle
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
              Don’t just flip cards. Train spelling, listening comprehension, speed, and contextual recall.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { title: 'Multiple Choice', desc: '4 options, instant recall', icon: '🔘' },
              { title: 'Type Translation', desc: 'Active Russian/Uzbek recall', icon: '⌨️' },
              { title: 'Type English', desc: 'Accurate spelling drill', icon: '🔤' },
              { title: 'Listening Audio', desc: 'Ear training with speech', icon: '🎧' },
              { title: 'Match Pairs', desc: 'Fast synaptic associations', icon: '🧩' },
              { title: 'Fill in Blank', desc: 'Real sentence contexts', icon: '📝' },
              { title: 'Sentence Translation', desc: 'Full conversational nuance', icon: '💬' },
              { title: 'Speed Round', desc: 'Beat the 60-second clock', icon: '⚡' },
              { title: 'Difficult Words', desc: 'Target your highest lapses', icon: '🎯' },
              { title: 'Random Challenge', desc: 'Surprise multi-mode mix', icon: '🎲' },
            ].map((mode, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 hover:border-emerald-400 hover:bg-emerald-50/20 transition-all text-center space-y-2 group"
              >
                <div className="text-3xl group-hover:scale-110 transition-transform">{mode.icon}</div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{mode.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{mode.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Testimonials */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <Badge variant="primary">REAL SUCCESS STORIES</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Loved by Engineers, Students & Travelers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  'I passed my FAANG technical interview in English thanks to WordFlow. Practicing terminology like "algorithm" and "paradigm" with spaced repetition made me speak with total confidence.',
                author: 'Timur S.',
                role: 'Senior Software Engineer (Tashkent)',
                rating: 5,
              },
              {
                quote:
                  'Having both Russian and Uzbek translations alongside simple English definitions is a game changer. I finally scored 8.0 on my IELTS Academic exam!',
                author: 'Elena K.',
                role: 'IELTS Student (Almaty)',
                rating: 5,
              },
              {
                quote:
                  'The AI tutor explaining why my preposition was wrong saved me hours of confusing dictionary lookups. The 10 practice modes keep my daily streak alive effortlessly.',
                author: 'Dilshod M.',
                role: 'Product Designer (Berlin)',
                rating: 5,
              },
            ].map((t, idx) => (
              <Card key={idx} hoverEffect className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    &quot;{t.quote}&quot;
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="font-bold text-sm text-slate-900 dark:text-white">{t.author}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <Badge variant="default">COMMON QUESTIONS</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What makes WordFlow different from generic flashcard apps?',
                a: 'WordFlow uses the scientifically proven SuperMemo SM-2 algorithm to schedule individual words exactly when your brain is about to forget them. Plus, it includes CEFR-leveled definitions, audio pronunciation, dual Russian and Uzbek translations, and a server-side Gemini 3.8 Flash AI Tutor.',
              },
              {
                q: 'How much time do I need each day?',
                a: 'Only 5 to 10 minutes per day! Spaced repetition is designed for micro-learning sessions. Consistent daily review of 10-15 words yields faster long-term fluency than cramming for 2 hours once a week.',
              },
              {
                q: 'Can I learn specific vocabulary for programming or business?',
                a: 'Yes! WordFlow has official curated collections including "English for Programmers", "Business & Workplace English", and "100 Essential Words". You can also create and study custom decks.',
              },
              {
                q: 'Is my learning progress saved in a real database?',
                a: 'Yes. All your study sessions, XP, review intervals, lapses, and streaks are securely persisted in a PostgreSQL database with encrypted session authentication.',
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2"
              >
                <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <HelpCircle size={18} className="text-emerald-600 shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 pl-6 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="py-20 bg-gradient-to-tr from-emerald-700 via-teal-700 to-emerald-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Start expanding your English vocabulary today.
          </h2>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            Join language learners mastering English with genuine long-term memory science and intelligent AI guidance.
          </p>
          <div className="pt-4 flex justify-center">
            <Link href={session ? '/dashboard' : '/register'}>
              <Button size="lg" className="bg-white text-emerald-800 hover:bg-slate-100 font-bold text-base px-8 shadow-xl">
                <span>{session ? 'Return to Dashboard' : 'Create Free Account'}</span>
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
