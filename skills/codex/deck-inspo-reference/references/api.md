# Deck.gallery public catalog API

Base URL: `https://www.deck.gallery`

## Endpoints

`GET /api/catalog/decks.json`

Returns a complete array of editorial design references. Fields:

- `slug`: string
- `title`: string
- `description`: string
- `url`: canonical Deck.gallery page
- `categories`: string array
- `slide_count`: integer
- `kind`: always `reference`

`GET /api/catalog/products.json`

Returns a complete array of digital product listings. It includes `creator`, `format`, `slide_count`, `price`, `available`, and canonical `url`; optional information can be `null`.

## Limits and rights

Both endpoints accept GET and HEAD. There is no server-side search or pagination. Cache responses for at least an hour, filter in the consuming workflow, and respect `Retry-After` if rate-limited.

Catalog access is anonymous and does not grant a licence to slide imagery or paid files. Cite canonical pages and credit the creator. The API cannot make purchases or retrieve purchased downloads.
