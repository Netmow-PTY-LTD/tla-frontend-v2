// middleware.js
import { NextResponse } from 'next/server';
import { verifyToken } from './utils/verifyToken';

export async function middleware(request) {
  const cookies = request.cookies.get('countryObj');
  const token = request.cookies.get('token')?.value;
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  //console.log('cookieCountry', cookieCountry);
  // if (cookies) {
  //   console.log('cookies', cookies.value);
  // }

  // ✅ Redirect logged-in users away from /login or /register


  // Function to set cache prevention headers
  const noCacheResponse = (response) => {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  };


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
        const response = NextResponse.redirect(new URL(redirectPath, request.url));

        return noCacheResponse(response);

      }
    }

    // Allow unauthenticated access to login/register
    const response = NextResponse.next();
    return noCacheResponse(response);
  }

  //Role based route protection
  const protectedRoutes = ['/admin', '/client', '/lawyer'];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );


  // If route is not protected, allow
  if (!isProtected) {
    const response = NextResponse.next();
    return noCacheResponse(response);
  }

  // If no token, redirect to login
  if (!token) {
    const response = NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify and decode token
  const user = await verifyToken(token); // Should return something like { reqUserType: 'admin' }

  if (!user) {
    console.log('❌ Token failed verification:', token);

    return noCacheResponse(response);
  }

  console.log('✅ Token passed verification:', user);

  const role = user.regUserType; // 'admin', 'client', or 'lawyer'

  // Role-based access rules
  const routeAccess = {
    admin: ['/admin', '/client', '/lawyer'],
    lawyer: ['/lawyer'],
    client: ['/client'],
  };

  const isAllowed =
    Array.isArray(routeAccess[role]) &&
    routeAccess[role].some((route) => pathname.startsWith(route));

  // if (!isAllowed) {
  //   // Role-specific redirection
  //   if (pathname.startsWith('/admin')) {
  //     if (role === 'lawyer') {
  //       return NextResponse.redirect(new URL('/lawyer/dashboard', request.url));
  //     }
  //     if (role === 'client') {
  //       return NextResponse.redirect(new URL('/client/dashboard', request.url));
  //     }
  //   }

  //   // Lawyer trying to access client routes
  //   if (pathname.startsWith('/client') && role === 'lawyer') {
  //     return NextResponse.redirect(new URL('/lawyer/dashboard', request.url));
  //   }

  //   // Client trying to access lawyer routes
  //   if (pathname.startsWith('/lawyer') && role === 'client') {
  //     return NextResponse.redirect(new URL('/client/dashboard', request.url));
  //   }

  //   // Default fallback
  //   return NextResponse.redirect(new URL(`/${role}`, request.url));
  // }


  if (!isAllowed) {
    let redirectPath = `/${role}`;
    if (role === 'lawyer') redirectPath = '/lawyer/dashboard';
    if (role === 'client') redirectPath = '/client/dashboard';
    const response = NextResponse.redirect(new URL(redirectPath, request.url));
    return noCacheResponse(response);
  }


  const response = NextResponse.next();
  return noCacheResponse(response);
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
