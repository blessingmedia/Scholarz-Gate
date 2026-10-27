# Scholarz Core — ApplyMate foundation

**Status: locally working migration prototype with tested editorial gates. Not production-backed AI agents.**

This is the Blogger-independent foundation for Scholarz Nation's ApplyMate, with a shared domain model for Scholarz Global and Scholarz Learn.

## Run

```bash
npm run dev
npm test
npm run harness:demo
```

Open `http://localhost:8787`.

## Implemented now

- Responsive ApplyMate-style public UI in original palette and layout proportions.
- 5-slide original-image carousel, theme switch, nav drawer, article bookmark, share, table of contents.
- Functional search, label routes, article canonical metadata, RSS/sitemap/robots, old-route example and honest 404.
- One verified-record seed article: Google AI Courses 2026. No fabricated article listings.
- Structured claim provenance, TTL, sponsor/eligibility flags and confidence policy.
- Provider-independent editorial harness contract, state machine, signed time-limited review link primitive, unit tests.

## Not yet built

- No production Cloudflare D1/R2 binding, no outbound email or actual AI-model calls, no authenticated owner review form, no migrated Blogger posts, no production publication process, no screenshot-diff baseline.
- Image URLs currently point to original Blogger/third-party hosts. Migrate approved media to owned R2 before claiming complete Blogger independence.
- The previous live Cloudflare preview remains untouched by this project.

## Docs

Start with `docs/PRODUCT_RULES.md`, `docs/ARCHITECTURE.md`, `docs/THEME_AUDIT.md`, `docs/GLOBAL.md`, and `docs/INVESTOR_THESIS.md`.

## Copyright

User-provided theme XML is a **premium Plus UI 3.7.0** template. It is not included in this source bundle. Interface implementation here is independent, avoids template redistribution, and is subject to a license/rights review before any direct copying of vendor assets or scripts.
