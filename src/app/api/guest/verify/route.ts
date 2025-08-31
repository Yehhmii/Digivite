import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    // Try search by qrCodeToken first, then slug
    const guest = await prisma.guest.findFirst({
      where: {
        OR: [{ qrCodeToken: token }, { slug: token }]
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        status: true,
        numberOfGuests: true,
        eventId: true,
        tableId: true,
        checkedIn: true,
        slug: true
      }
    });

    if (!guest) {
      return NextResponse.json({ error: 'Guest not found or not verified' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, guest }, { status: 200 });
  } catch (err) {
    console.error('verify error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
