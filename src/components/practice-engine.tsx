'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
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

const MODES_LIST: Array<{ id: PracticeMode; title: string; desc: string; icon: string }> = [
  { id: 'MULTIPLE_CHOICE', title: 'Multiple Choice', desc: 'Choose the correct definition or translation', icon: '🔘' },
  { id: 'TYPE_ENGLISH', title: 'Type English', desc: 'Recall exact spelling from memory', icon: '🔤' },
  { id: 'TYPE_TRANSLATION', title: 'Type Translation', desc: 'Produce the Russian/Uzbek equivalent', icon: '⌨️' },
  { id: 'LISTENING', title: 'Listening Audio', desc: 'Train your ear to recognize spoken words', icon: '🎧' },
  { id: 'MATCH_PAIRS', title: 'Match Pairs', desc: 'Connect English words with their meanings', icon: '🧩' },
  { id: 'FILL_BLANK', title: 'Fill in Blank', desc: 'Restore missing words in natural sentences', icon: '📝' },
  { id: 'SENTENCE_TRANSLATION', title: 'Sentence Translation', desc: 'Translate full context expressions', icon: '💬' },
  { id: 'SPEED_ROUND', title: 'Speed Round', desc: 'Test how many words you can answer in 60 seconds', icon: '⚡' },
  { id: 'DIFFICULT_WORDS', title: 'Difficult Words', desc: 'Focus on vocabulary with frequent lapses', icon: '🎯' },
  { id: 'RANDOM_CHALLENGE', title: 'Random Challenge', desc: 'A mixed blitz of all question formats', icon: '🎲' },
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

  // Match pairs mode specific state
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  // Speed round countdown
  useEffect(() => {
    if (selectedMode === 'SPEED_ROUND' && !isFinished) {
      if (timerSeconds <= 0) {
        finishPractice();
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
    setMatchedPairs([]);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setTypedInput('');
    setIsAnswered(false);
    setIsCorrect(false);

    if (currentIndex + 1 < words.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishPractice();
    }
  };

  const finishPractice = async () => {
    setIsFinished(true);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });

    try {
      await fetch('/api/learn/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionType: 'PRACTICE',
          mode: selectedMode || 'PRACTICE',
          wordsCount: words.length,
          correctCount: score,
          durationSeconds: 60,
          wordIds: words.map((w) => w.id),
        }),
      });
    } catch {
      // Non-blocking error handling
    }
  };

  // 1. Multiple Choice validation
  const handleMultipleChoice = (option: string, correct: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    const win = option.toLowerCase() === correct.toLowerCase();
    setIsCorrect(win);
    setIsAnswered(true);
    if (win) setScore((prev) => prev + 1);
  };

  // 2. Typing validation
  const handleTypeCheck = (e: React.FormEvent, targetWord: string) => {
    e.preventDefault();
    if (isAnswered) return;
    const clean = typedInput.trim().toLowerCase();
    const win = clean === targetWord.toLowerCase();
    setIsCorrect(win);
    setIsAnswered(true);
    if (win) setScore((prev) => prev + 1);
  };

  // 3. Match pairs handler
  const handleSelectLeft = (word: string) => {
    if (matchedPairs.includes(word)) return;
    setSelectedLeft(word);
    if (selectedRight) {
      checkPair(word, selectedRight);
    }
  };

  const handleSelectRight = (translation: string) => {
    if (matchedPairs.some((p) => p.endsWith(`::${translation}`))) return;
    setSelectedRight(translation);
    if (selectedLeft) {
      checkPair(selectedLeft, translation);
    }
  };

  const checkPair = (leftWord: string, rightTr: string) => {
    const item = words.find((w) => w.word.toLowerCase() === leftWord.toLowerCase());
    const isMatch = item?.translations.some((t) => t.translation.toLowerCase() === rightTr.toLowerCase());

    if (isMatch) {
      setMatchedPairs((prev) => [...prev, `${leftWord}::${rightTr}`]);
      setScore((prev) => prev + 1);
      setSelectedLeft(null);
      setSelectedRight(null);

      if (matchedPairs.length + 1 >= Math.min(words.length, 5)) {
        setTimeout(finishPractice, 600);
      }
    } else {
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500);
    }
  };

  // Mode Selection Screen
  if (!selectedMode) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <Badge variant="primary">VOCABULARY DRILLS</Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            10 Practice Modes
          </h1>
          <p className="text-sm text-slate-500">
            Choose an exercise format to strengthen active recall, spelling, and listening comprehension.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODES_LIST.map((m) => (
            <Card
              key={m.id}
              hoverEffect
              onClick={() => startMode(m.id)}
              className="p-5 cursor-pointer flex flex-col justify-between space-y-3 group border-slate-200 dark:border-slate-800 hover:border-emerald-500"
            >
              <div className="space-y-2">
                <span className="text-3xl block group-hover:scale-110 transition-transform">
                  {m.icon}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{m.desc}</p>
              </div>

              <div className="flex items-center text-xs font-bold text-emerald-600 pt-2">
                <span>Start Drill</span>
                <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Finished Practice Screen
  if (isFinished) {
    return (
      <Card className="p-8 max-w-md mx-auto text-center space-y-6 shadow-xl border-emerald-200 dark:border-emerald-800">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <Trophy size={32} />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Practice Complete!</h2>
          <p className="text-xs text-slate-500">Your practice results have been recorded.</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border space-y-1">
          <span className="text-3xl font-black text-emerald-600">{score}</span>
          <p className="text-xs text-slate-500 uppercase font-bold">Total Correct</p>
        </div>

        <div className="flex justify-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setSelectedMode(null)}>
            Choose Another Mode
          </Button>
          <Link href="/dashboard">
            <Button variant="primary" size="sm">
              Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  // In-session game play
  const allTrs = words.map((w) => w.translations[0]?.translation).filter((t): t is string => !!t);
  const correctTr = currentWord?.translations[0]?.translation || currentWord?.definitionSimple || '';
  const otherTrs = allTrs.filter((t) => t !== correctTr);
  const distractors = [...otherTrs].sort(() => 0.5 - Math.random()).slice(0, 3);
  const multipleChoiceOptions = [...distractors, correctTr].sort(() => 0.5 - Math.random());

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSelectedMode(null)}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw size={13} />
          <span>Exit Practice</span>
        </button>

        <div className="flex items-center space-x-2">
          {selectedMode === 'SPEED_ROUND' && (
            <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
              <Clock size={13} />
              <span>{timerSeconds}s</span>
            </div>
          )}
          <span className="text-xs font-bold text-slate-600">Score: {score}</span>
        </div>
      </div>

      {/* Progress */}
      {selectedMode !== 'SPEED_ROUND' && selectedMode !== 'MATCH_PAIRS' && (
        <Progress value={((currentIndex + 1) / words.length) * 100} />
      )}

      {/* MODE 1: MATCH PAIRS */}
      {selectedMode === 'MATCH_PAIRS' ? (
        <Card className="p-6 sm:p-8 space-y-6 shadow-xl border-slate-200 dark:border-slate-800">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Match the Pairs</h3>
            <p className="text-xs text-slate-500">Tap an English word, then tap its corresponding translation.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* Left Col (English) */}
            <div className="space-y-2">
              {words.slice(0, 5).map((w) => {
                const isMatched = matchedPairs.some((p) => p.startsWith(w.word));
                const isSelected = selectedLeft === w.word;
                return (
                  <button
                    key={w.id}
                    disabled={isMatched}
                    onClick={() => handleSelectLeft(w.word)}
                    className={`w-full p-3 rounded-xl border text-sm font-bold text-center transition-all cursor-pointer ${
                      isMatched
                        ? 'opacity-30 border-emerald-500 bg-emerald-50 text-emerald-800'
                        : isSelected
                        ? 'border-emerald-600 bg-emerald-100 dark:bg-emerald-950 text-emerald-900 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {w.word}
                  </button>
                );
              })}
            </div>

            {/* Right Col (Translations) */}
            <div className="space-y-2">
              {words
                .slice(0, 5)
                .map((w) => w.translations[0]?.translation)
                .filter((t): t is string => !!t)
                .sort()
                .map((tr, idx) => {
                  const isMatched = matchedPairs.some((p) => p.endsWith(`::${tr}`));
                  const isSelected = selectedRight === tr;
                  return (
                    <button
                      key={idx}
                      disabled={isMatched}
                      onClick={() => handleSelectRight(tr)}
                      className={`w-full p-3 rounded-xl border text-sm font-bold text-center transition-all cursor-pointer ${
                        isMatched
                          ? 'opacity-30 border-emerald-500 bg-emerald-50 text-emerald-800'
                        : isSelected
                        ? 'border-emerald-600 bg-emerald-100 dark:bg-emerald-950 text-emerald-900 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {tr}
                    </button>
                  );
                })}
            </div>
          </div>
        </Card>
      ) : selectedMode === 'TYPE_ENGLISH' ? (
        /* MODE 2: TYPE ENGLISH WORD */
        <Card className="p-6 sm:p-8 space-y-6 shadow-xl text-center">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Type English Word</span>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
              {currentWord?.translations[0]?.translation || currentWord?.definitionSimple}
            </h3>
            {currentWord?.definitionSimple && (
              <p className="text-xs text-slate-500">{currentWord.definitionSimple}</p>
            )}
          </div>

          <form onSubmit={(e) => handleTypeCheck(e, currentWord.word)} className="space-y-4 pt-2">
            <input
              type="text"
              autoFocus
              disabled={isAnswered}
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="Type in English..."
              className="w-full px-4 py-3 text-center text-lg font-bold rounded-2xl border-2 border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500"
            />

            {!isAnswered ? (
              <Button type="submit" size="lg" variant="primary" className="w-full font-bold">
                Check Spelling
              </Button>
            ) : (
              <div className="space-y-4 animate-in fade-in">
                <div
                  className={`p-3 rounded-xl border text-sm font-bold ${
                    isCorrect ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-rose-300 bg-rose-50 text-rose-800'
                  }`}
                >
                  {isCorrect ? 'Perfect!' : `Target word: "${currentWord.word}"`}
                </div>
                <Button type="button" size="lg" variant="primary" onClick={handleNext} className="w-full font-bold">
                  Next Question
                </Button>
              </div>
            )}
          </form>
        </Card>
      ) : selectedMode === 'LISTENING' ? (
        /* MODE 3: LISTENING */
        <Card className="p-6 sm:p-8 space-y-6 shadow-xl text-center">
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Listen & Identify</span>
            <div className="flex justify-center pt-2">
              <AudioButton text={currentWord.word} size="lg" />
            </div>
            <p className="text-xs text-slate-500">Tap audio icon to replay pronunciation</p>
          </div>

          <div className="space-y-2 pt-2">
            {multipleChoiceOptions.map((opt, i) => (
              <button
                key={i}
                type="button"
                disabled={isAnswered}
                onClick={() => handleMultipleChoice(opt, correctTr)}
                className={`w-full p-3.5 rounded-2xl border-2 text-sm font-semibold text-center transition-all cursor-pointer ${
                  isAnswered
                    ? opt === correctTr
                      ? 'border-emerald-500 bg-emerald-100 text-emerald-900 font-bold'
                      : selectedAnswer === opt
                      ? 'border-rose-500 bg-rose-100 text-rose-900'
                      : 'border-slate-200'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {isAnswered && (
            <Button size="lg" variant="primary" onClick={handleNext} className="w-full font-bold animate-in fade-in">
              Next Question
            </Button>
          )}
        </Card>
      ) : (
        /* DEFAULT MULTIPLE CHOICE / SPEED ROUND / DIFFICULT WORDS */
        <Card className="p-6 sm:p-8 space-y-6 shadow-xl text-center">
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Badge variant="cefr" level={currentWord?.cefrLevel} />
              <AudioButton text={currentWord.word} size="sm" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
              {currentWord?.word}
            </h3>
            <p className="text-xs text-slate-500">{currentWord?.definitionSimple}</p>
          </div>

          <div className="space-y-2.5 pt-2">
            {multipleChoiceOptions.map((opt, i) => (
              <button
                key={i}
                type="button"
                disabled={isAnswered}
                onClick={() => handleMultipleChoice(opt, correctTr)}
                className={`w-full p-4 rounded-2xl border-2 text-sm font-semibold text-left flex items-center justify-between transition-all cursor-pointer ${
                  isAnswered
                    ? opt === correctTr
                      ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950 text-emerald-900 font-bold'
                      : selectedAnswer === opt
                      ? 'border-rose-500 bg-rose-100 dark:bg-rose-950 text-rose-900'
                      : 'border-slate-200'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{opt}</span>
                {isAnswered && opt === correctTr && <CheckCircle2 size={18} className="text-emerald-600" />}
                {isAnswered && selectedAnswer === opt && opt !== correctTr && <XCircle size={18} className="text-rose-600" />}
              </button>
            ))}
          </div>

          {isAnswered && (
            <Button size="lg" variant="primary" onClick={handleNext} className="w-full font-bold animate-in fade-in">
              Next Question
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
