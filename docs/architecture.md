# Architecture

## Data flow

Site-walk notes → React → Express → Supabase pricing catalog → OpenAI → Zod validation → Supabase `agent_runs` → Marcus review → approval → Slack + audit log.

## Why this stack

**React/Vite/Tailwind:** fast functional dashboard and familiar frontend stack.

**Express:** keeps AI keys, database service credentials, business rules, and integrations server-side.

**Supabase/PostgreSQL:** persistent relational storage and a natural fit for pricing items, agent runs, approvals, and integration logs.

**OpenAI:** structured extraction is a strong fit for turning messy site-walk notes into a predictable proposal object.

**Slack:** simple external integration for an internal approval/event notification and easy to demo.

## Guardrails

The AI receives an explicit pricing catalog and is instructed not to invent prices. Zod validates the returned structure. Financial totals are recalculated server-side from quantity × unit price. Uncertain or unpriced work becomes a review flag. Approval is a separate endpoint.

## What breaks first at scale

The prototype reads the active pricing catalog on each generation and uses a single synchronous request. At higher volume, I would cache/version the pricing catalog, add an asynchronous job queue, add authentication/RBAC, add idempotency keys, and integrate directly with GHL for real lead/proposal lifecycle events.

## Next week

1. GHL webhook integration.
2. Google Docs/PDF proposal generation.
3. Proposal versioning and price-book version snapshots.
4. Authentication and role-based approval.
5. Observability and AI evaluation dataset.
6. Automated regression tests for pricing and scope extraction.
