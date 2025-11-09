import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cookies } from 'next/headers';
import { jwtVerify, JWTPayload } from 'jose';

interface AdminJWTPayload extends JWTPayload {
  id?: string;
  sub?: string;
}

const SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || '';

async function getAdminIdFromRequest(): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      return session.user.id;
    }
  } catch (err) {
    console.warn('next-auth session check failed', err);
  }

  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('adminToken')?.value;
    if (!adminToken) return null;

    if (!SECRET) {
      console.error('JWT secret not configured');
      return null;
    }

    const { payload } = await jwtVerify(adminToken, new TextEncoder().encode(SECRET));
    const jwtPayload = payload as AdminJWTPayload;
    const adminId = jwtPayload.id || jwtPayload.sub || null;
    return (typeof adminId === 'string' && adminId.length > 0) ? adminId : null;
  } catch (err) {
    console.warn('adminToken verification failed', err);
    return null;
  }
}

export async function PATCH(req: Request) {
  try {
    const adminId = await getAdminIdFromRequest();
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { guestId, numberOfGuests } = body;

    if (!guestId) {
      return NextResponse.json({ error: 'guestId is required' }, { status: 400 });
    }

    if (numberOfGuests !== undefined && numberOfGuests < 1) {
      return NextResponse.json({ error: 'numberOfGuests must be at least 1' }, { status: 400 });
    }

    // Fetch guest to verify ownership
    const guest = await prisma.guest.findUnique({
      where: { id: guestId },
      include: { event: true }
    });

    if (!guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    // Verify admin owns the event
    if (guest.event.adminId && guest.event.adminId !== adminId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update guest
    const updatedGuest = await prisma.guest.update({
      where: { id: guestId },
      data: {
        numberOfGuests: numberOfGuests !== undefined ? Number(numberOfGuests) : undefined
      }
    });

    return NextResponse.json({ ok: true, guest: updatedGuest });
  } catch (err) {
    console.error('Error updating guest:', err);
    return NextResponse.json({ error: 'Failed to update guest' }, { status: 500 });
  }
}