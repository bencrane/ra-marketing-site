import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require authentication
const publicRoutes = ["/sign-in", "/auth/verify", "/api"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Allow demo subdomain and localhost through without auth
  if (
    hostname.startsWith("demo.") ||
    hostname.includes("demo.revenueactivation") ||
    hostname.startsWith("localhost") ||
    hostname.startsWith("127.0.0.1")
  ) {
    return NextResponse.next();
  }

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for session token in cookies
  const sessionToken = request.cookies.get("session_token")?.value;

  // If no session token, redirect to sign-in
  if (!sessionToken) {
    const signInUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and _next
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
