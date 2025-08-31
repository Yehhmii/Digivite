// app/api/admin/tables/route.ts
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

async function verifyAdminId() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) return session.user.id;

  const cookieStore = await cookies();
  const token = cookieStore.get('adminToken')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(SECRET));
    const jwtPayload = payload as AdminJWTPayload;
    return jwtPayload.id || jwtPayload.sub || null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const eventId = url.searchParams.get('eventId');
    if (!eventId) {
      return NextResponse.json({ error: 'eventId required' }, { status: 400 });
    }

    const tables = await prisma.table.findMany({
      where: { eventId },
      select: { id: true, number: true, capacity: true },
      orderBy: { number: 'asc' } // ensure number 1,2,3...
    });

    const tablesWithUsage = await Promise.all(
      tables.map(async (t) => {
        const agg = await prisma.guest.aggregate({
          where: { tableId: t.id },
          _sum: { numberOfGuests: true }
        });
        const seatsUsed = (agg._sum.numberOfGuests ?? 0) as number;
        return { id: t.id, number: t.number, capacity: t.capacity, seatsUsed };
      })
    );

    return NextResponse.json({ tables: tablesWithUsage });
  } catch (err) {
    console.error('tables GET error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const adminId = await verifyAdminId();
    if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { eventId, number: rawNumber, capacity = 8 } = body;
    if (!eventId) return NextResponse.json({ error: 'eventId required' }, { status: 400 });

    // optional verify event ownership
    const ev = await prisma.event.findUnique({ where: { id: eventId } });
    if (!ev) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    if (ev.adminId && ev.adminId !== adminId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let number = typeof rawNumber === 'number' && rawNumber > 0 ? rawNumber : undefined;
    if (!number) {
      // find max number for event, then +1
      const maxResult = await prisma.table.aggregate({
        where: { eventId },
        _max: { number: true }
      });
      const maxNum = (maxResult._max.number ?? 0) as number;
      number = maxNum + 1 || 1;
    }

    const table = await prisma.table.create({
      data: { eventId, number, capacity: Number(capacity) }
    });

    return NextResponse.json({ table }, { status: 201 });
  } catch (err) {
    console.error('tables POST error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
