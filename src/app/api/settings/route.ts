import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentSession } from '@/lib/auth';
import { z } from 'zod';

const updateSettingsSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  bio: z.string().max(200).optional(),
  avatar: z.string().max(10).optional(),
  cefrLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).optional(),
  learningGoal: z.string().min(1).optional(),
  dailyTargetWords: z.number().int().min(5).max(50).optional(),
  interfaceLang: z.enum(['en', 'ru', 'uz']).optional(),
  soundEnabled: z.boolean().optional(),
  autoPronounce: z.boolean().optional(),
  theme: z.enum(['system', 'light', 'dark']).optional(),
  showStreak: z.boolean().optional(),
  showWordsLearned: z.boolean().optional(),
  showOnLeaderboard: z.boolean().optional(),
});

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = updateSettingsSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: validated.error.issues[0]?.message || 'Invalid settings data' }, { status: 400 });
    }

    const d = validated.data;

    await prisma.$transaction(async (tx) => {
      if (d.name) {
        await tx.user.update({
          where: { id: session.userId },
          data: { name: d.name },
        });
      }

      await tx.userProfile.upsert({
        where: { userId: session.userId },
        update: {
          bio: d.bio,
          avatar: d.avatar,
          showStreak: d.showStreak,
          showWordsLearned: d.showWordsLearned,
          showOnLeaderboard: d.showOnLeaderboard,
        },
        create: {
          userId: session.userId,
          bio: d.bio,
          avatar: d.avatar,
          showStreak: d.showStreak,
          showWordsLearned: d.showWordsLearned,
          showOnLeaderboard: d.showOnLeaderboard,
        },
      });

      await tx.userSettings.upsert({
        where: { userId: session.userId },
        update: {
          cefrLevel: d.cefrLevel,
          learningGoal: d.learningGoal,
          dailyTargetWords: d.dailyTargetWords,
          interfaceLang: d.interfaceLang,
          soundEnabled: d.soundEnabled,
          autoPronounce: d.autoPronounce,
          theme: d.theme,
        },
        create: {
          userId: session.userId,
          cefrLevel: d.cefrLevel || 'A1',
          learningGoal: d.learningGoal || 'Everyday English',
          dailyTargetWords: d.dailyTargetWords || 10,
          interfaceLang: d.interfaceLang || 'en',
          soundEnabled: d.soundEnabled ?? true,
          autoPronounce: d.autoPronounce ?? true,
          theme: d.theme || 'system',
        },
      });
    });

    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
