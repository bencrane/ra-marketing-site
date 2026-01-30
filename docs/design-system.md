# Revenue Activation Design System

Premium design tokens for an $8k+ B2B SaaS product.

## Color Philosophy

- **Dark mode first** - True black (`0 0% 0%`) for bold confidence
- **Forest green primary** (`152 55% 40%`) - Energy, growth, trust
- **Semantic badge colors** - Each signal type has distinct identity
- **HSL everywhere** - Consistent, themeable, accessible

---

## Core Colors

### Background & Foreground
```css
--background: 0 0% 0%;      /* True black */
--foreground: 0 0% 100%;    /* Pure white */
--card: 0 0% 4%;            /* Slightly elevated */
--muted: 0 0% 12%;          /* Subtle backgrounds */
--muted-foreground: 0 0% 65%; /* Secondary text */
```

### Primary (Forest Green)
```css
--primary: 152 55% 40%;
--primary-foreground: 0 0% 100%;
```
Use for: CTAs, active states, links, emphasis

### Borders & Inputs
```css
--border: 0 0% 16%;
--input: 0 0% 16%;
--ring: 152 55% 40%;  /* Focus rings match primary */
```

---

## Badge Colors (Intelligence Signals)

Each signal type has semantic meaning conveyed through color:

| Signal | Color | HSL | Meaning |
|--------|-------|-----|---------|
| New in Role | Green | `152 50% 55%` | Growth, change |
| Worked at Customer | Teal | `175 55% 45%` | Relationship, trust |
| Recently Funded | Purple | `271 60% 65%` | Wealth, opportunity |
| Recently Promoted | Amber | `40 70% 55%` | Success, achievement |
| At VC Portfolio | Blue | `210 60% 55%` | Corporate, established |

### Usage
```tsx
// In component
<span className="badge-new-role">New in Role</span>
<span className="badge-customer">Worked at Customer</span>
<span className="badge-funded">Recently Funded</span>
<span className="badge-promoted">Recently Promoted</span>
<span className="badge-vc">At VC Portfolio</span>
```

---

## Sidebar Colors

```css
--sidebar: 0 0% 6%;           /* Slightly lighter than bg */
--sidebar-foreground: 0 0% 95%;
--sidebar-border: 0 0% 14%;
--sidebar-accent: 0 0% 12%;   /* Hover states */
```

---

## Table Colors

```css
--table-header: 0 0% 4%;
--table-row-hover: 0 0% 6%;
```

### Usage
```tsx
<table className="table-premium">
  {/* Automatically styled */}
</table>
```

---

## Component Classes

### Cards
```tsx
// Elevated card with subtle shadow
<div className="card-elevated">...</div>

// Card with green glow on hover
<div className="card-glow">...</div>

// Card with red glow on hover (danger/warning)
<div className="card-glow-danger">...</div>
```

### Buttons
```tsx
// Button with green glow on hover
<button className="btn-glow">...</button>
```

### Filter Chips
```tsx
<span className="filter-chip">
  Industry: SaaS
  <X className="filter-chip-remove" />
</span>
```

### Sidebar Headers
```tsx
<h3 className="sidebar-section-header">COMPANY</h3>
```

---

## Animations

### Available Classes
```tsx
// Slide down from above (for dropdowns, menus)
<div className="animate-slide-down">...</div>

// Slide up from below (for toasts, notifications)
<div className="animate-slide-up">...</div>

// Simple fade in
<div className="animate-fade-in">...</div>
```

### Timing
- All micro-interactions: `0.15s ease-out`
- Card hover glows: `0.2s ease-out`

---

## Border Radius

```css
--radius: 0.5rem;           /* Base: 8px */
--radius-sm: 0.125rem;      /* 2px */
--radius-md: 0.375rem;      /* 6px */
--radius-lg: 0.5rem;        /* 8px */
--radius-xl: 0.75rem;       /* 12px */
```

---

## Spacing Guidelines

| Element | Padding | Gap |
|---------|---------|-----|
| Cards | `p-6` to `p-8` | - |
| Table cells | `px-4 py-4` | - |
| Filter sections | `space-y-3` | - |
| Badge groups | - | `gap-1.5` |
| Sidebar sections | `space-y-8` | - |

Premium = generous whitespace. Don't cram.

---

## Typography

### Font Stack
```css
--font-sans: var(--font-geist-sans);
--font-mono: var(--font-geist-mono);
```

### Hierarchy
| Element | Classes |
|---------|---------|
| Page title | `text-lg font-bold tracking-tight` |
| Section header | `text-[11px] font-semibold uppercase tracking-wider` |
| Table header | `text-xs font-medium` |
| Body text | `text-sm` |
| Secondary text | `text-sm text-muted-foreground` |

---

## Dark/Light Mode

The system supports both modes. Currently dark-first:

```tsx
// In layout.tsx
<html lang="en" className="dark">
```

To enable light mode:
```tsx
<html lang="en" className="light">
```

All tokens automatically adjust.

---

## Tailwind Classes Reference

```tsx
// Colors
bg-background
bg-card
bg-muted
bg-primary
bg-secondary
bg-sidebar
bg-table-header
bg-table-row-hover

text-foreground
text-muted-foreground
text-primary
text-secondary-foreground

border-border
border-sidebar-border

// Badge variants
badge-new-role
badge-customer
badge-funded
badge-promoted
badge-vc

// Status colors (inbox message states)
text-status-interested      // Amber - positive response
text-status-not-interested  // Red - negative response
text-status-out-of-office   // Blue - informational

// Effects
card-elevated
card-glow
card-glow-danger
btn-glow

// Table
table-premium

// Filters
filter-chip
filter-chip-remove

// Animations
animate-slide-down
animate-slide-up
animate-fade-in

// Focus
focus-ring
```

---

## UI Components

### Spinner
Loading indicator with size variants.

```tsx
import { Spinner } from "@/components/ui/spinner"

<Spinner />                           // Default (md)
<Spinner size="sm" />                 // Small
<Spinner size="lg" />                 // Large
<Spinner className="text-primary" />  // Custom color
```

### SegmentedControl
Toggle between mutually exclusive options.

```tsx
import { SegmentedControl } from "@/components/ui/segmented-control"

<SegmentedControl
  options={[
    { value: "existing", label: "Existing" },
    { value: "new", label: "New" },
  ]}
  value={mode}
  onChange={setMode}
/>

// Compact size for sidebars
<SegmentedControl
  options={[...]}
  value={value}
  onChange={onChange}
  size="sm"
/>
```
