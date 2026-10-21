import type { Greeting } from '../types/dashboard';
import { api } from './api';

interface GreetingResponse {
  status: 'success';
  data: Greeting;
}

export async function getGreetingRequest(): Promise<Greeting> {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { data } = await api.get<GreetingResponse>('/dashboard/greeting', {
    params: { timeZone },
  });
  return data.data;
}