# Frontend Architecture

Strategic approach for building a premium $8k+ B2B SaaS frontend, aligned with our API-first philosophy.

---

## Core Principle: API Contract Drives Everything

The OpenAPI spec is the source of truth. The frontend consumes what the API provides—no transformation layers, no hand-written types, no intermediate interfaces.

### Type Flow
```
OpenAPI Spec → openapi-typescript → components["schemas"]["Lead"] → React Components
```

### Rules
1. **Never hand-write types** that duplicate API schemas
2. **Pass full API objects** to components, not extracted fields
3. **Filter param names = API param names** exactly
4. **Signals are data, not code** — render from API response, style with CSS

---

## Component Organization

### Feature-Based Structure (Recommended)
```
/features/
  leads/
    components/
      LeadsTable.tsx
      LeadRow.tsx
      cells/
        NameCell.tsx
        CompanyCell.tsx
        SignalBadges.tsx
    hooks/
      useLeads.ts
      useLeadColumns.ts
  filters/
    components/
      FilterPanel.tsx
      FilterField.tsx
      FilterChip.tsx
    hooks/
      useFilterState.ts
/components/
  ui/          # shadcn primitives (untouched)
  badges/      # reusable badge components
    SignalBadge.tsx
```

**Why feature-based:** When you work on leads, everything is in one place. Related code stays together.

---

## Cell Components

Extract cell rendering from column definitions into composable components.

### Before (Inline)
```tsx
cell: ({ row }) => (
  <div className="font-medium text-foreground">
    {row.getValue("full_name") || "—"}
  </div>
)
```

### After (Extracted)
```tsx
cell: ({ row }) => <LeadNameCell lead={row.original} />
```

### Cell Component Pattern
```tsx
interface LeadNameCellProps {
  lead: Lead  // Full API type, not extracted fields
}

function LeadNameCell({ lead }: LeadNameCellProps) {
  return (
    <div className="font-medium text-foreground">
      {lead.full_name || "—"}
    </div>
  )
}
```

**Why:**
- Cells become testable in isolation
- Can add click handlers, tooltips, avatars without bloating column defs
- Consistent styling enforced at component level
- Full `Lead` object available for future enhancements

---

## Badge/Signal System

One component with typed variants, not separate components per signal.

### Implementation
```tsx
// The signal value comes from API or URL params
type SignalType = 'newInRole' | 'promoted' | 'funded' | 'customer' | 'vcPortfolio'

interface SignalBadgeProps {
  signal: SignalType
}

function SignalBadge({ signal }: SignalBadgeProps) {
  const config = {
    newInRole: { label: 'New in Role', className: 'badge-new-role' },
    promoted: { label: 'Recently Promoted', className: 'badge-promoted' },
    funded: { label: 'Recently Funded', className: 'badge-funded' },
    customer: { label: 'Worked at Customer', className: 'badge-customer' },
    vcPortfolio: { label: 'At VC Portfolio', className: 'badge-vc' },
  }

  const { label, className } = config[signal]

  return (
    <span className={cn("px-2 py-1 text-xs font-medium rounded-md", className)}>
      {label}
    </span>
  )
}
```

**Why:**
- Single component, multiple variants
- Styling comes from design system CSS (`.badge-new-role`, etc.)
- Type-safe: TypeScript enforces valid signal types
- Easy to add new signals without creating new components

---

## Filter State Architecture

Consolidate all filter state into a single hook wrapping nuqs.

### Current (Scattered)
```tsx
const [industry] = useQueryState('industry')
const [employeeRange] = useQueryState('employee_range')
const [companyName] = useQueryState('company_name')
// ...repeated for every filter
```

### Proposed (Consolidated)
```tsx
function useFilterState() {
  // All filter state in one place
  const [industry, setIndustry] = useQueryState('industry')
  const [employeeRange, setEmployeeRange] = useQueryState('employee_range')
  // ...

  return {
    filters: { industry, employeeRange, /* ... */ },
    setFilter: (key, value) => { /* dispatch to correct setter */ },
    clearFilter: (key) => { /* set to null */ },
    clearAll: () => { /* reset everything */ },
    activeFilters: [ /* computed list of non-null filters */ ],
  }
}
```

**Benefits:**
- One place to add new filters
- Easy to serialize/save filter views
- Cleaner component code
- `activeFilters` computed once, used everywhere

---

## What We Use vs What We Build

| Need | Approach |
|------|----------|
| Table logic (sorting, resizing) | TanStack Table (existing) |
| UI primitives | shadcn/ui (existing) |
| URL state | nuqs (existing) |
| Data fetching | SWR (existing) |
| Types | openapi-typescript (generated) |
| Cell rendering | Custom components |
| Badge styling | Design system CSS |
| Filter orchestration | Custom hook |

**Philosophy:** Use existing tools for solved problems. Build custom for product-specific presentation.

---

## What We Avoid

1. **Over-abstracting** — No generic `<DataCell>` that tries to handle everything
2. **Context everywhere** — Prop drilling is fine for 2-3 levels
3. **Premature optimization** — No virtualization until we need it
4. **Transformation layers** — No mapping API data to different shapes
5. **Hand-written types** — Everything comes from generated OpenAPI types

---

## Comparison: Lovable vs Our Approach

| Aspect | Lovable | Our Approach |
|--------|---------|--------------|
| Types | Hand-written interfaces | Generated from OpenAPI |
| Data flow | Transform API → UI shape | Direct pass-through |
| Filter state | Local useState | URL-synced (nuqs) |
| Data fetching | Static mock data | SWR with caching |
| Component size | Monolithic (300+ lines) | Atomic, composable |
| Styling | Scattered CSS variables | Structured design system |

**Summary:** Lovable's visual design + our engineering rigor.

---

## Implementation Checklist

### Phase 1: Design System ✓
- [x] CSS variables for all colors
- [x] Badge color variants
- [x] Table styling tokens
- [x] Animation utilities
- [x] Documentation

### Phase 2: Type Cleanup ✓
- [x] Generate types from OpenAPI
- [x] Remove hand-written Lead type
- [x] Remove transformation layer in page
- [x] Fix column accessors to match API

### Phase 3: Atomic Components (Next)
- [ ] Create `SignalBadge` component
- [ ] Extract `LeadNameCell`, `CompanyCell`, `TitleCell`
- [ ] Create `FilterChip` component
- [ ] Consolidate filter state into `useFilterState`

### Phase 4: Feature Organization
- [ ] Create `/features/leads/` structure
- [ ] Create `/features/filters/` structure
- [ ] Move related code into feature folders

---

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `LeadNameCell.tsx` |
| Hooks | camelCase with `use` prefix | `useFilterState.ts` |
| Types | PascalCase | Generated in `types.ts` |
| Utils | camelCase | `formatDate.ts` |
| CSS | kebab-case classes | `.badge-new-role` |

---

## Testing Strategy

1. **Unit tests** for utility functions and hooks
2. **Component tests** for cell components with mock data
3. **Integration tests** for filter state + URL sync
4. **E2E tests** for critical user flows

Cell components receiving full `Lead` objects are easy to test:
```tsx
render(<LeadNameCell lead={{ full_name: 'John Doe', /* ... */ }} />)
expect(screen.getByText('John Doe')).toBeInTheDocument()
```
