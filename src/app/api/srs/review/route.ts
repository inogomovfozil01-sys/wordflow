import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { reviewAnswerSchema } from '@/lib/validation';
import { submitWordReview } from '@/services/srs-service';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = reviewAnswerSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: 'Invalid review submission' }, { status: 400 });
    }

    const { wordId, rating, timeSpentMs } = validated.data;

    const result = await submitWordReview(session.userId, wordId, rating, timeSpentMs);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Review submit error:', error);
    return NextResponse.json({ error: 'Failed to record review' }, { status: 500 });
  }
}
