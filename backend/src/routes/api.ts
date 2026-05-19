// Arquivo: src/routes/api.ts
// Caminho: backend/src/routes/api.ts
// Deps: express@^4
// Agrega todos os sub-routers da API mobile sob /api — isolado das rotas Web existentes.

import { Router, Request, Response } from 'express';
import { login } from '../controllers/auth.controller';
import { listarPontosColeta } from '../controllers/pontos-coleta.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { checkDbConnection } from '../config/database';

const router = Router();

// Auth
router.post('/auth/login', login);

// Pontos de coleta (protegido)
router.get('/pontos-coleta', authMiddleware, listarPontosColeta);

// Health check (público — usado para diagnóstico antes de qualquer teste)
router.get('/health', async (_req: Request, res: Response) => {
  const dbOk = await checkDbConnection();
  res.status(200).json({
    status:    'ok',
    db:        dbOk ? 'connected' : 'error',
    timestamp: new Date().toISOString(),
  });
});

export default router;
