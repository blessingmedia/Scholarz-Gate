-- Scholarz canonical relational store: Cloudflare D1 (SQLite)
-- Schema only. Apply with Wrangler after creating a D1 database and configuring bindings.
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS source_snapshots (
 id TEXT PRIMARY KEY,
 canonical_url TEXT NOT NULL,
 fetched_at TEXT NOT NULL,
 content_hash TEXT NOT NULL,
 snapshot_r2_key TEXT,
 http_status INTEGER NOT NULL,
 UNIQUE(canonical_url, content_hash)
);
CREATE TABLE IF NOT EXISTS opportunities (
 id TEXT PRIMARY KEY,
 vertical TEXT NOT NULL CHECK(vertical IN ('applymate','global','learn')),
 kind TEXT NOT NULL,
 canonical_slug TEXT NOT NULL UNIQUE,
 title TEXT NOT NULL,
 summary TEXT NOT NULL,
 deadline TEXT,
 deadline_kind TEXT NOT NULL CHECK(deadline_kind IN ('fixed','rolling_or_unspecified','not_applicable')),
 fee_kind TEXT NOT NULL,
 credential_kind TEXT,
 official_url TEXT NOT NULL,
 geography_json TEXT NOT NULL,
 eligibility_json TEXT NOT NULL,
 sponsored INTEGER NOT NULL DEFAULT 0 CHECK(sponsored IN (0,1)),
 status TEXT NOT NULL CHECK(status IN ('discovered','draft','review_ready','published','expired','retracted')),
 last_verified_at TEXT NOT NULL,
 next_review_at TEXT NOT NULL,
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_opportunities_status_review ON opportunities(status,next_review_at);
CREATE INDEX IF NOT EXISTS idx_opportunities_vertical_status ON opportunities(vertical,status);
CREATE TABLE IF NOT EXISTS claims (
 id TEXT PRIMARY KEY,
 opportunity_id TEXT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
 claim_text TEXT NOT NULL,
 risk TEXT NOT NULL CHECK(risk IN ('low','medium','high')),
 check_status TEXT NOT NULL CHECK(check_status IN ('unverified','verified','disputed','outdated')),
 checked_at TEXT,
 checked_by TEXT,
 evidence_json TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_claims_record ON claims(opportunity_id,check_status);
CREATE TABLE IF NOT EXISTS content_versions (
 id TEXT PRIMARY KEY,
 opportunity_id TEXT NOT NULL REFERENCES opportunities(id),
 revision INTEGER NOT NULL,
 content_json TEXT NOT NULL,
 checksum TEXT NOT NULL,
 authored_by TEXT NOT NULL,
 created_at TEXT NOT NULL,
 UNIQUE(opportunity_id,revision)
);
CREATE TABLE IF NOT EXISTS editorial_jobs (
 id TEXT PRIMARY KEY,
 opportunity_id TEXT REFERENCES opportunities(id),
 source_snapshot_id TEXT REFERENCES source_snapshots(id),
 state TEXT NOT NULL CHECK(state IN ('discovered','extracted','verified','drafted','review_ready','approved','published','rejected','blocked','expired')),
 revision INTEGER NOT NULL DEFAULT 1,
 locked_by TEXT,
 updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS approval_nonces (
 nonce_hash TEXT PRIMARY KEY,
 job_id TEXT NOT NULL REFERENCES editorial_jobs(id),
 revision INTEGER NOT NULL,
 owner_id TEXT NOT NULL,
 expires_at TEXT NOT NULL,
 consumed_at TEXT
);
CREATE TABLE IF NOT EXISTS approvals (
 id TEXT PRIMARY KEY,
 job_id TEXT NOT NULL REFERENCES editorial_jobs(id),
 revision INTEGER NOT NULL,
 owner_id TEXT NOT NULL,
 decision TEXT NOT NULL CHECK(decision IN ('approve','reject','request_changes')),
 decision_at TEXT NOT NULL,
 notes TEXT,
 UNIQUE(job_id,revision,owner_id)
);
CREATE TABLE IF NOT EXISTS publish_outbox (
 id TEXT PRIMARY KEY,
 opportunity_id TEXT NOT NULL REFERENCES opportunities(id),
 revision INTEGER NOT NULL,
 action TEXT NOT NULL CHECK(action IN ('publish','retract','refresh')),
 status TEXT NOT NULL CHECK(status IN ('pending','processing','done','failed')),
 attempts INTEGER NOT NULL DEFAULT 0,
 next_attempt_at TEXT NOT NULL,
 UNIQUE(opportunity_id,revision,action)
);
CREATE TABLE IF NOT EXISTS legacy_redirects (
 old_path TEXT PRIMARY KEY,
 new_path TEXT NOT NULL,
 redirect_code INTEGER NOT NULL DEFAULT 301 CHECK(redirect_code IN (301,308)),
 validated_at TEXT
);
CREATE TABLE IF NOT EXISTS global_field_reports (
 id TEXT PRIMARY KEY,
 opportunity_id TEXT NOT NULL REFERENCES opportunities(id),
 country TEXT NOT NULL,
 institution TEXT,
 pseudonymous_author_id TEXT,
 contributor_consent_at TEXT NOT NULL,
 consent_scope TEXT NOT NULL,
 evidence_refs_json TEXT NOT NULL,
 fact_checked_by TEXT NOT NULL,
 cost_currency TEXT,
 cost_observed_at TEXT,
 last_review_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS audit_events (
 id TEXT PRIMARY KEY,
 job_id TEXT,
 opportunity_id TEXT,
 actor_type TEXT NOT NULL CHECK(actor_type IN ('owner','editor','agent','system')),
 actor_id TEXT NOT NULL,
 action TEXT NOT NULL,
 event_json TEXT NOT NULL,
 occurred_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_events_when ON audit_events(occurred_at);
-- Full-text index can be added after real content migration and locale strategy.
