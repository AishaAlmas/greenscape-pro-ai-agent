# Greenscape Pro AI — QuotePilot

A take-home implementation of a site-walk-to-proposal AI agent for Greenscape Pro.

## What it does

1. Marcus enters or pastes site-walk notes.
2. The API validates the input.
3. OpenAI extracts structured scope and matches it against the approved pricing catalog.
4. The result is validated before being stored.
5. Marcus reviews the proposal draft.
6. On approval, the app can send a Slack notification and persist the action log.
7. The dashboard shows recent agent runs and approval state.

## Architecture

React/Vite/Tailwind → Express API → OpenAI + Supabase PostgreSQL → Slack webhook.

The AI is intentionally constrained: it can select only from the pricing catalog supplied to the request. It must flag missing/ambiguous pricing instead of inventing a price.

## Stack

- React + Vite
- Tailwind CSS
- Node.js + Express
- OpenAI API
- Supabase PostgreSQL
- Slack Incoming Webhook
- Axios
- Zod
- Vercel (frontend) + Render (backend)

## Setup

### 1. Server

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 2. Client

```bash
cd client
npm install
npm run dev
```

### 3. Database

Run `database/schema.sql` in the Supabase SQL editor.

### 4. Environment

Copy `.env.example` to `.env` and fill the values.

Never commit `.env`.

## Production deployment

Deploy `server` to Render (Node web service) and `client` to Vercel. Set the same environment variables in the hosting dashboards. Set `VITE_API_URL` to the deployed API URL.

## Important

The repository is deployment-ready, but actual deployment requires the candidate's own OpenAI, Supabase, Slack, GitHub, Vercel and Render accounts/credentials. No credentials are included in this submission.

## AI cost

The agent is designed around a small structured-output request. Use a low-cost current OpenAI model suitable for structured extraction in production, and keep the prompt/catalog compact. Actual per-run cost depends on model pricing and token usage at deployment time.

## Failure handling

- Empty notes are rejected.
- AI JSON is schema-validated.
- Unpriced items are flagged.
- Failed AI requests are returned as errors and not persisted as successful runs.
- Approval is separate from generation.
- External notification failure is logged rather than silently treated as success.

## Suggested commit history

Use several meaningful commits rather than one mega-commit:
- `chore: initialize project structure`
- `feat: add proposal dashboard`
- `feat: add Supabase schema and persistence`
- `feat: add AI quote extraction`
- `feat: add output guardrails`
- `feat: add approval workflow`
- `feat: add Slack integration`
- `docs: add architecture and setup`
