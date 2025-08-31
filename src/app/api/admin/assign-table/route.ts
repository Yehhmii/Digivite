// app/api/admin/assign-table/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || '';

export async function POST(req: Request) {
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
        adminId = (payload as any).id || (payload as any).sub;
      } catch (err) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const body = await req.json();
    const { guestId, tableId, checkedIn } = body;
    if (!guestId || !tableId) {
      return NextResponse.json({ error: 'guestId and tableId are required' }, { status: 400 });
    }

    // fetch guest
    const guest = await prisma.guest.findUnique({ where: { id: guestId } });
    if (!guest) return NextResponse.json({ error: 'Guest not found' }, { status: 404 });

    // ensure admin owns the event
    const event = await prisma.event.findUnique({ where: { id: guest.eventId } });
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    if (event.adminId && event.adminId !== adminId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // fetch table
    const table = await prisma.table.findUnique({ where: { id: tableId } });
    if (!table) return NextResponse.json({ error: 'Table not found' }, { status: 404 });

    // compute current occupancy (excluding this guest if already assigned to this same table)
    const agg = await prisma.guest.aggregate({
      where: { tableId: table.id },
      _sum: { numberOfGuests: true }
    });
    const seatsUsed = (agg._sum.numberOfGuests ?? 0) as number;

    // if guest already assigned to a table (and it's the same table), subtract their current number to avoid double counting
    let adjustedSeatsUsed = seatsUsed;
    if (guest.tableId === table.id) {
      adjustedSeatsUsed = Math.max(0, seatsUsed - (guest.numberOfGuests ?? 1));
    }

    const guestNumber = guest.numberOfGuests ?? 1;
    const newOccupancy = adjustedSeatsUsed + guestNumber;

    if (newOccupancy > table.capacity) {
      return NextResponse.json({ error: `Table ${table.number} does not have enough seats` }, { status: 400 });
    }

    // update guest (atomic enough for most use-cases)
    const updatedGuest = await prisma.guest.update({
      where: { id: guestId },
      data: {
        tableId,
        checkedIn: Boolean(checkedIn),
        status: Boolean(checkedIn) ? 'ACCEPTED' : guest.status
      }
    });

    // recompute table occupancy to return
    const aggAfter = await prisma.guest.aggregate({
      where: { tableId: table.id },
      _sum: { numberOfGuests: true }
    });
    const seatsUsedAfter = (aggAfter._sum.numberOfGuests ?? 0) as number;

    const tableInfo = {
      id: table.id,
      number: table.number,
      capacity: table.capacity,
      seatsUsed: seatsUsedAfter
    };

    return NextResponse.json({ ok: true, guest: updatedGuest, table: tableInfo });
  } catch (err) {
    console.error('assign-table error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
