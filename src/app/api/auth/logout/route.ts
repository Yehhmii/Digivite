import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const res = NextResponse.json({
      ok: true,
      message: 'Logged out successfully',
    });

    // delete cookie on response
    res.cookies.delete('adminToken');

    return res;
  } catch (err) {
    console.error('Logout route error:', err);
    return NextResponse.json(
      { ok: false, message: 'Logout failed' },
      { status: 500 }
    );
  }
}
