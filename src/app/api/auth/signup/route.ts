import { NextResponse } from 'next/server';
import { createAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin) {
      return NextResponse.json({ error: 'Admin already exists, Login instead!' }, { status: 400 });
    }

    const admin = await createAdmin(email, password, name);
    
    return NextResponse.json({ 
      admin: { 
        id: admin.id, 
        email: admin.email, 
        name: admin.name 
      } 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}