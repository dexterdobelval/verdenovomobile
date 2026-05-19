// Arquivo: src/config/database.ts
// Caminho: backend/src/config/database.ts
// Deps: mssql@^10.0.4
// Pool singleton com retry na conexão inicial e fechamento limpo no SIGTERM.
// Somee requer encrypt:true e trustServerCertificate:true (cert autoassinado).

import sql, { ConnectionPool } from 'mssql';
import { env } from './env';

const config: sql.config = {
  server:   env.DB_HOST,
  database: env.DB_NAME,
  user:     env.DB_USER,
  password: env.DB_PASSWORD,
  port:     parseInt(env.DB_PORT, 10),
  options: {
    encrypt:                true,
    trustServerCertificate: true,
    connectTimeout:         30000,
    requestTimeout:         30000,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool: ConnectionPool | null = null;

export async function getPool(): Promise<ConnectionPool> {
  if (pool && pool.connected) return pool;

  const MAX_RETRIES = 5;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      pool = await new ConnectionPool(config).connect();
      console.log('✅ SQL Server conectado');
      return pool;
    } catch (err) {
      attempt++;
      const wait = attempt * 2000;
      console.error(`❌ Falha na conexão (tentativa ${attempt}/${MAX_RETRIES}). Retry em ${wait}ms`, err);
      if (attempt >= MAX_RETRIES) throw err;
      await new Promise(r => setTimeout(r, wait));
    }
  }

  throw new Error('Não foi possível conectar ao banco após múltiplas tentativas.');
}

export async function checkDbConnection(): Promise<boolean> {
  try {
    const p = await getPool();
    await p.request().query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

process.on('SIGTERM', async () => {
  if (pool) {
    await pool.close();
    console.log('Pool SQL Server fechado (SIGTERM)');
  }
  process.exit(0);
});
