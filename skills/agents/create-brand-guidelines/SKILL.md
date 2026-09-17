---
name: create-brand-guidelines
description: Create or update a comprehensive brand-guidelines.md document that serves as the single source of truth for the project's visual identity. Use this skill when the user wants to document the finalized design system, says things like "create brand guidelines", "write up the brand doc", "document the design system", "update brand guidelines", "create the style reference for dev". This document is critical — it bridges design and development, and is used by the apply_frontend skill to ensure consistency when implementing designs in code.
---

# Create Brand Guidelines

Create or update a comprehensive `brand-guidelines.md` that serves as the definitive reference for the project's visual identity. This document is the bridge between design (pencil.dev) and development (codebase), and should be detailed enough that any developer or AI agent can implement the design correctly without access to the pencil file.

## When to Use

Trigger when the user:
- Has finalized designs and wants to document the brand system
- Says "create brand guidelines", "document the style", "write up the design system"
- Wants a reference document for frontend implementation
- Is preparing for the `apply_frontend` step

## Workflow

### 1. Gather All Design Information

Pull from multiple sources:
- **Styleguide frames** in pencil.dev — the visual reference
- **style-exploration.md** — the style's origin and philosophy
- **Design variables** in pencil — the actual token values
- **Component library** in pencil — component specs and states

### 2. Write brand-guidelines.md

Create a comprehensive document with this structure:

