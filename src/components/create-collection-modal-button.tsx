'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';

export function CreateCollectionModalButton() {
  const router = useRouter();
  const { success, error } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📁');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, icon }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        error(data.error || 'Failed to create collection');
        return;
      }

      success(`Collection "${name}" created!`);
      setIsOpen(false);
      setName('');
      setDescription('');
      router.refresh();
    } catch {
      error('Failed to create collection');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="primary" size="md" onClick={() => setIsOpen(true)}>
        <Plus size={16} />
        <span>Create Collection</span>
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Custom Collection"
        description="Organize words for specific work projects, exams, or interests"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            label="Collection Name"
            placeholder="e.g. Frontend Engineering or Travel Phrases"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Icon Emoji
            </label>
            <div className="flex space-x-2">
              {['📁', '💻', '✈️', '💼', '🎓', '🏥', '🎨', '🌟'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`p-2 rounded-xl text-xl border cursor-pointer ${
                    icon === emoji ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="What are these words for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
              Create Deck
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
