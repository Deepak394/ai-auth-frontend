import { api } from './api';

interface GreetingResponse {
  status: 'success';
  data: { message: string };
}

export async function getGreetingRequest(): Promise<string> {
  const { data } = await api.get<GreetingResponse>('/dashboard/greeting');
  return data.data.message;
}