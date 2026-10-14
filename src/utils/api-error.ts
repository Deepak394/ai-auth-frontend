import axios from 'axios';
import type { ApiErrorBody } from '../types/auth';
import type { FieldErrors } from './form-errors';

export interface ParsedApiError {
  message: string;
  fieldErrors: FieldErrors;
}

const GENERIC_MESSAGE = 'Something went wrong. Please try again.';

export function parseApiError(error: unknown): ParsedApiError {
  if (!axios.isAxiosError<ApiErrorBody>(error)) {
    return { message: GENERIC_MESSAGE, fieldErrors: {} };
  }

  if (!error.response) {
    return {
      message: 'Cannot reach the server. Check your connection and try again.',
      fieldErrors: {},
    };
  }

  const body = error.response.data;
  const fieldErrors: FieldErrors = {};

  for (const item of body?.errors ?? []) {
    if (!fieldErrors[item.field]) {
      fieldErrors[item.field] = item.message;
    }
  }

  return { message: body?.message ?? GENERIC_MESSAGE, fieldErrors };
}