---
name: extract-style
description: Extract transferable design principles and visual DNA from reference images into a style-exploration.md document. Use this skill when the user drops reference images and wants to capture the design direction — not just what it looks like, but WHY it works and HOW to make new screens that feel like part of the same family. Triggers on "extract the style from this", "record this design style", "save this as a reference", "what's the design language here", or when building a collection of design explorations. Each style gets a unique name like "MINIMAL-01" or "BAUHAUS-02".
---

# Extract Style

Analyze reference images and extract the **design thinking** — not just the visual inventory — into a `style-exploration.md` (or `design-explorations.md`) document. The goal is to capture enough about the design's *decisions, philosophy, and rules* that another designer or AI agent could design a completely different screen that still feels like it belongs to the same family.

## The Core Shift

**Wrong approach:** "I see a blue button with 8px radius and 14px Inter text"
**Right approach:** "Buttons are deliberately understated — ghost style, no fills, the design trusts that layout and hierarchy make the CTA obvious without shouting"

You are not describing a screenshot. You are reverse-engineering a design system's **decision-making logic**.

## When to Use

Trigger when the user:
- Drops one or more reference images and wants the style captured
- Says "extract the style", "record this design", "save this as a reference"
- Wants to name and catalog a design direction (e.g., "call it MINIMAL-01")
- Is building a collection of style options for a project

## Workflow

### 1. Understand the Design Intent First

Before cataloging any specifics, answer these questions by studying the image(s):

#### Design Philosophy (MOST IMPORTANT)
- **What is this design trying to say?** What feeling, attitude, or brand position does it communicate?
- **What design tradition does it draw from?** (Swiss/International, Bauhaus, Memphis, Brutalist, Minimalist, Editorial, Neomorphism, etc.)
- **What is deliberately ABSENT?** The things a design chooses NOT to do are often more defining than what it does. (e.g., "No shadows anywhere — the flatness is the point", "No serif fonts — technical precision over warmth")
- **What are the 3–5 signature moves?** The decisions that, if you got them right, you'd nail the feel even if everything else was different.

#### Visual Hierarchy Strategy
- **How does the design guide attention?** Through scale? Weight? Colour? Position? Negative space?
- **What is the scale contrast?** Do headings and body text live at similar sizes, or is there extreme dramatic contrast?
- **How does it create rhythm?** Through repetition, variation, spacing, or colour alternation?

### 2. Extract the Design DNA

Now document the specifics — but always framed as **design decisions with rationale**, not just visual facts.

#### Colour System
- **Palette strategy**: Monochromatic? Complementary? One-accent-only? Full rainbow?
- **Colour roles with hex values**: Document primary, secondary, accent, background colours — but explain the RULE behind their usage (e.g., "Red only appears on full-bleed panels, never as a button colour" or "Each project gets a unique pastel as its identity colour")
- **Colour philosophy**: How many colours appear per screen? Is colour used for decoration, function, or environment? What's the relationship between colour and surface?
- **What's absent**: No gradients? No warm tones? No colour on text? Note these explicitly.

Use this table format for specifics:
```
| Role | Colour | Hex | Usage Rule |
|------|--------|-----|------------|
```

#### Typography System
- **Font pairing logic**: Why these fonts together? What does each font family *mean* in this system? (e.g., "Serif for soul, mono for structure" or "One family does everything through weight and scale")
- **Weight rules**: What weights exist and where are they permitted? (e.g., "Only 400 and 500 — the restraint IS the style" or "Bold only inside the dark block, never on white")
- **Scale philosophy**: Subtle variation or extreme contrast? What's the ratio between largest and smallest text?
- **Special treatments**: ALL CAPS usage, letter-spacing patterns, text overflow/cropping as a feature

Use this table for specifics:
```
| Role | Font | Weight | Size | Notes |
|------|------|--------|------|-------|
```

#### Layout & Spatial Logic
- **Structural concept**: What mental model describes the layout? (e.g., "Split-panel dualism", "Magazine grid", "Single-column scroll", "Modular card grid")
- **Spacing philosophy**: Is whitespace generous or tight? Is it even or varied? Does the design breathe or pack?
- **How sections are separated**: Through space, lines, colour blocks, or nothing at all?
- **Alignment philosophy**: Strict grid? Asymmetric? Centred? Left-anchored?
- **Content density**: How much content per viewport? Sparse and editorial, or information-dense?

Include an ASCII diagram showing the structural logic:
```
┌────────────────────────────┐
│  [Layout pattern here]     │
└────────────────────────────┘
```

