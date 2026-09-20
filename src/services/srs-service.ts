import prisma from '@/lib/db';
import { calculateNextSrs } from '@/lib/srs';
import { calculateReviewXp } from '@/lib/xp';
import { ReviewRating, WordItem } from '@/types';

export async function getDueReviewWords(userId: string, limit = 20): Promise<WordItem[]> {
  const now = new Date();

  const userWords = await prisma.userWord.findMany({
    where: {
      userId,
      nextReview: { lte: now },
    },
    orderBy: { nextReview: 'asc' },
    take: limit,
    include: {
      word: {
        include: {
          translations: true,
          examples: true,
          topics: { include: { topic: true } },
          relations: true,
        },
      },
    },
  });

  return userWords.map((uw) => ({
    id: uw.word.id,
    word: uw.word.word,
    normalizedWord: uw.word.normalizedWord,
    partOfSpeech: uw.word.partOfSpeech,
    cefrLevel: uw.word.cefrLevel,
    ipa: uw.word.ipa,
    audioUrl: uw.word.audioUrl,
    definitionEn: uw.word.definitionEn,
    definitionSimple: uw.word.definitionSimple,
    difficulty: uw.word.difficulty,
    translations: uw.word.translations.map((t) => ({
      id: t.id,
      language: t.language as 'ru' | 'uz',
      translation: t.translation,
      explanation: t.explanation,
    })),
    examples: uw.word.examples.map((e) => ({
      id: e.id,
      sentenceEn: e.sentenceEn,
      sentenceRu: e.sentenceRu,
      sentenceUz: e.sentenceUz,
    })),
    topics: uw.word.topics.map((t) => t.topic.name),
    synonyms: uw.word.relations.filter((r) => r.type === 'SYNONYM').map((r) => r.relatedWord),
    antonyms: uw.word.relations.filter((r) => r.type === 'ANTONYM').map((r) => r.relatedWord),
    userWord: {
      status: uw.status,
      interval: uw.interval,
      repetition: uw.repetition,
      easeFactor: uw.easeFactor,
      lapses: uw.lapses,
      nextReview: uw.nextReview.toISOString(),
      correctCount: uw.correctCount,
      incorrectCount: uw.incorrectCount,
    },
  }));
}

export async function submitWordReview(
  userId: string,
  wordId: string,
  rating: ReviewRating,
  timeSpentMs = 0
) {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  // 1. Fetch current UserWord
  let userWord = await prisma.userWord.findUnique({
    where: {
      userId_wordId: { userId, wordId },
    },
  });

  if (!userWord) {
    userWord = await prisma.userWord.create({
      data: {
        userId,
        wordId,
        status: 'NEW',
        interval: 0,
        repetition: 0,
        easeFactor: 2.5,
        lapses: 0,
        nextReview: now,
      },
    });
  }

  // 2. Calculate updated SRS
  const srsNext = calculateNextSrs(
    {
      interval: userWord.interval,
      repetition: userWord.repetition,
      easeFactor: userWord.easeFactor,
      lapses: userWord.lapses,
      status: userWord.status,
    },
    rating,
    now
  );

  const xpEarned = calculateReviewXp(rating);
  const isCorrect = rating >= 2;

  // 3. Persist atomically in a transaction
  return await prisma.$transaction(async (tx) => {
    // Record review log
    const review = await tx.review.create({
      data: {
        userId,
        wordId,
        rating,
        intervalBefore: userWord.interval,
        intervalAfter: srsNext.interval,
        easeFactorBefore: userWord.easeFactor,
        easeFactorAfter: srsNext.easeFactor,
        timeSpentMs,
        reviewedAt: now,
      },
    });

    // Update user word
    const updatedUserWord = await tx.userWord.update({
      where: { id: userWord.id },
      data: {
        status: srsNext.status,
        interval: srsNext.interval,
        repetition: srsNext.repetition,
        easeFactor: srsNext.easeFactor,
        lapses: srsNext.lapses,
        lastReviewed: now,
        nextReview: srsNext.nextReview,
        correctCount: isCorrect ? userWord.correctCount + 1 : userWord.correctCount,
        incorrectCount: !isCorrect ? userWord.incorrectCount + 1 : userWord.incorrectCount,
      },
    });

    // Update daily activity
    await tx.dailyActivity.upsert({
      where: {
        userId_date: { userId, date: todayStr },
      },
      update: {
        wordsReviewed: { increment: 1 },
        xpEarned: { increment: xpEarned },
        timeSpentSeconds: { increment: Math.max(1, Math.round(timeSpentMs / 1000)) },
      },
      create: {
        userId,
        date: todayStr,
        wordsReviewed: 1,
        xpEarned,
        timeSpentSeconds: Math.max(1, Math.round(timeSpentMs / 1000)),
      },
    });

    // Check review count achievements
    const totalReviews = await tx.review.count({ where: { userId } });
    if (totalReviews >= 25) {
      const ach = await tx.achievement.findUnique({ where: { code: 'REVIEW_MASTER' } });
      if (ach) {
        await tx.userAchievement.upsert({
          where: { userId_achievementId: { userId, achievementId: ach.id } },
          update: {},
          create: { userId, achievementId: ach.id },
        });
      }
    }

    return {
      review,
      updatedUserWord,
      srsNext,
      xpEarned,
    };
  });
}
