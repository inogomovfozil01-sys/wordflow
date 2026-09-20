import prisma from '@/lib/db';
import { calculateStreak, calculateUserLevel } from '@/lib/xp';
import { CefrLevel, UserStats } from '@/types';

export async function getUserStats(userId: string): Promise<UserStats> {
  const now = new Date();

  const [userWords, dailyActivities, totalReviews, correctReviews] = await Promise.all([
    prisma.userWord.findMany({
      where: { userId },
      select: {
        status: true,
        word: { select: { cefrLevel: true } },
      },
    }),
    prisma.dailyActivity.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 30,
    }),
    prisma.review.count({ where: { userId } }),
    prisma.review.count({ where: { userId, rating: { gte: 2 } } }),
  ]);

  const totalWordsLearned = userWords.length;
  const wordsMastered = userWords.filter((w) => w.status === 'MASTERED').length;
  const wordsLearning = userWords.filter((w) => w.status === 'LEARNING').length;

  const wordsDueReview = await prisma.userWord.count({
    where: {
      userId,
      nextReview: { lte: now },
    },
  });

  const totalXp = dailyActivities.reduce((acc, d) => acc + d.xpEarned, 0);
  const totalSeconds = dailyActivities.reduce((acc, d) => acc + d.timeSpentSeconds, 0);

  const streakData = calculateStreak(dailyActivities.map((d) => d.date));
  const levelData = calculateUserLevel(totalXp);

  const accuracyRate =
    totalReviews > 0 ? Math.round((correctReviews / totalReviews) * 100) : 100;

  const cefrDistribution: Record<CefrLevel, number> = {
    A1: 0,
    A2: 0,
    B1: 0,
    B2: 0,
    C1: 0,
    C2: 0,
  };

  userWords.forEach((uw) => {
    const lvl = uw.word.cefrLevel as CefrLevel;
    if (cefrDistribution[lvl] !== undefined) {
      cefrDistribution[lvl]++;
    }
  });

  // Recent 7 days activity
  const weeklyActivity = dailyActivities.slice(0, 7).reverse().map((a) => ({
    date: a.date,
    wordsStudied: a.wordsStudied,
    wordsReviewed: a.wordsReviewed,
    xpEarned: a.xpEarned,
  }));

  return {
    totalWordsLearned,
    wordsMastered,
    wordsLearning,
    wordsDueReview,
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
    totalXp,
    level: levelData.level,
    accuracyRate,
    studyTimeMinutes: Math.round(totalSeconds / 60),
    cefrDistribution,
    weeklyActivity,
  };
}

export async function getLeaderboard() {
  const users = await prisma.user.findMany({
    where: {
      profile: {
        showOnLeaderboard: true,
      },
    },
    select: {
      id: true,
      username: true,
      name: true,
      image: true,
      profile: { select: { avatar: true } },
      dailyActivity: {
        select: { xpEarned: true },
      },
    },
  });

  const ranked = users.map((u) => {
    const totalXp = u.dailyActivity.reduce((acc, d) => acc + d.xpEarned, 0);
    const { level } = calculateUserLevel(totalXp);

    return {
      id: u.id,
      username: u.username,
      displayName: u.name || u.username,
      avatar: u.profile?.avatar || '🌟',
      xp: totalXp,
      level,
    };
  });

  // Sort descending by XP
  ranked.sort((a, b) => b.xp - a.xp);

  return ranked.map((r, index) => ({
    ...r,
    rank: index + 1,
  }));
}

export async function getUserAchievements(userId: string) {
  const [allAchievements, userAchievements] = await Promise.all([
    prisma.achievement.findMany({ orderBy: { xpReward: 'asc' } }),
    prisma.userAchievement.findMany({ where: { userId } }),
  ]);

  const unlockedMap = new Map(
    userAchievements.map((ua) => [ua.achievementId, ua.unlockedAt.toISOString()])
  );

  return allAchievements.map((ach) => ({
    id: ach.id,
    code: ach.code,
    title: ach.title,
    description: ach.description,
    icon: ach.icon,
    category: ach.category,
    xpReward: ach.xpReward,
    unlockedAt: unlockedMap.get(ach.id) || null,
  }));
}
