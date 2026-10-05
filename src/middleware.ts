import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { AUTH_ROUTES, PROTECTED_ROUTE_PREFIXES, ROUTES } from "@/config/routes";
import { routing } from "@/i18n/routing";
import { localizePath, splitLocalePath } from "@/i18n/paths";

const handleI18nRouting = createIntlMiddleware(routing);

const hasActiveSession = async (request: NextRequest): Promise<boolean> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const response = await fetch(`${apiUrl}/api/auth/get-session`, {
      headers: { cookie: request.headers.get("cookie") || "" },
    });
    return response.ok && (await response.json()) !== null;
  } catch (error) {
    // Fail closed: without a confirmed session, protected pages send users to login.
    console.error("Middleware Auth Error:", error);
    return false;
  }
};

// Where an auth rule sends this request, or null to let it through. Paths are locale-free here.
const getAuthRedirect = async (path: string, request: NextRequest): Promise<string | null> => {
  const isProtected = PROTECTED_ROUTE_PREFIXES.some((prefix) => path.startsWith(prefix));
  const isAuthPage = AUTH_ROUTES.includes(path);
  const isHome = path === ROUTES.home;
  // Only these routes depend on the session; skip the API round trip for everything else.
  if (!isProtected && !isAuthPage && !isHome) return null;

  const signedIn = await hasActiveSession(request);
  if (isProtected && !signedIn) return ROUTES.login;
  if ((isAuthPage || isHome) && signedIn) return ROUTES.workspace;
  return null;
};

export async function middleware(request: NextRequest) {
  const { locale, path } = splitLocalePath(request.nextUrl.pathname);
  const redirectTo = await getAuthRedirect(path, request);

  if (redirectTo) {
    return NextResponse.redirect(new URL(localizePath(redirectTo, locale), request.url));
  }
  return handleI18nRouting(request);
}

export const config = {
  // Everything except API routes, Next internals and files with an extension (icons, robots.txt, sitemap.xml…).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
