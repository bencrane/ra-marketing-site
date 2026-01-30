// Cookie utilities with multi-domain support
// Supports both radarrevenue.com and revenueactivation.com during transition

/**
 * Get the root domain for cookie sharing across subdomains.
 * Returns the appropriate domain attribute for cookies based on current hostname.
 *
 * Examples:
 * - app.radarrevenue.com → .radarrevenue.com
 * - admin.radarrevenue.com → .radarrevenue.com
 * - app.revenueactivation.com → .revenueactivation.com
 * - localhost → "" (no domain attribute for local dev)
 */
export function getCookieDomain(): string {
  if (typeof window === "undefined") return "";

  const hostname = window.location.hostname;

  // Local development - no domain attribute needed
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "";
  }

  // radarrevenue.com and subdomains
  if (hostname.endsWith("radarrevenue.com")) {
    return ".radarrevenue.com";
  }

  // revenueactivation.com and subdomains
  if (hostname.endsWith("revenueactivation.com")) {
    return ".revenueactivation.com";
  }

  // revenueinfra.com and subdomains (if used)
  if (hostname.endsWith("revenueinfra.com")) {
    return ".revenueinfra.com";
  }

  // Fallback: no domain attribute (cookie scoped to exact hostname)
  return "";
}

/**
 * Set a cookie with proper domain handling for cross-subdomain support.
 */
export function setCookie(
  name: string,
  value: string,
  options: {
    maxAge?: number;
    path?: string;
    sameSite?: "Strict" | "Lax" | "None";
    secure?: boolean;
  } = {}
): void {
  const {
    maxAge = 60 * 60 * 24 * 30, // 30 days default
    path = "/",
    sameSite = "Lax",
    secure = window.location.protocol === "https:",
  } = options;

  const domain = getCookieDomain();
  const domainAttr = domain ? `; domain=${domain}` : "";
  const secureAttr = secure ? "; Secure" : "";

  document.cookie = `${name}=${encodeURIComponent(value)}; path=${path}${domainAttr}; max-age=${maxAge}; SameSite=${sameSite}${secureAttr}`;
}

/**
 * Clear a cookie with proper domain handling.
 */
export function clearCookie(name: string, path: string = "/"): void {
  const domain = getCookieDomain();
  const domainAttr = domain ? `; domain=${domain}` : "";

  // Clear with domain attribute
  document.cookie = `${name}=; path=${path}${domainAttr}; max-age=0`;

  // Also clear without domain attribute (in case it was set that way previously)
  document.cookie = `${name}=; path=${path}; max-age=0`;
}

/**
 * Get a cookie value by name.
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}
