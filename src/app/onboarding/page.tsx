'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Sparkles, ArrowRight, ArrowLeft, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/toast';

const LEVELS = [
  { level: 'A1', title: 'Beginner', desc: 'Starting from scratch, basic greetings and simple words.' },
  { level: 'A2', title: 'Elementary', desc: 'Familiar everyday phrases, shopping, family, routines.' },
  { level: 'B1', title: 'Intermediate', desc: 'Can express opinions, understand work and travel conversations.' },
  { level: 'B2', title: 'Upper Intermediate', desc: 'Fluent spontaneous talk, technical articles, and essays.' },
  { level: 'C1', title: 'Advanced', desc: 'Subtle nuances, idioms, high-level professional vocabulary.' },
  { level: 'C2', title: 'Proficiency', desc: 'Near-native fluency, literary and academic depth.' },
  { level: 'Not sure', title: 'Not sure', desc: 'We will calibrate your initial lessons starting at A2/B1.' },
];

const OBJECTIVES = [
  { title: 'Programming & Tech', icon: '💻', desc: 'Code architecture, documentation, pull requests' },
  { title: 'Work & Career', icon: '💼', desc: 'Professional emails, presentations, meetings' },
  { title: 'Everyday English', icon: '☀️', desc: 'Daily habits, friends, movies, casual chats' },
  { title: 'Travel & Living Abroad', icon: '✈️', desc: 'Airports, hotels, dining, navigation' },
  { title: 'IELTS Academic', icon: '🎓', desc: 'High-register vocabulary for band 7.5+' },
  { title: 'TOEFL Preparation', icon: '📚', desc: 'University lecture comprehension & writing' },
  { title: 'Conversation & Fluency', icon: '🗣️', desc: 'Overcoming speaking hesitation & natural flow' },
];

const TARGETS = [
  { count: 5, label: 'Casual', time: '5 mins/day', desc: 'Build steady habits without pressure' },
  { count: 10, label: 'Recommended', time: '10 mins/day', desc: 'Optimal sweet spot for long-term retention' },
  { count: 15, label: 'Serious', time: '15 mins/day', desc: 'Faster progress for upcoming interviews' },
  { count: 20, label: 'Intensive', time: '20 mins/day', desc: 'Rapid vocabulary expansion' },
  { count: 30, label: 'Immersion', time: '30 mins/day', desc: 'Maximum daily challenge' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { success: toastSuccess, error: toastError } = useToast();

  const [step, setStep] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState('B1');
  const [selectedGoal, setSelectedGoal] = useState('Programming & Tech');
  const [selectedTarget, setSelectedTarget] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cefrLevel: selectedLevel,
          learningGoal: selectedGoal,
          dailyTargetWords: selectedTarget,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toastError(data.error || 'Failed to save onboarding settings');
        return;
      }

      toastSuccess('Your learning curriculum is ready!');
      router.push('/dashboard');
      router.refresh();
    } catch {
      toastError('Network error saving onboarding settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
      {/* Step Header */}
      <div className="mb-8 space-y-3 text-center">
        <div className="flex items-center justify-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          <Sparkles size={14} />
          <span>Step {step} of 3</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {step === 1 && 'What is your current English level?'}
          {step === 2 && 'What is your primary learning goal?'}
          {step === 3 && 'Set your daily vocabulary target'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          {step === 1 && 'This helps WordFlow select words that are neither too easy nor overwhelming.'}
          {step === 2 && 'We will tailor your recommended lessons and AI tutor examples.'}
          {step === 3 && 'Consistency beats intensity. You can always change this later in Settings.'}
        </p>
        <Progress value={(step / 3) * 100} className="mt-4" />
      </div>

      {/* Step 1: CEFR Level */}
      {step === 1 && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {LEVELS.map((item) => {
            const isSelected = selectedLevel === item.level;
            return (
              <div
                key={item.level}
                onClick={() => setSelectedLevel(item.level)}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.level}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {isSelected && <Check size={14} />}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Step 2: Learning Goal */}
      {step === 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
          {OBJECTIVES.map((obj) => {
            const isSelected = selectedGoal === obj.title;
            return (
              <div
                key={obj.title}
                onClick={() => setSelectedGoal(obj.title)}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="text-2xl">{obj.icon}</div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{obj.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{obj.desc}</p>
                </div>

                <div className="pt-3 flex justify-end">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isSelected && <Check size={12} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Step 3: Daily Target */}
      {step === 3 && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {TARGETS.map((target) => {
            const isSelected = selectedTarget === target.count;
            return (
              <div
                key={target.count}
                onClick={() => setSelectedTarget(target.count)}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-base leading-none">{target.count}</span>
                    <span className="text-[10px] font-normal uppercase">words</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">{target.label}</h3>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {target.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{target.desc}</p>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {isSelected && <Check size={14} />}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        {step > 1 ? (
          <Button variant="ghost" size="md" onClick={() => setStep(step - 1)}>
            <ArrowLeft size={16} />
            <span>Back</span>
          </Button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <Button variant="primary" size="md" onClick={() => setStep(step + 1)}>
            <span>Continue</span>
            <ArrowRight size={16} />
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={handleFinish}
            isLoading={isSubmitting}
            className="font-bold px-6 shadow-lg shadow-emerald-600/20"
          >
            <span>Complete Onboarding</span>
            <ArrowRight size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}
