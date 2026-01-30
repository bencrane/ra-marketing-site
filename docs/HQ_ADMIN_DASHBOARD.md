# HQ Admin Dashboard

**Last Updated:** January 30, 2026
**Status:** Implemented and deployed

## Overview

The HQ Admin Dashboard is an internal tool accessible at `hq.radarrevenue.com`. It provides demo scenarios for customer presentations, allowing sales/success teams to demonstrate product capabilities with real or simulated data.

**Primary Use Case:** Recording demo videos for prospects showing various lead enrichment and discovery features.

## Access

| Environment | URL | Notes |
|-------------|-----|-------|
| Production | `https://hq.radarrevenue.com` | Subdomain routing via middleware |
| Local Dev | `http://localhost:3000/hq` | Direct path access |

## Architecture

### Subdomain Routing

The middleware (`src/middleware.ts`) handles subdomain routing:

```typescript
// Handle hq.radarrevenue.com subdomain
if (hostname.startsWith("hq.")) {
  if (pathname.startsWith("/hq")) {
    return NextResponse.next();
  }
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/hq" : `/hq${pathname}`;
  return NextResponse.rewrite(url);
}
```

This means:
- `hq.radarrevenue.com/` → Rewrites to `/hq`
- `hq.radarrevenue.com/demo` → Rewrites to `/hq/demo`
- `hq.radarrevenue.com/demo/1` → Rewrites to `/hq/demo/1`

### File Structure

```
src/app/hq/
├── page.tsx                    # Main HQ landing page
└── demo/
    ├── page.tsx                # Demo index with 5 demo cards
    ├── components/             # Shared demo components
    │   ├── index.ts            # Barrel export
    │   ├── DemoPageLayout.tsx  # Consistent page wrapper
    │   ├── DemoSearchCard.tsx  # Search input card
    │   ├── ProcessingChecklist.tsx  # Animated step checklist
    │   ├── ResultsTable.tsx    # Scrollable data table
    │   └── CTACard.tsx         # Call-to-action card
    ├── 1/
    │   ├── page.tsx            # Customer Alumni demo (fully functional)
    │   └── results/page.tsx    # Results page (unused)
    ├── 2/page.tsx              # New in Role demo (skeleton)
    ├── 3/page.tsx              # Website Visitors demo (skeleton)
    ├── 4/page.tsx              # CSV Upload demo (fully functional)
    └── 5/page.tsx              # Lookalike Companies demo (skeleton)
```

## Pages

### HQ Landing (`/hq`)

Main admin dashboard with navigation cards. Currently has one card linking to Demo section.

**File:** `src/app/hq/page.tsx`

### Demo Index (`/hq/demo`)

Grid of 5 demo scenario cards, each linking to its respective demo page.

**File:** `src/app/hq/demo/page.tsx`

| Demo | Title | Status |
|------|-------|--------|
| #1 | Show ICP Relevant People Who Used to Work at Their Current Customers | **Functional** - API integrated |
| #2 | Show ICP People New in Their Role | Skeleton |
| #3 | Show ICP People at Companies Visiting Your Website | Skeleton |
| #4 | Enrich Uploaded Leads | **Functional** - CSV upload works |
| #5 | Show Companies Most Similar to Your Best Customers | Skeleton |

## Demo Pages Detail

### Demo #1: Customer Alumni (Fully Functional)

**File:** `src/app/hq/demo/1/page.tsx`

**Flow:**
1. User enters a company domain (e.g., `stripe.com`)
2. Page fetches customers from API: `GET /api/companies/{domain}/customers?limit=100`
3. Results displayed in scrollable table (5-6 rows visible, max height 240px)
4. CTA card appears: "Ready to find alumni matches?"
5. Clicking "Find People" shows animated processing checklist (4 steps, 1s each)
6. After processing, "Alumni Matches" section appears with placeholder for results

**API Integration:**
```typescript
const response = await fetch(
  `${API_BASE_URL}/api/companies/${encodeURIComponent(domain.trim())}/customers?limit=100`
)
```

**API Base URL:** `https://api.revenueinfra.com` (defined in `src/lib/api.ts`)

**Customer Data Structure:**
```typescript
interface Customer {
  name: string
  domain: string
  matched_industry: string
  employee_range: string
  company_country: string
}
```

