// middleware.js
import { NextResponse } from 'next/server';
import { verifyToken } from './utils/verifyToken';
export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  // List of protected base routes
  const protectedRoutes = ['/admin', '/client', '/lawyer'];

  const isValidToken = await verifyToken(token);
  console.log('isValidToken', isValidToken)

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !isValidToken) {
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



