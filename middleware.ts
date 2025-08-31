// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('adminToken')?.value;
  const { pathname } = request.nextUrl;

  // allow _next, static files and api auth endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api/auth') ||
    // allow public assets with an extension
    /\.[^\/]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // only protect admin routes
  if (pathname.startsWith('/admin')) {
    const isAuthPage = pathname === '/admin/login' || pathname === '/admin/signup';

    // if no token and not on login/signup -> redirect
    if (!token && !isAuthPage) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.search = `returnTo=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }

    // if token present, verify it
    if (token) {
      try {
        await jwtVerify(token, secret);
        // if user requests login/signup while authenticated, send to dashboard
        if (isAuthPage) {
          const url = request.nextUrl.clone();
          url.pathname = '/admin/dashboard';
          return NextResponse.redirect(url);
        }
        return NextResponse.next();
      } catch (err) {
        // invalid token -> redirect to login
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/auth/:path*'],
};
