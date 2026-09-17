---
name: create-styleguide
description: Create a style guide and UI component library in pencil.dev canvas from imported screens and design tokens. Use this skill when the user wants to build a design system, create a component library, set up a styleguide in pencil, or says things like "create a styleguide", "build component library", "set up design system in pencil", "organize my design tokens". Also trigger when the user has just imported screens and wants to establish a consistent design foundation before making changes.
---

# Create Styleguide

Build a comprehensive style guide and UI component library in the pencil.dev canvas, making future design updates consistent and efficient.

## When to Use

Trigger when the user:
- Has just imported screens into pencil and wants to organize the design system
- Says "create styleguide", "build component library", "set up design system"
- Wants to establish design foundations before exploring new styles
- Needs a single source of truth for design decisions in pencil

## Prerequisites

- Screens already imported in pencil.dev (ideally via `get-ui-screens` skill)
- Design tokens/variables extracted from the codebase
- Active pencil.dev project

## Workflow

### 1. Audit Existing Design Patterns

Review the imported screens and extract recurring patterns:
- How many unique colors are actually used vs. defined?
- What typography combinations appear across screens?
- What component patterns repeat (cards, lists, forms, tables)?
- Are there inconsistencies to flag?

### 2. Create Styleguide Frames

Build dedicated frames in pencil.dev canvas for each design foundation:

#### Color Palette Frame
```
[Styleguide - Colors]

Primary Colors
├── Primary         #1a1a2e    (backgrounds, headers)
├── Primary Light   #2a2a4e    (hover states)
├── Primary Dark    #0a0a1e    (active states)

Secondary Colors
├── Secondary       #16213e
├── Accent          #0f3460

Neutral Colors
├── Gray 900        #1a1a1a
├── Gray 700        #4a4a4a
├── Gray 500        #7a7a7a
├── Gray 300        #b0b0b0
├── Gray 100        #f0f0f0

Semantic Colors
├── Success         #10b981
├── Warning         #f59e0b
├── Error           #ef4444
├── Info            #3b82f6
```

#### Typography Frame
```
[Styleguide - Typography]

Heading 1    - Inter Bold 32px/40px
Heading 2    - Inter Semibold 24px/32px
Heading 3    - Inter Semibold 20px/28px
Heading 4    - Inter Medium 18px/24px
Body Large   - Inter Regular 16px/24px
Body         - Inter Regular 14px/20px
Body Small   - Inter Regular 12px/16px
Caption      - Inter Medium 11px/14px
```

#### Spacing & Layout Frame
```
[Styleguide - Spacing]

4px  ░
8px  ░░
12px ░░░
16px ░░░░
24px ░░░░░░
32px ░░░░░░░░
48px ░░░░░░░░░░░░
64px ░░░░░░░░░░░░░░░░

Grid: 12-column, 24px gutter
Container: 1280px max-width
```

#### Elevation & Effects Frame
```
[Styleguide - Effects]

Shadow SM    - 0 1px 2px rgba(0,0,0,0.05)
Shadow MD    - 0 4px 6px rgba(0,0,0,0.1)
Shadow LG    - 0 10px 15px rgba(0,0,0,0.1)

Border Radius
├── Small    4px   (inputs, tags)
├── Medium   8px   (cards, buttons)
├── Large    12px  (modals, panels)
├── Full     9999px (avatars, pills)
```

### 3. Build Component Library Frame

Create a comprehensive component catalog:

#### Atoms (smallest units)
- **Buttons**: Primary, Secondary, Ghost, Destructive — each with Default, Hover, Active, Disabled states
- **Inputs**: Text, Select, Checkbox, Radio, Toggle, Textarea — with Empty, Filled, Error, Disabled states
- **Tags/Badges**: Status indicators, labels, counts
- **Icons**: List commonly used icons with names
- **Avatars**: Sizes and fallback states

#### Molecules (combined atoms)
- **Form Fields**: Label + Input + Helper text + Error message
- **Cards**: Content card, stats card, list item card
- **Navigation Items**: Nav link, breadcrumb, tab item
- **Search**: Search bar with suggestions

#### Organisms (complex components)
- **Navigation**: Header, sidebar, mobile nav
- **Tables**: With sorting, pagination, actions
- **Modals/Dialogs**: Confirmation, form, alert
- **Forms**: Login, settings, data entry

### 4. Set Up Pencil Variables

Configure pencil.dev's built-in variable system:
- Map all colors to named variables
- Set up typography scales as text styles
- Define spacing tokens
- Link component styles to variables (so changing a variable updates all instances)

### 5. Document Component Specs

For each component, include:
- **Name** matching the codebase component name
- **Variants** and their visual states
- **Spacing specs** (padding, margins)
- **Interaction notes** (what happens on hover, click, focus)

### 6. Verify & Present

```markdown
## Styleguide Created

### Foundations
- Colors: X primary, X secondary, X neutral, X semantic
- Typography: X text styles defined
- Spacing: X-step scale
- Effects: X shadows, X border radii

### Components: X total
- Atoms: X (buttons, inputs, tags, etc.)
- Molecules: X (form fields, cards, etc.)
- Organisms: X (nav, tables, modals, etc.)

### Variables Set: X
- All foundations linked to pencil variables
- Components reference variables (not hardcoded values)

Ready for style exploration or direct design work.
```

## Tips

- Name everything to match the codebase — `Button/Primary/Default` not `Blue Button`
- Always include interaction states, not just the default look — designers and developers both need these
- Group components by complexity (atoms → molecules → organisms) for easy navigation
- Make sure variables are actually connected to components, not just listed — this is what makes the `update_styleguide` and `rollout_new_style` skills work smoothly
