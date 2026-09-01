# 5-minute Loom script

## 0:00–0:45 — Strategy
“Greenscape Pro has healthy lead volume, but its bottleneck is quote throughput. Proposals take 6–9 days and 35–40% of qualified leads are lost to faster competitors. I ranked QuotePilot P0 because it attacks the direct revenue bottleneck. I then ranked post-sign follow-up, customer progress updates, closed-lost reactivation, and lead pre-qualification.”

## 0:45–2:45 — P0 demo
“Here is a site-walk note. I submit it. The backend retrieves the approved pricing catalog, sends the notes and catalog to the AI, validates the structured response, recalculates totals, and stores the run in Supabase. The UI shows line items, questions, risk flags, and the customer-facing draft. I can then approve it.”

Click Approve:
“Approval is a deliberate human-in-the-loop step. The API records the approval and attempts the Slack integration, while logging the integration result.”

## 2:45–4:00 — Architecture
“The frontend is React/Vite/Tailwind. Express keeps API keys and business logic off the client. Supabase gives persistent relational storage. OpenAI performs meaningful scope extraction and proposal drafting. Zod validates the AI response, and server-side arithmetic prevents the model from becoming the source of truth for totals.”

## 4:00–4:35 — Trade-offs
“This is intentionally a focused prototype. At scale I would add GHL webhooks, authentication, asynchronous jobs, price-book versioning, proposal PDF generation, observability, and an evaluation suite.”

## 4:35–5:00 — Close
“The core value is compressing the 6–9 day quote cycle to minutes for the first draft while keeping Marcus in control of final approval.”
