import axios from 'axios';
import { getToken } from '../utils/token-storage';

const PUBLIC_AUTH_PATHS = ['/auth/login', '/auth/register'];

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? '';
      const isPublicAuthCall = PUBLIC_AUTH_PATHS.some((path) => url.startsWith(path));

      if (!isPublicAuthCall && getToken()) {
        unauthorizedHandler?.();
      }
    }
    return Promise.reject(error);
  },
);