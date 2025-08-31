import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, amount, note, provider } = body;
    if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

    const guest = await prisma.guest.findFirst({ where: { slug } });
    if (!guest) return NextResponse.json({ error: 'Guest not found' }, { status: 404 });

    // create gift
    const gift = await prisma.gift.create({
      data: {
        eventId: guest.eventId,
        guestId: guest.id,
        amount: amount ? Number(amount) : undefined,
        note: note ?? undefined,
        provider: provider ?? undefined
      }
    });

    // mark guest as giftSent
    await prisma.guest.update({
      where: { id: guest.id },
      data: { giftSent: true, updatedAt: new Date() }
    });

    return NextResponse.json({ ok: true, gift });
  } catch (err) {
    console.error('gift route error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
