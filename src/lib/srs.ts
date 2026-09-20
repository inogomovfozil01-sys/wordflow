import { ReviewRating, SrsCalculationResult, WordStatus } from '@/types';

export interface CurrentSrsState {
  interval: number;
  repetition: number;
  easeFactor: number;
  lapses: number;
  status: WordStatus;
}

export const MINIMUM_EASE_FACTOR = 1.3;
export const DEFAULT_EASE_FACTOR = 2.5;

/**
 * Calculates updated SM-2 spaced repetition state based on user rating.
 *
 * @param current - Current word repetition metrics
 * @param rating - 1: Again, 2: Hard, 3: Good, 4: Easy
 * @param now - Base timestamp (defaults to Date.now())
 */
export function calculateNextSrs(
  current: CurrentSrsState,
  rating: ReviewRating,
  now: Date = new Date()
): SrsCalculationResult {
  // Map 1-4 rating to standard SM-2 0-5 scale
  // 1 (Again) -> 1
  // 2 (Hard)  -> 3
  // 3 (Good)  -> 4
  // 4 (Easy)  -> 5
  const gradeMap: Record<ReviewRating, number> = {
    1: 1,
    2: 3,
    3: 4,
    4: 5,
  };

  const grade = gradeMap[rating];
  const oldEf = current.easeFactor > 0 ? current.easeFactor : DEFAULT_EASE_FACTOR;

  // Calculate new Ease Factor using SuperMemo formula:
  // EF' = EF + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
  const delta = 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02);
  const newEaseFactor = Math.max(MINIMUM_EASE_FACTOR, Number((oldEf + delta).toFixed(2)));

  let newInterval: number;
  let newRepetition: number;
  let newLapses = current.lapses;
  let newStatus: WordStatus;

  if (grade < 3) {
    // Rating was "Again" (failure)
    newRepetition = 0;
    newInterval = 1; // Schedule for 1 day (or immediate review)
    newLapses += 1;
    newStatus = 'LEARNING';
  } else {
    // Rating was Hard (3), Good (4), or Easy (5)
    if (current.repetition === 0) {
      newInterval = 1;
    } else if (current.repetition === 1) {
      newInterval = rating === 2 ? 3 : 6;
    } else {
      newInterval = Math.max(1, Math.round(current.interval * newEaseFactor));
      if (rating === 4) {
        // Bonus day for easy rating
        newInterval += 1;
      }
    }

    newRepetition = current.repetition + 1;
    // If intervals exceed 21 days with successful repetitions, mark as MASTERED
    newStatus = newInterval >= 21 ? 'MASTERED' : 'REVIEW';
  }

  const nextReview = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);

  return {
    interval: newInterval,
    repetition: newRepetition,
    easeFactor: newEaseFactor,
    status: newStatus,
    nextReview,
    lapses: newLapses,
  };
}