**Table Columns:**
| Column | Width | Key |
|--------|-------|-----|
| Company | 20% | `name` |
| Domain | 20% | `domain` |
| Industry | 25% | `matched_industry` |
| Size | 15% | `employee_range` |
| Country | 20% | `company_country` |

### Demo #4: CSV Upload (Fully Functional)

**File:** `src/app/hq/demo/4/page.tsx`

**Flow:**
1. User enters their company domain first (required)
2. CSV upload area appears (drag & drop or click to browse)
3. File parsed with Papa Parse library
4. Leads displayed in scrollable table

**Dependencies:** `papaparse` (already installed)

**Expected CSV Format:**
```csv
first_name,last_name,company_name,domain,work_email,phone_number
John,Doe,Acme Inc,acme.com,john@acme.com,555-1234
```

All columns are optional (values can be empty/null).

**Lead Data Structure:**
```typescript
interface Lead {
  first_name?: string
  last_name?: string
  company_name?: string
  domain?: string
  work_email?: string
  phone_number?: string
  [key: string]: string | undefined  // Allows additional columns
}
```

### Demos #2, #3, #5 (Skeleton Pages)

These pages follow the same pattern:
1. `DemoSearchCard` for domain input
2. `CTACard` with action button
3. `ProcessingChecklist` showing animated steps
4. Placeholder "Results" section after processing

Each has unique:
- Title and description
- Icon (Clock, Globe, Sparkles)
- Processing steps relevant to the demo type

## Shared Components

All demo pages use shared components from `src/app/hq/demo/components/` for design consistency.

### DemoPageLayout

Wraps all demo pages with consistent header and layout.

```typescript
interface DemoPageLayoutProps {
  children: React.ReactNode
  backHref?: string    // Default: "/hq/demo"
  backLabel?: string   // Default: "Demo"
}
```

**Layout specs:**
- Full height (`min-h-screen`)
- Max width: `max-w-4xl`
- Padding: `px-6 py-8`
- Header with back arrow navigation

### DemoSearchCard

Centered search input with icon, title, and description.

```typescript
interface DemoSearchCardProps {
  icon: React.ReactNode
  title: string
  description: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading?: boolean
  buttonLabel?: string  // Default: "Search"
}
```

**Styling:**
- Max width: `max-w-lg`
- Centered text
- Icon in `bg-secondary` rounded container
- Card with input and button inside

### ProcessingChecklist

Animated checklist showing processing progress.

```typescript
interface ProcessingChecklistProps {
  steps: string[]
  completedSteps: number[]
  className?: string
}
```

**Animation behavior:**
- Completed steps show green checkmark
- Current step shows spinning loader
- Future steps are dimmed (40% opacity)
- Smooth transitions on all state changes

### useProcessingSteps Hook

Manages processing animation state.

```typescript
function useProcessingSteps(steps: string[], delayMs: number = 1000) {
  // Returns:
  return {
    isProcessing: boolean,    // True while processing
    completedSteps: number[], // Indices of completed steps
    isDone: boolean,          // True when all steps complete
    startProcessing: () => void,  // Trigger processing
    reset: () => void         // Reset state
  }
}
```

### ResultsTable

Generic scrollable table with fixed header.

```typescript
interface TableColumn<T> {
  key: keyof T | string
  label: string
  width?: string           // e.g., "20%"
  render?: (item: T) => React.ReactNode
}

interface ResultsTableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  maxHeight?: string       // Default: "240px"
  emptyMessage?: string    // Default: "No results found."
  getRowKey?: (item: T, index: number) => string
}
```

**Key features:**
- `table-fixed` layout for consistent column widths
- Separate header table (sticky) and scrollable body table
- First column is `font-medium`, rest are `text-muted-foreground`
- Text truncation on overflow
- Hover state on rows

### CTACard

Call-to-action card with icon, text, and button.

```typescript
interface CTACardProps {
  icon: React.ReactNode
  title: string
  description: string
  buttonLabel: string
  onAction: () => void
  disabled?: boolean
  className?: string
}
```

**Styling:**
- Primary-tinted border (`border-primary/20`)
- Icon in `bg-primary/10` container
- Centered content

## Design System Alignment

All components follow the project's design system (`docs/design-system.md`):

