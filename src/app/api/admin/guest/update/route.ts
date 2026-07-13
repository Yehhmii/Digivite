import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cookies } from 'next/headers';
import { jwtVerify, JWTPayload } from 'jose';

const SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || '';

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    let adminId: string | undefined = undefined;
    if (session?.user?.id) adminId = session.user.id;
    else {
      const cookieStore = await cookies();
      const adminToken = cookieStore.get('adminToken')?.value;
      if (!adminToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      try {
        const { payload } = await jwtVerify(adminToken, new TextEncoder().encode(SECRET));
        const jwtPayload = payload as JWTPayload & { id?: string; sub?: string };
        adminId = jwtPayload.id || jwtPayload.sub;
      } catch (err) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const body = await req.json();
    const { guestId, numberOfGuests } = body;
    
    if (!guestId) {
      return NextResponse.json({ error: 'guestId is required' }, { status: 400 });
    }

    const guest = await prisma.guest.findUnique({ where: { id: guestId } });
    if (!guest) return NextResponse.json({ error: 'Guest not found' }, { status: 404 });

    const event = await prisma.event.findUnique({ where: { id: guest.eventId } });
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    if (event.adminId && event.adminId !== adminId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedGuest = await prisma.guest.update({
      where: { id: guestId },
      data: { numberOfGuests: Number(numberOfGuests) || 1 }
    });

    return NextResponse.json({ ok: true, guest: updatedGuest });
  } catch (err) {
    console.error('guest update error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
