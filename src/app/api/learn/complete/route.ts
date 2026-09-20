import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { sessionCompleteSchema } from '@/lib/validation';
import { completeLessonSession } from '@/services/learning-service';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = sessionCompleteSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: 'Invalid session completion data' }, { status: 400 });
    }

    const summary = await completeLessonSession(session.userId, validated.data);

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error('Session complete error:', error);
    return NextResponse.json({ error: 'Failed to complete session' }, { status: 500 });
  }
}
