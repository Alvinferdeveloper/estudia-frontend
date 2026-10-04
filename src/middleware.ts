import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_ROUTES, PROTECTED_ROUTE_PREFIXES, ROUTES } from "@/config/routes";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieHeader = request.headers.get("cookie") || "";

  let session = null;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const response = await fetch(`${apiUrl}/api/auth/get-session`, {
      headers: {
        cookie: cookieHeader,
      },
    });
    if (response.ok) {
      session = await response.json();
    }
  } catch (error) {
    console.error("Middleware Auth Error:", error);
  }

  if (pathname === ROUTES.home) {
    if (session) {
      return NextResponse.redirect(new URL(ROUTES.workspace, request.url));
    }
    return NextResponse.next();
  }

  //if we try to access protected routes without a session
  const isProtectedRoute = PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL(ROUTES.login, request.url));
  }

  // if we try to access login or register pages with an active session
  const isAuthPage = AUTH_ROUTES.includes(pathname);
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL(ROUTES.workspace, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (static assets under /images)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|public).*)",
  ],
};
