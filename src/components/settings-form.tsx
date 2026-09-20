'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { CefrLevel } from '@/types';
import {
  User,
  Sliders,
  Volume2,
  Eye,
  Trash2,
  Save,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface SettingsFormProps {
  user: {
    name: string | null;
    username: string;
    email: string;
    role: string;
  };
  profile: {
    bio: string | null;
    avatar: string | null;
    showStreak: boolean;
    showWordsLearned: boolean;
    showOnLeaderboard: boolean;
  } | null;
  settings: {
    cefrLevel: string;
    learningGoal: string;
    dailyTargetWords: number;
    interfaceLang: string;
    soundEnabled: boolean;
    autoPronounce: boolean;
    theme: string;
  } | null;
}

const AVATAR_OPTIONS = ['🎓', '🚀', '🧠', '🌟', '📚', '⚡', '🦉', '🎯', '🔥', '💎'];

export function SettingsForm({ user, profile, settings }: SettingsFormProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Form states
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatar, setAvatar] = useState(profile?.avatar || '🎓');
  const [cefrLevel, setCefrLevel] = useState<CefrLevel>(
    (settings?.cefrLevel as CefrLevel) || 'B1'
  );
  const [learningGoal, setLearningGoal] = useState(
    settings?.learningGoal || 'Everyday Conversation & Fluency'
  );
  const [dailyTargetWords, setDailyTargetWords] = useState(
    settings?.dailyTargetWords || 10
  );
  const [interfaceLang, setInterfaceLang] = useState(
    settings?.interfaceLang || 'en'
  );
  const [soundEnabled, setSoundEnabled] = useState(
    settings?.soundEnabled ?? true
  );
  const [autoPronounce, setAutoPronounce] = useState(
    settings?.autoPronounce ?? true
  );
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(
    profile?.showOnLeaderboard ?? true
  );
  const [showStreak, setShowStreak] = useState(profile?.showStreak ?? true);
  const [showWordsLearned, setShowWordsLearned] = useState(
    profile?.showWordsLearned ?? true
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          bio,
          avatar,
          cefrLevel,
          learningGoal,
          dailyTargetWords: Number(dailyTargetWords),
          interfaceLang,
          soundEnabled,
          autoPronounce,
          showOnLeaderboard,
          showStreak,
          showWordsLearned,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      success('Preferences and profile saved successfully!');
      router.refresh();
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Error updating settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setIsDeleting(true);

    try {
      const res = await fetch('/api/settings/delete-account', {
        method: 'POST',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete account');
      }

      window.location.href = '/login?deleted=true';
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Account deletion failed');
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Profile Info */}
      <Card className="p-6 border-neutral-200 dark:border-neutral-800 space-y-6">
        <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div className="p-2 bg-primary-100 dark:bg-primary-950/60 rounded-xl text-primary-600">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              Profile & Public Presence
            </h2>
            <p className="text-xs text-neutral-500">
              Manage your display name, chosen avatar, and bio
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Select Avatar
            </label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setAvatar(emoji)}
                  className={`w-11 h-11 text-2xl rounded-xl border flex items-center justify-center transition ${
                    avatar === emoji
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/40 ring-2 ring-primary-500/20'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Display Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Mercer"
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Username
              </label>
              <Input
                type="text"
                value={user.username}
                disabled
                className="opacity-70 bg-neutral-100 dark:bg-neutral-900 cursor-not-allowed"
              />
              <span className="text-[11px] text-neutral-500">Username cannot be changed</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Bio / Learning Objective
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others what you are preparing for (e.g. IELTS 7.5, job interviews, travel)..."
              rows={2}
              maxLength={200}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </Card>

      {/* Learning Preferences */}
      <Card className="p-6 border-neutral-200 dark:border-neutral-800 space-y-6">
        <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-950/60 rounded-xl text-indigo-600">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              Target Level & Study Pace
            </h2>
            <p className="text-xs text-neutral-500">
              Calibrate exercise difficulty, AI tutor responses, and daily targets
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Target CEFR Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CefrLevel[]).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setCefrLevel(lvl)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                    cefrLevel === lvl
                      ? 'border-primary-600 bg-primary-600 text-white shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Daily Target: <span className="text-primary-600 font-bold">{dailyTargetWords} words</span>
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={dailyTargetWords}
              onChange={(e) => setDailyTargetWords(Number(e.target.value))}
              className="w-full accent-primary-600 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-500 mt-1">
              <span>5 (Casual)</span>
              <span>20 (Regular)</span>
              <span>50 (Intensive)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Primary Focus / Goal
            </label>
            <select
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary-500"
            >
              <option value="Everyday Conversation & Fluency">Everyday Conversation & Fluency</option>
              <option value="IELTS / TOEFL Academic Exam">IELTS / TOEFL Academic Exam</option>
              <option value="Business, Tech & Career English">Business, Tech & Career English</option>
              <option value="Travel & International Living">Travel & International Living</option>
              <option value="Reading English Literature & News">Reading English Literature & News</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Interface Language
            </label>
            <select
              value={interfaceLang}
              onChange={(e) => setInterfaceLang(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary-500"
            >
              <option value="en">English (English)</option>
              <option value="ru">Русский (Russian)</option>
              <option value="uz">Oʻzbekcha (Uzbek)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Audio & Audio Preferences */}
      <Card className="p-6 border-neutral-200 dark:border-neutral-800 space-y-4">
        <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl text-emerald-600">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              Audio & Pronunciation
            </h2>
            <p className="text-xs text-neutral-500">
              Native speech synthesizer behavior during flashcards and quizzes
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer">
            <div>
              <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                Audio Sound Effects
              </div>
              <div className="text-xs text-neutral-500">
                Play subtle feedback sounds on correct or incorrect answers
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-5 h-5 accent-primary-600 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer">
            <div>
              <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                Auto-Pronounce on Flashcards
              </div>
              <div className="text-xs text-neutral-500">
                Automatically pronounce words aloud when revealed in review mode
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoPronounce}
              onChange={(e) => setAutoPronounce(e.target.checked)}
              className="w-5 h-5 accent-primary-600 rounded cursor-pointer"
            />
          </label>
        </div>
      </Card>

      {/* Privacy & Community */}
      <Card className="p-6 border-neutral-200 dark:border-neutral-800 space-y-4">
        <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-950/60 rounded-xl text-amber-600">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              Privacy & Leaderboard Visibility
            </h2>
            <p className="text-xs text-neutral-500">
              Control what other learners can see on public leaderboards
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer">
            <div>
              <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                Show on Global Leaderboard
              </div>
              <div className="text-xs text-neutral-500">
                Display your rank, level, and XP to the community
              </div>
            </div>
            <input
              type="checkbox"
              checked={showOnLeaderboard}
              onChange={(e) => setShowOnLeaderboard(e.target.checked)}
              className="w-5 h-5 accent-primary-600 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900/50 cursor-pointer">
            <div>
              <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                Display Daily Streak
              </div>
              <div className="text-xs text-neutral-500">
                Show your streak count on your public profile card
              </div>
            </div>
            <input
              type="checkbox"
              checked={showStreak}
              onChange={(e) => setShowStreak(e.target.checked)}
              className="w-5 h-5 accent-primary-600 rounded cursor-pointer"
            />
          </label>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSaving}
          className="min-w-40 flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save All Preferences
            </>
          )}
        </Button>
      </div>

      {/* Danger Zone */}
      <div className="pt-6 border-t border-red-200 dark:border-red-950">
        <div className="p-6 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-base font-bold text-red-900 dark:text-red-300">
                Danger Zone: Delete Account
              </h3>
              <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                Permanently delete your WordFlow account, all learned words, review intervals, streaks, and achievements. This action is irreversible.
              </p>
            </div>
          </div>

          {!showDeleteConfirm ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 border-red-300 hover:bg-red-50 text-xs"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              I want to delete my account
            </Button>
          ) : (
            <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-red-300 dark:border-red-900 space-y-3">
              <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                To confirm deletion, type <span className="text-red-600 font-bold">DELETE</span> below:
              </p>
              <div className="flex items-center gap-3">
                <Input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  className="max-w-xs"
                />
                <Button
                  type="button"
                  disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs"
                >
                  {isDeleting ? 'Deleting...' : 'Permanently Delete'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
