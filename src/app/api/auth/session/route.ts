import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('adminToken')?.value;
  
  if (!token) {
    return NextResponse.json({ admin: null });
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const admin = await prisma.admin.findUnique({ 
      where: { id: payload.id as string },
      select: { id: true, email: true, name: true }
    });

    return NextResponse.json({ admin });
  } catch (error) {
    return NextResponse.json({ admin: null });
  }
}