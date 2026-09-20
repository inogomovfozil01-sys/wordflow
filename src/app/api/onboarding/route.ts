import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentSession, createSessionToken, setSessionCookie } from '@/lib/auth';
import { onboardingSchema } from '@/lib/validation';
import { CefrLevel } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = onboardingSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: validated.error.issues[0]?.message || 'Invalid onboarding data' }, { status: 400 });
    }

    const { cefrLevel, learningGoal, dailyTargetWords } = validated.data;
    const finalLevel: CefrLevel = cefrLevel === 'Not sure' ? 'A1' : (cefrLevel as CefrLevel);

    // Save to UserSettings
    const updatedSettings = await prisma.userSettings.upsert({
      where: { userId: session.userId },
      update: {
        cefrLevel: finalLevel,
        learningGoal,
        dailyTargetWords,
      },
      create: {
        userId: session.userId,
        cefrLevel: finalLevel,
        learningGoal,
        dailyTargetWords,
      },
    });

    // Update session token with new CEFR level
    const updatedToken = await createSessionToken({
      userId: session.userId,
      email: session.email,
      username: session.username,
      role: session.role,
      cefrLevel: finalLevel,
    });

    await setSessionCookie(updatedToken);

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
    });
  } catch (error) {
    console.error('Onboarding update error:', error);
    return NextResponse.json({ error: 'Failed to update onboarding settings' }, { status: 500 });
  }
}