#### Component Principles (not component specs)
Instead of cataloging every component's exact measurements, describe the **design rules** that govern all components:
- **Surface treatment**: Are components elevated (shadows/borders), flat, or on bare canvas?
- **Border & radius philosophy**: Sharp? Rounded? Pill-shaped? What's the reasoning?
- **Button philosophy**: How do CTAs present themselves? Bold or understated?
- **Card philosophy**: Do cards exist? As floating surfaces, flat rows, or colour-blocked sections?
- **Decoration policy**: What decorative elements exist? What's explicitly forbidden?

#### Texture & Surface
- **Shadow usage**: None, subtle, dramatic? Why?
- **Border usage**: None, hairline functional, decorative?
- **Surface effects**: Flat, textured, gradient, glassmorphic?
- **What's explicitly absent**: List the effects and treatments that are NOT used — this prevents future agents from adding them

#### Motion & Interaction Feel (if discernible)
- **Transition personality**: Snappy? Smooth? Elastic? Weighty? Instant?
- **Hover/interaction style**: Subtle or dramatic?
- **Is motion part of the brand or invisible?**

### 3. Write the "How to Apply" Section

This is **critical** — it bridges the gap between "what this looks like" and "how to design something new in this style." Write actionable directives:

- Start with [X], then do [Y]...
- Make [element] [adjective] — [specific guidance]
- Remove all [things] — the design trusts [what instead]
- When in doubt, [decision heuristic]

Include specific mapping to the user's project if the context is known (e.g., "Applied to Handover: the red panel maps to a featured CTA card on the dashboard").

### 4. Distill the Key Principles

Write 5–12 numbered rules that serve as the design's "constitution." These should be:
- **Prescriptive**: Tell someone what to do, not just what exists
- **Prioritized**: The most important / distinctive principle first
- **Testable**: Someone could look at a screen and say "does this follow rule #3?"

Format:
```
1. **[Principle name]** — [explanation of the rule and WHY]
2. **[Principle name]** — [explanation]
```

### 5. Name the Style

If the user hasn't provided a name, suggest one using the format: `STYLE-XX`

Naming convention:
- Use a short descriptive word in ALL CAPS
- Follow with a two-digit number
- Examples: `MINIMAL-01`, `BAUHAUS-02`, `BRUTALIST-01`, `EDITORIAL-DARK-01`, `AIOS-FOLD-01`

Ask the user to confirm or suggest a different name.

### 6. Write to the Document

Check if `style-exploration.md` or `design-explorations.md` exists in the project. If not, create it with a header. Then append the new style entry.

#### Document Structure

```markdown
# Style Exploration

Project: [Project Name]
Last Updated: [Date]

---

## STYLE-NAME

**Style:** [One-line description of the design language]
**Created:** [Date]
**Source:** [What the reference images are — brief description]
**File:** [.pen filename if applicable]
**Frames:** [Frame names if applicable, or TBC]

### Inspiration
[2-3 sentences capturing the FEEL and design tradition. Not what you see — what
the design is trying to BE. Use evocative language.]

### Colour Palette
| Token | Hex | Usage Rule |
|-------|-----|------------|
| ... | ... | ... |

**Colour philosophy:**
- [How colour is used as a system, not just a palette]

### Typography
| Role | Font | Weight | Size | Notes |
|------|------|--------|------|-------|
| ... | ... | ... | ... | ... |

**Typographic philosophy:**
- [Why these fonts, why these weights, what's the hierarchy logic]

### Layout System
- [Structural concept and spatial philosophy]
- [ASCII diagram of the pattern]

### Component Principles
- [Rules governing all components, not individual specs]

### Texture & Effects
- [What's present AND what's absent]

### Key Principles
1. **[Principle]** — [explanation]
2. ...

### How to Apply This Style
- [Actionable directives for designing new screens in this family]
- [Project-specific mapping if context is known]

---
```

### 7. Confirm with User

After writing, present a brief summary:
```
Saved as MINIMAL-01 in style-exploration.md

Design DNA:
- [The 3 most distinctive principles]
- [What makes this feel like THIS and not something else]

Ready to explore this style on your screens? (use explore_style)
```

## Critical Mindset Reminders

- **You are a design director, not a pixel inspector.** Extract the thinking, not just the measurements.
- **Philosophy sections matter more than tables.** The hex values are useful reference, but the rules about HOW colours are used are what enable designing new screens in this family.
- **Note what's ABSENT as much as what's present.** "No gradients, no shadows, no rounded corners" prevents future agents from adding things that break the style.
- **The "How to Apply" section is the most valuable output.** If someone only reads that section, they should be able to design a new screen that feels right.
- **Think in systems, not screenshots.** A good extraction works for screens the reference never showed.
- **Use the user's existing entries as calibration.** If `style-exploration.md` or `design-explorations.md` already has entries, match their depth, tone, and structure for consistency.
