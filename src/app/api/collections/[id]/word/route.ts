import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { toggleWordInCollection } from '@/services/collection-service';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: collectionId } = await params;
    const body = await req.json();
    const wordId = body.wordId;

    if (!wordId) {
      return NextResponse.json({ error: 'Word ID is required' }, { status: 400 });
    }

    const result = await toggleWordInCollection(session.userId, collectionId, wordId);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Toggle collection word error:', error);
    return NextResponse.json({ error: 'Failed to update collection' }, { status: 500 });
  }
}
