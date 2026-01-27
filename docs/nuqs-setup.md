# Nuqs Setup for Next.js App Router

## The Problem

When using `nuqs` (URL state management library) with Next.js App Router, you'll encounter this runtime error:

```
[nuqs] nuqs requires an adapter to work with your framework.
See https://nuqs.dev/NUQS-404
```

This happens because `nuqs` needs to know which framework/router it's working with to properly sync state with the URL.

## The Fix

Wrap your app with `NuqsAdapter` in the root layout.

### src/app/layout.tsx

```tsx
import type { Metadata } from "next";
import { NuqsAdapter } from 'nuqs/adapters/next/app';  // Add this import
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>  {/* Wrap children */}
      </body>
    </html>
  );
}
```

## Key Points

1. **Import from the correct adapter path**: `nuqs/adapters/next/app` (not just `nuqs`)
2. **Wrap at the root layout level**: The adapter must wrap all components that use `useQueryState`
3. **No additional configuration needed**: Just the wrapper is sufficient

## Usage After Setup

Once the adapter is in place, you can use `useQueryState` anywhere in your app:

```tsx
import { useQueryState, parseAsBoolean, parseAsInteger } from 'nuqs'

function MyComponent() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const [active, setActive] = useQueryState('active', parseAsBoolean)

  // URL will sync automatically: ?page=2&active=true
}
```

## References

- [nuqs documentation](https://nuqs.dev/)
- [NUQS-404 error explanation](https://nuqs.dev/NUQS-404)
