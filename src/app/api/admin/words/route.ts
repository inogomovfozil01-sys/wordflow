import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentSession } from '@/lib/auth';
import { wordAdminSchema } from '@/lib/validation';
import { RelationType } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. Admin privileges required.' }, { status: 403 });
    }

    const body = await req.json();
    const validated = wordAdminSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: validated.error.issues[0]?.message || 'Invalid word data' }, { status: 400 });
    }

    const d = validated.data;
    const normalized = d.word.toLowerCase().trim();

    // Check duplicate
    const existing = await prisma.word.findUnique({
      where: { normalizedWord: normalized },
    });

    if (existing) {
      return NextResponse.json({ error: 'A word with this spelling already exists.' }, { status: 409 });
    }

    const word = await prisma.word.create({
      data: {
        word: d.word,
        normalizedWord: normalized,
        partOfSpeech: d.partOfSpeech,
        cefrLevel: d.cefrLevel,
        ipa: d.ipa,
        definitionEn: d.definitionEn,
        definitionSimple: d.definitionSimple,
        translations: {
          create: [
            { language: 'ru', translation: d.translationRu },
            { language: 'uz', translation: d.translationUz },
          ],
        },
        examples: {
          create: [
            {
              sentenceEn: d.sentenceEn,
              sentenceRu: d.sentenceRu,
              sentenceUz: d.sentenceUz,
            },
          ],
        },
        relations: {
          create: [
            ...(d.synonyms || []).map((s) => ({ type: RelationType.SYNONYM, relatedWord: s })),
            ...(d.antonyms || []).map((a) => ({ type: RelationType.ANTONYM, relatedWord: a })),
          ],
        },
      },
      include: {
        translations: true,
        examples: true,
      },
    });

    // Record admin audit log
    await prisma.adminAuditLog.create({
      data: {
        adminId: session.userId,
        action: 'CREATE_WORD',
        targetType: 'Word',
        targetId: word.id,
        details: `Created word "${word.word}" (${word.cefrLevel})`,
      },
    });

    return NextResponse.json({ success: true, word });
  } catch (error) {
    console.error('Admin create word error:', error);
    return NextResponse.json({ error: 'Failed to create word' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden. Admin privileges required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Word ID is required' }, { status: 400 });
    }

    const word = await prisma.word.delete({
      where: { id },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminId: session.userId,
        action: 'DELETE_WORD',
        targetType: 'Word',
        targetId: id,
        details: `Deleted word "${word.word}"`,
      },
    });

    return NextResponse.json({ success: true, message: 'Word deleted successfully' });
  } catch (error) {
    console.error('Admin delete word error:', error);
    return NextResponse.json({ error: 'Failed to delete word' }, { status: 500 });
  }
}
