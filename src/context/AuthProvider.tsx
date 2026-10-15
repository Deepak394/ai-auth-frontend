import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { setUnauthorizedHandler } from '../services/api';
import { loginRequest, meRequest } from '../services/auth.service';
import type { User } from '../types/auth';
import { clearToken, getToken, saveToken } from '../utils/token-storage';
import type { LoginInput } from '../validators/auth.schema';
import { AuthContext, type AuthStatus } from './auth-context';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [status, setStatus] = useState<AuthStatus>(() =>
    getToken() ? 'loading' : 'unauthenticated',
  );

  const expireSession = useCallback(() => {
    clearToken();
    setUser(null);
    setSessionExpired(true);
    setStatus('unauthenticated');
  }, []);


  useEffect(() => {
    setUnauthorizedHandler(expireSession);
    return () => setUnauthorizedHandler(null);
  }, [expireSession]);

  useEffect(() => {
    if (!getToken()) {
      return;
    }

    let cancelled = false;

    meRequest()
      .then((currentUser) => {
        if (cancelled) return;
        setUser(currentUser);
        setStatus('authenticated');
      })
      .catch(() => {
      
        if (cancelled) return;
        setUser(null);
        setStatus('unauthenticated');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const { token, user: loggedInUser } = await loginRequest(input);
    saveToken(token);
    setSessionExpired(false);
    setUser(loggedInUser);
    setStatus('authenticated');
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setSessionExpired(false);
    setStatus('unauthenticated');
  }, []);

  const value = useMemo(
    () => ({ user, status, sessionExpired, login, logout }),
    [user, status, sessionExpired, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}