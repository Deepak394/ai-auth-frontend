import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'font-semibold text-blue-600' : 'text-gray-600 hover:text-gray-900';

export function Layout() {
  const { user, status, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-semibold">
            AI Auth Dashboard
          </Link>

          <div className="flex items-center gap-4 text-sm">
            {status === 'authenticated' && user && (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>
                <span className="text-gray-500">{user.name}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded border border-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            )}

            {status === 'unauthenticated' && (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Login
                </NavLink>
                <NavLink to="/register" className={navLinkClass}>
                  Register
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}