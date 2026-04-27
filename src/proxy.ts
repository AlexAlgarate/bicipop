import 'dotenv/config';
import { type NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

import { routes } from './utils/constants';

const SESSION_COOKIE_NAME = 'session';

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

const protectedRoutes = [routes.dashboard, routes.items.upload, routes.items.edit];

const authRoutes = ['/login', '/register'];

const verifyToken = async (token: string): Promise<boolean> => {
  try {
    await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return true;
  } catch {
    return false;
  }
};
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  const isValidSession = sessionCookie ? await verifyToken(sessionCookie) : false;

  if (isProtectedRoute && !isValidSession) {
    const loginUrl = new URL(routes.auth.login, request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isValidSession) {
    return NextResponse.redirect(new URL(routes.dashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)'],
};
