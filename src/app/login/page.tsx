'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, ArrowRight, CheckCircle2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';

export default function LoginPage() {
  const router = useRouter();
  const { error: toastError, success: toastSuccess } = useToast();

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to sign in');
        toastError(data.error || 'Invalid credentials');
        return;
      }

      toastSuccess('Welcome back to WordFlow');
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('An unexpected network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (username: string, pass: string) => {
    setEmailOrUsername(username);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="min-h-[88vh] grid grid-cols-1 lg:grid-cols-12 bg-[var(--bg-app)]">
      {/* Left Column: Product Philosophy & Mission (Desktop only) */}
      <div className="hidden lg:flex lg:col-span-5 bg-slate-900 text-white p-12 flex-col justify-between border-r border-slate-800">
        <div className="space-y-6">
          <Link href="/" className="inline-flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              WF
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Word<span className="text-blue-400">Flow</span>
            </span>
          </Link>

          <div className="pt-10 space-y-4">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400">
              Cognitive Vocabulary Mastery
            </span>
            <h1 className="text-3xl font-bold tracking-tight leading-snug">
              Consistent daily practice turns words into automatic recall.
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Log in to review words scheduled for your personalized SuperMemo SM-2 interval today. Keep your memory consolidation uninterrupted.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-12 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <CheckCircle2 size={16} className="text-blue-400" />
            <span>Spaced repetition algorithm (SM-2)</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 size={16} className="text-blue-400" />
            <span>Gemini 3.8 Flash AI language tutor</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 size={16} className="text-blue-400" />
            <span>Bilingual Russian & Uzbek translations</span>
          </div>
        </div>
      </div>

      {/* Right Column: Sign In Form */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Sign in to your account
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your credentials to access your personal study plan.
            </p>
          </div>

          <Card className="p-6 sm:p-7 space-y-5 border-slate-200/90 dark:border-slate-800 shadow-sm">
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email or Username"
                placeholder="demo@wordflow.app or username"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full font-semibold text-xs"
                isLoading={isLoading}
              >
                <span>Sign In</span>
                <ArrowRight size={14} />
              </Button>
            </form>

            {/* Quick Demo Fill Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
              <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider text-center">
                Instant Evaluation Accounts
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo('demo@wordflow.app', 'Demo@WordFlow2026!')}
                  className="py-2 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer text-center"
                >
                  Fill Demo User
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('admin@wordflow.app', 'Admin@WordFlow2026!')}
                  className="py-2 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer text-center"
                >
                  Fill Admin User
                </button>
              </div>
            </div>
          </Card>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Don&apos;t have an account yet?{' '}
            <Link href="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
