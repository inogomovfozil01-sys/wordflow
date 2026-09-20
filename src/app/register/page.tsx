'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';

export default function RegisterPage() {
  const router = useRouter();
  const { error: toastError, success: toastSuccess } = useToast();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to create account');
        toastError(data.error || 'Registration failed');
        return;
      }

      toastSuccess('Account created successfully');
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('A network error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
              Personalized Lexical Growth
            </span>
            <h1 className="text-3xl font-bold tracking-tight leading-snug">
              Begin your structured path from A1 to C2 mastery.
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Create a free account to track your spaced repetition intervals, practice listening and spelling, and train with your personal AI language mentor.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-12 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <CheckCircle2 size={16} className="text-blue-400" />
            <span>Database-backed persistence on Neon PostgreSQL</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 size={16} className="text-blue-400" />
            <span>Oxford 3000 & IELTS academic collections</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 size={16} className="text-blue-400" />
            <span>Natural audio pronunciation engine</span>
          </div>
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create your account
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Start expanding your active vocabulary today.
            </p>
          </div>

          <Card className="p-6 sm:p-7 space-y-5 border-slate-200/90 dark:border-slate-800 shadow-sm">
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <Input
                label="Full Name"
                placeholder="Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Username"
                placeholder="alex_learner"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full font-semibold text-xs mt-2"
                isLoading={isLoading}
              >
                <span>Create Account</span>
                <ArrowRight size={14} />
              </Button>
            </form>
          </Card>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Already registered?{' '}
            <Link href="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Sign in to account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
