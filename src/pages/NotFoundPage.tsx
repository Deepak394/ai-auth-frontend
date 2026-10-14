import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <Link to="/" className="text-blue-600 underline">
        Go home
      </Link>
    </div>
  );
}