---
name: get-ui-screens
description: Import all screen designs and UI components from a codebase into pencil.dev canvas, including global CSS as variables. Use this skill whenever the user wants to bring existing frontend pages into pencil for redesign, says things like "import my screens into pencil", "pull pages from codebase into pencil", "get the UI from my project", "extract screens from code", or mentions needing to set up pencil.dev with their existing project screens. Also trigger when the user references syncing their codebase UI with pencil.dev or preparing designs for a redesign workflow.
---

# Get UI Screens

Import all screen designs, pages, and UI components from a codebase into pencil.dev, including global CSS extracted as design variables.

## When to Use

Trigger when the user:
- Wants to import existing frontend screens into pencil.dev
- Is starting a redesign workflow and needs current screens in pencil
- Says "get screens from codebase", "import UI into pencil", "set up pencil with my project"
- Needs to bring code-based components into a design canvas for iteration

## Prerequisites

- Access to the project codebase (via mounted folder or git)
- pencil.dev project open (user should confirm the pencil project URL or workspace)
- Antigravity IDE or Codex with browser/file access

## Workflow

### 1. Scan the Codebase

Identify all frontend pages and components. Look for:
- **Page/route files**: Check routing config (e.g., `app/`, `pages/`, `routes/`, `src/views/`)
- **Component library**: Reusable UI components (e.g., `components/`, `ui/`, `shared/`)
- **Layout files**: Wrappers, navigation, sidebars, footers
- **Global styles**: CSS/SCSS/Tailwind config, design tokens, theme files

```
Typical scan targets:
- src/app/**/page.tsx (Next.js)
- src/pages/**/*.vue (Nuxt/Vue)
- src/routes/**/*.svelte (SvelteKit)
- src/components/**/*
- src/styles/globals.css
- tailwind.config.js / theme.ts
- tokens.json / variables.scss
```

### 2. Extract Global CSS & Design Tokens

Parse the global stylesheet and any design token files to extract:
- **Colors**: All color values (hex, rgb, hsl, CSS custom properties)
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: Padding/margin scales, gap values
- **Breakpoints**: Responsive breakpoints
- **Shadows, borders, radii**: Any recurring visual properties

Format these as a structured reference that can be set up as pencil.dev variables:

```markdown
## Extracted Design Tokens

### Colors
- --primary: #1a1a2e
- --secondary: #16213e
- --accent: #0f3460
- --text: #e94560
- --bg: #f5f5f5

### Typography
- --font-heading: 'Inter', sans-serif
- --font-body: 'Inter', sans-serif
- --text-xs: 12px
- --text-sm: 14px
- --text-base: 16px
- --text-lg: 18px
- --text-xl: 24px

### Spacing
- --space-1: 4px
- --space-2: 8px
- --space-3: 16px
- --space-4: 24px
- --space-5: 32px
```

### 3. Identify Screens to Import

Present the user with a list of all discovered pages/screens:

```
Found 12 screens in codebase:
1. Dashboard (/dashboard)
2. Projects List (/projects)
3. Project Detail (/projects/[id])
4. Settings (/settings)
5. Profile (/profile)
6. Login (/auth/login)
7. Signup (/auth/signup)
8. Landing Page (/)
...

Which screens should I import into pencil? (all / specific numbers)
```

### 4. Import into Pencil.dev

For each screen to import:

1. **Capture the current design** - Either take a screenshot of the running app or reconstruct the layout from the component tree
2. **Create a frame in pencil** for each screen, named clearly (e.g., "Dashboard - Current", "Login - Current")
3. **Set up design variables** in pencil matching the extracted CSS tokens
4. **Organize frames** logically - group by feature area or user flow

### 5. Import Reusable Components

For shared UI components (buttons, cards, inputs, modals, etc.):
- Create a separate "Components - Current" frame
- Import each component with its variants (hover, active, disabled states where visible in code)
- Label components to match their codebase names for easy cross-reference

### 6. Verify & Report

After import, provide a summary:

```markdown
## Import Complete

### Screens Imported: 8
- Dashboard, Projects List, Project Detail, Settings...

### Components Imported: 15
- Button (3 variants), Card, Input, Modal, Nav, Sidebar...

### Design Variables Set: 24
- 8 colors, 5 type scales, 6 spacing, 5 other

### Notes:
- [Any screens that couldn't be fully imported]
- [Any components with missing states]
- [Suggestions for additional imports]
```

## Tips

- If the project uses Tailwind, extract the full `theme` config — it maps directly to design variables
- For component libraries (shadcn, radix, etc.), note which base library is used so the styleguide skill can account for it
- Always preserve the original naming from the codebase — this makes the `apply_frontend` skill much smoother later
- If the app needs to be running to capture screens, ask the user to start the dev server first
