import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware
 * 
 * NOTE: This middleware is currently DISABLED because:
 * 1. Tokens are stored in localStorage (client-side only)
 * 2. Middleware runs on server-side and cannot access localStorage
 * 3. Route protection is handled by client-side layout components
 * 
 * If you want to enable server-side route protection:
 * - Switch to httpOnly cookies for token storage
 * - Update auth service to set cookies
 * - Uncomment the middleware logic below
 */

export function middleware(request: NextRequest) {
  // Middleware is disabled - all route protection is client-side
  return NextResponse.next();
  
  /* DISABLED CODE - Uncomment if using httpOnly cookies
  
  // Get token from cookie
  const token = request.cookies.get('accessToken')?.value;

  // Protected routes
  const protectedPaths = ['/dashboard', '/tickets', '/users', '/categories', '/knowledge', '/settings'];
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

  // Redirect to login if accessing protected route without token
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if accessing auth pages with token
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
  */
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
