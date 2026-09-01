import OpenAI from 'openai';
import { z } from 'zod';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const LineSchema = z.object({
  pricing_code: z.string(),
  description: z.string(),
  quantity: z.number().positive(),
  unit: z.string(),
  unit_price: z.number().nonnegative(),
  total: z.number().nonnegative(),
  confidence: z.number().min(0).max(1)
});

const ResultSchema = z.object({
  summary: z.string(),
  customer_preferences: z.array(z.string()),
  line_items: z.array(LineSchema),
  exclusions: z.array(z.string()),
  questions: z.array(z.string()),
  risk_flags: z.array(z.string()),
  proposal_body: z.string()
});

export async function generateQuote({ notes, pricingCatalog }) {
  const system = `You are QuotePilot for Greenscape Pro, a premium Phoenix landscape/hardscape company.
Convert site-walk notes into a proposal draft using ONLY the provided pricing catalog.
Never invent a price. If an item is not represented by the catalog, put it in questions or risk_flags.
Use conservative quantities when the notes are explicit; otherwise ask a question.
Return valid JSON with keys:
summary, customer_preferences, line_items, exclusions, questions, risk_flags, proposal_body.
Each line item must contain pricing_code, description, quantity, unit, unit_price, total, confidence.
The human founder must approve before anything customer-facing is sent.`;

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
    temperature: 0.1,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: JSON.stringify({ site_walk_notes: notes, pricing_catalog: pricingCatalog }) }
    ]
  });

  const raw = response.choices?.[0]?.message?.content;
  if (!raw) throw new Error('AI returned an empty response');

  const parsed = ResultSchema.parse(JSON.parse(raw));

  // Deterministic financial guardrail: totals must equal quantity × unit price.
  parsed.line_items = parsed.line_items.map((item) => ({
    ...item,
    total: Number((item.quantity * item.unit_price).toFixed(2))
  }));

  return parsed;
}
