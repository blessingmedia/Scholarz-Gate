# Architecture Decision Record ADR-001 — Harness before dashboards

Status: **Accepted design target; not all services implemented** (27 Oct 2026)

## Core decision

Build a thin read-only publishing surface (ApplyMate-first) and a provider-independent editorial harness. Source-linked structured records, not blog HTML, are the system of record.

### Service boundaries

```
   Student browser / WhatsApp / future global.scholarz
                         |
                Read surface (Astro)
                 SSR/SSG on Workers
                         |
                Published read model
                         |
           D1 canonical opportunity store
                         ^
                         |
                 Publish outbox
                         ^
                         |
Human approves revision <-- signed REVIEW page <-- Resend review notification
                         ^
                         |
Cloudflare Workflows: ingest --> extract --> cross-check --> draft --> QA --> pause
        |             |          |           |
   Source snapshot  AI adapters  evidence  policy engine
        |             |          |           |
        +-------------+----------+-----------+
                          |
                  R2 content snapshots
```

### Technical choices

| Layer | Choice | Reason |
| --- | --- | --- |
| Public site | Astro, Cloudflare Workers adapter | Low client JS, static-first, SEO-friendly, fast article pages. Current bootstrap uses dependency-free Worker and can later be replaced. |
| Content model | JSON/Zod typed records | Source truth separated from editorial HTML; shared by ApplyMate, Global and Learn. |
| Relational data | Cloudflare D1 (SQLite) | Opportunity records, source timestamps, approval revisions, audit and redirects. |
| Source snapshots/media | R2 | Immutable normalized snapshots, image rights metadata; do not rely on Blogger-hosted images permanently. |
| Long-running work | Cloudflare Workflows | Durable retries, waits for review, event-driven rather than polling loops. |
| Model routing | Model adapter / optional AI Gateway | Small model for classification/extraction, stronger model only for cross-source conflicts and synthesis. Fallback to humans on errors. |
| Review email | Resend (planned) | One notification with secure short-lived review link. Email is only an entrypoint; authentication and POST approval occur on the site. |
| Search | D1 query/FTS5 initially | Avoid a vector database until users demonstrate semantic search needs. |
| Analytics | consent-conscious events + Cloudflare Web Analytics | Measure useful actions and data trust, not only pageviews. |
| Source control | Git and PR gates | Every policy, prompt, schema change is versioned and reviewed. |

### Why not a large "big model" doing everything?

Cost, reliability, auditability and prompt-injection risk. A coordinator decides which deterministic tools and narrowly scoped agents run. The expensive model is invoked on uncertain reasoning tasks, not routing, storage writes or repetitive classifications. Provider swap requires no database rewrite.

### Why no large owner dashboard?

Owner only needs a weekly exceptions digest and event-driven review. An editorial job record plus signed review link is enough for early operation. The owner sees the exact diff, sources, risks and actions: **Approve revision**, **Request changes**, **Reject**. Preview GET is read-only. Approval uses authenticated POST + CSRF + one-use nonce + revision matching.

### Operational costs model (track, don't guess)

`cost_per_verified_post = fetch + extraction + verification + synthesis + storage + approval_email + ongoing_recheck + infrastructure`; log token usage by stage. `cost_per_eligible_user_action` is the north-star unit-economics proxy in early trials.

### Data separation without duplication

Vertical field identifies ApplyMate / Global / Learn; country reports and learning materials get vertical extension records, not copy-pasted separate CMS databases. `global.scholarz` is a future presentation host, **not** the database boundary. It can use the same API with its own read experience, consent model, geolocation context and moderation rules.

### Security boundaries

Internet sources, course PDFs, email bodies, WhatsApp submissions and AI results are *untrusted*. No direct database access from a model, no agent-held publication token, SSR escapes text, external URLs allowlist http/https, snapshots hashed, rate-limited ingest, domain-sensitive provider checks, logs redact secrets.

### Live vs planned

**Implemented locally:** request handler, ApplyMate-style layout, the published Google AI record, search/category pages, bookmarks/theme/carousel, RSS/sitemap, rule validation, proof-of-concept harness, owner-only state transitions, signed review-link primitives, tests.

**Not operational:** agents making LLM calls, scheduled monitoring, outbound email, authenticated approval UI, D1, R2, orchestration, production analytics, import of the historic Blogger archive, licensed-theme visual parity verification, custom domain, GitHub deploy pipeline.

Do not claim these planned functions are live.
