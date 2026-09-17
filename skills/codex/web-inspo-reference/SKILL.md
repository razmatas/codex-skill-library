---
name: web-inspo-reference
description: "Find and translate visual website references with Inspo MCP when designing or redesigning a page, screen, or UI section."
---

# Web Inspo Reference

Use the installed `inspo` MCP server to ground visual direction in real production sites before implementation.

Apply this skill when the user wants visual inspiration, a design direction, examples of a page or component, or a design-led redesign. Do not use it for copy, business logic, tests, or a change that already has an established project pattern.

## Workflow

First inspect the project for an existing design system, component library, or supplied design. Those decisions take priority over external references.

Turn the request into a compact visual brief: product type, audience, desired mood, content hierarchy, and the section or page being designed. Start with `recommend` for an open-ended brief. Use `search_screens` when the requested look or component is specific. Call `get_filters` before applying a filter whose accepted values are uncertain.

Keep the study lean: use one recommendation or one to two searches, then inspect only the three to five references worth retaining with `get_screen` or `get_design_system`. Use `find_components` or `find_reference_components` when the request is about a particular UI element. Fetch `get_reference_jsx` only when a reference component will materially help implementation.

For each selected reference, extract transferable decisions: page hierarchy, macrostructure, content density, spacing rhythm, typography roles, palette roles, and component treatment. Credit references by site name and link when available. Do not copy a site's branding, proprietary assets, or text.

In the implementation brief, state the chosen direction, the specific decisions it supports, and which project conventions remain authoritative. Treat external captures as visual reference, not a complete interaction specification.

## Motion requests

Inspo captures are useful for page sequencing and visual pacing, but they do not expose live animation code, exact timelines, or interaction states. For a motion request, derive only a proposed sequence from the page structure, clearly label it as an interpretation, and inspect the live website separately if faithful behavior is required.
