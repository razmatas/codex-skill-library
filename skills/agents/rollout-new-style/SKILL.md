---
name: rollout-new-style
description: Roll out the updated styleguide across all existing screen designs in pencil.dev canvas. Use this skill after the styleguide has been updated with a new style and you need to apply it consistently to all pages/frames. Trigger on phrases like "roll out the new style", "apply to all screens", "update all pages with the new design", "propagate the style changes", "apply styleguide to all frames", or when the user has just finished updating the styleguide and wants it reflected everywhere.
---

# Rollout New Style

Apply the updated styleguide consistently across all existing screen designs in the pencil.dev canvas. This is the systematic propagation step — taking the updated design foundations and ensuring every screen reflects them.

## When to Use

Trigger when the user:
- Has updated the styleguide (via `update_styleguide`) and wants changes reflected everywhere
- Says "roll out", "apply to all", "update all screens", "propagate changes"
- Needs consistent style across all imported/designed screens

## Prerequisites

- Styleguide updated with new style (via `update_styleguide`)
- Existing screen frames in pencil.dev that need updating

## Workflow

### 1. Inventory All Screens

List all screen frames in the pencil canvas that need updating. Categorize by complexity:

```markdown
## Screens to Update

### High Complexity (many components, data-dense)
- Dashboard
- Project Detail
- Settings

### Medium Complexity
- Projects List
- Profile
- Search Results

### Low Complexity (fewer elements)
- Login
- Signup
- Landing Page
- 404/Error pages

Total: X screens to update
```

### 2. Establish Update Strategy

Work through screens in this order:
1. **Low complexity first** — Quick wins, builds momentum, catches issues early
2. **Medium complexity** — The bulk of the work
3. **High complexity last** — Most time-consuming, benefits from patterns established in earlier screens

For each screen, the update follows this checklist:

### 3. Per-Screen Update Checklist

For each screen frame:

#### Foundation Layer
- [ ] Background colors match new palette
- [ ] Text colors updated (primary, secondary, muted)
- [ ] Accent colors applied correctly

#### Typography Layer
- [ ] Headings use new heading styles
- [ ] Body text uses new body style
- [ ] Captions, labels, helper text updated
- [ ] Font family consistent throughout

#### Component Layer
- [ ] Buttons match updated component library
- [ ] Input fields match updated styles
- [ ] Cards/containers match updated styles
- [ ] Navigation elements updated
- [ ] Table rows, cells, headers updated
- [ ] Tags, badges, status indicators updated
- [ ] Icons consistent with new style

#### Spacing Layer
- [ ] Section spacing matches new scale
- [ ] Component internal padding updated
- [ ] Margins between elements consistent
- [ ] Overall page density matches style intent

#### Effects Layer
- [ ] Shadows updated on all elevated elements
- [ ] Border radius consistent
- [ ] Border styles/colors updated
- [ ] Any overlays or backdrop effects

### 4. Cross-Screen Consistency Check

After updating all individual screens, do a holistic review:

- **Navigation flow**: Do screens feel like they belong to the same app?
- **Component consistency**: Does the same component (e.g., a data table) look identical across screens?
- **Spacing rhythm**: Is the vertical rhythm consistent across pages?
- **Color distribution**: Is the accent color used with the same frequency/intention?
- **Edge cases**: Empty states, loading states, error states (if present)

### 5. Flag Issues

Some screens may not adapt cleanly. Document any issues:

```markdown
## Rollout Issues

### Dashboard
- Data table is very dense — new spacing scale makes it feel too spread out
  → Suggestion: Use tighter spacing variant for data tables specifically

### Landing Page
- Hero section needs new imagery to match the style change
  → Suggestion: Update hero with style-appropriate illustration/photography

### Profile
- Avatar component doesn't have a clear style in the new system
  → Suggestion: Add avatar component to styleguide
```

### 6. Report

```markdown
## Rollout Complete

### Screens Updated: X/X
✅ Dashboard — updated with data table spacing note
✅ Projects List — clean update
✅ Project Detail — updated, new section dividers
✅ Login — updated, simplified layout
✅ Settings — updated with form field tweaks
...

### Issues Found: X
1. [Issue and suggested resolution]
2. [Issue and suggested resolution]

### Before/After
Each screen now has "- Current" and "- Updated" versions for comparison

### Next Steps
- Review updated screens for approval
- Run `create_brand_guidelines` to document the finalized style
- Run `apply_frontend` when ready to implement in code
```

## Tips

- If pencil's variable system is properly connected, many updates happen automatically when variables change — check which screens auto-updated before doing manual work
- Always keep the original imported screens as a "before" reference — work on copies
- If a screen looks off after update, the issue is usually spacing — the style spec's whitespace philosophy may need adaptation for data-dense pages
- Don't be afraid to flag screens that need structural layout changes beyond just style swapping — some designs need to be rethought, not just reskinned
- Number your frames clearly so the user can quickly navigate to any screen that needs review
