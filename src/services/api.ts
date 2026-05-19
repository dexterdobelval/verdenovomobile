// Arquivo: src/services/api.ts
// Caminho: src/services/api.ts
// Deps: axios@^1.7.2, expo-secure-store@~14.0.1, expo-constants@~17.0.0
// Instância axios centralizada: injeta Bearer token em todo request,
// faz logout automático no 401 e retry com backoff exponencial em erros 5xx.

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

export const TOKEN_KEY = 'verdenovo_jwt';

// URL configurável via app.config.js (extra.apiUrl) — fallback para dev local
const BASE_URL: string =
  (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl ??
  'http://10.0.2.2:3001/api';

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: injeta token ────────────────────────────────────────
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor: 401 → logout | 5xx → retry ────────────────────────
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler;
}

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & { _retryCount?: number };

    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      onUnauthorized?.();
      return Promise.reject(error);
    }

    // Retry com backoff exponencial para erros 5xx (máx 3 tentativas)
    const isServerError = (error.response?.status ?? 0) >= 500;
    const retryCount    = config._retryCount ?? 0;

    if (isServerError && retryCount < 3) {
      config._retryCount = retryCount + 1;
      const delay = Math.pow(2, retryCount) * 500; // 500ms, 1s, 2s
      await new Promise(r => setTimeout(r, delay));
      return api(config);
    }

    return Promise.reject(error);
  },
);
