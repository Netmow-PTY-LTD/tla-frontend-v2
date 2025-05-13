import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';
export async function middleware(request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('refreshToken')?.value;

  const isAuthenticated = Boolean(token);

  // If not authenticated and trying to access a protected route
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/seller/:path*', '/buyer/:path*', '/admin/:path*'],
};
