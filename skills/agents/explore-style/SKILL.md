---
name: explore-style
description: Apply a named design style to specific pencil.dev frames as quick explorations using the pencil MCP — finding the real frame, duplicating it, and restyling the actual elements. Use this skill when the user wants to see how a style looks on actual screens, says things like "explore MINIMAL-01 on dashboard", "try this style on the project page", "mockup how BAUHAUS-02 would look", "apply the style to these frames", "show me 2-3 options". This is rapid visual exploration using real canvas frames, not image generation — working directly in pencil so the result is immediately editable.
---

# Explore Style

Apply a named design style from `style-exploration.md` to real pencil.dev frames by finding them on the canvas via MCP, duplicating them, and restyling the actual elements. The output is a live, editable exploration in pencil — not a flat image.

## Key Principle

Always work in the actual pencil canvas. Duplicate first, restyle second. The original frame must stay untouched so the user can compare before/after. This is still a fast exploration — don't update variables or the component library yet (that's `update-styleguide`). Focus on getting the feel right using direct element edits.

## Workflow

### 1. Load the Style Spec

Read `style-exploration.md` and find the requested style by name (e.g., "MINIMAL-01"). This is your restyling blueprint — pay particular attention to:
- **Color palette** — exact hex values and their roles
- **Typography** — font family, weights, sizes
- **Component characteristics** — how buttons, cards, inputs should look
- **Key Differentiators** — the 2-3 things that define the style's feel

If the style name is ambiguous or not in the doc, ask the user to clarify before proceeding. If no `style-exploration.md` exists, suggest running `extract-style` first.

### 2. Discover Pencil MCP Tools

Before touching the canvas, check which pencil MCP tools are available in this session. Use whatever tool listing is available (e.g., list available tools, check MCP connections). You're looking for tools that can:

- **List pages/frames** — to see what's in the canvas
- **Get frame/element details** — to read the structure and current properties
- **Duplicate a frame** — to create the exploration copy
- **Update element properties** — to change fills, strokes, fonts, spacing, etc.

Different versions of the pencil MCP may name these differently (e.g., `list_frames`, `get_page_elements`, `duplicate_node`, `update_fill`). Adapt accordingly. If a capability seems missing, check whether it's available under a different tool name before stopping.

### 3. Identify the Target Frame(s)

Use the pencil MCP to list all frames/pages in the current project. Find the ones matching the user's instruction:
- "Dashboard" → find a frame whose name contains "Dashboard" (likely "Dashboard — Current" from the `get-ui-screens` step)
- "Project page" → find frames related to Projects
- Be case-insensitive and flexible — "projects list" should match "Projects List — Current"

If you find multiple candidates (e.g., both "Dashboard — Current" and "Dashboard — WARM-01 — Option A"), confirm with the user which to use as the base. Default to the "— Current" version unless told otherwise.

If the user says "all screens", push back — exploration works best on 2-3 representative screens first. Suggest the most structurally varied options (e.g., one data-heavy screen, one simpler one).

### 4. Determine Exploration Scope

Before duplicating, confirm (or infer from the user's message):
- **How many option variants?** Default: 1. Max: 3 per screen. More options = more value, but don't over-complicate a first pass.
- **What dimension to vary between options?** Good variation axes:
  - Color intensity (muted vs. vivid)
  - Density (spacious vs. compact)
  - Component style (rounded vs. sharp)
  - Dark mode vs. light mode adaptation

If the user said something like "show me 2 options", plan out what each option will vary before you start duplicating.

### 5. Duplicate the Frame(s)

For each target frame × option:

1. **Duplicate the original frame** using the pencil MCP duplicate tool
2. **Rename it immediately** to the exploration naming convention:
   - Single option: `[Screen] — [STYLE-NAME]` (e.g., "Dashboard — MINIMAL-01")
   - Multiple options: `[Screen] — [STYLE-NAME] — Option A/B/C`
3. **Position it** near the original but clearly separated so the canvas stays navigable — place it to the right of or below the source frame

Verify the duplication succeeded by reading back the frame name before proceeding.

### 6. Apply the Style to the Duplicate

Work through the duplicate frame systematically using the pencil MCP's element update tools. Apply changes in this order (foundations first, details last):

#### Pass 1 — Colors
- Update background fills to match the new palette
- Update all text colors (primary text, secondary text, muted)
- Update accent/highlight colors (buttons, links, active states)
- Update surface colors (cards, panels, inputs)
- Update border/stroke colors

#### Pass 2 — Typography
- Update font families on headings, body, captions
- Update font weights to match the spec
- Update font sizes if the style's scale differs from the current one
- Adjust letter spacing and line height on key text elements

#### Pass 3 — Components & Elements
- Restyle buttons (radius, fill, border treatment)
- Restyle input fields (border style, fill, radius)
- Restyle cards/containers (border, shadow, radius)
- Update icon tints to match new text/accent colors
- Adjust any decorative elements to fit the style

#### Pass 4 — Spacing & Layout
- Adjust section-level spacing if the style's whitespace philosophy differs significantly
- Tighten or loosen padding on components to match the style's density
- Keep layout structure the same — this is a restyle, not a layout redesign

#### What NOT to change
- Don't restructure the layout or move major elements around
- Don't change the actual content (labels, data, icons used)
- Don't update pencil variables or the component library (that's `update-styleguide`)
- Don't worry about every edge case — focus on what's visible

### 7. Add an Annotation

On or near each exploration frame, add a sticky note or annotation via the pencil MCP:

```
Style: MINIMAL-01 — Option A
Base: Dashboard — Current

Key changes:
- Background: #fff → #FAFAFA (off-white)
- Accent: teal → electric blue (#2563EB)
- Font: Poppins → Inter, tightened tracking
- Cards: hard shadow → soft diffused
- Buttons: 4px → 8px radius
- Section spacing: increased ~30%

Note: Data table rows feel sparse at this spacing —
consider tightening if selected.
```

The annotation is what the user reads when reviewing the canvas — make it actionable.

### 8. Report Back

After all frames are done, give the user a clear summary:

```markdown
## Exploration complete: MINIMAL-01 on Dashboard

**Frames created:**
- "Dashboard — MINIMAL-01 — Option A" (full minimal, spacious)
- "Dashboard — MINIMAL-01 — Option B" (same palette, tighter data areas)

**What I changed:** background palette, Inter font, electric blue accent,
soft shadows, rounded-lg buttons. Layout and content untouched.

**Worth flagging:** The stats row at the top loses some visual weight with
the softer palette — might want to consider adding a subtle border or
bumping the numbers to bold if you go this direction.

What do you think? I can:
- Refine either option further
- Try a different style on the same frames
- Run `update-styleguide` to commit to a direction
```

## Comparing Multiple Styles

If the user wants to compare styles side by side (e.g., "show me MINIMAL-01 and BAUHAUS-02 on the dashboard"):
- Duplicate the original once per style
- Name clearly: "Dashboard — MINIMAL-01", "Dashboard — BAUHAUS-02"
- Position all versions (original + explorations) in a horizontal row for easy comparison
- In your report, describe the key difference in feel between the two

## Troubleshooting

**Can't find the frame by name** — List all frames and present the names to the user; let them identify which one.

**MCP update tool affects too many elements at once** — Update parent containers first, then override specific children. Work top-down in the element tree.

**A style characteristic can't be applied to a specific element type** — Note it in the annotation and suggest the closest approximation. Don't silently skip it.

**Pencil MCP doesn't support a needed operation** — Note the limitation clearly and describe what you were trying to do. Offer to flag it so the user can do that part manually.
