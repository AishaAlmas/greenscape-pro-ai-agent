import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import agentRouter from './routes/agent.js';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN?.split(',') || '*'
}));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'greenscape-quote-agent' });
});

app.use('/api/agent', agentRouter);

const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`API listening on ${port}`));