```markdown
# Brand Guidelines — [Project Name]

Version: 1.0
Last Updated: [Date]
Style Foundation: [Style name, e.g., MINIMAL-01]

---

## 1. Brand Philosophy

### Design Principles
[3-5 core principles that drive all design decisions]

1. **[Principle]** — [Why it matters and how it manifests]
2. **[Principle]** — [Why it matters and how it manifests]
3. **[Principle]** — [Why it matters and how it manifests]

### Visual Personality
- **Mood**: [e.g., Calm, professional, approachable]
- **Influences**: [e.g., Swiss design, modern minimalism]
- **Do**: [e.g., Use whitespace generously, keep interactions subtle]
- **Don't**: [e.g., Use decorative elements, add gradients to buttons]

---

## 2. Color System

### Primary Palette
| Token | Name | Hex | RGB | Usage |
|-------|------|-----|-----|-------|
| --color-primary | Primary | #2563EB | 37,99,235 | CTAs, links, active states |
| --color-primary-hover | Primary Hover | #1D4ED8 | 29,78,216 | Button/link hover |
| --color-primary-light | Primary Light | #DBEAFE | 219,234,254 | Backgrounds, highlights |

### Neutral Palette
| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| --color-gray-900 | Gray 900 | #111827 | Primary text |
| --color-gray-700 | Gray 700 | #374151 | Secondary text |
| --color-gray-500 | Gray 500 | #6B7280 | Muted text, placeholders |
| --color-gray-300 | Gray 300 | #D1D5DB | Borders, dividers |
| --color-gray-100 | Gray 100 | #F3F4F6 | Subtle backgrounds |
| --color-gray-50 | Gray 50 | #F9FAFB | Page background |

### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| --color-success | #10B981 | Success states, confirmations |
| --color-warning | #F59E0B | Warnings, attention needed |
| --color-error | #EF4444 | Errors, destructive actions |
| --color-info | #3B82F6 | Informational, help |

### Color Application Rules
- Background surfaces use gray-50 or white
- Cards use white with gray-300 border
- Text on dark backgrounds uses white or gray-100
- Accent color reserved for interactive elements only
- Never use more than 2 colors from the primary palette on one screen

---

## 3. Typography

### Font Stack
- **Primary Font**: Inter
- **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Monospace**: 'JetBrains Mono', 'Fira Code', monospace

### Type Scale
| Style | Font | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|------|--------|-------------|----------------|-------|
| Display | Inter | 36px | 700 | 44px | -0.02em | Hero headlines |
| H1 | Inter | 30px | 600 | 38px | -0.02em | Page titles |
| H2 | Inter | 24px | 600 | 32px | -0.01em | Section headers |
| H3 | Inter | 20px | 600 | 28px | -0.01em | Subsection headers |
| H4 | Inter | 16px | 600 | 24px | 0 | Card titles |
| Body LG | Inter | 16px | 400 | 26px | 0 | Lead paragraphs |
| Body | Inter | 14px | 400 | 22px | 0 | Default body text |
| Body SM | Inter | 13px | 400 | 20px | 0 | Secondary content |
| Caption | Inter | 12px | 500 | 16px | 0.01em | Labels, timestamps |
| Overline | Inter | 11px | 600 | 16px | 0.05em | Category labels (uppercase) |

### Typography Rules
- Maximum 2 font weights per section (e.g., regular + semibold)
- Headings use sentence case, not title case
- Body text max-width: 680px for readability
- Links are accent-colored, no underline; underline on hover
- Numbers in data contexts use tabular figures

---

## 4. Spacing & Layout

### Spacing Scale
| Token | Value | Usage |
|-------|-------|-------|
| --space-1 | 4px | Tight gaps (icon + label) |
| --space-2 | 8px | Related elements |
| --space-3 | 12px | Component internal padding |
| --space-4 | 16px | Standard padding, gaps |
| --space-5 | 20px | Card padding |
| --space-6 | 24px | Section internal spacing |
| --space-8 | 32px | Between components |
| --space-10 | 40px | Between sections |
| --space-12 | 48px | Major section breaks |
| --space-16 | 64px | Page-level spacing |

### Grid System
- Columns: 12
- Gutter: 24px
- Max content width: 1280px
- Sidebar width: 256px (collapsible)
- Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)

### Layout Rules
- Content sections separated by --space-10 minimum
- Cards use --space-5 internal padding
- Form fields spaced by --space-4
- Page padding: --space-6 on mobile, --space-8 on desktop

---

## 5. Effects & Surfaces

### Shadows
| Token | Value | Usage |
|-------|-------|-------|
| --shadow-sm | 0 1px 2px rgba(0,0,0,0.05) | Subtle depth (inputs) |
| --shadow-md | 0 4px 6px -1px rgba(0,0,0,0.07) | Cards, dropdowns |
| --shadow-lg | 0 10px 25px -3px rgba(0,0,0,0.08) | Modals, floating elements |

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| --radius-sm | 4px | Tags, small elements |
| --radius-md | 6px | Inputs, small buttons |
| --radius-lg | 8px | Cards, large buttons |
| --radius-xl | 12px | Modals, panels |
| --radius-full | 9999px | Avatars, pills |

### Borders
- Default border: 1px solid var(--color-gray-300)
- Focus ring: 2px solid var(--color-primary) with 2px offset
- Dividers: 1px solid var(--color-gray-200)

---

## 6. UI Components

### Buttons

#### Primary Button
- Background: var(--color-primary)
- Text: white, 14px, font-weight 500
- Padding: 10px 20px
- Border radius: var(--radius-lg)
- Hover: darken background 10%, subtle shadow-sm
- Active: darken background 15%
- Disabled: opacity 0.5, cursor not-allowed
- Focus: focus ring

#### Secondary Button
- Background: transparent
- Border: 1px solid var(--color-gray-300)
- Text: var(--color-gray-700)
- Hover: background var(--color-gray-50), border darken
- [Same states as primary]

#### Ghost Button
- Background: transparent
- No border
- Text: var(--color-gray-600)
- Hover: background var(--color-gray-100)
- [Same states as primary]

#### Destructive Button
- Background: var(--color-error)
- Text: white
- Hover: darken 10%

### Input Fields
- Height: 40px
- Padding: 0 12px
- Border: 1px solid var(--color-gray-300)
- Border radius: var(--radius-md)
- Font: Body (14px)
- Placeholder: var(--color-gray-500)
- Focus: border-color var(--color-primary), focus ring
- Error: border-color var(--color-error), error message below
- Disabled: background var(--color-gray-100), opacity 0.7

### Cards
- Background: white
- Border: 1px solid var(--color-gray-200)
- Border radius: var(--radius-lg)
- Padding: var(--space-5)
- Hover (if interactive): shadow-md, border-color var(--color-gray-300)

### Tables
- Header: background var(--color-gray-50), font-weight 600, text Caption size
- Rows: border-bottom 1px solid var(--color-gray-200)
- Row hover: background var(--color-gray-50)
- Cell padding: var(--space-3) var(--space-4)

### Navigation
- Sidebar: background white, border-right 1px solid var(--color-gray-200)
- Active item: background var(--color-primary-light), text var(--color-primary)
- Hover item: background var(--color-gray-100)
- Top nav: background white, shadow-sm at bottom

### Modals
- Overlay: rgba(0,0,0,0.4), backdrop-blur 4px
- Modal: white background, shadow-lg, radius-xl
- Max width: 480px (small), 640px (medium), 800px (large)
- Padding: var(--space-6)

### Dropdowns
- Background: white
- Border: 1px solid var(--color-gray-200)
- Shadow: shadow-md
- Border radius: var(--radius-lg)
- Item padding: var(--space-2) var(--space-3)
- Item hover: background var(--color-gray-100)
- Selected item: background var(--color-primary-light), text var(--color-primary)

### Tooltips
- Background: var(--color-gray-900)
- Text: white, Caption size
- Padding: var(--space-1) var(--space-2)
- Border radius: var(--radius-sm)
- Max width: 240px

### Tags/Badges
- Padding: 2px 8px
- Border radius: var(--radius-full)
- Font: Caption size, font-weight 500
- Variants: Each semantic color has a light bg + darker text version

### Toast/Notifications
- Position: top-right
- Width: 360px
- Shadow: shadow-lg
- Border-left: 4px solid [semantic color]
- Auto-dismiss: 5 seconds

---

## 7. Iconography

### Style
- Set: [e.g., Lucide, Heroicons, Phosphor]
- Weight: 1.5px stroke (outline style)
- Size: 16px (inline), 20px (button), 24px (feature)
- Color: inherits from parent text color

### Usage Rules
- Icons always paired with text labels in navigation
- Standalone icons only in toolbars or established patterns (close, search, menu)
- Decorative icons at 24px in muted color

---

## 8. Motion & Interaction

### Timing
- **Micro**: 100ms — button states, toggles
- **Standard**: 200ms — dropdowns, tooltips, color changes
- **Entrance**: 300ms — modals, sidebars, page transitions
- **Complex**: 400ms — multi-step animations

### Easing
- Default: cubic-bezier(0.4, 0, 0.2, 1)
- Enter: cubic-bezier(0, 0, 0.2, 1)
- Exit: cubic-bezier(0.4, 0, 1, 1)

### Interaction Patterns
- Buttons: subtle scale (0.98) on active, color transition on hover
- Cards: shadow elevation change on hover if clickable
- Page transitions: fade with 100ms duration
- Loading: skeleton screens preferred over spinners
- Scroll: native smooth scroll behavior

---

## 9. Patterns & Graphics

### Empty States
- Centered illustration or icon (24-48px, muted)
- Heading + description + primary action CTA
- Keep illustrations simple, matching icon style

### Loading States
- Skeleton screens: gray-200 rectangles with pulse animation
- Inline loading: small spinner next to triggering element
- Full page: centered spinner with optional message

### Error States
- Inline errors: red text below the field
- Page errors: centered message with retry action
- Toast errors: top-right with error color border

---

## 10. Implementation Notes

### CSS Custom Properties
All tokens should be implemented as CSS custom properties on `:root`
so they can be overridden for theming or dark mode.

### Component Naming
Components in code should match the names used in this document:
- Button → `<Button variant="primary">` or `.btn-primary`
- Card → `<Card>` or `.card`
- etc.

### Responsive Behavior
- Mobile-first approach
- Sidebar collapses to hamburger below 768px
- Grid switches to single column below 640px
- Touch targets minimum 44px × 44px on mobile
```

