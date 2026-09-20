import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { collectionSchema } from '@/lib/validation';
import { createCustomCollection, getCollections } from '@/services/collection-service';

export async function GET() {
  const session = await getCurrentSession();
  const collections = await getCollections(session?.userId);
  return NextResponse.json({ success: true, collections });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = collectionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: validated.error.issues[0]?.message || 'Invalid collection data' }, { status: 400 });
    }

    const collection = await createCustomCollection(session.userId, validated.data);

    return NextResponse.json({ success: true, collection });
  } catch (error) {
    console.error('Create collection error:', error);
    return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 });
  }
}
