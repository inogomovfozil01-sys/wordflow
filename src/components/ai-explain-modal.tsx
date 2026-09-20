'use client';

import React, { useState } from 'react';
import { Sparkles, Lightbulb, AlertTriangle, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AiWordExplanation } from '@/lib/gemini';

interface AiExplainModalProps {
  word: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AiExplainModal({ word, isOpen, onClose }: AiExplainModalProps) {
  const [data, setData] = useState<AiWordExplanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Load explanation when modal opens
  React.useEffect(() => {
    if (isOpen && !data && !isLoading) {
      setIsLoading(true);
      setError(null);
      setSelectedOption(null);
      setQuizSubmitted(false);

      fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.explanation) {
            setData(json.explanation);
          } else {
            setError(json.error || 'Failed to load AI breakdown');
          }
        })
        .catch((err) => {
          console.error(err);
          setError('Failed to reach AI explanation service');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, word, data, isLoading]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`AI Breakdown: "${word}"`}
      description="Personalized mnemonic, level-appropriate usage, and mini-quiz"
      maxWidth="xl"
    >
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">
            Gemini 3.8 Flash is crafting your personalized breakdown...
          </p>
        </div>
      ) : error ? (
        <div className="py-8 text-center space-y-3">
          <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
          <Button variant="outline" size="sm" onClick={() => setData(null)}>
            Try Again
          </Button>
        </div>
      ) : data ? (
        <div className="space-y-6 pt-2">
          {/* Definition */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Simple Meaning
            </h4>
            <p className="text-base text-slate-900 dark:text-white font-medium">
              {data.simpleExplanation}
            </p>
          </div>

          {/* Memory Hook */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-1.5">
            <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
              <Lightbulb size={18} className="fill-amber-400 text-amber-500" />
              <span>Mnemonic Memory Hook</span>
            </div>
            <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
              {data.memoryHook}
            </p>
          </div>

          {/* Examples */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Natural Usage in Context
            </h4>
            <div className="space-y-2">
              {data.cefrExamples.map((ex, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-sm space-y-1 bg-white dark:bg-slate-900"
                >
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {ex.english}
                  </p>
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                    <p>🇷🇺 {ex.translationRu}</p>
                    <p>🇺🇿 {ex.translationUz}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistake */}
          {data.commonMistake && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-1">
              <div className="flex items-center space-x-2 text-rose-800 dark:text-rose-300 font-bold text-sm">
                <AlertTriangle size={18} />
                <span>Common Pitfall to Avoid</span>
              </div>
              <p className="text-sm text-rose-900 dark:text-rose-200 leading-relaxed">
                {data.commonMistake}
              </p>
            </div>
          )}

          {/* Mini Quiz */}
          {data.miniQuiz && (
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-3">
              <div className="flex items-center space-x-2 text-indigo-900 dark:text-indigo-200 font-bold text-sm">
                <HelpCircle size={18} />
                <span>Quick Retention Check</span>
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {data.miniQuiz.question}
              </p>
              <div className="space-y-1.5">
                {data.miniQuiz.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === data.miniQuiz.correctIndex;

                  let style = 'border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900';
                  if (quizSubmitted) {
                    if (isCorrect) style = 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-100 font-semibold';
                    else if (isSelected) style = 'border-rose-500 bg-rose-100 dark:bg-rose-950/70 text-rose-900 dark:text-rose-100';
                  } else if (isSelected) {
                    style = 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900/50 font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={quizSubmitted}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-colors flex items-center justify-between cursor-pointer ${style}`}
                    >
                      <span>{opt}</span>
                      {quizSubmitted && isCorrect && <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
                      {quizSubmitted && isSelected && !isCorrect && <XCircle size={16} className="text-rose-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <Button
                  size="sm"
                  variant="primary"
                  disabled={selectedOption === null}
                  onClick={() => setQuizSubmitted(true)}
                  className="w-full mt-2"
                >
                  Check Answer
                </Button>
              ) : (
                <p className="text-xs text-indigo-800 dark:text-indigo-300 italic pt-1">
                  {data.miniQuiz.explanation}
                </p>
              )}
            </div>
          )}
        </div>
      ) : null}
    </Modal>
  );
}
