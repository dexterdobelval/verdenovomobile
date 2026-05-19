// Arquivo: src/controllers/auth.controller.ts
// Caminho: backend/src/controllers/auth.controller.ts
// Deps: bcrypt@^6.0.0, jsonwebtoken@^9.0.2, mssql@^10.0.4, zod@^3.23.8
// Busca por email com parameterized query (previne SQL injection),
// compara hash bcrypt, emite JWT com payload mínimo.

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import sql from 'mssql';
import { z } from 'zod';
import { getPool } from '../config/database';
import { env } from '../config/env';
import type { UsuarioRow } from '../types/domain';

const loginSchema = z.object({
  email:    z.string().email('E-mail inválido.'),
  password: z.string().min(1, 'Senha obrigatória.'),
});

function parseExpiresInSeconds(value: string): number {
  const match = value.trim().match(/^(\d+)([smhd])?$/i);
  if (!match) return 8 * 60 * 60;

  const amount = Number(match[1]);
  const unit = (match[2] ?? 's').toLowerCase();

  if (unit === 'm') return amount * 60;
  if (unit === 'h') return amount * 60 * 60;
  if (unit === 'd') return amount * 24 * 60 * 60;
  return amount;
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({
      error: { code: 'VALIDATION_ERROR', message: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
    });
    return;
  }

  const { email, password } = parsed.data;

  try {
    const pool    = await getPool();
    const request = pool.request();
    request.input('email', sql.VarChar(100), email);

    const result = await request.query<UsuarioRow>(
      `
        SELECT id, nome, email, senha
        FROM dbo.usuario
        WHERE email = @email AND status_usuario = 'ATIVO'
      `,
    );

    const user = result.recordset[0];

    // Mesmo tempo de resposta para usuário inexistente e senha errada (evita user enumeration)
    const senhaHash   = user?.senha ?? '$2b$10$invalidhashpaddingtomatchtime000000000000000000000';
    const senhaValida = await bcrypt.compare(password, senhaHash);

    if (!user || !senhaValida) {
      res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'E-mail ou senha incorretos.' } });
      return;
    }

    const expiresIn = parseExpiresInSeconds(env.JWT_EXPIRES_IN);
    const token = jwt.sign(
      { sub: Number(user.id), name: user.nome, email: user.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] },
    );

    res.status(200).json({
      token,
      expiresIn,
      user: { id: Number(user.id), name: user.nome, email: user.email },
    });
  } catch (err) {
    console.error('[auth.login]', err);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor.' } });
  }
}
