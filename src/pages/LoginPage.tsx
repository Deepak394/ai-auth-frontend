import { useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { Alert } from "../components/Alert";
import { Card } from "../components/Card";
import { FormField } from "../components/FormField";
import { loginRequest } from "../services/auth.service";
import { parseApiError } from "../utils/api-error";
import { type FieldErrors, zodToFieldErrors } from "../utils/form-errors";
import { loginSchema } from "../validators/auth.schema";

export function LoginPage() {
  const location = useLocation();
  const justRegistered =
    (location.state as { registered?: boolean } | null)?.registered === true;

  const [values, setValues] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSucceeded, setLoginSucceeded] = useState(false);

  const updateField = (field: keyof typeof values) => (value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setLoginSucceeded(false);

    const result = loginSchema.safeParse(values);
    if (!result.success) {
      setFieldErrors(zodToFieldErrors(result.error));
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await loginRequest(result.data);
      // Temporary: Day 9 stores the token and redirects to the dashboard.
      setLoginSucceeded(true);
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
      {justRegistered && (
        <Alert variant="success">Account created. Please log in.</Alert>
      )}
      {formError && <Alert variant="error">{formError}</Alert>}
      {loginSucceeded && (
        <Alert variant="success">
          Login successful. Session handling comes next.
        </Alert>
      )}

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
