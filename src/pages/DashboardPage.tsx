import { useEffect, useState } from 'react';
import { Alert } from '../components/Alert';
import { Card } from '../components/Card';
import { getGreetingRequest } from '../services/dashboard.service';
import { parseApiError } from '../utils/api-error';

export function DashboardPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getGreetingRequest()
      .then((greeting) => {
        if (cancelled) return;
        setMessage(greeting);
        setError(null);
      })
      .catch((requestError: unknown) => {
        if (cancelled) return;
        setError(parseApiError(requestError).message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const handleRefresh = () => {
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  };

  return (
    <Card title="Dashboard">
      {error && <Alert variant="error">{error}</Alert>}

      {isLoading ? (
        <p className="text-gray-600">Loading your greeting...</p>
      ) : (
        message && <p className="text-lg">{message}</p>
      )}

      <button
        type="button"
        onClick={handleRefresh}
        disabled={isLoading}
        className="mt-4 rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-60"
      >
        Refresh
      </button>
    </Card>
  );
}