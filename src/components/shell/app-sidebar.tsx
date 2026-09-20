'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Compass,
  Sparkles,
  BrainCircuit,
  BookOpen,
  Search,
  Layers,
  BarChart3,
  Trophy,
  Settings,
  ShieldAlert,
  LogOut,
  Flame,
  ChevronRight,
  Command,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CefrLevel } from '@/types';
import { NavbarUser } from '@/components/navbar';

interface AppSidebarProps {
  user: NavbarUser;
  streak?: number;
}

interface NavSection {
  label: string;
  items: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

export function AppSidebar({ user, streak = 0 }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const sections: NavSection[] = [
    {
      label: 'MAIN',
      items: [
        { href: '/dashboard', label: 'Overview', icon: Compass },
        { href: '/learn', label: 'Learn', icon: Sparkles },
        { href: '/review', label: 'Review', icon: BrainCircuit },
        { href: '/practice', label: 'Practice', icon: BookOpen },
      ],
    },
    {
      label: 'LIBRARY',
      items: [
        { href: '/dictionary', label: 'Dictionary', icon: Search },
        { href: '/collections', label: 'Collections', icon: Layers },
      ],
    },
    {
      label: 'INSIGHTS',
      items: [
        { href: '/ai-tutor', label: 'AI Tutor', icon: Sparkles },
        { href: '/stats', label: 'Statistics', icon: BarChart3 },
      ],
    },
    {
      label: 'COMMUNITY',
      items: [
        { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
      ],
    },
  ];

  if (user.role === 'ADMIN') {
    sections.push({
      label: 'ADMINISTRATION',
      items: [
        { href: '/admin', label: 'Control Center', icon: ShieldAlert, badge: 'Staff' },
      ],
    });
  }

  const displayName = ('name' in user && user.name) ? user.name : user.username;
  const initial = displayName ? displayName[0].toUpperCase() : 'U';

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 select-none z-30">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-base flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
            W
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
            Word<span className="text-blue-600 dark:text-blue-400">Flow</span>
          </span>
        </Link>

        {/* Quick Search Shortcut button */}
        <button
          type="button"
          onClick={() => {
            const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true });
            window.dispatchEvent(event);
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Command Palette (Cmd+K)"
        >
          <Command className="w-4 h-4" />
        </button>
      </div>

      {/* Streak & Level summary banner */}
      <div className="p-3 mx-3 my-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            {streak}d streak
          </span>
        </div>
        <Badge variant="cefr" level={user.cefrLevel} />
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
        {sections.map((section) => (
          <div key={section.label} className="space-y-1">
            <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer Profile Card */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
          <Link href="/settings" className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {displayName}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                @{user.username}
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href="/settings"
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
