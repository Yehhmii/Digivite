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

const SECRET =
  process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || '';

function isObjectId(str?: string) {
  return typeof str === 'string' && /^[a-fA-F0-9]{24}$/.test(str);
}

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
      console.error('JWT secret not configured (process.env.JWT_SECRET or NEXTAUTH_SECRET)');
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


export async function GET(req: Request) {
  try {
    const adminId = await getAdminIdFromRequest();
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const rawEventInput = url.searchParams.get('eventId') ?? undefined;
    let where: any = {};

    if (rawEventInput) {
      if (isObjectId(rawEventInput)) {
        where = { eventId: rawEventInput };
      } else {
        const ev = await prisma.event.findFirst({
          where: { OR: [{ slug: rawEventInput }, { title: rawEventInput }] },
          select: { id: true },
        });
        if (!ev) {
          return NextResponse.json({ guests: [] });
        }
        where = { eventId: ev.id };
      }
    }

    const guests = await prisma.guest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: {
        id: true,
        fullName: true,
        slug: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ guests });
  } catch (err: unknown) {
    console.error('GET /api/admin/guest error', err);
    const errorMessage = (err instanceof Error) ? err.message : 'Server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}


import { nanoid } from 'nanoid';

async function generateUniqueGuestSlug(base: string) {
  let candidate = base;
  for (let i = 0; i < 6; i++) {
    const exists = await prisma.guest.findUnique({ where: { slug: candidate } });
    if (!exists) return candidate;
    candidate = `${base}-${nanoid(4)}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

interface GuestCreateBody {
  fullName: string;
  eventId?: string;
  event?: string;
}

export async function POST(req: Request) {
  try {
    const adminId = await getAdminIdFromRequest();
    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: GuestCreateBody = await req.json();
    const rawFullName = (body.fullName || '').trim();
    const rawEventInput = (body.eventId || body.event || '') + '';

    if (!rawFullName) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    }

    let eventId = '';

    if (rawEventInput) {
      if (isObjectId(rawEventInput)) {
        const ev = await prisma.event.findUnique({ where: { id: rawEventInput } });
        if (ev) eventId = ev.id;
      } else {
        const ev = await prisma.event.findFirst({
          where: { OR: [{ slug: rawEventInput }, { title: rawEventInput }] },
          select: { id: true }
        });
        if (ev) eventId = ev.id;
      }
    }

    if (!eventId) {
      const recent = await prisma.event.findFirst({
        where: { adminId },
        orderBy: { createdAt: 'desc' },
        select: { id: true }
      });
      if (recent) eventId = recent.id;
      else {
        return NextResponse.json({ error: 'No event found; provide a valid eventId or event slug/title' }, { status: 400 });
      }
    }

    const baseSlug = rawFullName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);
    const slug = await generateUniqueGuestSlug(`${baseSlug}-${Math.random().toString(36).substring(2, 6)}`);

    const placeholderToken = `pending_${nanoid(12)}`;

    const guest = await prisma.guest.create({
      data: {
        fullName: rawFullName,
        slug,
        eventId,
        qrCodeToken: placeholderToken
      }
    });

    return NextResponse.json({ guest }, { status: 201 });
  } catch (err) {
    console.error('Error creating guest:', err);
    return NextResponse.json({ error: 'Failed to create guest' }, { status: 500 });
  }
}
