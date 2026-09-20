'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  RotateCcw,
  Clock,
  Zap,
  Sparkles,
  Layers,
  Target,
  Check,
  Type,
  Shuffle,
  AlertTriangle,
  Play,
} from 'lucide-react';
import { WordItem, PracticeMode } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AudioButton } from '@/components/audio-button';
import { speakText } from '@/lib/speech';
import { useToast } from '@/components/ui/toast';

interface PracticeEngineProps {
  initialWords: WordItem[];
  defaultMode?: PracticeMode;
}

interface ModeDef {
  id: PracticeMode;
  title: string;
  desc: string;
  badge: string;
}

const MODES_LIST: ModeDef[] = [
  { id: 'MULTIPLE_CHOICE', title: 'Multiple Choice', desc: 'Choose the correct definition or translation from 4 choices', badge: 'Recognition' },
  { id: 'TYPE_ENGLISH', title: 'Type English Spelling', desc: 'Recall exact orthography and spelling from Russian/Uzbek cues', badge: 'Active Recall' },
  { id: 'TYPE_TRANSLATION', title: 'Type Translation', desc: 'Produce the native Russian or Uzbek equivalent from English', badge: 'Production' },
  { id: 'LISTENING', title: 'Listening Dictation', desc: 'Train your auditory perception and transcribe spoken English', badge: 'Phonetics' },
  { id: 'MATCH_PAIRS', title: 'Match Pairs', desc: 'Connect 4 English words with their definitions as fast as possible', badge: 'Synaptic Drill' },
  { id: 'FILL_BLANK', title: 'Fill in Blank', desc: 'Restore missing vocabulary in real-world graded sentences', badge: 'Context' },
  { id: 'SENTENCE_TRANSLATION', title: 'Sentence Translation', desc: 'Read full context sentences and identify target expressions', badge: 'Advanced' },
  { id: 'SPEED_ROUND', title: 'Speed Recall (60s)', desc: 'Test how many vocabulary items you can retrieve in 60 seconds', badge: 'Fluency' },
  { id: 'DIFFICULT_WORDS', title: 'Lapsed Words', desc: 'Dedicated drill focusing on vocabulary with repeat lapses', badge: 'Hardening' },
  { id: 'RANDOM_CHALLENGE', title: 'Cognitive Interleaving', desc: 'A randomized mix of all question modalities', badge: 'Interleaving' },
];

