---
name: deck-inspo-reference
description: Find and translate Deck.gallery references into a practical visual direction for a presentation. Use when a user wants deck inspiration, reference selection, or a slide design direction from Deck.gallery.
---

# Deck Inspo Reference

Use Deck.gallery as a source of presentation references. The catalog is public, read-only metadata; it helps identify decks and links back to their canonical pages.

## Find suitable references

1. Fetch `https://www.deck.gallery/api/catalog/decks.json` and filter locally. There is no pagination or server-side search.
2. Start from the brief's subject, audience, genre, palette, tone, and desired layout types. Search the catalog title, description, and categories together.
3. Shortlist a small, varied set of strong candidates. Prioritize visual fit over a superficial keyword match.
4. Open the canonical Deck.gallery pages and inspect their slide thumbnails before recommending a reference. Metadata alone cannot establish the visual character of a deck.
5. If a selected deck has an image, device mockup, chart, or other content-specific asset, use its composition as inspiration only. Do not present or reuse it as the user's content without permission.

## Turn references into a usable direction

For each recommended deck, explain what to borrow in practical terms: palette roles, type hierarchy, whitespace, section-title rhythm, image treatment, grids, charts, and accent use. State what should change to suit the user's brief.

Make a clear recommendation rather than offering an unranked list. When useful, combine one primary reference for the visual system with one secondary reference for a specific layout type such as a table, data slide, or image-led page.

Treat reference work as inspiration, not as a template to copy. Preserve creator credit and link to the canonical Deck.gallery page. Deck imagery and paid files remain subject to the original creator's rights.

## API facts

- `GET https://www.deck.gallery/api/catalog/decks.json` returns published design references with `title`, `description`, `categories`, `slide_count`, and `url`.
- `GET https://www.deck.gallery/api/catalog/products.json` lists marketplace products. Use it only when the user wants an editable product or template, and clarify that checkout and downloads happen through the product page.
- The catalog updates when Deck.gallery publishes the site. Cache it for at least one hour and respect `Retry-After` after rate limiting.
- No account, API key, OAuth flow, or agent registration is required for catalog access.

See [API reference](references/api.md) when implementation details or the full field definitions are needed.
