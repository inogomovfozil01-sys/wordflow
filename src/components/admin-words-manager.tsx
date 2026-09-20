'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { CefrLevel } from '@/types';
import {
  Plus,
  Trash2,
  Search,
  BookOpen,
  Volume2,
  Loader2,
  Filter,
  CheckCircle2,
} from 'lucide-react';

interface WordItem {
  id: string;
  word: string;
  partOfSpeech: string;
  cefrLevel: string;
  ipa: string | null;
  definitionEn: string;
  translations: { language: string; translation: string }[];
  examples: { sentenceEn: string }[];
}

interface AdminWordsManagerProps {
  initialWords: WordItem[];
}

export function AdminWordsManager({ initialWords }: AdminWordsManagerProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const [words, setWords] = useState<WordItem[]>(initialWords);
  const [search, setSearch] = useState('');
  const [selectedCefr, setSelectedCefr] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states for creating a new word
  const [formData, setFormData] = useState({
    word: '',
    partOfSpeech: 'noun',
    cefrLevel: 'B1' as CefrLevel,
    ipa: '',
    definitionEn: '',
    definitionSimple: '',
    translationRu: '',
    translationUz: '',
    sentenceEn: '',
    sentenceRu: '',
    sentenceUz: '',
    synonyms: '',
    antonyms: '',
  });

  const filteredWords = words.filter((w) => {
    const matchesSearch =
      w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.definitionEn.toLowerCase().includes(search.toLowerCase());
    const matchesCefr = selectedCefr === 'ALL' || w.cefrLevel === selectedCefr;
    return matchesSearch && matchesCefr;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        word: formData.word.trim(),
        partOfSpeech: formData.partOfSpeech,
        cefrLevel: formData.cefrLevel,
        ipa: formData.ipa.trim() || undefined,
        definitionEn: formData.definitionEn.trim(),
        definitionSimple: formData.definitionSimple.trim() || undefined,
        translationRu: formData.translationRu.trim(),
        translationUz: formData.translationUz.trim(),
        sentenceEn: formData.sentenceEn.trim(),
        sentenceRu: formData.sentenceRu.trim() || undefined,
        sentenceUz: formData.sentenceUz.trim() || undefined,
        synonyms: formData.synonyms
          ? formData.synonyms.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        antonyms: formData.antonyms
          ? formData.antonyms.split(',').map((a) => a.trim()).filter(Boolean)
          : [],
      };

      const res = await fetch('/api/admin/words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create word');
      }

      success(`Word "${formData.word}" added successfully!`);
      setWords((prev) => [data.word, ...prev]);
      setIsModalOpen(false);
      setFormData({
        word: '',
        partOfSpeech: 'noun',
        cefrLevel: 'B1',
        ipa: '',
        definitionEn: '',
        definitionSimple: '',
        translationRu: '',
        translationUz: '',
        sentenceEn: '',
        sentenceRu: '',
        sentenceUz: '',
        synonyms: '',
        antonyms: '',
      });
      router.refresh();
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Error adding word');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, wordText: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${wordText}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/words?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete word');
      }

      success(`Word "${wordText}" deleted successfully.`);
      setWords((prev) => prev.filter((w) => w.id !== id));
      router.refresh();
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Error deleting word');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search words or definitions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={selectedCefr}
            onChange={(e) => setSelectedCefr(e.target.value)}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-primary-500"
          >
            <option value="ALL">All Levels</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
            <option value="C2">C2</option>
          </select>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Word
        </Button>
      </div>

      {/* Words Table */}
      <Card className="overflow-hidden border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="text-xs font-semibold text-neutral-500">
            Showing {filteredWords.length} words
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="py-3 px-4">Word & IPA</th>
                <th className="py-3 px-4">Level & POS</th>
                <th className="py-3 px-4">Definition</th>
                <th className="py-3 px-4">Translations (RU / UZ)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredWords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-neutral-500">
                    No words found matching the search criteria.
                  </td>
                </tr>
              ) : (
                filteredWords.map((item) => {
                  const ruTrans = item.translations.find((t) => t.language === 'ru')?.translation;
                  const uzTrans = item.translations.find((t) => t.language === 'uz')?.translation;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span>{item.word}</span>
                          {item.ipa && (
                            <span className="text-xs font-normal text-neutral-400">
                              {item.ipa}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="primary" className="text-[10px] py-0 px-1.5 font-bold">
                            {item.cefrLevel}
                          </Badge>
                          <span className="text-xs text-neutral-500 lowercase italic">
                            {item.partOfSpeech}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs truncate text-xs text-neutral-600 dark:text-neutral-400">
                        {item.definitionEn}
                      </td>

                      <td className="py-3.5 px-4 text-xs">
                        <div className="space-y-0.5">
                          {ruTrans && (
                            <div className="text-neutral-700 dark:text-neutral-300">
                              <span className="font-semibold text-neutral-400">RU:</span> {ruTrans}
                            </div>
                          )}
                          {uzTrans && (
                            <div className="text-neutral-700 dark:text-neutral-300">
                              <span className="font-semibold text-neutral-400">UZ:</span> {uzTrans}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          disabled={deletingId === item.id}
                          onClick={() => handleDelete(item.id, item.word)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                          title="Delete word"
                        >
                          {deletingId === item.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Word Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Word to WordFlow Dictionary"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Word *</label>
              <Input
                required
                value={formData.word}
                onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                placeholder="e.g. perseverance"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">IPA Transcription</label>
              <Input
                value={formData.ipa}
                onChange={(e) => setFormData({ ...formData, ipa: e.target.value })}
                placeholder="/ˌpɜːsɪˈvɪərəns/"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">CEFR Level *</label>
              <select
                value={formData.cefrLevel}
                onChange={(e) => setFormData({ ...formData, cefrLevel: e.target.value as CefrLevel })}
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500"
              >
                <option value="A1">A1 - Beginner</option>
                <option value="A2">A2 - Elementary</option>
                <option value="B1">B1 - Intermediate</option>
                <option value="B2">B2 - Upper-Intermediate</option>
                <option value="C1">C1 - Advanced</option>
                <option value="C2">C2 - Proficiency</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Part of Speech *</label>
              <select
                value={formData.partOfSpeech}
                onChange={(e) => setFormData({ ...formData, partOfSpeech: e.target.value })}
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500"
              >
                <option value="noun">Noun</option>
                <option value="verb">Verb</option>
                <option value="adjective">Adjective</option>
                <option value="adverb">Adverb</option>
                <option value="idiom">Idiom</option>
                <option value="phrasal_verb">Phrasal Verb</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Full English Definition *</label>
            <textarea
              required
              rows={2}
              value={formData.definitionEn}
              onChange={(e) => setFormData({ ...formData, definitionEn: e.target.value })}
              placeholder="Continued effort to do or achieve something despite difficulties..."
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Russian Translation *</label>
              <Input
                required
                value={formData.translationRu}
                onChange={(e) => setFormData({ ...formData, translationRu: e.target.value })}
                placeholder="настойчивость, упорство"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Uzbek Translation *</label>
              <Input
                required
                value={formData.translationUz}
                onChange={(e) => setFormData({ ...formData, translationUz: e.target.value })}
                placeholder="matonat, sabot"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Example Sentence (English) *</label>
            <Input
              required
              value={formData.sentenceEn}
              onChange={(e) => setFormData({ ...formData, sentenceEn: e.target.value })}
              placeholder="Through hard work and perseverance, she reached her goal."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Synonyms (comma separated)</label>
              <Input
                value={formData.synonyms}
                onChange={(e) => setFormData({ ...formData, synonyms: e.target.value })}
                placeholder="persistence, dedication"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Antonyms (comma separated)</label>
              <Input
                value={formData.antonyms}
                onChange={(e) => setFormData({ ...formData, antonyms: e.target.value })}
                placeholder="apathy, laziness"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  Saving Word...
                </>
              ) : (
                'Save Word'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
