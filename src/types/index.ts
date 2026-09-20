export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type UserRole = 'USER' | 'ADMIN';

export type WordStatus = 'NEW' | 'LEARNING' | 'REVIEW' | 'MASTERED';

export type ReviewRating = 1 | 2 | 3 | 4; // 1: Again, 2: Hard, 3: Good, 4: Easy

export interface UserSession {
  id: string;
  name: string | null;
  username: string;
  email: string;
  role: UserRole;
  cefrLevel: CefrLevel;
  learningGoal: string;
  dailyTargetWords: number;
}

export interface WordTranslationItem {
  id?: string;
  language: 'ru' | 'uz';
  translation: string;
  explanation?: string | null;
}

export interface WordExampleItem {
  id?: string;
  sentenceEn: string;
  sentenceRu?: string | null;
  sentenceUz?: string | null;
}

export interface WordItem {
  id: string;
  word: string;
  normalizedWord: string;
  partOfSpeech: string;
  cefrLevel: CefrLevel;
  ipa?: string | null;
  audioUrl?: string | null;
  definitionEn: string;
  definitionSimple: string;
  frequency?: number | null;
  difficulty: number;
  translations: WordTranslationItem[];
  examples: WordExampleItem[];
  synonyms?: string[];
  antonyms?: string[];
  topics?: string[];
  userWord?: {
    status: WordStatus;
    interval: number;
    repetition: number;
    easeFactor: number;
    lapses: number;
    nextReview: string;
    correctCount: number;
    incorrectCount: number;
  } | null;
}

export interface SrsCalculationResult {
  interval: number;
  repetition: number;
  easeFactor: number;
  status: WordStatus;
  nextReview: Date;
  lapses: number;
}

export interface LearningSessionSummary {
  sessionId: string;
  wordsCount: number;
  correctCount: number;
  accuracy: number;
  xpEarned: number;
  durationSeconds: number;
  streakUpdated: boolean;
  currentStreak: number;
  newAchievements: AchievementItem[];
}

export interface AchievementItem {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  xpReward: number;
  unlockedAt?: string | null;
}

export type PracticeMode =
  | 'MULTIPLE_CHOICE'
  | 'TYPE_TRANSLATION'
  | 'TYPE_ENGLISH'
  | 'LISTENING'
  | 'MATCH_PAIRS'
  | 'FILL_BLANK'
  | 'SENTENCE_TRANSLATION'
  | 'SPEED_ROUND'
  | 'DIFFICULT_WORDS'
  | 'RANDOM_CHALLENGE';

export interface UserStats {
  totalWordsLearned: number;
  wordsMastered: number;
  wordsLearning: number;
  wordsDueReview: number;
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
  level: number;
  accuracyRate: number;
  studyTimeMinutes: number;
  cefrDistribution: Record<CefrLevel, number>;
  weeklyActivity: Array<{
    date: string;
    wordsStudied: number;
    wordsReviewed: number;
    xpEarned: number;
  }>;
}
