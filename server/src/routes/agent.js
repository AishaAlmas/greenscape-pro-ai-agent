import { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../services/supabase.js';
import { generateQuote } from '../services/quoteAgent.js';
import { notifySlack } from '../services/slack.js';

const router = Router();

const GenerateSchema = z.object({
  customer_name: z.string().min(1),
  project_address: z.string().min(1),
  site_walk_notes: z.string().min(20)
});

router.post('/generate', async (req, res) => {
  try {
    const input = GenerateSchema.parse(req.body);

    const { data: catalog, error: catalogError } = await supabase
      .from('pricing_items')
      .select('code,name,unit,unit_price')
      .eq('active', true)
      .order('name');

    if (catalogError) throw catalogError;

    const aiResult = await generateQuote({
      notes: input.site_walk_notes,
      pricingCatalog: catalog
    });

    const status = aiResult.questions.length || aiResult.risk_flags.length
      ? 'needs_review'
      : 'generated';

    const { data, error } = await supabase
      .from('agent_runs')
      .insert({ ...input, ai_result: aiResult, status })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message || 'Generation failed' });
  }
});

router.get('/runs', async (_req, res) => {
  const { data, error } = await supabase
    .from('agent_runs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: run, error: runError } = await supabase
      .from('agent_runs')
      .select('*')
      .eq('id', id)
      .single();

    if (runError) throw runError;

    const { error: updateError } = await supabase
      .from('agent_runs')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) throw updateError;

    const message = `QuotePilot approved proposal for ${run.customer_name} at ${run.project_address}.`;
    let integrationStatus = 'skipped';

    try {
      await notifySlack(message);
      integrationStatus = process.env.SLACK_WEBHOOK_URL ? 'sent' : 'skipped';
    } catch (integrationError) {
      integrationStatus = 'failed';
      await supabase.from('integration_logs').insert({
        agent_run_id: id,
        integration: 'slack',
        status: 'failed',
        response: integrationError.message
      });
    }

    await supabase.from('approval_actions').insert({
      agent_run_id: id,
      action: 'approved',
      actor: 'Marcus'
    });

    await supabase.from('integration_logs').insert({
      agent_run_id: id,
      integration: 'slack',
      status: integrationStatus,
      response: message
    });

    res.json({ success: true, integrationStatus });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message || 'Approval failed' });
  }
});

export default router;
