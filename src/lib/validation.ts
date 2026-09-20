import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const onboardingSchema = z.object({
  cefrLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Not sure']),
  learningGoal: z.string().min(1, 'Please select a learning objective'),
  dailyTargetWords: z.number().int().min(5).max(50).default(10),
});

export const wordAdminSchema = z.object({
  word: z.string().min(1, 'Word is required').trim(),
  partOfSpeech: z.string().min(1, 'Part of speech is required').trim(),
  cefrLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
  ipa: z.string().optional().nullable(),
  definitionEn: z.string().min(3, 'English definition is required'),
  definitionSimple: z.string().min(3, 'Simple definition is required'),
  translationRu: z.string().min(1, 'Russian translation is required'),
  translationUz: z.string().min(1, 'Uzbek translation is required'),
  sentenceEn: z.string().min(5, 'Example English sentence is required'),
  sentenceRu: z.string().optional().nullable(),
  sentenceUz: z.string().optional().nullable(),
  synonyms: z.array(z.string()).optional(),
  antonyms: z.array(z.string()).optional(),
  topicSlugs: z.array(z.string()).optional(),
});

export const collectionSchema = z.object({
  name: z.string().min(2, 'Collection name must be at least 2 characters').max(100),
  description: z.string().max(300).optional(),
  icon: z.string().max(10).optional().default('📁'),
  isPublic: z.boolean().default(true),
});

export const reviewAnswerSchema = z.object({
  wordId: z.string().min(1),
  rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]), // 1=Again, 2=Hard, 3=Good, 4=Easy
  timeSpentMs: z.number().int().min(0).default(0),
});

export const sessionCompleteSchema = z.object({
  sessionType: z.enum(['LESSON', 'REVIEW', 'PRACTICE']),
  mode: z.string().min(1),
  wordsCount: z.number().int().min(0),
  correctCount: z.number().int().min(0),
  durationSeconds: z.number().int().min(0),
  wordIds: z.array(z.string()),
});

export const aiTutorMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(1000, 'Message is too long (max 1000 characters)'),
  currentWord: z.string().max(100).optional(),
  context: z.string().max(500).optional(),
});
