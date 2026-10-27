# Scholarz Nation — implementation plan (27 Oct 2026)

## Mission
Build a student intelligence network, not an AI article farm. Scholarz Nation is the identity and shared trust layer; ApplyMate is the verified opportunity publication; Scholarz Global is a consent-based member network; Learn follows after validation.

## Release 0.2: public surface (this branch)
- Nation homepage that communicates user outcomes, not post quantity.
- Separate /apply publication with original Plus UI-inspired layout, narrow navigation, real carousel, verified record only.
- /global consent-safe foundation; no unverified profile cards.
- Semantic SVG icon system, reduced-motion handling, share/bookmarks/search/category routes.
- robots preview protection, sitemap and RSS.
- Retain existing deterministic human-only publish gates.

## Release 0.3: production editorial harness — NOT implemented yet
- Audit existing Blessing Media Python/Gemini scripts; wrap behind schema-based agent adapter.
- Persistent D1 canonical opportunity record, claim and approval tables; R2 evidence snapshots.
- Durable workflow with retries/idempotency and dead-letter handling.
- Signed review-email notification -> authenticated preview -> POST approve exact revision hash -> publish outbox.
- No agent-held publish capability, no GET publication, external sources always untrusted.
- Audit trail, incident rollback, review-due scheduling and cost ceilings.

## Release 0.4: owned publishing system
- Replace bootstrap Worker with Astro/Cloudflare static-first publication if measured gains warrant.
- Import licensed content and images with canonical/redirect strategy.
- Restore approved comments with moderation and consent.
- Complete Plus UI 3.7 visual feature parity against authorized assets and screenshots at 360/390/768/1024/1440px.

## Release 0.5: Scholarz Global
- Verified membership, explicit display consent, profile-level visibility controls, correction/delete workflow.
- Profiles filtered by public country, institution, field only when shared; never leak location or contact data by default.
- Publish original experience stories only with confirmation, editing permission and evidence.

## Release gates
Never automatically deploy unapproved editorial content. CI tests and screenshot review must pass before site deployment. User-authorized code deployment does not imply author approval for new articles. Track eligible-user actions, successful referrals, revisits and corrections, not just traffic.
