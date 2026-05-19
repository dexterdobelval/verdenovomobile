// Arquivo: src/server.ts
// Caminho: backend/src/server.ts
// Deps: express@^4, cors@^2.8.5
// Entry point: monta o router /api sobre o Express existente sem tocar nas rotas Web.
// CORS configurado para aceitar origens explícitas (nunca wildcard).

import './config/env'; // valida env antes de qualquer import
import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import apiRouter from './routes/api';
import { getPool } from './config/database';

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = env.CORS_ORIGINS.split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Requests nativos do Expo não enviam origin header — permitir undefined
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

// ── Rotas API Mobile (novas — não afetam rotas Web existentes) ────────────────
app.use('/api', apiRouter);

// ── Inicialização ─────────────────────────────────────────────────────────────
const PORT = parseInt(env.PORT, 10);

(async () => {
  await getPool(); // falha rápido se banco inacessível
  app.listen(PORT, () => console.log(`🚀 API rodando em http://localhost:${PORT}`));
})();

export default app;
