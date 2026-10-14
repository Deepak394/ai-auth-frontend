import type { ZodError } from 'zod';

export type FieldErrors = Partial<Record<string, string>>;

export function zodToFieldErrors(error: ZodError): FieldErrors {
  const errors: FieldErrors = {};

  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? '');
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }

  return errors;
}