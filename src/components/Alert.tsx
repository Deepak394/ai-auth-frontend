import type { ReactNode } from 'react';

interface AlertProps {
  variant: 'error' | 'success';
  children: ReactNode;
}

const styles = {
  error: 'border-red-300 bg-red-50 text-red-800',
  success: 'border-green-300 bg-green-50 text-green-800',
};

export function Alert({ variant, children }: AlertProps) {
  return (
    <div role="alert" className={`mb-4 rounded border px-3 py-2 text-sm ${styles[variant]}`}>
      {children}
    </div>
  );
}