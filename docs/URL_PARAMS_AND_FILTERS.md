# URL Parameters and Filter System

**Last Updated:** January 30, 2026

## Overview

The leads dashboard uses **nuqs (v2.8.6)** for URL state management. This library synchronizes filter state with URL query parameters, enabling:
- Persistent filter states across page refreshes
- Shareable URLs with pre-applied filters
- Browser back/forward navigation through filter changes

## Architecture

### Three Levels of Filter State

| Level | Storage | URL Synced | Use Case |
|-------|---------|------------|----------|
| Manual Filters | nuqs/URL | Yes | User-set filters via sidebar |
| AI Filters | React State | No | Filters from AI Search |
| List Filters | React State | No | Filtering by saved lists |

**Precedence:** AI Filters > List Filters > Manual Filters

When AI or List filters are active, manual filters are paused (not cleared).

## URL Parameter Reference

### Pagination

| Param | Type | Default | Example |
|-------|------|---------|---------|
| `limit` | integer | 50 | `?limit=100` |
| `offset` | integer | 0 | `?offset=50` |

### Signal Filters (Boolean)

Signals determine which API endpoint is called.

| Param | Description | Example |
|-------|-------------|---------|
| `new_in_role` | People recently changed jobs | `?new_in_role=true` |
| `recently_promoted` | People recently promoted | `?recently_promoted=true` |
| `at_vc_portfolio` | People at VC portfolio companies | `?at_vc_portfolio=true` |
| `worked_at_customer` | People who worked at target company's customers | `?worked_at_customer=true` |
| `past_employer` | People from past employers | `?past_employer=true` |
| `recently_raised` | Companies that recently raised funding | `?recently_raised=true` |
| `rapid_growth` | Rapidly growing companies | `?rapid_growth=true` |

### Company Filters (String)

| Param | Description | Example |
|-------|-------------|---------|
| `industry` | Company industry | `?industry=SaaS` |
| `employee_range` | Company size | `?employee_range=51-200` |
| `company_name` | Company name | `?company_name=Stripe` |
| `company_domain` | Company domain | `?company_domain=stripe.com` |

### Person Filters (String)

| Param | Description | Example |
|-------|-------------|---------|
| `job_function` | Job function/department | `?job_function=Sales` |
| `seniority` | Seniority level | `?seniority=VP,Director` |
| `job_title` | Job title | `?job_title=VP%20of%20Sales` |
| `full_name` | Person's name | `?full_name=John%20Doe` |

### Location Filters (String)

| Param | Description | Example |
|-------|-------------|---------|
| `person_country` | Country | `?person_country=USA` |
| `person_state` | State/Province | `?person_state=California` |
| `person_city` | City | `?person_city=San%20Francisco` |

### Business Model Filters (Boolean)

| Param | Description | Example |
|-------|-------------|---------|
| `is_b2b` | B2B companies | `?is_b2b=true` |
| `is_b2c` | B2C companies | `?is_b2c=true` |
| `is_b2b_and_b2c` | Both B2B and B2C | `?is_b2b_and_b2c=true` |

### Funding Filters (String)

| Param | Description | Example |
|-------|-------------|---------|
| `total_raised` | Total funding raised | `?total_raised=10M-50M` |
| `last_round_amount` | Last round amount | `?last_round_amount=5M` |
| `raised_within_days` | Days since last raise | `?raised_within_days=90` |
| `round_type` | Funding round type | `?round_type=Series%20A` |
| `vc_firm` | VC firm investor | `?vc_firm=Sequoia` |

### Additional Filters (String)

| Param | Description | Example |
|-------|-------------|---------|
| `technologies` | Tech stack | `?technologies=Salesforce,HubSpot` |
| `revenue_range` | Revenue range | `?revenue_range=1M-10M` |
| `how_they_sell` | Sales model | `?how_they_sell=Self-serve` |
| `how_they_price` | Pricing model | `?how_they_price=Usage-based` |
| `enterprise_readiness` | Enterprise features | `?enterprise_readiness=SOC2` |
| `competitors` | Competitor companies | `?competitors=Salesforce` |
| `lookalikes` | Similar companies | `?lookalikes=stripe.com` |
| `hiring_for` | Open job roles | `?hiring_for=Sales` |
| `payments_data` | Payment processing data | `?payments_data=true` |
| `public_filings` | Public filings data | `?public_filings=true` |

