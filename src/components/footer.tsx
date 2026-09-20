import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                W
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                Word<span className="text-emerald-600 dark:text-emerald-400">Flow</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Master English vocabulary that actually stays with you through scientifically proven SM-2 spaced repetition and Gemini AI tutoring.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wider uppercase mb-4">
              Learning
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/learn" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Interactive Lessons
                </Link>
              </li>
              <li>
                <Link href="/review" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Spaced Repetition
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  10 Practice Modes
                </Link>
              </li>
              <li>
                <Link href="/ai-tutor" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Gemini AI Tutor
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wider uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/dictionary" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  English Dictionary
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Curated Decks
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Community Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  About the Science
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-wider uppercase mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500">
          <p>© {new Date().getFullYear()} WordFlow. All rights reserved.</p>
          <p className="mt-4 sm:mt-0">
            Engineered for long-term memory and true linguistic mastery.
          </p>
        </div>
      </div>
    </footer>
  );
}
