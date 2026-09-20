import prisma from '@/lib/db';
import { calculateLessonXp, calculateStreak } from '@/lib/xp';
import { CefrLevel, PracticeMode, WordItem } from '@/types';

export async function getLessonWords(userId: string, count = 5): Promise<WordItem[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { settings: true },
  });

  const level = (user?.settings?.cefrLevel as CefrLevel) || 'A1';

  // Words user has already studied
  const studiedWordIds = (
    await prisma.userWord.findMany({
      where: { userId },
      select: { wordId: true },
    })
  ).map((uw) => uw.wordId);

  // 1. Try finding unstudied words at user's exact CEFR level
  let words = await prisma.word.findMany({
    where: {
      id: { notIn: studiedWordIds },
      cefrLevel: level,
    },
    take: count,
    include: {
      translations: true,
      examples: true,
      topics: { include: { topic: true } },
      relations: true,
    },
  });

  // 2. If not enough words at exact level, widen to any unstudied level
  if (words.length < count) {
    const additional = await prisma.word.findMany({
      where: {
        id: { notIn: [...studiedWordIds, ...words.map((w) => w.id)] },
      },
      take: count - words.length,
      include: {
        translations: true,
        examples: true,
        topics: { include: { topic: true } },
        relations: true,
      },
    });
    words = [...words, ...additional];
  }

  // 3. If user studied everything, pick words currently in LEARNING status to reinforce
  if (words.length < count) {
    const reinforce = await prisma.word.findMany({
      where: {
        id: { notIn: words.map((w) => w.id) },
      },
      take: count - words.length,
      include: {
        translations: true,
        examples: true,
        topics: { include: { topic: true } },
        relations: true,
      },
    });
    words = [...words, ...reinforce];
  }

  return words.map((w) => ({
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
    synonyms: w.relations.filter((r) => r.type === 'SYNONYM').map((r) => r.relatedWord),
    antonyms: w.relations.filter((r) => r.type === 'ANTONYM').map((r) => r.relatedWord),
  }));
}

export async function completeLessonSession(
  userId: string,
  params: {
    wordsCount: number;
    correctCount: number;
    durationSeconds: number;
    wordIds: string[];
    mode: string;
    sessionType?: 'LESSON' | 'PRACTICE' | 'REVIEW';
  }
) {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const xpEarned = calculateLessonXp(params.wordsCount, params.correctCount);
  const sessionType = params.sessionType || 'LESSON';

  return await prisma.$transaction(async (tx) => {
    // 1. Create LearningSession
    const session = await tx.learningSession.create({
      data: {
        userId,
        sessionType,
        mode: params.mode,
        wordsCount: params.wordsCount,
        correctCount: params.correctCount,
        xpEarned,
        durationSeconds: params.durationSeconds,
        completedAt: now,
      },
    });

    // 2. Upsert UserWord entries for each studied word
    for (const wordId of params.wordIds) {
      await tx.userWord.upsert({
        where: { userId_wordId: { userId, wordId } },
        update: {
          status: 'LEARNING',
          correctCount: { increment: 1 },
          lastReviewed: now,
        },
        create: {
          userId,
          wordId,
          status: 'LEARNING',
          interval: 1,
          repetition: 1,
          easeFactor: 2.5,
          nextReview: new Date(now.getTime() + 86400000), // Due in 24 hours
          correctCount: 1,
        },
      });
    }

    // 3. Update DailyActivity
    await tx.dailyActivity.upsert({
      where: { userId_date: { userId, date: todayStr } },
      update: {
        wordsStudied: { increment: params.wordsCount },
        xpEarned: { increment: xpEarned },
        timeSpentSeconds: { increment: params.durationSeconds },
      },
      create: {
        userId,
        date: todayStr,
        wordsStudied: params.wordsCount,
        xpEarned,
        timeSpentSeconds: params.durationSeconds,
      },
    });

    // 4. Calculate streak & check achievements
    const allActivities = await tx.dailyActivity.findMany({
      where: { userId },
      select: { date: true },
    });
    const streakData = calculateStreak(allActivities.map((a) => a.date));

    const totalWordsStudied = await tx.userWord.count({ where: { userId } });

    // Check achievement triggers
    const achievementsToUnlock: string[] = [];
    if (totalWordsStudied >= 1) achievementsToUnlock.push('FIRST_WORD');
    if (totalWordsStudied >= 10) achievementsToUnlock.push('WORDS_10');
    if (totalWordsStudied >= 50) achievementsToUnlock.push('WORDS_50');
    if (totalWordsStudied >= 100) achievementsToUnlock.push('WORDS_100');
    if (params.wordsCount > 0 && params.correctCount === params.wordsCount) {
      achievementsToUnlock.push('PERFECT_LESSON');
    }
    if (streakData.currentStreak >= 3) achievementsToUnlock.push('STREAK_3');
    if (streakData.currentStreak >= 7) achievementsToUnlock.push('STREAK_7');
    if (streakData.currentStreak >= 30) achievementsToUnlock.push('STREAK_30');

    const unlockedBadges = [];
    for (const code of achievementsToUnlock) {
      const ach = await tx.achievement.findUnique({ where: { code } });
      if (ach) {
        const alreadyHas = await tx.userAchievement.findUnique({
          where: { userId_achievementId: { userId, achievementId: ach.id } },
        });
        if (!alreadyHas) {
          await tx.userAchievement.create({
            data: { userId, achievementId: ach.id },
          });
          unlockedBadges.push(ach);
        }
      }
    }

    return {
      session,
      xpEarned,
      accuracy: params.wordsCount > 0 ? Math.round((params.correctCount / params.wordsCount) * 100) : 100,
      currentStreak: streakData.currentStreak,
      unlockedAchievements: unlockedBadges,
    };
  });
}

export async function getPracticeSessionWords(
  userId: string,
  mode: PracticeMode,
  count = 10
): Promise<WordItem[]> {
  // If "DIFFICULT_WORDS", prioritize words with lapses > 0 or low ease factor
  if (mode === 'DIFFICULT_WORDS') {
    const difficult = await prisma.userWord.findMany({
      where: {
        userId,
        OR: [{ lapses: { gt: 0 } }, { easeFactor: { lt: 2.2 } }, { incorrectCount: { gt: 0 } }],
      },
      take: count,
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

    if (difficult.length > 0) {
      return difficult.map((uw) => ({
        id: uw.word.id,
        word: uw.word.word,
        normalizedWord: uw.word.normalizedWord,
        partOfSpeech: uw.word.partOfSpeech,
        cefrLevel: uw.word.cefrLevel,
        ipa: uw.word.ipa,
        definitionEn: uw.word.definitionEn,
        definitionSimple: uw.word.definitionSimple,
        difficulty: uw.word.difficulty,
        translations: uw.word.translations.map((t) => ({
          id: t.id,
          language: t.language as 'ru' | 'uz',
          translation: t.translation,
        })),
        examples: uw.word.examples.map((e) => ({
          id: e.id,
          sentenceEn: e.sentenceEn,
          sentenceRu: e.sentenceRu,
          sentenceUz: e.sentenceUz,
        })),
      }));
    }
  }

  // Default: Get available words for user's practice
  const words = await prisma.word.findMany({
    take: count,
    orderBy: { frequency: 'asc' },
    include: {
      translations: true,
      examples: true,
      topics: { include: { topic: true } },
      relations: true,
    },
  });

  return words.map((w) => ({
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
  }));
}
