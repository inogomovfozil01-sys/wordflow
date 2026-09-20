import prisma from '@/lib/db';
import { CefrLevel, WordItem } from '@/types';
import { Prisma } from '@prisma/client';

export interface SearchWordsParams {
  query?: string;
  cefr?: CefrLevel | 'ALL';
  topic?: string;
  partOfSpeech?: string;
  page?: number;
  limit?: number;
  userId?: string;
}

export async function searchWords({
  query,
  cefr,
  topic,
  partOfSpeech,
  page = 1,
  limit = 20,
  userId,
}: SearchWordsParams) {
  const skip = (page - 1) * limit;

  const where: Prisma.WordWhereInput = {};

  if (query && query.trim() !== '') {
    const clean = query.trim().toLowerCase();
    where.OR = [
      { word: { contains: clean, mode: 'insensitive' } },
      { normalizedWord: { contains: clean, mode: 'insensitive' } },
      { definitionEn: { contains: clean, mode: 'insensitive' } },
      {
        translations: {
          some: {
            translation: { contains: clean, mode: 'insensitive' },
          },
        },
      },
    ];
  }

  if (cefr && cefr !== 'ALL') {
    where.cefrLevel = cefr as CefrLevel;
  }

  if (partOfSpeech && partOfSpeech !== 'ALL') {
    where.partOfSpeech = partOfSpeech;
  }

  if (topic && topic !== 'ALL') {
    where.topics = {
      some: {
        topic: {
          slug: topic,
        },
      },
    };
  }

  const [total, words] = await Promise.all([
    prisma.word.count({ where }),
    prisma.word.findMany({
      where,
      skip,
      take: limit,
      orderBy: { word: 'asc' },
      include: {
        translations: true,
        examples: { take: 2 },
        topics: { include: { topic: true } },
        relations: true,
        ...(userId
          ? {
              userWords: {
                where: { userId },
                take: 1,
              },
            }
          : {}),
      },
    }),
  ]);

  const items: WordItem[] = words.map((w) => {
    const userWord = userId && w.userWords && w.userWords.length > 0 ? w.userWords[0] : null;

    return {
      id: w.id,
      word: w.word,
      normalizedWord: w.normalizedWord,
      partOfSpeech: w.partOfSpeech,
      cefrLevel: w.cefrLevel as CefrLevel,
      ipa: w.ipa,
      audioUrl: w.audioUrl,
      definitionEn: w.definitionEn,
      definitionSimple: w.definitionSimple,
      difficulty: w.difficulty,
      translations: w.translations.map((t) => ({
        id: t.id,
        language: t.language as 'ru' | 'uz',
        translation: t.translation,
        explanation: t.explanation,
      })),
      examples: w.examples.map((e) => ({
        id: e.id,
        sentenceEn: e.sentenceEn,
        sentenceRu: e.sentenceRu,
        sentenceUz: e.sentenceUz,
      })),
      topics: w.topics.map((t) => t.topic.name),
      synonyms: w.relations.filter((r) => r.type === 'SYNONYM').map((r) => r.relatedWord),
      antonyms: w.relations.filter((r) => r.type === 'ANTONYM').map((r) => r.relatedWord),
      userWord: userWord
        ? {
            status: userWord.status,
            interval: userWord.interval,
            repetition: userWord.repetition,
            easeFactor: userWord.easeFactor,
            lapses: userWord.lapses,
            nextReview: userWord.nextReview.toISOString(),
            correctCount: userWord.correctCount,
            incorrectCount: userWord.incorrectCount,
          }
        : null,
    };
  });

  return {
    words: items,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getWordDetail(wordOrSlug: string, userId?: string): Promise<WordItem | null> {
  const clean = wordOrSlug.toLowerCase().trim();

  const w = await prisma.word.findFirst({
    where: {
      OR: [{ normalizedWord: clean }, { word: { equals: clean, mode: 'insensitive' } }],
    },
    include: {
      translations: true,
      examples: true,
      topics: { include: { topic: true } },
      relations: true,
      ...(userId
        ? {
            userWords: {
              where: { userId },
              take: 1,
            },
          }
        : {}),
    },
  });

  if (!w) return null;

  const userWord = userId && w.userWords && w.userWords.length > 0 ? w.userWords[0] : null;

  return {
    id: w.id,
    word: w.word,
    normalizedWord: w.normalizedWord,
    partOfSpeech: w.partOfSpeech,
    cefrLevel: w.cefrLevel as CefrLevel,
    ipa: w.ipa,
    audioUrl: w.audioUrl,
    definitionEn: w.definitionEn,
    definitionSimple: w.definitionSimple,
    difficulty: w.difficulty,
    translations: w.translations.map((t) => ({
      id: t.id,
      language: t.language as 'ru' | 'uz',
      translation: t.translation,
      explanation: t.explanation,
    })),
    examples: w.examples.map((e) => ({
      id: e.id,
      sentenceEn: e.sentenceEn,
      sentenceRu: e.sentenceRu,
      sentenceUz: e.sentenceUz,
    })),
    topics: w.topics.map((t) => t.topic.name),
    synonyms: w.relations.filter((r) => r.type === 'SYNONYM').map((r) => r.relatedWord),
    antonyms: w.relations.filter((r) => r.type === 'ANTONYM').map((r) => r.relatedWord),
    userWord: userWord
      ? {
          status: userWord.status,
          interval: userWord.interval,
          repetition: userWord.repetition,
          easeFactor: userWord.easeFactor,
          lapses: userWord.lapses,
          nextReview: userWord.nextReview.toISOString(),
          correctCount: userWord.correctCount,
          incorrectCount: userWord.incorrectCount,
        }
      : null,
  };
}

export async function getAllTopics() {
  return await prisma.topic.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { words: true } },
    },
  });
}