## Special Case: Target Company Parameter

The `company` parameter is handled **separately** from nuqs.

### Behavior

```
https://app.revenueactivation.com/leads?company=securitypalhq.com
```

- **Read:** Via `searchParams.get("company")` on page load
- **Set:** Via `router.push(/leads?company=${domain})`
- **Display:** Shown in `TargetCompanyPanel` component
- **Effect:** Only affects API when `worked_at_customer` signal is active

### Code Reference

```typescript
// src/app/leads/page.tsx (lines 64-72)
React.useEffect(() => {
  const companyParam = searchParams.get("company")
  if (companyParam) {
    setTargetCompany({ companyDomain: companyParam })
  } else {
    setTargetCompany(null)
  }
}, [searchParams])
```

### Integration with Signals

When `worked_at_customer=true` AND `company` is set:

```typescript
// src/app/leads/page.tsx (lines 99-104)
if (filters.signal_worked_at_customer && targetCompany?.companyDomain) {
  return {
    ...baseFilters,
    signal_worked_at_customer: true,
    company_domain: targetCompany.companyDomain,
  }
}
```

## Multiple Values

Text filters support comma-separated values:

```
?industry=SaaS,FinTech,Healthcare
?seniority=VP,Director,C-Level
?technologies=Salesforce,HubSpot,Marketo
```

These are parsed and displayed as individual filter chips in the sidebar.

## Example URLs

**Basic pagination:**
```
/leads?limit=50&offset=0
```

**Single signal:**
```
/leads?new_in_role=true
```

**Multiple filters:**
```
/leads?industry=SaaS&employee_range=51-200&job_title=VP%20of%20Sales
```

**Target company with signal:**
```
/leads?company=stripe.com&worked_at_customer=true
```

**Complex filter combination:**
```
/leads?is_b2b=true&industry=SaaS,FinTech&employee_range=51-500&seniority=VP,Director&new_in_role=true
```

## Implementation Details

### nuqs Configuration

Filters use nuqs parsers:

```typescript
// Boolean filters
const [newInRole, setNewInRole] = useQueryState("new_in_role", parseAsBoolean)

// Integer filters
const [limit, setLimit] = useQueryState("limit", parseAsInteger.withDefault(50))

// String filters (default parser)
const [industry, setIndustry] = useQueryState("industry")
```

### Filter State Hook

The `useFilterState` hook consolidates URL-synced filters:

```typescript
// src/features/filters/hooks/use-filter-state.ts
const filters = {
  limit,
  offset,
  // Signals
  signal_new_in_role: newInRole || false,
  signal_recently_promoted: recentlyPromoted || false,
  // ... more signals
  // Company
  industry,
  employee_range: employeeRange,
  // Person
  job_function: jobFunction,
  seniority,
  job_title: jobTitle,
  // Location
  person_country: personCountry,
  person_state: personState,
  person_city: personCity,
}
```

### Dual Management Architecture

**Important:** Filters are managed in two places:

1. **`useFilterState` hook** - Used by leads page for core filters
2. **Sidebar component** - Direct `useQueryState` calls for additional filters

Both write to the same URL, staying in sync through nuqs.

## Signal → API Endpoint Routing

Signals change which API endpoint is called:

| Signal | Endpoint |
|--------|----------|
| `new_in_role` | `/api/leads/new-in-role` |
| `recently_promoted` | `/api/leads/recently-promoted` |
| `at_vc_portfolio` | `/api/leads/vc-portfolio` |
| `worked_at_customer` | `/api/leads/worked-at-customer` |
| Default (no signal) | `/api/leads` |

## Key Files

| File | Purpose |
|------|---------|
| `src/app/leads/page.tsx` | Main page, target company handling |
| `src/features/filters/hooks/use-filter-state.ts` | Centralized filter state |
| `src/components/sidebar.tsx` | Filter UI, additional nuqs filters |
| `src/features/leads/hooks/use-leads.ts` | API integration, filter → query params |
| `src/features/leads/components/TargetCompanyPanel.tsx` | Target company display |
| `src/features/leads/components/SecretCompanyModal.tsx` | Target company input modal |

## Not URL-Synced

These filter types are stored in React state only:

| Type | Reason |
|------|--------|
| AI Filters | Temporary, from AI Search results |
| List Filters | Reference list ID, not filter values |

When active, these suppress (but don't clear) manual URL filters.
