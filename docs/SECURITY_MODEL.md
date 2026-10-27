# Security and review authority

Agent access is strictly limited to discovering, researching and proposing facts or drafts. Publish capability belongs only to authenticated, explicitly-authorized humans.

## Production minimum
1. Immutable source snapshot and claim provenance with content hashes.
2. Deterministic policy gates independent of any model output.
3. Separate verification model or human check for high-risk claims.
4. Draft revision hash, expiring one-time review token (preview-only), CSRF token, authenticated owner session.
5. Publication via explicit POST after revision revalidation; no GET or email-open publishing.
6. Webhook signature verification, sender allowlist, idempotency, retries, dead-letter queue.
7. Strong prompt-injection boundary; external HTML and submitted emails are data, not agent instructions.
8. Secret redaction, budget guardrails, kill switch and audit events.
9. Public user profile data is opt-in, consent logged, deletable and minimally disclosed.

Code updates/deployment may be permitted by maintainers. New editorial publication still requires human review.
