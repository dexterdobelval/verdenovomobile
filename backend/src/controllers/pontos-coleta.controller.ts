// Arquivo: src/controllers/pontos-coleta.controller.ts
// Caminho: backend/src/controllers/pontos-coleta.controller.ts
// Deps: mssql@^10.0.4
// Lê pontos do banco; para os não geocodificados, dispara geocodificação lazy
// em paralelo (Promise.allSettled — falha individual não cancela a resposta).

import { Request, Response } from 'express';
import sql from 'mssql';
import { getPool } from '../config/database';
import { geocodeAndCache } from '../services/geocoding.service';
import type { PontoColetaRow } from '../types/domain';

function parsePositiveInt(value: unknown, fallback: number, max?: number): number {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return max ? Math.min(parsed, max) : parsed;
}

function isDbConnectivityError(err: unknown): boolean {
  const code = typeof err === 'object' && err !== null && 'code' in err ? String((err as { code?: unknown }).code) : '';
  return ['ECONNCLOSED', 'ETIMEOUT', 'ESOCKET', 'ELOGIN'].includes(code);
}

export async function listarPontosColeta(req: Request, res: Response): Promise<void> {
  const page  = parsePositiveInt(req.query.page, 1);
  const limit = parsePositiveInt(req.query.limit, 50, 100);
  const offset = (page - 1) * limit;

  try {
    const pool    = await getPool();
    const request = pool.request();
    request.input('limit',  sql.Int, limit);
    request.input('offset', sql.Int, offset);

    const [dataResult, countResult] = await Promise.all([
      request.query<PontoColetaRow>(`
        SELECT
          id,
          nome,
          material AS tipo,
          CONCAT(COALESCE(logradouro, ''), ', ', numero, ' - CEP ', cep) AS endereco,
          cep,
          numero,
          lat,
          lng,
          geocoded
        FROM dbo.ponto
        WHERE status_ponto = 'ATIVO'
        ORDER BY id
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `),
      pool.request().query<{ total: number }>("SELECT COUNT(*) AS total FROM dbo.ponto WHERE status_ponto = 'ATIVO'"),
    ]);

    const pontos = dataResult.recordset;
    const total  = countResult.recordset[0].total;

    // Geocodificação lazy: resolve a página atual e mantém cache no SQL Server.
    const semGeo = pontos.filter(p => !p.geocoded && p.cep);
    if (semGeo.length > 0) {
      await Promise.allSettled(
        semGeo.map(p => geocodeAndCache(p.id, p.cep, p.numero).then(coords => {
          p.lat      = coords.lat;
          p.lng      = coords.lng;
          p.geocoded = coords.lat !== null;
        }))
      );
    }

    res.status(200).json({
      data: pontos.map(p => ({
        id:       Number(p.id),
        nome:     p.nome,
        tipo:     p.tipo,
        endereco: p.endereco,
        lat:      p.lat,
        lng:      p.lng,
        geocoded: p.geocoded,
      })),
      total,
      page,
      limit,
    });
  } catch (err) {
    console.error('[pontos-coleta.listar]', err);
    const code = isDbConnectivityError(err) ? 'DB_CONNECTION_ERROR' : 'DB_QUERY_ERROR';
    const message = code === 'DB_CONNECTION_ERROR'
      ? 'Erro de conexão com o banco de dados.'
      : 'Erro ao consultar banco de dados.';
    res.status(500).json({ error: { code, message } });
  }
}
