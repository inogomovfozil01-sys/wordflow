import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Brain,
  Zap,
  Repeat,
  Trophy,
  CheckCircle2,
  Globe,
  BookOpen,
  Volume2,
  ShieldCheck,
  Star,
  Layers,
  Sparkles,
  BarChart3,
  Check,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getCurrentSession } from '@/lib/auth';
import { LandingFlashcardPreview } from '@/components/landing-flashcard-preview';

export default async function HomePage() {
  const session = await getCurrentSession();

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-app)]">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                <span>SuperMemo SM-2 Spaced Repetition + Gemini 3.8 Flash AI</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                Master 5,000+ English words with{' '}
                <span className="text-blue-600 dark:text-blue-400">
                  cognitive science
                </span>
                , not cramming.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                WordFlow transforms passive vocabulary lists into permanent, active recall. Powered by peer-reviewed spaced repetition algorithms, natural audio, bilingual translations in Russian and Uzbek, and personalized AI tutoring.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link href={session ? '/dashboard' : '/register'} className="w-full sm:w-auto">
                  <Button size="lg" variant="primary" className="w-full sm:w-auto font-semibold text-base shadow-sm">
                    <span>{session ? 'Go to Learning Command Center' : 'Start Learning Free'}</span>
                    <ArrowRight size={16} />
                  </Button>
                </Link>

                <Link href="/dictionary" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto font-medium text-base">
                    <span>Explore Dictionary</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 size={15} className="text-blue-600 dark:text-blue-400" />
                  <span>CEFR A1 through C2</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 size={15} className="text-blue-600 dark:text-blue-400" />
                  <span>Dual RU & UZ Translations</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 size={15} className="text-blue-600 dark:text-blue-400" />
                  <span>Verified IPA Phonetics</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 size={15} className="text-blue-600 dark:text-blue-400" />
                  <span>Zero Advertisements</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <LandingFlashcardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Value Pillars (Product Proof Horizontal Row) */}
      <section className="py-14 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Brain size={20} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Spaced Repetition
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Adaptive SM-2 scheduling tests vocabulary immediately prior to memory decay, optimizing review intervals from minutes to months.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
                <Layers size={20} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Contextual Immersion
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Every word includes graded example sentences, high-frequency collocations, part-of-speech markers, and phonetic transcriptions.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
                <Sparkles size={20} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Conversational AI Tutor
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Integrated Gemini 3.8 Flash answers nuanced language questions, creates vivid mnemonics, and clarifies common speaker pitfalls.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
                <BarChart3 size={20} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Empirical Analytics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Track retention curves, daily consistency streaks, CEFR distribution milestones, and words requiring extra review focus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 3-Step Pedagogy */}
      <section className="py-20 bg-[var(--bg-app)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16 space-y-3">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Systematic Learning Architecture
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              How WordFlow guarantees permanent retention
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Traditional language learning relies on brute-force memorization. WordFlow follows the cognitive stages of lexical acquisition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-blue-600 dark:text-blue-400">01</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Acquire & Map
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Multi-Sensory Encoding
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Learn definitions alongside phonetic IPA pronunciation, native audio playback, and dual Russian/Uzbek translations. Building cross-lingual associations creates stronger synaptic pathways.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
                Word → Audio → Definition → Ru/Uz Context
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-blue-600 dark:text-blue-400">02</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Active Recall
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Varied Context Practice
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Passive recognition does not transfer to active speaking. Test yourself across 10 specialized practice modalities: cloze sentences, spelling drills, listening dictation, and speed recall.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
                Cloze Context + Audio + Active Spelling
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-blue-600 dark:text-blue-400">03</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Consolidation
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                SuperMemo SM-2 Intervals
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                WordFlow calculates personalized Ease Factors and review schedules. Words move progressively from short-term memory to permanent storage over intervals of 1, 3, 7, 18, and 45 days.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
                Interval: 1d → 3d → 7d → 18d → 45d+
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Visual SM-2 Interval Timeline */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14 space-y-2">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Mathematical Precision
            </span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              The SuperMemo SM-2 Interval Timeline
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Each successful recall doubles the memory half-life. You spend study time only on words at risk of being forgotten.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Repetition 1</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white">Today</div>
              <p className="text-[11px] text-slate-500 mt-1">Acquisition & Initial Rating</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Repetition 2</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white">1 Day</div>
              <p className="text-[11px] text-slate-500 mt-1">Next Day First Review</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Repetition 3</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white">3 Days</div>
              <p className="text-[11px] text-slate-500 mt-1">Short-term consolidation</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Repetition 4</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white">7 Days</div>
              <p className="text-[11px] text-slate-500 mt-1">One-week interval anchor</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Repetition 5</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white">18 Days</div>
              <p className="text-[11px] text-slate-500 mt-1">Intermediate stability</p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800">
              <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block mb-1">Repetition 6+</span>
              <div className="text-lg font-bold text-blue-700 dark:text-blue-300">45+ Days</div>
              <p className="text-[11px] text-blue-600/80 dark:text-blue-400/80 mt-1">Permanent Lexicon</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Realistic AI Tutor Interaction Preview */}
      <section className="py-20 bg-[var(--bg-app)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
                <span>Gemini 3.8 Flash Engine</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                An intelligent language tutor that corrects nuance in real time.
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                Stuck on subtle differences like <em>pragmatic vs practical</em>, or why a preposition sounds unnatural? The WordFlow AI Tutor analyzes your input, points out linguistic interference from Russian and Uzbek, and creates memorable conceptual anchors.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={13} />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong>Collocation Verification:</strong> Learn which words natively combine (e.g. <em>take a decision</em> vs <em>make a decision</em>).
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={13} />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong>CEFR Level Alignment:</strong> Explanations adjust seamlessly whether you are at A2 or polishing C1 academic vocabulary.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={13} />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong>Tailored Mnemonics:</strong> Generates vivid associative memory devices tailored to bilingual speakers.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/ai-tutor">
                  <Button variant="secondary" size="md">
                    <MessageSquare size={15} />
                    <span>Open AI Tutor Workspace</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mocked High-Fidelity AI Chat Dialog */}
            <div className="lg:col-span-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      WF
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-slate-900 dark:text-white">WordFlow Senior Tutor</h4>
                      <p className="text-[10px] text-slate-400">Contextual Grammar & Lexicon</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">CEFR B2-C1</Badge>
                </div>

                <div className="space-y-3 text-xs">
                  {/* User question */}
                  <div className="flex justify-end">
                    <div className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-xl rounded-tr-xs max-w-sm">
                      Can I say &quot;I did a big mistake on my code review&quot;?
                    </div>
                  </div>

                  {/* AI Tutor analysis */}
                  <div className="flex justify-start">
                    <div className="bg-blue-50/70 dark:bg-slate-800/90 border border-blue-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 p-3.5 rounded-xl rounded-tl-xs max-w-md space-y-2">
                      <p className="font-semibold text-slate-900 dark:text-white text-xs">
                        Correction & Collocation Analysis:
                      </p>
                      <p className="leading-relaxed">
                        Instead of <em>&quot;did a mistake&quot;</em>, the correct natural collocation is <strong>&quot;made a mistake&quot;</strong>. Furthermore, in professional contexts, <em>&quot;serious error&quot;</em> or <em>&quot;critical oversight&quot;</em> sounds more precise than <em>&quot;big mistake&quot;</em>.
                      </p>
                      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700 space-y-1">
                        <p className="text-[11px] font-medium text-blue-700 dark:text-blue-300">
                          ✓ Improved: &quot;I made a critical oversight during the pull request review.&quot;
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          🇷🇺 В русском говорят &laquo;сделать ошибку&raquo;, но в английском глагол — <strong>make</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Ten Practice Modalities */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14 space-y-2">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Comprehensive Practice Engine
            </span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              10 Adaptive Practice Modes
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Strengthen vocabulary through diverse mental retrieval routes: listening comprehension, spelling, context completion, and speed.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {[
              { title: 'Multiple Choice', desc: 'Fast recognition & distinction' },
              { title: 'Type Spelling', desc: 'Exact orthographic retrieval' },
              { title: 'Type Translation', desc: 'Active production in target language' },
              { title: 'Listening Dictation', desc: 'Phonetic ear training from audio' },
              { title: 'Match Pairs', desc: 'Rapid synaptic connection drill' },
              { title: 'Fill in Blank', desc: 'Cloze sentence context mastery' },
              { title: 'Sentence Translation', desc: 'Full conversational grammar structure' },
              { title: 'Speed Round', desc: '60-second automatic recall blitz' },
              { title: 'Difficult Words', desc: 'Target low-ease-factor lapses' },
              { title: 'Random Mix', desc: 'Cognitive interleaving challenge' },
            ].map((mode, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 space-y-1.5 transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="text-xs font-mono text-slate-400">0{i + 1}</div>
                <h4 className="font-semibold text-xs text-slate-900 dark:text-white">{mode.title}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{mode.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/practice">
              <Button variant="outline" size="md">
                <span>Explore Practice Engine</span>
                <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Final Minimalist Call to Action */}
      <section className="py-20 bg-slate-900 text-white text-center border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Build your English vocabulary with permanent retention.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join software engineers, students, and professionals mastering vocabulary systematically. Zero ads, mathematically optimized spaced repetition.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href={session ? '/dashboard' : '/register'} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-white text-slate-900 hover:bg-slate-100 font-semibold text-sm px-6">
                <span>{session ? 'Go to Dashboard' : 'Create Free Account'}</span>
                <ArrowRight size={15} />
              </Button>
            </Link>
            <Link href="/dictionary" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-700 text-white hover:bg-slate-800 text-sm">
                <span>Browse Lexicon</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
