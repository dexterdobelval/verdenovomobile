// Arquivo: src/config/env.ts
// Caminho: backend/src/config/env.ts
// Deps: dotenv@16.4.5, zod@^3.23.8
// Valida todas as variáveis de ambiente no startup — servidor não sobe se faltar alguma obrigatória.

import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV:           z.enum(['development', 'production', 'test']).default('development'),
  PORT:               z.string().default('3001'),
  JWT_SECRET:         z.string().min(32, 'JWT_SECRET deve ter ao menos 32 caracteres'),
  JWT_EXPIRES_IN:     z.string().default('8h'),
  DB_HOST:            z.string(),
  DB_NAME:            z.string(),
  DB_USER:            z.string(),
  DB_PASSWORD:        z.string(),
  DB_PORT:            z.string().default('1433'),
  CORS_ORIGINS:       z.string().default('http://localhost:8081'),
  GEOCODING_API_BASE: z.string().default('https://cep.awesomeapi.com.br/json'),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Variáveis de ambiente inválidas:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
