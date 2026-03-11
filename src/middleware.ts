import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

  if (pathname === "/") {
    if (session) {
      return NextResponse.redirect(new URL("/workspace", request.url));
    }
    return NextResponse.next();
  }

  //if we try to access protected routes without a session
  const isProtectedRoute = pathname.startsWith("/workspace") || pathname.startsWith("/document");
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // if we try to access login or register pages with an active session
  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/workspace", request.url));
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
     * - public (static assets like images/login_background.jpg)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|public).*)",
  ],
};
