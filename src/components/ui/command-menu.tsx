'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  BookOpen,
  BrainCircuit,
  Sparkles,
  Layers,
  BarChart3,
  Trophy,
  Settings,
  ShieldAlert,
  ArrowRight,
  X,
  Compass,
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  category: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const COMMANDS: CommandItem[] = [
  { id: 'dash', title: 'Dashboard', category: 'Navigation', href: '/dashboard', icon: Compass, description: 'Your personal learning overview' },
  { id: 'learn', title: 'Learn Vocabulary', category: 'Study', href: '/learn', icon: Sparkles, description: 'Start multi-step study session' },
  { id: 'review', title: 'Review (SRS)', category: 'Study', href: '/review', icon: BrainCircuit, description: 'Spaced repetition flashcards' },
  { id: 'practice', title: 'Practice Modes', category: 'Study', href: '/practice', icon: BookOpen, description: '10 custom practice drills' },
  { id: 'dict', title: 'Dictionary', category: 'Library', href: '/dictionary', icon: Search, description: 'Look up A1–C2 words' },
  { id: 'coll', title: 'Collections', category: 'Library', href: '/collections', icon: Layers, description: 'Curated and custom decks' },
  { id: 'ai', title: 'AI English Tutor', category: 'Insights', href: '/ai-tutor', icon: Sparkles, description: 'Conversational vocabulary coach' },
  { id: 'stats', title: 'Statistics & Analytics', category: 'Insights', href: '/stats', icon: BarChart3, description: 'Retention metrics & CEFR progress' },
  { id: 'leader', title: 'Community Leaderboard', category: 'Community', href: '/leaderboard', icon: Trophy, description: 'Global rankings & levels' },
  { id: 'settings', title: 'Settings & Profile', category: 'Account', href: '/settings', icon: Settings, description: 'Preferences & language options' },
  { id: 'admin', title: 'Admin Control Center', category: 'Account', href: '/admin', icon: ShieldAlert, description: 'Dictionary manager & logs' },
];

export function CommandMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = COMMANDS.filter((cmd) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q) ||
      (cmd.description && cmd.description.toLowerCase().includes(q))
    );
  });

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // Press '/' to search when not focused in input/textarea
      if (e.key === '/' && !isOpen) {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          e.preventDefault();
          handleOpen();
        }
      }
      // Escape
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleOpen, handleClose]);

  const handleSelect = (cmd: CommandItem) => {
    handleClose();
    router.push(cmd.href);
  };

  const handleKeyDownInMenu = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDownInMenu}
      >
        {/* Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search pages... (e.g. Learn, Review, Dictionary)"
            className="w-full py-4 text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/40">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No matching pages or actions found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;

              return (
                <button
                  key={cmd.id}
                  type="button"
                  onClick={() => handleSelect(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate flex items-center gap-2">
                        <span>{cmd.title}</span>
                        <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {cmd.category}
                        </span>
                      </div>
                      {cmd.description && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {cmd.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'opacity-100 translate-x-0 text-blue-600' : 'opacity-0 -translate-x-1'
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span>WordFlow Quick Command</span>
        </div>
      </div>
    </div>
  );
}