| Property | Value |
|----------|-------|
| Background | `bg-background` |
| Text | `text-foreground` / `text-muted-foreground` |
| Borders | `border-border` |
| Cards | `bg-card` with `border-border` |
| Primary accents | `bg-primary` / `text-primary` |
| Secondary backgrounds | `bg-secondary` |
| Font sizes | `text-xs` (tables), `text-sm` (body), `text-lg` (headings) |
| Max widths | `max-w-4xl` (demo pages), `max-w-5xl` (index pages) |
| Spacing | `px-6`, `py-4`/`py-6`/`py-8` |

## Extending the System

### Adding a New Demo Page

1. Create new folder: `src/app/hq/demo/{n}/page.tsx`
2. Use shared components:

```typescript
"use client"

import { useState } from "react"
import { YourIcon, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  DemoPageLayout,
  DemoSearchCard,
  CTACard,
  ProcessingChecklist,
  useProcessingSteps,
} from "../components"

const PROCESSING_STEPS = [
  "Step 1 description",
  "Step 2 description",
  "Step 3 description",
  "Step 4 description",
]

export default function DemoNPage() {
  const [domain, setDomain] = useState("")
  const [savedDomain, setSavedDomain] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const { isProcessing, completedSteps, isDone, startProcessing } = useProcessingSteps(
    PROCESSING_STEPS,
    1000
  )

  const handleSearch = () => {
    setSavedDomain(domain.trim())
    setHasSearched(true)
  }

  return (
    <DemoPageLayout>
      <DemoSearchCard
        icon={<YourIcon className="h-5 w-5 text-muted-foreground" />}
        title="Your Demo Title"
        description="Your demo description."
        placeholder="Enter company domain (e.g. stripe.com)"
        value={domain}
        onChange={setDomain}
        onSubmit={handleSearch}
      />

      {hasSearched && savedDomain && (
        <div>
          {/* CTA, Processing, and Results sections */}
        </div>
      )}
    </DemoPageLayout>
  )
}
```

3. Add card to demo index (`src/app/hq/demo/page.tsx`):

```typescript
{
  id: "n",
  title: "#N Your Demo Title",
  description: "Brief description",
  icon: <YourIcon className="h-6 w-6" />,
  href: "/hq/demo/n",
}
```

### Adding a New HQ Section

1. Create new folder: `src/app/hq/{section}/page.tsx`
2. Add navigation card to HQ landing (`src/app/hq/page.tsx`):

```typescript
{
  title: "Section Name",
  description: "Section description",
  href: "/hq/section",
  icon: <SectionIcon className="h-6 w-6" />,
}
```

## External Dependencies

| Dependency | Purpose | Location |
|------------|---------|----------|
| `papaparse` | CSV parsing | Demo #4 |
| `lucide-react` | Icons | All pages |
| `@/components/ui/*` | UI components (shadcn) | All pages |

## API Endpoints Used

| Endpoint | Method | Purpose | Used In |
|----------|--------|---------|---------|
| `/api/companies/{domain}/customers` | GET | Fetch customer list | Demo #1 |

**API Base URL:** `https://api.revenueinfra.com`

## Known Limitations

1. **Demo #1 Alumni Results:** The "Alumni Matches" section shows a placeholder after processing - actual alumni matching API not yet integrated
2. **Demos #2, #3, #5:** Processing animations work but no actual API calls or results
3. **Demo #4:** CSV parsing works but enrichment API not integrated
4. **No authentication:** HQ pages are publicly accessible (auth middleware disabled)

## Future Enhancements

1. Integrate remaining API endpoints for demos #2, #3, #5
2. Connect Demo #4 enrichment to actual enrichment API
3. Add real alumni matching results to Demo #1
4. Consider adding authentication when auth middleware is re-enabled
5. Add export functionality for results (CSV download)

## Related Documentation

- `docs/AUTH_STATE.md` - Authentication system state
- `docs/design-system.md` - Design system guidelines
- `docs/frontend-architecture.md` - Frontend architecture overview

## Commits

| Commit | Description |
|--------|-------------|
| Latest | Add spacing between Demo 1 sections |
| Previous | Complete Demo pages 1-5 with shared components |
| Earlier | HQ subdomain routing, initial page setup |
