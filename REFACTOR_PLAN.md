# Refactor Plan

Goal: simplify `useBuilderStore`, `useProductCard`, and `useReviewSection` by moving shared logic into small pure helpers and keeping each implementation step reviewable before the next one starts.

## Workflow

- Do not start the next step until the current step is reviewed and approved.
- Each step is intentionally blocked on the previous step.
- Keep each change small enough to validate on its own.

## Step 1 - Extract shared pure helpers

Status: Blocked

Scope:
- Create reusable helpers for default variant resolution, item-key creation, currency formatting, line-item calculation, grouping, and savings math.
- Keep these helpers pure and colocated in a small utility module set.

Why this comes first:
- `useBuilderStore`, `useProductCard`, and `useReviewSection` all repeat the same calculations.
- This reduces duplication without changing behavior yet.

Review criteria:
- No UI or store behavior changes.
- Helper outputs match the current logic exactly.
- Existing code can still compile without changing call sites yet.

Blocked by:
- Approval of this helper extraction.

## Step 2 - Simplify the store around state and mutation only

Status: Blocked

Scope:
- Move cart derivation out of `useBuilderStore`.
- Keep `selections` and `updateQuantity` as the primary store responsibilities.
- Replace hard-coded startup selection setup with a data-driven initializer.
- Centralize product collection lookup so the store does not rebuild derived cart data on every call.

Why this is next:
- The store is the main source of coupling today.
- Once helpers exist, the store can consume them instead of duplicating logic.

Review criteria:
- Stored selection behavior stays the same.
- Quantity updates still work for normal and variant products.
- No derived cart totals remain inside store methods if they can live in helpers/selectors.

Blocked by:
- Step 1 being approved and merged.

## Step 3 - Make `useProductCard` a thin UI hook

Status: Blocked

Scope:
- Reuse the shared default-variant helper.
- Reuse shared price formatting and line-total helpers.
- Add a reset path for `activeColor` when the product changes.
- Keep the hook focused on UI state and dispatching quantity updates.

Why this is separate:
- The product card still has local UI state, so it needs its own review after the store/helper cleanup.

Review criteria:
- Selected variant stays stable for the current product.
- Switching products does not leave stale color state behind.
- Pricing output matches the old behavior.

Blocked by:
- Step 2 being approved and merged.

## Step 4 - Make `useReviewSection` consume shared derived cart data

Status: Blocked

Scope:
- Replace repeated cart math with shared derived cart helpers.
- Remove the forced subscription to `selections` if the new derived source already provides reactivity.
- Keep save-state behavior and item grouping, but move the heavy calculation work out of the hook.

Why this is separate:
- This hook currently mixes presentation logic, aggregation, and persistence state.

Review criteria:
- Totals, savings, and groupings stay identical.
- Free items still cannot be mutated.
- Save-state behavior is unchanged.

Blocked by:
- Step 3 being approved and merged.

## Step 5 - Add focused tests for the extracted behavior

Status: Blocked

Scope:
- Add tests for helper functions and the simplified store/hook behavior that changed in the previous steps.
- Cover default variant selection, quantity updates, cart totals, savings math, and product-card variant switching.

Why this is last:
- The test surface should follow the final shape of the refactor, not the intermediate one.

Review criteria:
- Tests cover the new shared helpers and the behavior that was previously duplicated.
- No test depends on implementation details that are meant to be removed.

Blocked by:
- Step 4 being approved and merged.
