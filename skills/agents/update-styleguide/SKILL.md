---
name: update-styleguide
description: Update the pencil.dev project styleguide, variables, and design tokens with a chosen design style from exploration. Use this skill when the user has picked a design direction and wants to commit it to the design system — updating fonts, colors, spacing, component styles, and pencil variables. Trigger on phrases like "update the styleguide with MINIMAL-01", "commit this style", "apply this to the design system", "update my variables", "set this as the new style", or when the user confirms a style exploration and wants to make it the foundation.
---

# Update Styleguide

Commit a chosen design style to the pencil.dev project's styleguide, updating all design variables, tokens, and component definitions to match the new direction.

## When to Use

Trigger when the user:
- Has completed style exploration and chosen a direction
- Says "update styleguide with [style name]", "commit this style", "use this as the foundation"
- Wants to make a style exploration the new design system
- Needs to update pencil variables and component library after choosing a direction

## Prerequisites

- Style exploration completed (via `explore_style` or manual design)
- The chosen style documented in `style-exploration.md`
- Existing styleguide in pencil (via `create_styleguide` or manual setup)

## Workflow

### 1. Load Style Specification

Read the chosen style from `style-exploration.md`. Also load the current styleguide configuration to understand what needs to change.

Identify the delta:
```markdown
## Changes Required: MINIMAL-01

### Colors (8 changes)
- Primary: #1a1a2e → #2563EB
- Background: #ffffff → #FAFAFA
- ...

### Typography (4 changes)
- Heading font: Poppins → Inter
- Body size: 14px → 15px
- ...

### Spacing (3 changes)
- Section gap: 48px → 80px
- ...

### Components (12 changes)
- Button radius: 4px → 8px
- Card shadow: hard → soft diffused
- ...
```

### 2. Update Design Variables

Update pencil.dev's variable system systematically:

#### Color Variables
- Update all color tokens to match the new palette
- Ensure semantic naming is preserved (primary, secondary, accent, etc.)
- Add any new colors the style requires
- Remove any colors that are no longer needed

#### Typography Variables
- Update font family, weights, sizes
- Adjust line heights and letter spacing
- Update text styles (heading, body, caption, etc.)

#### Spacing Variables
- Update the spacing scale
- Adjust section-level spacing
- Update grid/gutter settings if changed

#### Effect Variables
- Update shadow definitions
- Update border radius values
- Update any gradient or overlay tokens

### 3. Update Component Library

For each component in the styleguide, apply the new style:

#### Systematic Update Order
1. **Atoms first**: Buttons, inputs, tags, icons — these are the building blocks
2. **Molecules next**: Form fields, cards, nav items — these compose atoms
3. **Organisms last**: Headers, tables, modals — these compose molecules

For each component:
- Apply new color variables
- Update typography to match new styles
- Adjust spacing and padding
- Restyle borders, shadows, radii
- Update all states (default, hover, active, disabled, error)
- Ensure the component still references variables, not hardcoded values

### 4. Quality Check

Before marking complete, verify:

- [ ] All color variables updated and connected to components
- [ ] Typography styles updated across all text elements
- [ ] Spacing consistent with the new style's philosophy
- [ ] All component states updated (not just default)
- [ ] No orphaned/unused variables remaining
- [ ] Component naming still matches codebase naming
- [ ] Styleguide frames look cohesive as a whole

### 5. Report Changes

```markdown
## Styleguide Updated: MINIMAL-01

### Variables Updated
- Colors: 8 updated, 2 added, 1 removed
- Typography: 4 text styles updated
- Spacing: Scale adjusted (base unit unchanged)
- Effects: 3 shadows redefined, radii updated

### Components Updated: 15
- Buttons: ✅ All 4 variants + states
- Inputs: ✅ All types + states
- Cards: ✅ Content, stats, list
- Navigation: ✅ Header, sidebar, tabs
- Tables: ✅ With new row styling
- Modals: ✅ Confirmation, form, alert
- Tags/Badges: ✅ Updated colors
- Avatars: ✅ New border treatment

### Ready for Next Steps
- Run `rollout_new_style` to apply across all screen designs
- Or manually review the styleguide before rolling out
```

## Tips

- Always update variables first, then components — if pencil's variable system is properly connected, some component updates happen automatically
- Pay special attention to interactive states — hover, focus, active, disabled are easy to miss but critical for the design feeling complete
- Keep a mental note of any components where the new style doesn't quite work — flag these to the user rather than forcing a poor fit
- If the style change is dramatic (e.g., light to dark mode), some components may need structural changes, not just variable swaps — call this out
