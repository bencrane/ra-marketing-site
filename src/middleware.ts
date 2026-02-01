import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // Handle demo.* subdomain (demo.radarrevenue.com, demo.revenueactivation.com)
  // Routes to the main leads page (same as app.radarrevenue.com/leads)
  if (hostname.startsWith("demo.")) {
    // Already on /leads path, allow through
    if (pathname.startsWith("/leads")) {
      return NextResponse.next();
    }
    // Rewrite root to /leads
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/leads" : pathname;
    return NextResponse.rewrite(url);
  }

  // Handle hq.* subdomain (hq.radarrevenue.com, hq.revenueactivation.com)
  if (hostname.startsWith("hq.")) {
    // Already on /hq path, allow through
    if (pathname.startsWith("/hq")) {
      return NextResponse.next();
    }
    // Rewrite paths to /hq prefix (e.g., /demo -> /hq/demo, / -> /hq)
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/hq" : `/hq${pathname}`;
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
