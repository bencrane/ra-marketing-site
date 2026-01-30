import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // Handle hq.radarrevenue.com subdomain
  if (hostname.startsWith("hq.")) {
    // Already on /hq path, allow through
    if (pathname.startsWith("/hq")) {
      return NextResponse.next();
    }
    // Rewrite all other paths to /hq
    const url = request.nextUrl.clone();
    url.pathname = "/hq";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and _next
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
