# Greenscape Pro — AI Agent Strategy

## Business diagnosis
Greenscape Pro is a $4.2M Phoenix residential hardscape/landscape design-build business targeting $5.5M. The average project is $28K. Lead volume is healthy, but the proposal cycle takes 6–9 days and 35–40% of qualified leads are lost to faster competitors. Marcus is the only person who can turn site-walk notes into a proposal scope. The highest-leverage constraint is therefore quote throughput, not lead generation.

## Ranked AI agents

### P0 — QuotePilot: Site-Walk-to-Proposal Agent
**Purpose:** Turn Marcus's site-walk notes into a structured, reviewable proposal draft in minutes instead of days.
- Extract scope, quantities, materials, exclusions, timeline, and customer preferences from site-walk notes.
- Match requested work to the approved pricing catalog.
- Calculate line-item totals and flag uncertain/missing pricing instead of inventing prices.
- Draft a customer-ready proposal and a concise internal review summary.
- Route the draft to Marcus for approval before any customer-facing send.

**Replaces/unblocks:** Marcus manually interpreting notes, opening the pricing spreadsheet, building Google Doc line items, and writing the proposal.

**Estimated ROI:** If faster quoting recovers only 10 additional projects/year, at the $28K average project value that is ~$280K gross booked revenue. The source materials indicate 35–40% of qualified leads are lost during the proposal stage, making a 6–9 day → 1–2 day cycle the strongest leverage point.

**Why #1:** It attacks the bottleneck that directly causes lost revenue. The company is not lead-volume constrained; Marcus explicitly says it is quote-volume constrained.

### P1 — PostSign Guardian
**Purpose:** Automate HOA, permit, and deposit follow-up after a project is signed.
- Track the project stage and next required customer/internal action.
- Send scheduled GHL follow-ups and reminders.
- Escalate stalled projects to Jenna/Marcus.
- Surface aging projects on a dashboard.

**Replaces/unblocks:** Jenna's manual chasing after signing.

**Estimated ROI:** 8–12 projects are typically in post-sign limbo; at $28K average project value, that represents roughly $224K–$336K of delayed revenue at a point in time.

### P2 — BuildUpdate Agent
**Purpose:** Turn Jobber milestones and CompanyCam activity into consistent customer updates.
- Detect meaningful project progress.
- Draft Marcus-branded updates using project facts only.
- Queue updates for approval or automatically send low-risk updates.
- Log every customer communication.

**Replaces/unblocks:** Marcus's manual Loom updates and inconsistent crew/customer texting.

**Estimated ROI:** Reduces inbound status calls to Jenna and improves the premium customer experience; customers have responded strongly to personal progress updates.

### P3 — WinBack 1400
**Purpose:** Systematically re-engage closed-lost GHL leads with personalized messages.
- Pull relevant lead context from GHL.
- Segment by likely reason for loss/age.
- Generate personal-feeling SMS/email drafts.
- Send only approved campaigns and track responses.

**Replaces/unblocks:** Sporadic manual re-engagement by Brittany.

**Estimated ROI:** The auditor estimates a 2% re-close rate on 1,400 leads could mean 28 deals × $28K = ~$784K latent revenue.

### P4 — LeadGate
**Purpose:** Pre-qualify inbound leads before Marcus spends time on a call.
- Ask 4–5 qualifying questions.
- Capture budget, ownership, scope, timeline, and fit.
- Score the lead against documented criteria.
- Route qualified leads to Marcus and reject/redirect obvious non-fits.

**Replaces/unblocks:** Marcus calling every raw lead.

**Estimated ROI:** 4–6 clearly unqualified calls/week; the auditor estimates 1–2 hours/week saved.

## Why P0 is #1
Marcus's stated #1 was speeding up quoting, and the evidence supports that judgment. The auditor independently identified the quote cycle as the single highest-leverage intervention: 6–9 days, 35–40% of qualified leads lost to faster competitors, and Marcus as the bottleneck. The agent is valuable because it compresses the time between the site walk and a customer-ready proposal while preserving Marcus's final approval.

## Considered but excluded
**CrewCoach** was considered because Marcus personally cares about it, but it is lower leverage. The transcript estimates roughly $104K/year of preventable leakage, versus substantially larger revenue opportunity in quote speed and closed-lost reactivation. It should come after the top five unless new data changes the economics.

## Assumptions
Pricing is treated as authoritative only when supplied by Greenscape Pro. The prototype does not invent prices. Any unmatched scope, ambiguous quantity, or missing catalog item is flagged for human review.