export function PracticeEngine({ initialWords, defaultMode = 'MULTIPLE_CHOICE' }: PracticeEngineProps) {
  const { error } = useToast();
  const [selectedMode, setSelectedMode] = useState<PracticeMode | null>(null);
  const [words, setWords] = useState<WordItem[]>(initialWords);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedInput, setTypedInput] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);

  // Speed round countdown
  useEffect(() => {
    if (selectedMode === 'SPEED_ROUND' && !isFinished) {
      if (timerSeconds <= 0) {
        setIsFinished(true);
        return;
      }
      const interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [selectedMode, timerSeconds, isFinished]);

  // Audio auto-play for listening mode
  useEffect(() => {
    if (selectedMode === 'LISTENING' && words[currentIndex]) {
      speakText(words[currentIndex].word);
    }
  }, [selectedMode, currentIndex, words]);

  const currentWord = words[currentIndex];

  const startMode = (mode: PracticeMode) => {
    setSelectedMode(mode);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setTypedInput('');
    setTimerSeconds(60);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setTypedInput('');
    setIsAnswered(false);
    setIsCorrect(false);

    if (currentIndex + 1 < words.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleSelectChoice = (choice: string, correct: string) => {
    if (isAnswered) return;
    setSelectedAnswer(choice);
    const correctMatch = choice.trim().toLowerCase() === correct.trim().toLowerCase();
    setIsCorrect(correctMatch);
    setIsAnswered(true);
    if (correctMatch) setScore((prev) => prev + 1);
  };

  const handleCheckTyped = (e: React.FormEvent, target: string) => {
    e.preventDefault();
    if (isAnswered) return;
    const clean = typedInput.trim().toLowerCase();
    const cleanTarget = target.trim().toLowerCase();
    const correctMatch = clean === cleanTarget;
    setIsCorrect(correctMatch);
    setIsAnswered(true);
    if (correctMatch) setScore((prev) => prev + 1);
  };

  // 1. Practice Mode Selection Dashboard
  if (!selectedMode) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <Layers size={15} />
            <span>Practice Workspace</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            10 Cognitive Training Modalities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Strengthen your memory pathways through multiple retrieval routes. Select a practice mode to test auditory recognition, spelling, context, or rapid recall.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODES_LIST.map((mode, idx) => (
            <Card
              key={mode.id}
              hoverEffect
              onClick={() => startMode(mode.id)}
              className="p-5 flex flex-col justify-between cursor-pointer border-slate-200/90 dark:border-slate-800 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-400">0{idx + 1}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                    {mode.badge}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {mode.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {mode.desc}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>Start Training</span>
                <Play size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 2. Practice Session Finished Screen
  if (isFinished) {
    const accuracy = words.length > 0 ? Math.round((score / words.length) * 100) : 0;
    return (
      <Card className="max-w-md mx-auto p-8 text-center space-y-6 border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
          <Trophy size={24} />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Practice Complete
          </h2>
          <p className="text-xs text-slate-500">
            Mode: {MODES_LIST.find((m) => m.id === selectedMode)?.title}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Score</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {score} / {words.length}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Accuracy</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{accuracy}%</div>
          </div>
        </div>

        <div className="flex gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            className="flex-1"
            onClick={() => startMode(selectedMode)}
          >
            <RotateCcw size={14} />
            <span>Practice Again</span>
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            className="flex-1"
            onClick={() => setSelectedMode(null)}
          >
            <span>All Modes</span>
            <ArrowRight size={14} />
          </Button>
        </div>
      </Card>
    );
  }

  // 3. Active Practice Player
  const progressPercent = Math.round(((currentIndex + 1) / words.length) * 100);
  const correctTr = currentWord?.translations[0]?.translation || currentWord?.definitionSimple || '';

  // Generate 4 multiple choice options from words
  const otherTrs = words
    .filter((w) => w.id !== currentWord?.id)
    .map((w) => w.translations[0]?.translation || w.definitionSimple)
    .filter(Boolean)
    .slice(0, 3);
  const choices = [...otherTrs, correctTr].sort(() => 0.5 - Math.random());

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Active Mode Top Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedMode(null)}
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            ← Modes
          </button>
          <span>•</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {MODES_LIST.find((m) => m.id === selectedMode)?.title}
          </span>
          <span>•</span>
          <span>{currentIndex + 1} of {words.length}</span>
        </div>

        {selectedMode === 'SPEED_ROUND' ? (
          <div className="flex items-center gap-1 font-mono font-bold text-rose-600">
            <Clock size={14} />
            <span>{timerSeconds}s</span>
          </div>
        ) : (
          <div className="font-semibold text-slate-700 dark:text-slate-300">
            Score: {score}
          </div>
        )}
      </div>

      <Progress value={progressPercent} className="h-1.5" />

      {/* Practice Question Card */}
      <Card className="p-7 sm:p-10 border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
        {/* Audio prompt for listening mode */}
        {selectedMode === 'LISTENING' ? (
          <div className="text-center space-y-4 py-4">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Listen & Transcribe Spoken English
            </span>
            <div className="flex justify-center">
              <AudioButton text={currentWord.word} size="lg" />
            </div>
            <p className="text-xs text-slate-500">Tap audio icon to replay</p>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Target Vocabulary
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {selectedMode === 'TYPE_ENGLISH' ? correctTr : currentWord?.word}
            </h2>
            {selectedMode !== 'TYPE_ENGLISH' && currentWord?.ipa && (
              <p className="font-mono text-xs text-slate-400">{currentWord.ipa}</p>
            )}
          </div>
        )}

        {/* Input or Options based on mode */}
        {selectedMode === 'MULTIPLE_CHOICE' || selectedMode === 'SPEED_ROUND' || selectedMode === 'DIFFICULT_WORDS' || selectedMode === 'RANDOM_CHALLENGE' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {choices.map((choice, i) => {
              const isSelected = selectedAnswer === choice;
              const isThisCorrect = choice === correctTr;

              let style = 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 hover:bg-slate-100';
              if (isAnswered) {
                if (isThisCorrect) {
                  style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold';
                } else if (isSelected) {
                  style = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300';
                }
              }

              return (
                <button
                  key={i}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectChoice(choice, correctTr)}
                  className={`p-3.5 rounded-xl border text-xs text-left transition-all cursor-pointer disabled:cursor-default flex items-center justify-between ${style}`}
                >
                  <span>{choice}</span>
                  {isAnswered && isThisCorrect && <Check size={14} className="text-emerald-600" />}
                </button>
              );
            })}
          </div>
        ) : (
          <form
            onSubmit={(e) =>
              handleCheckTyped(
                e,
                selectedMode === 'TYPE_TRANSLATION' ? correctTr : currentWord.word
              )
            }
            className="space-y-4 max-w-md mx-auto"
          >
            <input
              type="text"
              autoFocus
              disabled={isAnswered}
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder={
                selectedMode === 'TYPE_TRANSLATION'
                  ? 'Type Russian or Uzbek equivalent...'
                  : 'Type English spelling...'
              }
              className="w-full text-center text-lg font-bold py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            {!isAnswered ? (
              <Button type="submit" variant="primary" size="md" className="w-full font-semibold text-xs">
                <span>Verify Answer</span>
              </Button>
            ) : null}
          </form>
        )}

        {/* Post-Answer Feedback Bar */}
        {isAnswered && (
          <div className="space-y-3 animate-in fade-in pt-2">
            <div
              className={`p-3 rounded-xl text-xs font-semibold text-center ${
                isCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200'
              }`}
            >
              {isCorrect ? 'Accurate recall!' : `Correct: ${selectedMode === 'TYPE_TRANSLATION' ? correctTr : currentWord.word}`}
            </div>
            <Button
              type="button"
              variant="primary"
              size="md"
              className="w-full font-semibold text-xs"
              onClick={handleNext}
            >
              <span>Continue</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
