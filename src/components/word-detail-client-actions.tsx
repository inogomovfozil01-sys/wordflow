'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Bookmark, BookOpen, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AiExplainModal } from '@/components/ai-explain-modal';
import { useToast } from '@/components/ui/toast';
import { WordItem } from '@/types';

interface WordDetailClientActionsProps {
  word: WordItem;
  userId?: string;
}

export function WordDetailClientActions({ word, userId }: WordDetailClientActionsProps) {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isLearning, setIsLearning] = useState(!!word.userWord);
  const [isAdding, setIsAdding] = useState(false);
  const { success, error } = useToast();

  const handleAddToQueue = async () => {
    if (!userId) {
      window.location.href = '/login';
      return;
    }

    setIsAdding(true);
    try {
      const res = await fetch('/api/learn/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wordsCount: 1,
          correctCount: 1,
          durationSeconds: 15,
          wordIds: [word.id],
          mode: 'MANUAL_ADD',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsLearning(true);
        success(`"${word.word}" added to your active study queue!`);
      } else {
        error(data.error || 'Failed to add word');
      }
    } catch {
      error('Failed to add word to study queue');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsAiModalOpen(true)}
          className="shadow-sm"
        >
          <Sparkles size={15} />
          <span>Explain with AI</span>
        </Button>

        <Button
          variant={isLearning ? 'success' : 'outline'}
          size="sm"
          onClick={handleAddToQueue}
          isLoading={isAdding}
          disabled={isLearning}
        >
          {isLearning ? (
            <>
              <Check size={15} />
              <span>In Study Queue</span>
            </>
          ) : (
            <>
              <Bookmark size={15} />
              <span>Learn This Word</span>
            </>
          )}
        </Button>

        <Link href={`/practice?word=${encodeURIComponent(word.word)}`}>
          <Button variant="outline" size="sm">
            <BookOpen size={15} />
            <span>Practice</span>
          </Button>
        </Link>
      </div>

      <AiExplainModal
        word={word.word}
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </>
  );
}
