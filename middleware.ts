import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const directCookie = request.cookies.get("better-auth.session_token");
  // Some weird bug where the cookie is not being get by getSessionCookie, so we need to check both
  const sessionCookie = getSessionCookie(request, {
    cookieName: "session_token",
    cookiePrefix: "better-auth",
  });

  const isAuthenticated = !!sessionCookie || !!directCookie;

  const authPaths = ["/signin", "/signup"];
  const exactPublicPaths = [...authPaths, "/"];
  const prefixPublicPaths = ["/api/auth"];

  // If user is authenticated and trying to access auth pages, redirect to home
  if (isAuthenticated && authPaths.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Only check authentication for non-public paths
  const isPublicPath =
    exactPublicPaths.includes(path) ||
    prefixPublicPaths.some((p) => path.startsWith(p));

  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
