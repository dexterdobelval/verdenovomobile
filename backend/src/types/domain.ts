// Arquivo: src/types/domain.ts
// Caminho: backend/src/types/domain.ts
// Deps: nenhuma
// Tipos centrais do domínio + augmentation do Express.Request para req.user.

import { Request } from 'express';

// ── Entidades do banco ────────────────────────────────────────────────────────

export interface UsuarioRow {
  id:    string;   // BIGINT retornado como string pelo mssql
  nome:  string;   // NVARCHAR
  email: string;   // NVARCHAR
  senha: string;   // NVARCHAR (bcrypt hash)
}

export interface PontoColetaRow {
  id:       string;
  nome:     string;
  tipo:     string;
  endereco: string;
  cep:      string;
  numero:   string;
  lat:      number | null;  // DECIMAL(9,6) — null até geocodificação
  lng:      number | null;
  geocoded: boolean;        // BIT
}

// ── Payload JWT ───────────────────────────────────────────────────────────────

export interface JwtPayload {
  sub:   number;
  name:  string;
  email: string;
}

// ── Envelope de erro padrão ───────────────────────────────────────────────────

export interface ApiError {
  error: {
    code:     string;
    message:  string;
    details?: unknown;
  };
}

// ── Express.Request augmentation ─────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
