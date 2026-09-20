import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { explainWordWithAi } from '@/lib/gemini';
import { CefrLevel } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    const body = await req.json();
    const word = body.word;

    if (!word || typeof word !== 'string' || word.trim().length === 0) {
      return NextResponse.json({ error: 'Word is required' }, { status: 400 });
    }

    const userLevel = (session?.cefrLevel as CefrLevel) || 'B1';
    const explanation = await explainWordWithAi(word.trim(), userLevel);

    return NextResponse.json({
      success: true,
      explanation,
    });
  } catch (error) {
    console.error('AI Explain API error:', error);
    return NextResponse.json({ error: 'Failed to generate explanation' }, { status: 500 });
  }
}
