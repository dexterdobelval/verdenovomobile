# Arquivo: docs/mobile-backend-integration.md
# Caminho: docs/mobile-backend-integration.md
# Deps NPM: backend dotenv@16.4.5, express@^4.19.2, mssql@^10.0.4, jsonwebtoken@^9.0.2, bcrypt@^6.0.0, zod@^3.23.8; mobile axios@^1.16.1, expo-secure-store@~15.0.8, expo-constants@~18.0.13, jwt-decode@^4.0.0, react-native-maps@1.20.1

## Pressupostos Confirmados

- Este repositorio contem o app mobile Expo e um backend novo em `backend/`.
- Nao ha link do backend web original no workspace; por isso o backend novo assume SQL Server raw via `mssql`, tabela `Usuarios` com `id`, `nome`, `email`, `senha`, e tabela `PontosColeta` com `id`, `nome`, `tipo`, `endereco`, `cep`, `numero`.
- A senha em `Usuarios.senha` deve estar em hash bcrypt.
- O mobile nao cadastra usuarios. Ele usa o mesmo usuario ja criado pela web.
- A estrategia adotada e hibrida: a web pode continuar com sessao/cookie, e o mobile usa JWT em endpoints `/api`.
- Geocodificacao usa cache lazy no SQL Server (`lat`, `lng`, `geocoded`) para evitar O(n) no cliente e evitar dependencia de Redis em hospedagem compartilhada.

## Versoes Efetivas

- Mobile: Expo `~54.0.34`, React Native `0.81.5`, TypeScript `~5.9.2`.
- Backend: Node alvo 20 LTS, Express `^4.19.2`, TypeScript `^5.4.5`, `mssql` `^10.0.4`, `jsonwebtoken` `^9.0.2`, `bcrypt` `^6.0.0`, `zod` `^3.23.8`.

## Seguranca

- Queries usam `request.input()` do `mssql`; nao concatenar valores em SQL.
- JWT fica em `expo-secure-store`, nao em `AsyncStorage`.
- CORS usa `CORS_ORIGINS` com lista explicita. Requests nativos do Expo podem vir sem `Origin` e sao permitidos.
- Gotchas do `mssql`: `BIGINT` pode voltar como `string`, `DATETIME` como `Date`, `BIT` como `boolean`.
- Segredos devem ficar em `.env` local ou painel do Somee, nunca commitados.

## Contratos API

Envelope de erro:

```ts
interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

`POST /api/auth/login`

Request:

```ts
{ email: string; password: string }
```

Response `200`:

```ts
{
  token: string;
  expiresIn: number;
  user: { id: number; name: string; email: string }
}
```

Erros: `401 INVALID_CREDENTIALS`, `422 VALIDATION_ERROR`, `500 INTERNAL_ERROR`.

`GET /api/pontos-coleta`

Headers: `Authorization: Bearer <token>`

Query opcional: `page`, `limit`

Response `200`:

```ts
{
  data: Array<{
    id: number;
    nome: string;
    tipo: string;
    endereco: string;
    lat: number | null;
    lng: number | null;
    geocoded: boolean;
  }>;
  total: number;
  page: number;
  limit: number;
}
```

Erros: `401 TOKEN_MISSING`, `401 TOKEN_EXPIRED`, `401 TOKEN_INVALID`, `500 DB_CONNECTION_ERROR`, `500 DB_QUERY_ERROR`.

`GET /api/health`

Response `200`:

```ts
{ status: "ok"; db: "connected" | "error"; timestamp: string }
```

## SQL Necessario

Execute uma vez:

```sql
-- backend/sql/001_add_geocoding_columns.sql
ALTER TABLE PontosColeta ADD lat DECIMAL(9,6) NULL;
ALTER TABLE PontosColeta ADD lng DECIMAL(9,6) NULL;
ALTER TABLE PontosColeta ADD geocoded BIT NOT NULL DEFAULT 0;
```

Use o arquivo SQL do repositorio, que ja e idempotente.

## Executar Backend

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

String Somee esperada via variaveis:

```txt
DB_HOST=VerDenovo.mssql.somee.com
DB_NAME=VerDenovo
DB_PORT=1433
```

O pool usa `encrypt: true`, `trustServerCertificate: true`, `connectTimeout: 30000`, `requestTimeout: 30000`.

## Configurar Expo

`app.config.js` le `API_URL` e publica em `extra.apiUrl`.

- Android Emulator: `API_URL=http://10.0.2.2:3001/api`
- iOS Simulator: `API_URL=http://localhost:3001/api`
- Dispositivo fisico: use o IP local da maquina, exemplo `http://192.168.1.100:3001/api`
- Fallback externo: `ngrok http 3001` e use a URL HTTPS gerada com `/api`

Descobrir IP local:

- Windows PowerShell: `ipconfig`
- macOS: `ipconfig getifaddr en0`
- Linux: `hostname -I`

## Testes Manuais

Health:

```bash
curl http://localhost:3001/api/health
```

Login invalido:

```bash
curl -X POST http://localhost:3001/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"errado@example.com\",\"password\":\"x\"}"
```

Login valido:

```bash
curl -X POST http://localhost:3001/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"usuario@site.com\",\"password\":\"senha\"}"
```

Pontos sem token:

```bash
curl http://localhost:3001/api/pontos-coleta
```

Pontos com token:

```bash
curl http://localhost:3001/api/pontos-coleta ^
  -H "Authorization: Bearer SEU_TOKEN"
```

Para simular token expirado, defina `JWT_EXPIRES_IN=1s`, reinicie o backend, faca login, aguarde alguns segundos e chame `/api/pontos-coleta`.

## Deploy Somee

- Configure todas as variaveis de `backend/.env.example` no painel.
- Rode o SQL de geocodificacao no banco antes de publicar.
- Confirme whitelist/firewall do SQL Server se o painel exigir.
- Teste primeiro `/api/health`; depois login; por ultimo `/api/pontos-coleta`.
