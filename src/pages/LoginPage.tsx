import { type FormEvent, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Alert } from "../components/Alert";
import { Card } from "../components/Card";
import { FormField } from "../components/FormField";
import { useAuth } from "../hooks/useAuth";
import { parseApiError } from "../utils/api-error";
import { type FieldErrors, zodToFieldErrors } from "../utils/form-errors";
import { loginSchema } from "../validators/auth.schema";

export function LoginPage() {
  const { login, sessionExpired } = useAuth();
  const location = useLocation();
  const justRegistered =
    (location.state as { registered?: boolean } | null)?.registered === true;

  const [values, setValues] = useState({
    email: "admin@Example.com",
    password: "Password123",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof typeof values) => (value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const result = loginSchema.safeParse(values);
    if (!result.success) {
      setFieldErrors(zodToFieldErrors(result.error));
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await login(result.data);
      // On success the status becomes "authenticated" and GuestRoute redirects.
    } catch (error) {
      const parsed = parseApiError(error);
      setFormError(parsed.message);
      setFieldErrors(parsed.fieldErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title="Login">
      {sessionExpired && (
        <Alert variant="error">
          Your session has expired. Please log in again.
        </Alert>
      )}
      {justRegistered && (
        <Alert variant="success">Account created. Please log in.</Alert>
      )}
      {formError && <Alert variant="error">{formError}</Alert>}

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={updateField("email")}
          error={fieldErrors.email}
          disabled={isSubmitting}
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={updateField("password")}
          error={fieldErrors.password}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        No account?{" "}
        <Link to="/register" className="text-blue-600 underline">
          Register
        </Link>
      </p>
    </Card>
  );
}
