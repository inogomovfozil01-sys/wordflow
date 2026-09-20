import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  registerSchema,
  loginSchema,
  reviewAnswerSchema,
  wordAdminSchema,
  onboardingSchema,
  collectionSchema,
} from './validation';

describe('Zod Validation Schemas', () => {
  describe('registerSchema', () => {
    it('accepts valid registration payload', () => {
      const payload = {
        name: 'Jane Learner',
        username: 'learner_01',
        email: 'learner@example.com',
        password: 'Password123!',
      };
      const result = registerSchema.safeParse(payload);
      assert.ok(result.success);
    });

    it('rejects passwords shorter than 6 characters', () => {
      const payload = {
        name: 'Jane Learner',
        email: 'learner@example.com',
        password: 'Pass',
        username: 'learner_01',
      };
      const result = registerSchema.safeParse(payload);
      assert.ok(!result.success);
    });

    it('rejects invalid email formats', () => {
      const payload = {
        name: 'Jane Learner',
        email: 'not-an-email',
        password: 'Password123!',
        username: 'learner_01',
      };
      const result = registerSchema.safeParse(payload);
      assert.ok(!result.success);
    });

    it('rejects invalid characters in username', () => {
      const payload = {
        name: 'Jane Learner',
        email: 'learner@example.com',
        password: 'Password123!',
        username: 'learner@bad!name',
      };
      const result = registerSchema.safeParse(payload);
      assert.ok(!result.success);
    });
  });

  describe('reviewAnswerSchema', () => {
    it('accepts valid review ratings between 1 and 4', () => {
      [1, 2, 3, 4].forEach((rating) => {
        const result = reviewAnswerSchema.safeParse({
          wordId: 'word_123',
          rating: rating as 1 | 2 | 3 | 4,
          timeSpentMs: 4500,
        });
        assert.ok(result.success, `Rating ${rating} should be valid`);
      });
    });

    it('rejects invalid ratings like 0 or 5', () => {
      const invalid0 = reviewAnswerSchema.safeParse({
        wordId: 'word_123',
        rating: 0,
      });
      assert.ok(!invalid0.success);

      const invalid5 = reviewAnswerSchema.safeParse({
        wordId: 'word_123',
        rating: 5,
      });
      assert.ok(!invalid5.success);
    });
  });

  describe('wordAdminSchema', () => {
    it('validates CEFR levels and required bilingual translations', () => {
      const valid = {
        word: 'diligent',
        partOfSpeech: 'adjective',
        cefrLevel: 'B2',
        definitionEn: 'Having or showing care and conscientiousness in one\'s work or duties.',
        definitionSimple: 'Working hard and carefully.',
        translationRu: 'прилежный, старательный',
        translationUz: 'tirishqoq, quntli',
        sentenceEn: 'She was a diligent student who never missed a class.',
      };
      const result = wordAdminSchema.safeParse(valid);
      assert.ok(result.success);
    });

    it('rejects invalid CEFR levels', () => {
      const invalid = {
        word: 'diligent',
        partOfSpeech: 'adjective',
        cefrLevel: 'Z9', // Invalid
        definitionEn: 'Test definition',
        definitionSimple: 'Test simple',
        translationRu: 'тест',
        translationUz: 'test',
        sentenceEn: 'Test sentence.',
      };
      const result = wordAdminSchema.safeParse(invalid);
      assert.ok(!result.success);
    });
  });

  describe('collectionSchema', () => {
    it('accepts valid custom collection', () => {
      const valid = {
        name: 'My Job Interview Words',
        description: 'Key vocabulary for tech behavioral interviews',
        icon: '💼',
        isPublic: true,
      };
      const result = collectionSchema.safeParse(valid);
      assert.ok(result.success);
    });

    it('rejects collection name shorter than 2 characters', () => {
      const invalid = {
        name: 'a',
      };
      const result = collectionSchema.safeParse(invalid);
      assert.ok(!result.success);
    });
  });
});
