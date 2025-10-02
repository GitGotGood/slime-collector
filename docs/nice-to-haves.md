## Nice-to-haves backlog (post-unified rollout)

This list captures useful follow-ups that are not required for today’s release. Use it to pick targeted improvements without spiraling into over-refinement.

### 1) Alias telemetry and insights
- Effort: low
- Risk: low
- Benefits: Visibility into how often legacy IDs are resolved; flags accidental references before they become bugs.

### 2) Schema validation for `skins.ts`
- Effort: medium
- Risk: low
- Benefits: Early failure on malformed skins (missing `base.fill`, invalid `kind`, bad gradients). Prevents gray/blank renders in prod.

### 3) Color normalization
- Effort: low
- Risk: low
- Benefits: Consistent hex casing and gradient stop normalization reduces pixel drift and snapshot noise.

### 4) Full delegation of legacy `Slime.tsx`
- Effort: medium
- Risk: medium
- Benefits: One renderer to maintain; eliminates drift between components.

### 5) Feature flags per surface
- Effort: low
- Risk: low
- Benefits: Safer staged rollouts and emergency toggles per surface (Shop, Collection, Profile).

### 6) Workbench (draft/live roster, JSON diff, paste preview)
- Effort: medium-high
- Risk: low
- Benefits: Faster iteration for adding/editing skins without touching live lists; safer promotions.

### 7) Profile migration dry‑run + report
- Effort: medium
- Risk: low
- Benefits: Validates that player inventories won’t lose skins when aliases change; outputs CSV of unknown IDs.

### 8) Deprecation policy for IDs/aliases
- Effort: low
- Risk: low
- Benefits: Predictable process for renames; avoids surprises like the Aurora rename.

### 9) Extra telemetry events
- Effort: low
- Risk: low
- Benefits: Trace important flows (unknown_id, workbench_promoted) to catch issues early.

### 10) Golden screenshots (expanded)
- Effort: medium (after initial set)
- Risk: low
- Benefits: Extend visual regression coverage beyond shop to high-impact skins and seasonal events.


