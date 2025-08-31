// src/app/api/dev/create-guest/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateGuestSlug } from '@/lib/slug';
import { nanoid } from 'nanoid'

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phone, eventId, eventSlug } = body;

    if (!eventId) return NextResponse.json({ error: 'eventId required' }, { status: 400 });

    const slug = generateGuestSlug(eventSlug);

    const guest = await prisma.guest.create({
      data: {
        fullName,
        email,
        phone,
        eventId,
        qrCodeToken: `q_${nanoid(16)}`, // generate secure token for QR as well
        slug,
      },
    });

    return NextResponse.json({ guest }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
