import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateReviewXp,
  calculateLessonXp,
  calculateUserLevel,
  calculateStreak,
  XP_RULES,
} from './xp';

describe('Gamification: XP, Levels, and Streaks', () => {
  describe('calculateReviewXp', () => {
    it('awards correct XP values for SM-2 ratings', () => {
      assert.equal(calculateReviewXp(1), XP_RULES.REVIEW_AGAIN); // 1
      assert.equal(calculateReviewXp(2), XP_RULES.REVIEW_HARD);  // 3
      assert.equal(calculateReviewXp(3), XP_RULES.REVIEW_GOOD);  // 5
      assert.equal(calculateReviewXp(4), XP_RULES.REVIEW_EASY);  // 7
    });
  });

  describe('calculateLessonXp', () => {
    it('calculates base lesson XP plus word XP', () => {
      const xp = calculateLessonXp(5, 3); // 5 words, 3 correct
      // Base: 20, words: 5 * 10 = 50, bonus: 0 -> total 70
      assert.equal(xp, 70);
    });

    it('adds perfect bonus when all words are answered correctly', () => {
      const xp = calculateLessonXp(5, 5);
      // Base: 20, words: 50, perfect bonus: 15 -> total 85
      assert.equal(xp, 85);
    });
  });

  describe('calculateUserLevel', () => {
    it('places 0 XP at Level 1', () => {
      const result = calculateUserLevel(0);
      assert.equal(result.level, 1);
      assert.equal(result.currentLevelXp, 0);
    });

    it('progresses to Level 2 at 50 XP', () => {
      const result = calculateUserLevel(50);
      assert.equal(result.level, 2);
    });

    it('progresses to Level 3 at 200 XP', () => {
      const result = calculateUserLevel(200);
      assert.equal(result.level, 3);
    });

    it('calculates progress percentage correctly within current level band', () => {
      // Level 2 band: 50 to 200 (range 150)
      // At 125 XP: (125 - 50) = 75 / 150 = 50%
      const result = calculateUserLevel(125);
      assert.equal(result.level, 2);
      assert.equal(result.currentLevelXp, 75);
      assert.equal(result.progressPercent, 50);
    });
  });

  describe('calculateStreak', () => {
    it('returns 0 for empty activity logs', () => {
      const result = calculateStreak([]);
      assert.equal(result.currentStreak, 0);
      assert.equal(result.longestStreak, 0);
    });

    it('calculates consecutive active streak including today', () => {
      const dates = ['2026-03-20', '2026-03-19', '2026-03-18', '2026-03-17'];
      const result = calculateStreak(dates, '2026-03-20');
      assert.equal(result.currentStreak, 4);
      assert.equal(result.longestStreak, 4);
    });

    it('preserves streak if user has not yet studied today but studied yesterday', () => {
      const dates = ['2026-03-19', '2026-03-18', '2026-03-17'];
      const result = calculateStreak(dates, '2026-03-20');
      assert.equal(result.currentStreak, 3);
      assert.equal(result.longestStreak, 3);
    });

    it('breaks current streak if user missed yesterday and today', () => {
      const dates = ['2026-03-17', '2026-03-16'];
      const result = calculateStreak(dates, '2026-03-20');
      assert.equal(result.currentStreak, 0);
      assert.equal(result.longestStreak, 2);
    });
  });
});
