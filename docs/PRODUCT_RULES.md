# Scholarz Nation — Product Constitution (draft v0.1)

## Mission and boundaries

Scholarz turns fragmented information about academic progress and opportunities into **actionable, evidence-linked student decisions**. It is not an admissions agency, not a scholarship guarantor, not an essay mill, and not an AI-generated article farm.

### Nonnegotiable rules

1. **Evidence before publication.** Each materially consequential claim has a source, timestamp, status and accountable reviewer. Direct application links point to the actual provider. A social post may be a discovery lead but never alone the final source of eligibility or cost claims.
2. **Separate facts from estimates.** Reported fees, currency, requirements, deadlines and available credentials must retain their original meaning. Mark unclear facts "unconfirmed", never invent them.
3. **Open ≠ Verified.** A record can be accurate but expired. Verification recency, opening status and publishing status are different fields. A missed check should downgrade confidence or suppress an "open" label.
4. **No outcomes guarantee.** Never promise automatic admission, funding, visa or employment. Scholarz does not sell or imply influence over selection.
5. **The user must receive value without a login.** Public articles, official sources, primary actions, categories, search and feeds stay usable anonymously. Login may later support personalization, but is not a gate for basic information.
6. **Regional context is explicit.** Specify when a programme is global, African-region-specific, country-specific or not yet confirmed for the reader's location. Never confuse "online" with "open to all countries".
7. **Attribution is mandatory.** Discoveries may come from third-party aggregators. Show discovery credit when appropriate; verify facts against primary sources. Do not republish full third-party articles or hotlink images permanently without rights.
8. **One fact, multiple presentations.** Canonical structured records generate article, cards, search, RSS, WhatsApp brief, alerts and future AI responses. Do not create separate copies that diverge.
9. **Explicit owner publication authority.** Agents can discover, research, propose and report; their credentials cannot publish to public channels. Each public revision requires a recorded owner/editor approval under defined delegation rules.
10. **Corrections are visible.** Incorrect or outdated content can be updated, corrected or retracted; keep revision history, source snapshots and audit logs. No quiet re-writing of a bad claim.
11. **No dark patterns.** No forced countdowns, misleading safelinks, false exclusivity, fabricated view counts, affiliate links disguised as official application links or ads that mimic content. Sponsorship disclosures cannot be omitted.
12. **Security and privacy first.** Minimize personal data, keep contributor reports consent-based, protect source/provider content as untrusted input, require signatures and CSRF protections on approval actions. Never email raw one-click publish GET links.
13. **Default mobile/lightweight.** Zimbabwean users may be on constrained connections and older devices. No required download-heavy client library for basic reading, offline-friendly saved content where feasible.
14. **Teaching > outsourcing assessments.** Scholarz Learn supports practice and understanding, not impersonation, exam misconduct or misleading institutions.
15. **No invented product metrics.** Investor materials clearly distinguish live usage data from forecasts and hypotheses.

## Information labels

- **Provider verified**: official source explicitly supports the claim, checked at time displayed.
- **Community reported**: first-hand consent-based observation; not a general fact.
- **Partially confirmed**: one or more key conditions are unresolved.
- **Review due**: last check is older than the policy window.
- **Expired / closed**: deadline passed or provider confirmed closure.
- **Retracted**: previously published claim was materially incorrect; explain correction.

## Hard claim schema

`claim = {text, evidence_urls[], checked_at, risk, status, reviewer}`.
Facts that change frequently (eligibility, deadline, fee, route, quota) need a shorter review window than evergreen background.

## Publishing gates

1. Candidate extracted with a source snapshot and content hash.
2. Primary-source checks resolve material claims; gaps clearly marked.
3. Deterministic schema validation and policy checks pass.
4. Duplicate detection compares provider ID, URL, title + cycle.
5. AI draft is separated from grounded facts; untrusted source instructions cannot alter publication policies.
6. Human approves exact revision and sees source links, risks and changes.
7. Transaction records approval, change of status and outbox event, then a worker updates the published read model.
8. Post-publication monitor schedules expiry and source-change checks.

**Never allow:** "agent says approved", bare webhook payload, email sender name, or URL GET request to unlock publication.

## Minimal governance

- Editorial owner controls publication policy, corrections and appeals.
- Agents are service principals with scoped abilities: research, evidence parsing, drafting, consistency checking.
- Independent source verifier reviews high-risk claims; no single model self-certifies high-risk facts.
- Contributors can submit leads/reports but never directly publish articles.
