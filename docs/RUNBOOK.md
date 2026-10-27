# Operation and implementation order

## Start locally

Node 22.12+ is required. No npm dependencies are needed for current prototype.

```bash
npm run dev
# open http://localhost:8787
npm test
npm run harness:demo
```

This server is a locally runnable **functional prototype**, not yet the production content platform.

## The simplest editorial day

1. One URL or student lead appears in a source inbox.
2. Workflow snapshots the source, extracts machine-readable facts, matches duplicates and verifies source-backed claims.
3. Low-cost model drafts a useful article; separate QA checks unsupported wording, geographical eligibility and urgency claims.
4. Owner gets email: title, verification grade, changes, application URL, badge/cost caveats and a **Review** link.
5. The link opens an authenticated preview; GET never publishes. Owner may edit flagged fields, request revisions, reject, or approve exact revision.
6. A single transaction stores approval and outbox event. Publication worker writes public read model, updates feeds/sitemap, sends optional opt-in brief.
7. Recency monitor rechecks deadline and source availability; significant changes return to the owner.

## Security requirements before sending actual email

- Verify Resend webhook signatures using raw request body; reject unapproved sender origins for agent inbound instructions.
- Keep sender identity separate from approval authority: email spoofing should not permit publication.
- Review links short lived and scoped by job, owner, revision; use HTTP POST with CSRF and login or second-factor approval step.
- Store nonce hash (not bearer token), consume once; perform atomic idempotent transition.
- Never execute instructions embedded in scholarships PDFs, web articles, email or user-submitted documents.
- A model can propose content; only a deterministic policy engine and owner can decide publication.
- If source checks fail, draft remains blocked and never silently publishes.

## Hosted rollout plan

1. Push project to the approved GitHub repository under the Scholarz owner, protect `main` and require tests on PRs.
2. Replace current fs-loaded JSON with Cloudflare D1 read/write adapters behind a repository interface.
3. Create D1 database, apply `infra/schema.sql`, add R2 snapshots/media. Keep environments separated (dev / staging / production).
4. Deploy full-stack app with Workers build pipeline; preview every PR and compare screenshot baselines.
5. Implement Workflows (not self-written long running cron state machines) and provider adapters with scope-limited API credentials.
6. Configure Resend review sender and verified owner address when provided via secrets; never put credentials in git.
7. Implement review POST with auth+CSRF+one-use nonce and revision lock.
8. Import Blogger article export and build 301 redirect manifest. Do not disable Blogger until old URLs and new URLs are proven to work.
9. Add a Scholarz domain only after product rules and user-testing criteria are met.

## Failure policy

If model provider times out: retry bounded times, record incident and hold draft. If verification conflicts: flag and halt. If an owner misses approval: no publication. If D1 is unavailable: keep existing public content read-only. If R2 media is unavailable: show fallback image. If email fails: persistent review job remains queryable in a tiny private inbox (not a large dashboard).
