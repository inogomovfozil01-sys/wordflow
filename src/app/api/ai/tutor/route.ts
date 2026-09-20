import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { aiTutorMessageSchema } from '@/lib/validation';
import { getAiTutorResponse } from '@/lib/gemini';

// In-memory rate limiting map (IP / User)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(key: string, limit = 20, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    const rateLimitKey = session?.userId || req.headers.get('x-forwarded-for') || 'anon';

    if (!checkRateLimit(rateLimitKey, 15, 60000)) {
      return NextResponse.json(
        { error: 'You have reached the AI message rate limit. Please wait a minute.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = aiTutorMessageSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: validated.error.issues[0]?.message || 'Invalid message' }, { status: 400 });
    }

    const { message, currentWord } = validated.data;
    const userLevel = session?.cefrLevel || 'B1';

    const reply = await getAiTutorResponse(message, userLevel, currentWord);

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error('AI Tutor API error:', error);
    return NextResponse.json({ error: 'AI Tutor service encountered an error' }, { status: 500 });
  }
}
