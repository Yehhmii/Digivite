import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';
import { jwtVerify, JWTPayload } from 'jose';

interface AdminJWTPayload extends JWTPayload {
  id?: string;
  sub?: string;
}

interface GuestCreateBody {
  fullName: string;
  eventId?: string;
  event?: string;
}


const SECRET =
  process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || '';

function isObjectId(str?: string) {
  return typeof str === 'string' && /^[a-fA-F0-9]{24}$/.test(str);
}

async function generateUniqueGuestSlug(base: string) {
  let candidate = base;
  for (let i = 0; i < 6; i++) {
    const exists = await prisma.guest.findUnique({ where: { slug: candidate } });
    if (!exists) return candidate;
    candidate = `${base}-${nanoid(4)}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export async function POST(req: Request) {
  try {
    // DEBUG - log incoming cookie header (optional)
    // console.log('[guest.create] request headers cookie:', req.headers.get('cookie'));

    // 1) Try next-auth session first
    const session = await getServerSession(authOptions);
    // console.log('[guest.create] next-auth session ->', session);

    let adminId: string | undefined = undefined;
    if (session?.user?.id) {
      adminId = session.user.id;
    } else {
      // 2) Fallback -> check custom adminToken cookie
      const cookieStore = await cookies();
      const adminToken = cookieStore.get('adminToken')?.value;
      if (adminToken) {
        if (!SECRET) {
          console.error('[guest.create] JWT secret not configured (process.env.JWT_SECRET)');
          return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
        }
        try {
          const { payload } = await jwtVerify(adminToken, new TextEncoder().encode(SECRET));
          const jwtPayload = payload as AdminJWTPayload;
          adminId = jwtPayload.id || jwtPayload.sub || undefined;
        } catch (err) {
          console.error('[guest.create] adminToken verification failed', err);
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
      }
    }

    if (!adminId) {
      console.log('[guest.create] unauthorized - no session or valid adminToken');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // parse payload
    const body: GuestCreateBody = await req.json();
    const rawFullName = (body.fullName || '').trim();
    const rawEventInput = (body.eventId || body.event || '') + '';

    if (!rawFullName) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    }

    // Resolve eventId:
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

    // If no eventId supplied, try to pick most recent event for this admin
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

    // create slug
    const baseSlug = rawFullName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);
    const slug = await generateUniqueGuestSlug(`${baseSlug}-${Math.random().toString(36).substring(2, 6)}`);

    // placeholder token because your schema requires it; remove if you make it optional
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
