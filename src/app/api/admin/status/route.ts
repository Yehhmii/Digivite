// app/api/admin/status/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || '';

async function getAdminIdFromReq() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) return session.user.id;

  const cookieStore = await cookies();
  const token = cookieStore.get('adminToken')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(SECRET));
    return (payload as any).id || (payload as any).sub || null;
  } catch (err) {
    console.error('status: adminToken verify failed', err);
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const adminId = await getAdminIdFromReq();
    if (!adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const eventIdQuery = url.searchParams.get('eventId') || '';
    const perStatus = Math.min(Math.max(Number(url.searchParams.get('limit') || '50'), 1), 500);

    // resolve eventId: prefer query, else admin's most recent event, else any event with guests
    let eventId = eventIdQuery;
    if (!eventId) {
      const recent = await prisma.event.findFirst({
        where: { adminId },
        orderBy: { createdAt: 'desc' },
        select: { id: true }
      });
      if (recent?.id) eventId = recent.id;
      else {
        const eventWithGuests = await prisma.event.findFirst({
          where: { guests: { some: {} } },
          orderBy: { createdAt: 'desc' },
          select: { id: true }
        });
        if (eventWithGuests?.id) eventId = eventWithGuests.id;
      }
    }

    if (!eventId) {
      // no event to inspect
      return NextResponse.json({
        counts: { PENDING: 0, ACCEPTED: 0, DECLINED: 0 },
        guestsByStatus: { PENDING: [], ACCEPTED: [], DECLINED: [] }
      });
    }

    // compute counts for each status
    const [pendingCount, acceptedCount, declinedCount] = await Promise.all([
      prisma.guest.count({ where: { eventId, status: 'PENDING' } }),
      prisma.guest.count({ where: { eventId, status: 'ACCEPTED' } }),
      prisma.guest.count({ where: { eventId, status: 'DECLINED' } })
    ]);

    // fetch sample lists per status (limit perStatus)
    const [pendingGuests, acceptedGuests, declinedGuests] = await Promise.all([
      prisma.guest.findMany({
        where: { eventId, status: 'PENDING' },
        orderBy: { createdAt: 'desc' },
        take: perStatus,
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          numberOfGuests: true,
          table: { select: { number: true } },
          checkedIn: true,
          checkInTime: true,
          status: true,
          giftSent: true,
          gifts: {
            select: {
              id: true,
              amount: true,
              note: true,
              provider: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      }),
      prisma.guest.findMany({
        where: { eventId, status: 'ACCEPTED' },
        orderBy: { createdAt: 'desc' },
        take: perStatus,
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          numberOfGuests: true,
          table: { select: { number: true } },
          checkedIn: true,
          checkInTime: true,
          status: true,
          giftSent: true,
          gifts: {
            select: {
              id: true,
              amount: true,
              note: true,
              provider: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      }),
      prisma.guest.findMany({
        where: { eventId, status: 'DECLINED' },
        orderBy: { createdAt: 'desc' },
        take: perStatus,
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          numberOfGuests: true,
          table: { select: { number: true } },
          checkedIn: true,
          checkInTime: true,
          status: true,
          giftSent: true,
          gifts: {
            select: {
              id: true,
              amount: true,
              note: true,
              provider: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      })
    ]);

    const mapGuest = (g: any) => ({
      id: g.id,
      fullName: g.fullName,
      email: g.email,
      phone: g.phone,
      numberOfGuests: g.numberOfGuests,
      tableNumber: g.table?.number ?? null,
      checkedIn: g.checkedIn,
      checkInTime: g.checkInTime,
      status: g.status,
      giftSent: !!g.giftSent,
      gifts: (g.gifts || []).map((gift: any) => ({
        id: gift.id,
        amount: gift.amount,
        note: gift.note,
        provider: gift.provider,
        createdAt: gift.createdAt
      }))
    });

    return NextResponse.json({
      counts: { PENDING: pendingCount, ACCEPTED: acceptedCount, DECLINED: declinedCount },
      guestsByStatus: {
        PENDING: pendingGuests.map(mapGuest),
        ACCEPTED: acceptedGuests.map(mapGuest),
        DECLINED: declinedGuests.map(mapGuest)
      }
    });
  } catch (err) {
    console.error('status GET error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
