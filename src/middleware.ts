import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // Handle demo.* subdomain (demo.radarrevenue.com, demo.revenueactivation.com)
  if (hostname.startsWith("demo.")) {
    // Already on /hq/demo path, allow through
    if (pathname.startsWith("/hq/demo")) {
      return NextResponse.next();
    }
    // Rewrite paths to /hq/demo prefix (e.g., /1 -> /hq/demo/1, / -> /hq/demo/1)
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/hq/demo/1" : `/hq/demo${pathname}`;
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
