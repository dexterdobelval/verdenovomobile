// Arquivo: src/contexts/AuthContext.tsx
// Caminho: src/contexts/AuthContext.tsx
// Deps: expo-secure-store@~14.0.1, jwt-decode@^4.0.0, axios@^1.7.2
// Contexto global de autenticação: persiste token no Keychain/Keystore,
// valida expiração localmente (sem round-trip) e registra handler de logout no axios.

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { api, TOKEN_KEY, setUnauthorizedHandler } from '../services/api';

interface User {
  id:    number;
  name:  string;
  email: string;
}

interface JwtPayload {
  sub:   number;
  name:  string;
  email: string;
  exp:   number;
}

interface AuthState {
  user:            User | null;
  token:           string | null;
  isLoading:       boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login:  (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function isTokenValid(token: string): boolean {
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
}

function tokenToUser(token: string): User | null {
  try {
    const { sub, name, email } = jwtDecode<JwtPayload>(token);
    return { id: sub, name, email };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null, token: null, isLoading: true, isAuthenticated: false,
  });

  // Restaura sessão do SecureStore no mount
  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync(TOKEN_KEY);
      if (stored && isTokenValid(stored)) {
        setState({ user: tokenToUser(stored), token: stored, isLoading: false, isAuthenticated: true });
      } else {
        if (stored) await SecureStore.deleteItemAsync(TOKEN_KEY); // limpa token expirado
        setState(s => ({ ...s, isLoading: false }));
      }
    })();
  }, []);

  const logout = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
  }, []);

  // Registra handler para logout automático no interceptor axios (401)
  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
    await SecureStore.setItemAsync(TOKEN_KEY, data.token);
    setState({ user: data.user, token: data.token, isLoading: false, isAuthenticated: true });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
