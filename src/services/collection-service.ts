import prisma from '@/lib/db';
import { WordItem } from '@/types';

export async function getCollections(userId?: string) {
  const collections = await prisma.collection.findMany({
    where: {
      OR: [
        { isOfficial: true },
        ...(userId ? [{ creatorId: userId }] : [{ isPublic: true }]),
      ],
    },
    orderBy: [{ isOfficial: 'desc' }, { createdAt: 'desc' }],
    include: {
      _count: { select: { words: true } },
    },
  });

  return collections.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    isOfficial: c.isOfficial,
    icon: c.icon || '📁',
    isCreator: userId ? c.creatorId === userId : false,
    wordCount: c._count.words,
  }));
}

export async function getCollectionBySlug(slug: string, userId?: string) {
  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: {
      words: {
        orderBy: { order: 'asc' },
        include: {
          word: {
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
          },
        },
      },
    },
  });

  if (!collection) return null;

  const words: WordItem[] = collection.words.map((cw) => {
    const w = cw.word;
    const userWord = userId && w.userWords && w.userWords.length > 0 ? w.userWords[0] : null;

    return {
      id: w.id,
      word: w.word,
      normalizedWord: w.normalizedWord,
      partOfSpeech: w.partOfSpeech,
      cefrLevel: w.cefrLevel,
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
    id: collection.id,
    name: collection.name,
    slug: collection.slug,
    description: collection.description,
    isOfficial: collection.isOfficial,
    icon: collection.icon || '📁',
    isCreator: userId ? collection.creatorId === userId : false,
    words,
  };
}

export async function createCustomCollection(
  userId: string,
  data: { name: string; description?: string; icon?: string; isPublic?: boolean }
) {
  const slug = `${data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;

  return await prisma.collection.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      icon: data.icon || '📁',
      isPublic: data.isPublic ?? true,
      isOfficial: false,
      creatorId: userId,
    },
  });
}

export async function deleteCustomCollection(userId: string, collectionId: string) {
  const existing = await prisma.collection.findUnique({
    where: { id: collectionId },
  });

  if (!existing || existing.creatorId !== userId) {
    throw new Error('Unauthorized or collection not found');
  }

  return await prisma.collection.delete({
    where: { id: collectionId },
  });
}

export async function toggleWordInCollection(userId: string, collectionId: string, wordId: string) {
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
  });

  if (!collection || collection.creatorId !== userId) {
    throw new Error('Unauthorized or collection not found');
  }

  const existing = await prisma.collectionWord.findUnique({
    where: {
      collectionId_wordId: { collectionId, wordId },
    },
  });

  if (existing) {
    await prisma.collectionWord.delete({
      where: { id: existing.id },
    });
    return { added: false };
  } else {
    const count = await prisma.collectionWord.count({ where: { collectionId } });
    await prisma.collectionWord.create({
      data: {
        collectionId,
        wordId,
        order: count,
      },
    });
    return { added: true };
  }
}
