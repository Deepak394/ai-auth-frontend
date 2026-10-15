import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface RedirectState {
  from?: { pathname: string };
}

function CheckingSession() {
  return <p className="text-center text-gray-600">Checking session...</p>;
}

export function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <CheckingSession />;
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function GuestRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <CheckingSession />;
  }

  if (status === 'authenticated') {
    const state = location.state as RedirectState | null;
    return <Navigate to={state?.from?.pathname ?? '/dashboard'} replace />;
  }

  return <Outlet />;
}