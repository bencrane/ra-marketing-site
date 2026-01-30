# Authentication State

**Last Updated:** January 30, 2026
**Status:** Fully implemented but disabled

## Overview

The authentication system is complete but the middleware is currently disabled to allow development/testing. Re-enabling requires renaming `src/middleware.ts.disabled` to `src/middleware.ts`.

## Components

| Component | Location | Status |
|-----------|----------|--------|
| Auth Middleware | `src/middleware.ts.disabled` | Disabled |
| Sign-In Page | `src/app/sign-in/page.tsx` | Working |
| Magic Link Verify | `src/app/auth/verify/page.tsx` | Working |
| Cookie Utils | `src/lib/cookies.ts` | Working |

## Auth Flow

1. User enters work email on `/sign-in` (consumer domains like gmail, yahoo, outlook are blocked)
2. Magic link sent via `api.revenueinfra.com`
3. User clicks link → `/auth/verify` validates token
4. `session_token` stored in localStorage + cookie (30-day expiry)
5. Redirect to `/leads`

## Token Storage

| Token | Storage | Purpose |
|-------|---------|---------|
| `session_token` | localStorage + cookie | Auth verification (middleware uses cookie) |
| `access_token` | localStorage only | API calls (optional, depends on API response) |

## Multi-Domain Cookie Support

Cookies are configured to work across subdomains for:

- `radarrevenue.com`
- `revenueactivation.com`
- `revenueinfra.com`
- localhost (no domain attribute for local dev)

Cookie defaults:
- Path: `/`
- Max Age: 30 days
- SameSite: `Lax`
- Secure: Based on protocol

## Middleware Configuration

When enabled, the middleware enforces:

**Public Routes (no auth required):**
- `/sign-in`
- `/auth/verify`
- `/api/*`

**Bypassed:**
- `demo.*` subdomains
- localhost / 127.0.0.1

**Protected:**
- All other routes (redirects to `/sign-in` if no `session_token` cookie)

## External API

All auth validation happens via:
- **Base URL:** `https://api.revenueinfra.com`
- **Send Magic Link:** `POST /api/auth/send-magic-link`
- **Verify Magic Link:** `POST /api/auth/verify-magic-link`

## Sign-Out

Sign-out clears:
- `localStorage.removeItem("session_token")`
- `localStorage.removeItem("access_token")`
- `clearCookie("session_token")`
- Redirects to `/sign-in`

## Known Limitations

1. **No auth context/provider** - Auth state is purely localStorage/cookie based, no React context
2. **No client-side auth guards** - Pages don't check auth status (middleware would enforce it)
3. **No automatic auth headers** - API calls don't automatically include auth headers
4. **No refresh token logic** - Single-use magic link tokens with no refresh mechanism
5. **No user profile storage** - No user data persisted client-side after auth

## Re-enabling Auth

To enforce authentication:

```bash
mv src/middleware.ts.disabled src/middleware.ts
```

## Recent Changes

| Commit | Date | Description |
|--------|------|-------------|
| `6eaa2df` | Jan 30 | Add multi-domain cookie support for radarrevenue.com |
| `4d85c0d` | Jan 28 | Temporarily disable auth middleware |
| `766434a` | Jan 28 | Allow localhost through auth middleware |
| `5e41649` | Jan 28 | Add auth middleware with demo subdomain bypass |
