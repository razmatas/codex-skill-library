---
name: apply-frontend
description: Implement designs from pencil.dev canvas into the project codebase, using brand-guidelines.md as the source of truth for consistency. Use this skill when the user wants to turn their pencil designs into actual code, says things like "apply the design to code", "implement the frontend", "build the UI from the design", "code up the pencil designs", "apply designs to codebase". This skill carefully translates every design detail into code and uses brand-guidelines.md to fill gaps for missing components like button rollovers, dropdown menus, or missing page states.
---

# Apply Frontend

Implement designs from pencil.dev canvas into the project codebase. Use `brand-guidelines.md` as the single source of truth for consistency, and fill in any gaps where components exist in code but weren't explicitly designed in pencil.

## When to Use

Trigger when the user:
- Has finalized designs in pencil and wants them coded
- Says "apply design to code", "implement the frontend", "code the designs"
- Wants to sync pencil canvas designs with the actual codebase
- Is ready to move from design to implementation

## Prerequisites

- Finalized designs in pencil.dev
- `brand-guidelines.md` in the project (created via `create_brand_guidelines`)
- Access to the project codebase
- Understanding of the project's tech stack (React, Vue, Svelte, etc.)

## Workflow

### 1. Preparation

#### Load Brand Guidelines
Read `brand-guidelines.md` thoroughly. This is your implementation bible. Every design decision should reference this document.

#### Scan the Codebase
Understand the existing architecture:
- **Framework**: React/Next.js, Vue/Nuxt, Svelte/SvelteKit, etc.
- **Styling approach**: Tailwind, CSS Modules, styled-components, SCSS, etc.
- **Component structure**: Where components live, naming patterns
- **Existing design tokens**: CSS variables, theme config, token files
- **Existing components**: What's already built vs. what needs updating

#### Map Pencil Frames to Code
Create a mapping between design frames and code files:

```markdown
## Design → Code Mapping

| Pencil Frame | Route/Page | Code File |
|---|---|---|
| Dashboard - Updated | /dashboard | src/app/dashboard/page.tsx |
| Projects List - Updated | /projects | src/app/projects/page.tsx |
| Login - Updated | /auth/login | src/app/auth/login/page.tsx |
...

| Component in Pencil | Code Component |
|---|---|
| Button/Primary | src/components/ui/Button.tsx |
| Card/Content | src/components/ui/Card.tsx |
| Input/Text | src/components/ui/Input.tsx |
...
```

### 2. Implement Design Foundations First

Before touching individual pages, set up the design system in code:

#### Design Tokens / CSS Variables
Update the global stylesheet or theme config to match brand-guidelines.md:
- All color tokens
- Typography scale
- Spacing scale
- Shadow definitions
- Border radius values
- Transition timings

```css
:root {
  /* Colors */
  --color-primary: #2563EB;
  --color-primary-hover: #1D4ED8;
  /* ... all tokens from brand-guidelines.md */

  /* Typography */
  --font-sans: 'Inter', -apple-system, sans-serif;
  /* ... */

  /* Spacing */
  --space-1: 4px;
  /* ... */
}
```

Or if Tailwind, update `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: { DEFAULT: '#2563EB', hover: '#1D4ED8' },
      // ...from brand-guidelines.md
    }
  }
}
```

#### Base Components
Update shared UI components to match the brand:
- Buttons (all variants and states)
- Input fields
- Cards
- Navigation
- Modals
- Dropdowns
- Tooltips
- Tags/Badges

For each component, implement ALL states from brand-guidelines.md:
- Default, Hover, Active, Focus, Disabled
- Error states where applicable
- Loading states where applicable

### 3. Implement Page by Page

For each screen in the design → code mapping:

#### Deep Analysis
Look at the pencil frame carefully. For each element:
1. What component is this?
2. What are its exact dimensions, spacing, colors?
3. What interactions does it have?
4. Does this component already exist in code or is it new?

#### Implementation
- Match layouts exactly — grid structure, spacing, alignment
- Use design tokens (not hardcoded values) for all visual properties
- Ensure responsive behavior matches brand guidelines
- Add appropriate hover/focus/active states even if not all explicitly shown in design

