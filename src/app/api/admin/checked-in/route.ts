// app/api/admin/checked-in/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cookies } from 'next/headers';
import { jwtVerify, JWTPayload } from 'jose';

const SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || '';


async function getAdminIdFromReq() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) return session.user.id;

  const cookieStore = await cookies();
  const token = cookieStore.get('adminToken')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(SECRET));
    const jwtPayload = payload as JWTPayload & { id?: string; sub?: string };
    return jwtPayload.id || jwtPayload.sub || null;
  } catch (err) {
    console.error('checked-in: adminToken verify failed', err);
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const adminId = await getAdminIdFromReq();
    if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    let eventId = url.searchParams.get('eventId') || '';
    const q = (url.searchParams.get('q') || '').trim();
    const field = (url.searchParams.get('field') || 'all').toLowerCase(); // name|email|table|all
    const page = Math.max(Number(url.searchParams.get('page') || '1'), 1);
    const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || '50'), 1), 200);

    // Resolve eventId same as before (client can optionally pass eventId)
    if (!eventId) {
      const recent = await prisma.event.findFirst({
        where: { adminId },
        orderBy: { createdAt: 'desc' },
        select: { id: true }
      });
      if (recent && recent.id) eventId = recent.id;
      else {
        // fallback: any event with checkedIn guests
        const eventWithCheckedIn = await prisma.event.findFirst({
          where: { guests: { some: { checkedIn: true } } },
          orderBy: { createdAt: 'desc' },
          select: { id: true }
        });
        if (eventWithCheckedIn && eventWithCheckedIn.id) eventId = eventWithCheckedIn.id;
        else return NextResponse.json({ guests: [], total: 0 });
      }
    }

    // Build search filter
    const baseWhere: Prisma.GuestWhereInput = { eventId, checkedIn: true };

    if (q) {
      const qIsNumber = /^\d+$/.test(q);
      const nameCond: Prisma.GuestWhereInput = { 
        fullName: { contains: q, mode: Prisma.QueryMode.insensitive }
      };

      const emailCond: Prisma.GuestWhereInput = { 
        email: { contains: q, mode: Prisma.QueryMode.insensitive }
      };

      const tableCond: Prisma.GuestWhereInput | null = qIsNumber
        ? { table: { number: Number(q) } }
        : null;

      if (field === 'name') baseWhere.AND = [{ OR: [nameCond] }];
      else if (field === 'email') baseWhere.AND = [{ OR: [emailCond] }];
      else if (field === 'table') {
        if (!tableCond) {
          // nothing will match
          return NextResponse.json({ guests: [], total: 0 });
        }
        baseWhere.AND = [{ OR: [tableCond] }];
      } else {
        // all
        const ors: Prisma.GuestWhereInput[] = [nameCond, emailCond];

        if (tableCond) ors.push(tableCond);
        baseWhere.AND = [{ OR: ors }];
      }
    }

    // count total
    const total = await prisma.guest.count({ where: baseWhere });

    // fetch page
    const guests = await prisma.guest.findMany({
      where: baseWhere,
      orderBy: { checkInTime: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        numberOfGuests: true,
        tableId: true,
        checkedIn: true,
        createdAt: true,
        table: { select: { id: true, number: true } }
      }
    });

    const result = guests.map((g) => ({
      id: g.id,
      fullName: g.fullName,
      phone: g.phone,
      email: g.email,
      numberOfGuests: g.numberOfGuests,
      tableId: g.tableId,
      tableNumber: g.table?.number ?? null,
      createdAt: g.createdAt
    }));

    return NextResponse.json({ guests: result, total });
  } catch (err) {
    console.error('checked-in GET error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
