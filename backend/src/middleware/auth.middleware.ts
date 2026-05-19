// Arquivo: src/middleware/auth.middleware.ts
// Caminho: backend/src/middleware/auth.middleware.ts
// Deps: jsonwebtoken@^9.0.2
// Três casos de erro distintos (ausente / expirado / inválido) com codes semânticos
// para que o mobile possa reagir diferentemente a cada um.

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import type { JwtPayload } from '../types/domain';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: { code: 'TOKEN_MISSING', message: 'Token de autenticação não fornecido.' } });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as unknown as JwtPayload;
    req.user = { sub: payload.sub, name: payload.name, email: payload.email };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: { code: 'TOKEN_EXPIRED', message: 'Sessão expirada. Faça login novamente.' } });
      return;
    }
    res.status(401).json({ error: { code: 'TOKEN_INVALID', message: 'Token inválido.' } });
  }
}