#### Gap Filling
When you encounter elements that need to exist in the code but aren't explicitly designed in pencil:

**Check brand-guidelines.md first**, then:
- **Missing hover states**: Use the hover rules from the guidelines (e.g., darken by 10%, add shadow)
- **Missing dropdown menus**: Follow the dropdown spec from guidelines
- **Missing empty states**: Use the empty state pattern from guidelines
- **Missing loading states**: Use the loading pattern from guidelines
- **Missing error states**: Use the error pattern from guidelines
- **Missing mobile layouts**: Follow responsive rules from guidelines

Document every gap you fill:
```markdown
Gap: Dropdown menu for project filter not in pencil
Resolution: Built using brand-guidelines.md dropdown spec
- White bg, gray-200 border, shadow-md
- Item hover: gray-100 background
- Selected: primary-light bg, primary text
```

### 4. Handle New Design Elements

Sometimes the pencil design includes elements that DON'T exist in the current codebase (new buttons, new pages, new features). When this happens:

1. **Build it anyway** — implement the frontend as designed
2. **Make it visually complete** — it should look and feel right
3. **Don't wire it up** — if there's no backend/logic to connect to, leave it as a presentational component
4. **Flag it clearly** — document what's new and unconnected

```markdown
## New Elements (Not Connected)

### 1. "Quick Actions" Panel on Dashboard
- Built: ✅ UI complete, matches MINIMAL-01 style
- Status: 🔌 Not connected — buttons are non-functional
- Needs: Backend endpoints for each quick action
- Options:
  a) Connect to existing API endpoints if they exist
  b) Create new API routes for each action
  c) Wire to existing navigation as shortcuts

### 2. "Activity Feed" Widget
- Built: ✅ UI complete with mock data
- Status: 🔌 Not connected — showing placeholder data
- Needs: Real-time data source or API endpoint
- Options:
  a) Connect to existing activity/audit log if available
  b) Create a new activity tracking system
  c) Remove if not a priority feature
```

### 5. Quality Assurance

After implementation, verify:

#### Visual Accuracy
- [ ] Side-by-side comparison with pencil frames
- [ ] Colors match exactly (check with color picker if needed)
- [ ] Typography is correct (font, size, weight, spacing)
- [ ] Spacing matches the design (use dev tools to measure)
- [ ] Shadows and borders match

#### Interactive States
- [ ] All hover states work correctly
- [ ] Focus states are visible (keyboard navigation)
- [ ] Active/pressed states implemented
- [ ] Disabled states styled correctly
- [ ] Error states display properly

#### Responsiveness
- [ ] Looks correct at all breakpoints from brand guidelines
- [ ] Navigation adapts properly on mobile
- [ ] Touch targets are 44px+ on mobile
- [ ] No horizontal scroll on mobile

#### Cross-Reference
- [ ] All design tokens are using variables, not hardcoded values
- [ ] Components match brand-guidelines.md specs
- [ ] Gap-filled components are consistent with the system

### 6. Report

```markdown
## Frontend Implementation Complete

### Pages Implemented: X
✅ Dashboard — exact match to pencil frame
✅ Projects List — exact match
✅ Login — exact match, added form validation states
...

### Components Updated: X
✅ Button (4 variants, all states)
✅ Input (text, select, checkbox, all states)
...

### Gaps Filled: X
- Dropdown menus (using brand guidelines spec)
- Table sort indicators (inferred from style)
- Mobile navigation (responsive rules)
...

### New Elements (Not Connected): X
1. Quick Actions Panel — UI only, needs backend
2. Activity Feed — mock data, needs real source
[See details above for connection options]

### Design Tokens Applied: X variables in code
### Responsive: All breakpoints verified
```

## Tips

- ALWAYS use design tokens/variables — never hardcode a color, spacing, or font value
- When in doubt about a design decision, brand-guidelines.md is the answer
- Don't silently skip gap-filled components — always document what you improvised
- Test in a real browser, not just in code review — CSS can surprise you
- If the design requires a new npm package (font, icon set, animation library), ask before installing
- Keep component naming consistent between pencil, brand guidelines, and code
