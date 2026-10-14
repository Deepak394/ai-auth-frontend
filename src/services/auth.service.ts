import type { AuthResponse, User } from '../types/auth';
import type { LoginInput, RegisterInput } from '../validators/auth.schema';
import { api } from './api';

interface RegisterResponse {
  status: 'success';
  data: { user: User };
}

interface LoginResponse {
  status: 'success';
  data: AuthResponse;
}

export async function registerRequest(input: RegisterInput): Promise<User> {
  const { data } = await api.post<RegisterResponse>('/auth/register', input);
  return data.data.user;
}

export async function loginRequest(input: LoginInput): Promise<AuthResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', input);
  return data.data;
}