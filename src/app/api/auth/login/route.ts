import { NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await verifyPassword(admin, password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await new SignJWT({ id: admin.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(secret);

    // Fixed cookies usage
    const cookieStore = await cookies();
    cookieStore.set('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 2, // 2 hours
      path: '/',
    });

    return NextResponse.json({
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Login Error:', error)
    } else {
      console.error("Unexpected error:", error);
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });

  }
}