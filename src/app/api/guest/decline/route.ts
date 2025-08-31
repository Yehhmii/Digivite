import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();
    if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 });

    const guest = await prisma.guest.findFirst({ where: { slug } });
    if (!guest) return NextResponse.json({ error: 'Guest not found' }, { status: 404 });

    const updated = await prisma.guest.update({
      where: { id: guest.id },
      data: { status: 'DECLINED', updatedAt: new Date() }
    });

    return NextResponse.json({ ok: true, guest: updated });
  } catch (err) {
    console.error('decline route error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
