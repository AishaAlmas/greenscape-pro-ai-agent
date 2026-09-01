import { useEffect, useState } from 'react';
import { api } from './services/api';
import { CheckCircle2, Clock3, FileText, Sparkles, AlertTriangle } from 'lucide-react';
import './index.css';

const sampleNotes = `Customer wants a premium 500 sq ft patio, a pergola, a fire pit, and artificial turf in the rear yard. They prefer warm natural stone colors. Existing irrigation should be inspected and reused where possible. Customer wants the project started within six weeks. HOA approval may be required.`;

function money(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);
}

export default function App() {
  const [form, setForm] = useState({
    customer_name: 'Sarah Johnson',
    project_address: '123 Desert View Dr, Phoenix, AZ',
    site_walk_notes: sampleNotes
  });
  const [run, setRun] = useState(null);
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function loadRuns() {
    try {
      const { data } = await api.get('/agent/runs');
      setRuns(data);
    } catch {}
  }

  useEffect(() => { loadRuns(); }, []);

  async function generate(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { data } = await api.post('/agent/generate', form);
      setRun(data);
      setMessage('Proposal draft generated and saved.');
      loadRuns();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Generation failed.');
    } finally {
      setLoading(false);
    }
  }

  async function approve() {
    if (!run) return;
    setLoading(true);
    try {
      await api.post(`/agent/${run.id}/approve`);
      setRun({ ...run, status: 'approved' });
      setMessage('Approved. Slack notification was attempted and the action was logged.');
      loadRuns();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Approval failed.');
    } finally {
      setLoading(false);
    }
  }

  const total = run?.ai_result?.line_items?.reduce((sum, i) => sum + i.total, 0) || 0;

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Greenscape Pro</p>
            <h1 className="text-2xl font-bold">QuotePilot</h1>
            <p className="text-sm text-slate-500">Site-walk → proposal in minutes</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Sparkles size={17} /> Human-approved AI workflow
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 grid lg:grid-cols-[1fr_1fr] gap-6">
        <section className="bg-white rounded-2xl border p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <FileText size={20} />
            <h2 className="font-semibold">New site walk</h2>
          </div>
          <form onSubmit={generate} className="space-y-4">
            <label className="block text-sm font-medium">Customer name
              <input className="mt-1 w-full rounded-lg border p-3" value={form.customer_name}
                onChange={e => setForm({...form, customer_name:e.target.value})} />
            </label>
            <label className="block text-sm font-medium">Project address
              <input className="mt-1 w-full rounded-lg border p-3" value={form.project_address}
                onChange={e => setForm({...form, project_address:e.target.value})} />
            </label>
            <label className="block text-sm font-medium">Site-walk notes
              <textarea rows="13" className="mt-1 w-full rounded-lg border p-3" value={form.site_walk_notes}
                onChange={e => setForm({...form, site_walk_notes:e.target.value})} />
            </label>
            <button disabled={loading} className="w-full rounded-lg bg-slate-900 text-white p-3 font-semibold disabled:opacity-50">
              {loading ? 'Processing…' : 'Generate proposal draft'}
            </button>
          </form>
          {message && <p className="mt-4 text-sm text-slate-600">{message}</p>}
        </section>

        <section className="bg-white rounded-2xl border p-6 shadow-sm">
          {!run ? (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center text-slate-500">
              <Clock3 size={36} className="mb-3" />
              <p className="font-medium text-slate-700">No proposal selected</p>
              <p className="text-sm mt-1">Generate a draft to review the AI output.</p>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-lg">{run.customer_name}</h2>
                  <p className="text-sm text-slate-500">{run.project_address}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase">
                  {run.status}
                </span>
              </div>

              <div className="mt-6 rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold mb-1">AI summary</p>
                <p className="text-sm text-slate-700">{run.ai_result.summary}</p>
              </div>

              {run.ai_result.risk_flags.length > 0 && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex gap-2 font-semibold text-amber-900"><AlertTriangle size={18}/> Review flags</div>
                  <ul className="mt-2 text-sm text-amber-900 list-disc pl-5">
                    {run.ai_result.risk_flags.map((x,i)=><li key={i}>{x}</li>)}
                  </ul>
                </div>
              )}

              <div className="mt-5 overflow-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left text-slate-500">
                    <th className="py-2">Item</th><th>Qty</th><th>Unit</th><th className="text-right">Total</th>
                  </tr></thead>
                  <tbody>
                    {run.ai_result.line_items.map((item,i)=>(
                      <tr key={i} className="border-b">
                        <td className="py-3">{item.description}</td>
                        <td>{item.quantity}</td><td>{item.unit}</td>
                        <td className="text-right font-medium">{money(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 flex items-center justify-between text-lg font-bold">
                <span>Estimated total</span><span>{money(total)}</span>
              </div>

              <div className="mt-5 rounded-xl border p-4">
                <p className="text-sm font-semibold mb-2">Proposal draft</p>
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{run.ai_result.proposal_body}</p>
              </div>

              <button onClick={approve} disabled={loading || run.status === 'approved'}
                className="mt-5 w-full rounded-lg bg-emerald-700 text-white p-3 font-semibold disabled:opacity-50">
                <span className="inline-flex items-center gap-2"><CheckCircle2 size={18}/> {run.status === 'approved' ? 'Approved' : 'Approve proposal'}</span>
              </button>
            </>
          )}
        </section>

        <section className="lg:col-span-2 bg-white rounded-2xl border p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Recent agent runs</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {runs.slice(0,6).map(r => (
              <button key={r.id} onClick={() => setRun(r)} className="text-left rounded-xl border p-4 hover:bg-slate-50">
                <p className="font-medium">{r.customer_name}</p>
                <p className="text-xs text-slate-500 mt-1">{new Date(r.created_at).toLocaleString()}</p>
                <p className="mt-3 text-xs font-semibold uppercase">{r.status}</p>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
