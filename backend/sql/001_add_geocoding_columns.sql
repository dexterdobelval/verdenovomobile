-- Arquivo: sql/001_add_geocoding_columns.sql
-- Caminho: backend/sql/001_add_geocoding_columns.sql
-- Execute UMA VEZ no banco Somee antes de subir o backend.
-- Adiciona suporte a cache de geocodificacao na tabela real dbo.ponto.

IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'ponto' AND COLUMN_NAME = 'lat'
)
BEGIN
  ALTER TABLE dbo.ponto ADD lat DECIMAL(9,6) NULL;
END

IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'ponto' AND COLUMN_NAME = 'lng'
)
BEGIN
  ALTER TABLE dbo.ponto ADD lng DECIMAL(9,6) NULL;
END

IF NOT EXISTS (
  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'ponto' AND COLUMN_NAME = 'geocoded'
)
BEGIN
  ALTER TABLE dbo.ponto ADD geocoded BIT NOT NULL DEFAULT 0;
END

SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'ponto'
ORDER BY ORDINAL_POSITION;