### 3. Verify Completeness

Before finishing, check that the document covers every question a developer might ask:
- [ ] Can I implement any component without seeing the design?
- [ ] Are all interactive states documented?
- [ ] Are responsive behaviors specified?
- [ ] Are edge cases covered (empty, loading, error)?
- [ ] Are animation timings and easings specified?
- [ ] Would an AI agent be able to create a new page that feels consistent?

### 4. Cross-Reference with Pencil

Compare the document against the actual pencil designs:
- Do the token values match what's in the frames?
- Are there components in the designs not covered in the document?
- Are there any visual nuances in the design that the text doesn't capture?

### 5. Present to User

```markdown
## Brand Guidelines Created

📄 brand-guidelines.md

### Sections:
1. Brand Philosophy — principles and personality
2. Color System — full palette with tokens
3. Typography — scale, rules, font stack
4. Spacing & Layout — grid, spacing scale
5. Effects & Surfaces — shadows, radii, borders
6. UI Components — all components with states
7. Iconography — style and usage rules
8. Motion & Interaction — timing and patterns
9. Patterns & Graphics — empty, loading, error states
10. Implementation Notes — dev-specific guidance

This document will be used by `apply_frontend` as the single
source of truth when implementing designs in code.
```

## Tips

- Be extremely specific with values — "subtle shadow" means nothing to an agent, "0 4px 6px -1px rgba(0,0,0,0.07)" is actionable
- Document what NOT to do alongside what to do — constraints are as important as specifications
- Include the "why" behind design decisions where possible — it helps when improvising for unmocked components
- Keep the document in the project root so both pencil and code workflows can reference it
- This is a living document — update it when the design evolves
