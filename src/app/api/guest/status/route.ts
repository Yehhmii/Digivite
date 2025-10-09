import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import QRCode from 'qrcode';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug') ?? '';
    if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

    const guest = await prisma.guest.findUnique({
      where: { slug },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        numberOfGuests: true,
        qrCodeToken: true,
        rsvpAt: true,
        rsvpStatus: true,
      },
    });

    if (!guest) return NextResponse.json({ error: 'Guest not found' }, { status: 404 });

    let qrDataUrl: string | null = null;
    if (guest.qrCodeToken) {
      qrDataUrl = await QRCode.toDataURL(guest.qrCodeToken, { type: 'image/png', margin: 1, width: 400 });
    }

    return NextResponse.json({ guest: { ...guest, qrDataUrl } }, { status: 200 });
  } catch (err: any) {
    console.error('[GET /api/guest/status] err', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
