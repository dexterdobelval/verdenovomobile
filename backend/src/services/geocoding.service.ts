// Arquivo: src/services/geocoding.service.ts
// Caminho: backend/src/services/geocoding.service.ts
// Deps: mssql@^10.0.4 (node-fetch nativo no Node 20)
// Geocodifica via AwesomeAPI (CEP → lat/lng), persiste no banco (cache permanente).
// Nunca lança exceção para não quebrar a listagem — retorna null em caso de falha.

import sql from 'mssql';
import { getPool } from '../config/database';
import { env } from '../config/env';

interface GeoResult {
  lat: number | null;
  lng: number | null;
}

interface AwesomeApiResponse {
  lat: string;
  lng: string;
  ok?: boolean;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchCoordinates(cep: string, numero?: string): Promise<GeoResult> {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) return { lat: null, lng: null };

  // AwesomeAPI geocodifica por CEP; o número fica na assinatura para manter o contrato CEP + número.
  void numero;

  try {
    for (let attempt = 0; attempt < 3; attempt++) {
      const res = await fetch(`${env.GEOCODING_API_BASE}/${cleanCep}`, {
        signal: AbortSignal.timeout(5000),
      });

      if (res.status === 429 && attempt < 2) {
        const retryAfter = Number(res.headers.get('retry-after'));
        await sleep(Number.isFinite(retryAfter) ? retryAfter * 1000 : (attempt + 1) * 1000);
        continue;
      }

      if (!res.ok) return { lat: null, lng: null };

      const data = await res.json() as AwesomeApiResponse;
      if (!data.lat || !data.lng) return { lat: null, lng: null };

      return { lat: parseFloat(data.lat), lng: parseFloat(data.lng) };
    }
  } catch {
    return { lat: null, lng: null };
  }

  return { lat: null, lng: null };
}

export async function geocodeAndCache(pontoId: string | number, cep: string, numero?: string): Promise<GeoResult> {
  const coords = await fetchCoordinates(cep, numero);

  // Persiste mesmo se null — marca geocoded=1 para não tentar novamente em falhas permanentes
  // (CEP inválido nunca vai resolver). Para falhas de rede (timeout), geocoded permanece 0.
  if (coords.lat !== null && coords.lng !== null) {
    try {
      const pool    = await getPool();
      const request = pool.request();
      request.input('lat',      sql.Decimal(9, 6), coords.lat);
      request.input('lng',      sql.Decimal(9, 6), coords.lng);
      request.input('id',       sql.BigInt,        String(pontoId));
      await request.query(
        'UPDATE dbo.ponto SET lat = @lat, lng = @lng, geocoded = 1 WHERE id = @id',
      );
    } catch (err) {
      console.error(`[geocoding] Falha ao persistir coords para ponto ${pontoId}:`, err);
    }
  }

  return coords;
}
