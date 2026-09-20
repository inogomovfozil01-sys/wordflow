import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE_NAME = 'wordflow_session';
const DEFAULT_SECRET = 'wordflow-super-secure-production-auth-secret-key-32chars';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/learn',
  '/review',
  '/practice',
  '/ai-tutor',
  '/collections',
  '/settings',
  '/stats',
];

const AUTH_ROUTES = ['/login', '/register'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  let sessionPayload: { userId: string; role: string; cefrLevel: string } | null = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.AUTH_SECRET || DEFAULT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      sessionPayload = {
        userId: payload.userId as string,
        role: payload.role as string,
        cefrLevel: payload.cefrLevel as string,
      };
    } catch {
      sessionPayload = null;
    }
  }

  // 1. Admin route protection
  if (pathname.startsWith('/admin')) {
    if (!sessionPayload) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    if (sessionPayload.role !== 'ADMIN') {
      return new NextResponse('Access Denied: Administrator role required.', {
        status: 403,
        headers: { 'content-type': 'text/plain' },
      });
    }
  }

  // 2. Protected user routes
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  if (isProtected) {
    if (!sessionPayload) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  // 3. Auth routes redirect if already signed in
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  if (isAuthRoute && sessionPayload) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(self), geolocation=()');

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/learn/:path*',
    '/review/:path*',
    '/practice/:path*',
    '/ai-tutor/:path*',
    '/collections/:path*',
    '/settings/:path*',
    '/stats/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
