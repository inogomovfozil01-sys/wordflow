'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Compass,
  Sparkles,
  BrainCircuit,
  BookOpen,
  Menu,
  X,
  Search,
  Layers,
  BarChart3,
  Trophy,
  Settings,
  ShieldAlert,
  LogOut,
  Flame,
} from 'lucide-react';
import { NavbarUser } from '@/components/navbar';
import { Badge } from '@/components/ui/badge';

interface MobileNavProps {
  user: NavbarUser;
  streak?: number;
}

export function MobileNav({ user, streak = 0 }: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const primaryTabs = [
    { href: '/dashboard', label: 'Home', icon: Compass },
    { href: '/learn', label: 'Learn', icon: Sparkles },
    { href: '/review', label: 'Review', icon: BrainCircuit },
    { href: '/practice', label: 'Practice', icon: BookOpen },
  ];

  const moreItems = [
    { href: '/dictionary', label: 'Dictionary', icon: Search, desc: 'Bilingual A1–C2 lexicon' },
    { href: '/collections', label: 'Collections', icon: Layers, desc: 'Curated and custom decks' },
    { href: '/ai-tutor', label: 'AI Tutor', icon: Sparkles, desc: 'Level-calibrated conversational coach' },
    { href: '/stats', label: 'Statistics', icon: BarChart3, desc: 'Retention metrics & CEFR charts' },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy, desc: 'Community rankings & levels' },
    { href: '/settings', label: 'Settings', icon: Settings, desc: 'Profile, pace & preferences' },
  ];

  if (user.role === 'ADMIN') {
    moreItems.push({
      href: '/admin',
      label: 'Admin Control Center',
      icon: ShieldAlert,
      desc: 'System dictionary manager',
    });
  }

  const displayName = ('name' in user && user.name) ? user.name : user.username;

  return (
    <>
      {/* Top Mobile Bar (Compact Branding & Streak) */}
      <header className="lg:hidden sticky top-0 z-30 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
            W
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
            Word<span className="text-blue-600 dark:text-blue-400">Flow</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{streak}d</span>
          </div>
          <Badge variant="cefr" level={user.cefrLevel} />
        </div>
      </header>

      {/* Bottom Sticky Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 pb-safe flex items-center justify-around shadow-lg">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href || (tab.href !== '/dashboard' && pathname.startsWith(tab.href));

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors min-w-[60px] ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </Link>
          );
        })}

        {/* More Button */}
        <button
          type="button"
          onClick={() => setIsMoreOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors min-w-[60px] cursor-pointer ${
            isMoreOpen
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">More</span>
        </button>
      </nav>

      {/* Slide-over "More" Sheet */}
      {isMoreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMoreOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-full bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 shadow-2xl p-5 pb-safe space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-sm flex items-center justify-center">
                  {displayName[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {displayName}
                  </div>
                  <div className="text-xs text-slate-500">@{user.username}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMoreOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {item.desc}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Sign Out Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out from WordFlow
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
