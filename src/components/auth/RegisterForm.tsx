import { useState } from "react";
import { Button } from "../ui/button";
import { useAuthForm } from "@/lib/hooks/useAuthForm";
import { InputField, CheckboxField, FormError, SuccessMessage } from "./FormElements";

export default function RegisterForm() {
  const { formData, errors, isLoading, status, handleChange, submitForm } = useAuthForm({
    initialState: {
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    endpoint: "/api/auth/register",
    redirect: "/dashboard",
  });

  const handleSubmit = (e: React.FormEvent) => {
    submitForm(e, true); // true oznacza tryb rejestracji (dodatkowa walidacja)
  };

  if (status === "success") {
    return (
      <SuccessMessage
        title="Rejestracja zakończona pomyślnie!"
        message="Zostaniesz przekierowany do panelu głównego..."
        actionLink={{
          text: "Przejdź do panelu",
          href: "/dashboard",
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <InputField
          id="email"
          name="email"
          type="email"
          label="Adres email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="twoj@email.com"
          required
          autoComplete="email"
          testId="auth-email-input"
        />

        <div>
          <InputField
            id="password"
            name="password"
            type="password"
            label="Hasło"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
            required
            autoComplete="new-password"
            testId="auth-password-input"
          />
          <p className="mt-1 text-xs text-blue-100/70">Minimum 8 znaków, 1 wielka litera, 1 cyfra, 1 znak specjalny</p>
        </div>

        <InputField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Potwierdź hasło"
          value={formData.confirmPassword as string}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="••••••••"
          required
          autoComplete="new-password"
          testId="auth-confirm-password-input"
        />

        <CheckboxField
          id="acceptTerms"
          name="acceptTerms"
          label={
            <>
              Akceptuję{" "}
              <a href="/terms" className="text-blue-300 hover:text-blue-200">
                warunki użytkowania
              </a>{" "}
              oraz{" "}
              <a href="/privacy" className="text-blue-300 hover:text-blue-200">
                politykę prywatności
              </a>
            </>
          }
          checked={formData.acceptTerms as boolean}
          onChange={handleChange}
          error={errors.acceptTerms}
          testId="auth-terms-checkbox"
        />
      </div>

      <FormError error={errors.form} />

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-md"
        disabled={isLoading}
        data-testid="auth-submit-button"
      >
        {isLoading ? "Tworzenie konta..." : "Zarejestruj się"}
      </Button>
    </form>
  );
}
