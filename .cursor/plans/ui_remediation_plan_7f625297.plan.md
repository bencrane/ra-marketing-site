---
name: UI Remediation Plan
overview: A comprehensive plan to align the codebase with the Revenue Activation Design System, based on the UI Audit findings. This plan addresses hardcoded colors, spacing inconsistencies, typography deviations, and missing design tokens.
todos:
  - id: create-report
    content: Create `ui-audit-report.md` with detailed audit findings.
    status: pending
  - id: fix-sidebar-typography
    content: Refactor `InboxSidebar.tsx` to use `.sidebar-section-header` class instead of inline styles.
    status: pending
  - id: fix-table-spacing
    content: Update `src/components/ui/table.tsx` to match `px-4 py-4` spacing guidelines.
    status: pending
  - id: fix-leads-table
    content: Refactor `src/features/leads/components/LeadsTable.tsx` to align with `table-premium` styles and correct padding.
    status: pending
  - id: fix-auth-cards
    content: Extract duplicated Auth card styles in `sign-in/page.tsx` and `auth/verify/page.tsx` into a shared pattern or apply `card-elevated`.
    status: pending
  - id: fix-auth-colors
    content: Replace hardcoded colors in `src/app/auth/verify/page.tsx` and `src/app/sign-in/page.tsx` with semantic tokens.
    status: pending
  - id: fix-lead-signal
    content: Refactor hardcoded "Funded" signal in `src/app/leads/[personId]/page.tsx` to use `badge-funded` tokens or `SignalBadge` logic.
    status: pending
  - id: fix-shadows
    content: Standardize shadow usage to `card-elevated` or `card-glow` where applicable.
    status: pending
isProject: false
---

Based on the comprehensive UI Audit, the following issues were identified:

- **Hardcoded Colors**: Red/Purple/Yellow values used directly instead of semantic tokens in Auth and Leads pages.
- **Typography**: Inline styles used instead of `sidebar-section-header`; non-standard `text-[10px]` usage.
- **Spacing**: Table cell padding (`p-2`, `py-3.5`) deviates from the `px-4 py-4` standard.
- **Missing Classes**: `card-elevated`, `card-glow`, and `table-premium` are defined but unused.
- **Duplication**: Auth card styles are repeated; Sidebar header styles are repeated inline.

The plan below outlines the steps to remediate these issues, starting with low-risk refactors and moving to component alignment.

### Phase 1: Audit Report & Standards

- Generate the full `ui-audit-report.md` file (as requested) to document the current state.
- Create a reusable `AuthCard` component or layout to unify Sign In and Verify pages.

### Phase 2: Base Component Refactoring

- **Tables**: Update `src/components/ui/table.tsx` to use `px-4 py-4` padding.
- **Typography**: Replace inline sidebar header styles in `InboxSidebar.tsx` with the `.sidebar-section-header` class.
- **Cards**: Apply `.card-elevated` class to Auth cards and main containers where appropriate, replacing manual `shadow-xl`.

### Phase 3: Token Alignment

- **Auth Pages**: Replace `bg-red-500/10` and `text-red-500` with `destructive` tokens or a new `alert-danger` semantic class.
- **Leads Page**: Replace the hardcoded "Funded" card (`bg-purple-950/50`) with a component using `badge-funded` variables or a new `SignalCard` component.
- **Inbox**: Map `MessageDetail` status colors to design tokens (or extend design system if needed).

### Phase 4: Cleanup & Organization

- Remove unused or duplicate inline styles.
- Verify all changes against `docs/design-system.md`.