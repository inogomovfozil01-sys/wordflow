import { ReviewRating } from '@/types';

export const XP_RULES = {
  NEW_WORD_LEARNED: 10,
  REVIEW_AGAIN: 1,
  REVIEW_HARD: 3,
  REVIEW_GOOD: 5,
  REVIEW_EASY: 7,
  LESSON_COMPLETE: 20,
  PERFECT_SESSION_BONUS: 15,
  DAILY_GOAL_MET_BONUS: 25,
} as const;

export function calculateReviewXp(rating: ReviewRating): number {
  switch (rating) {
    case 4:
      return XP_RULES.REVIEW_EASY;
    case 3:
      return XP_RULES.REVIEW_GOOD;
    case 2:
      return XP_RULES.REVIEW_HARD;
    case 1:
      return XP_RULES.REVIEW_AGAIN;
    default:
      return 1;
  }
}

export function calculateLessonXp(wordsCount: number, correctCount: number): number {
  const baseLessonXp = XP_RULES.LESSON_COMPLETE;
  const wordXp = wordsCount * XP_RULES.NEW_WORD_LEARNED;
  const isPerfect = wordsCount > 0 && correctCount === wordsCount;
  const perfectBonus = isPerfect ? XP_RULES.PERFECT_SESSION_BONUS : 0;

  return baseLessonXp + wordXp + perfectBonus;
}

export function calculateUserLevel(totalXp: number): {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
} {
  // Level formula: Level L requires 50 * (L - 1)^2 total XP
  // L = 1: 0 XP
  // L = 2: 50 XP
  // L = 3: 200 XP
  // L = 4: 450 XP
  // L = 5: 800 XP
  const level = Math.floor(Math.sqrt(Math.max(0, totalXp) / 50)) + 1;
  const xpForCurrentLevel = 50 * Math.pow(level - 1, 2);
  const xpForNextLevel = 50 * Math.pow(level, 2);

  const range = xpForNextLevel - xpForCurrentLevel;
  const progressInLevel = Math.max(0, totalXp - xpForCurrentLevel);
  const progressPercent = Math.min(100, Math.round((progressInLevel / (range || 1)) * 100));

  return {
    level,
    currentLevelXp: progressInLevel,
    nextLevelXp: range,
    progressPercent,
  };
}

/**
 * Calculates streak given an array of unique sorted activity dates (YYYY-MM-DD desc).
 */
export function calculateStreak(dates: string[], todayStr?: string): { currentStreak: number; longestStreak: number } {
  if (!dates || dates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const today = todayStr || new Date().toISOString().slice(0, 10);
  const sortedDates = Array.from(new Set(dates)).sort().reverse();

  let currentStreak = 0;
  let checkDate = new Date(today);

  // Check if today or yesterday exists
  const hasToday = sortedDates.includes(today);
  const yesterday = new Date(checkDate.getTime() - 86400000).toISOString().slice(0, 10);
  const hasYesterday = sortedDates.includes(yesterday);

  if (!hasToday && !hasYesterday) {
    currentStreak = 0;
  } else {
    // Traverse backwards day-by-day
    let cur = hasToday ? new Date(today) : new Date(yesterday);
    while (true) {
      const formatted = cur.toISOString().slice(0, 10);
      if (sortedDates.includes(formatted)) {
        currentStreak++;
        cur = new Date(cur.getTime() - 86400000);
      } else {
        break;
      }
    }
  }

  // Calculate longest historical streak
  let longestStreak = 0;
  let running = 0;
  const chronological = [...sortedDates].reverse();

  for (let i = 0; i < chronological.length; i++) {
    if (i === 0) {
      running = 1;
    } else {
      const prev = new Date(chronological[i - 1]);
      const expectedNext = new Date(prev.getTime() + 86400000).toISOString().slice(0, 10);
      if (chronological[i] === expectedNext) {
        running++;
      } else {
        running = 1;
      }
    }
    if (running > longestStreak) {
      longestStreak = running;
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(currentStreak, longestStreak),
  };
}
