import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateNextSrs, DEFAULT_EASE_FACTOR, MINIMUM_EASE_FACTOR } from './srs';
import { CurrentSrsState } from './srs';

describe('SM-2 Spaced Repetition Algorithm', () => {
  const baseDate = new Date('2026-01-01T00:00:00.000Z');

  it('resets repetition and interval to 1 on "Again" (rating 1) and increments lapses', () => {
    const current: CurrentSrsState = {
      interval: 10,
      repetition: 3,
      easeFactor: 2.5,
      lapses: 0,
      status: 'REVIEW',
    };

    const result = calculateNextSrs(current, 1, baseDate);

    assert.equal(result.repetition, 0);
    assert.equal(result.interval, 1);
    assert.equal(result.lapses, 1);
    assert.equal(result.status, 'LEARNING');
    assert.ok(result.easeFactor < 2.5, 'Ease factor should drop on failure');
    assert.ok(result.easeFactor >= MINIMUM_EASE_FACTOR);
  });

  it('handles first successful review (repetition 0 -> 1) with interval 1', () => {
    const current: CurrentSrsState = {
      interval: 0,
      repetition: 0,
      easeFactor: DEFAULT_EASE_FACTOR,
      lapses: 0,
      status: 'NEW',
    };

    const result = calculateNextSrs(current, 3, baseDate); // Good rating

    assert.equal(result.repetition, 1);
    assert.equal(result.interval, 1);
    assert.equal(result.status, 'REVIEW');
  });

  it('sets interval to 6 on second successful review (repetition 1 -> 2) with "Good"', () => {
    const current: CurrentSrsState = {
      interval: 1,
      repetition: 1,
      easeFactor: 2.5,
      lapses: 0,
      status: 'REVIEW',
    };

    const result = calculateNextSrs(current, 3, baseDate);

    assert.equal(result.repetition, 2);
    assert.equal(result.interval, 6);
    assert.equal(result.status, 'REVIEW');
  });

  it('scales interval by ease factor on subsequent reviews (repetition >= 2)', () => {
    const current: CurrentSrsState = {
      interval: 6,
      repetition: 2,
      easeFactor: 2.5,
      lapses: 0,
      status: 'REVIEW',
    };

    const result = calculateNextSrs(current, 3, baseDate);

    assert.equal(result.repetition, 3);
    assert.equal(result.interval, 15); // Math.round(6 * 2.5) = 15
    assert.equal(result.status, 'REVIEW');
  });

  it('promotes word to MASTERED when interval reaches or exceeds 21 days', () => {
    const current: CurrentSrsState = {
      interval: 15,
      repetition: 3,
      easeFactor: 2.5,
      lapses: 0,
      status: 'REVIEW',
    };

    const result = calculateNextSrs(current, 3, baseDate);

    assert.ok(result.interval >= 21);
    assert.equal(result.status, 'MASTERED');
  });

  it('never drops ease factor below the minimum boundary (1.3)', () => {
    let current: CurrentSrsState = {
      interval: 1,
      repetition: 0,
      easeFactor: 1.35,
      lapses: 5,
      status: 'LEARNING',
    };

    // Fail 10 times in a row
    for (let i = 0; i < 10; i++) {
      const res = calculateNextSrs(current, 1, baseDate);
      current = {
        interval: res.interval,
        repetition: res.repetition,
        easeFactor: res.easeFactor,
        lapses: res.lapses,
        status: res.status,
      };
    }

    assert.equal(current.easeFactor, MINIMUM_EASE_FACTOR);
  });
});
