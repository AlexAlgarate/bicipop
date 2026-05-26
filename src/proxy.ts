import { type NextRequest, NextResponse } from 'next/server';

import { SESSION_COOKIE_NAME } from '@/infrastructure/auth/constants';
import { verifyToken } from '@/infrastructure/auth/jwt';

import { routes } from './config/routes';

const routeMatchers = {
  protected: [
    routes.profile.dashboard,
    routes.profile.messages,
    routes.products.upload,
    '/products/edit',
    '/messages',
  ],
  auth: [routes.auth.login, routes.auth.register],
};

const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const isProtectedRoute = routeMatchers.protected.some(route =>
    pathname.startsWith(route)
  );
  const isAuthRoute = routeMatchers.auth.some(route => pathname.startsWith(route));
  const isValidSession = sessionCookie ? await verifyToken(sessionCookie) : false;

  if (isProtectedRoute && !isValidSession) {
    const loginUrl = new URL(routes.auth.login, request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isValidSession) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)'],
};

export default proxy;
