// middleware.js
import { NextResponse } from 'next/server';
import { verifyToken } from './utils/verifyToken';

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // ✅ Redirect logged-in users away from /login or /register
  const publicAuthPages = ['/login', '/register'];
  if (publicAuthPages.includes(pathname)) {
    if (token) {
      const user = await verifyToken(token);
      if (user) {
        const role = user.regUserType;
        const dashboardRoutes = {
          admin: '/admin', // optional: you can also use '/admin/dashboard'
          lawyer: '/lawyer/dashboard',
          client: '/client/dashboard',
        };

        const redirectPath = dashboardRoutes[role] || '/';

        // ✅ Return early — stop further execution
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }
    }

    // Allow unauthenticated access to login/register
    return NextResponse.next();
  }

  //Role based route protection
  const protectedRoutes = ['/admin', '/client', '/lawyer'];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If route is not protected, allow
  if (!isProtected) {
    return NextResponse.next();
  }

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify and decode token
  const user = await verifyToken(token); // Should return something like { reqUserType: 'admin' }

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const role = user.regUserType; // 'admin', 'client', or 'lawyer'

  // Role-based access rules
  const routeAccess = {
    admin: ['/admin', '/client', '/lawyer'],
    lawyer: ['/lawyer', '/client'],
    client: ['/client', '/lawyer'],
  };

  const isAllowed =
    Array.isArray(routeAccess[role]) &&
    routeAccess[role].some((route) => pathname.startsWith(route));


  if (!isAllowed) {
    // Special redirect if trying to access /admin
    if (pathname.startsWith('/admin')) {
      if (role === 'lawyer') {
        return NextResponse.redirect(new URL('/lawyer/dashboard', request.url));
      }
      if (role === 'client') {
        return NextResponse.redirect(new URL('/client/dashboard', request.url));
      }
    }

    // Default fallback
    return NextResponse.redirect(new URL(`/${role}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/client',
    '/client/:path*',
    '/lawyer',
    '/lawyer/:path*',
    '/login',
    '/register',
  ],
};
