import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "../components/Alert";
import { Card } from "../components/Card";
import { FormField } from "../components/FormField";
import { registerRequest } from "../services/auth.service";
import { parseApiError } from "../utils/api-error";
import { type FieldErrors, zodToFieldErrors } from "../utils/form-errors";
import { registerSchema } from "../validators/auth.schema";

export function RegisterPage() {
  const navigate = useNavigate();

  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof typeof values) => (value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const result = registerSchema.safeParse(values);
    if (!result.success) {
      setFieldErrors(zodToFieldErrors(result.error));
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await registerRequest(result.data);
      navigate("/login", { state: { registered: true } });
    } catch (error) {
      const parsed = parseApiError(error);
      setFormError(parsed.message);
      setFieldErrors(parsed.fieldErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title="Register">
      {formError && <Alert variant="error">{formError}</Alert>}

      <form onSubmit={handleSubmit} noValidate>
        <FormField
          id="name"
          label="Name"
          autoComplete="name"
          value={values.name}
          onChange={updateField("name")}
          error={fieldErrors.name}
          disabled={isSubmitting}
        />
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
          autoComplete="new-password"
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
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 underline">
          Log in
        </Link>
      </p>
    </Card>
  );
}
