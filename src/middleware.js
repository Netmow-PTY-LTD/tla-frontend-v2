// middleware.js
import { NextResponse } from 'next/server';
export function middleware(request) {
  console.log('Request', request);
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  // List of protected base routes
  const protectedRoutes = ['/admin', '/client', '/lawyer'];

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !token) {
    // Redirect unauthenticated access to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Make sure both base and nested routes are matched
export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/client',
    '/client/:path*',
    '/lawyer',
    '/lawyer/:path*',
  ],
};
