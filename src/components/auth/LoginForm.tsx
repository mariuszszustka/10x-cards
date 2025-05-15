import { useState } from "react";
import { Button } from "../ui/button";
import { useAuthForm } from "@/lib/hooks/useAuthForm";
import { InputField, FormError, DebugInfo, SuccessMessage } from "./FormElements";

export default function LoginForm() {
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const { formData, errors, isLoading, debugInfo, handleChange, submitForm, sendMagicLink } = useAuthForm({
    initialState: {
      email: "",
      password: "",
    },
    endpoint: "/api/auth/login",
    redirect: "/dashboard",
  });

  const handleSubmit = (e: React.FormEvent) => {
    submitForm(e);
  };

  const handleSendMagicLink = async () => {
    await sendMagicLink();
    setMagicLinkSent(true);
  };

  if (magicLinkSent) {
    return (
      <SuccessMessage
        title="Sprawdź swoją skrzynkę odbiorczą"
        message="Wysłaliśmy link do logowania na podany adres email. Kliknij w link, aby się zalogować."
        onBackClick={() => setMagicLinkSent(false)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="auth-login-form">
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
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-1">
              Hasło
            </label>
            <a
              href="/auth/reset-password"
              className="text-sm text-blue-300 hover:text-blue-200"
              data-testid="auth-forgot-password-link"
            >
              Zapomniałem hasła
            </a>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            placeholder="••••••••"
            data-testid="auth-password-input"
            style={{ caretColor: "transparent" }}
          />
          {errors.password && <p className="mt-1 text-sm text-red-300">{errors.password}</p>}
        </div>
      </div>

      <FormError error={errors.form} />
      <DebugInfo info={debugInfo} />

      <div className="flex flex-col gap-3">
        <Button type="submit" className="w-full py-2" disabled={isLoading} data-testid="auth-submit-button">
          {isLoading ? "Logowanie..." : "Zaloguj się"}
        </Button>

        <button
          type="button"
          onClick={handleSendMagicLink}
          className="text-sm text-blue-300 hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 py-1"
          disabled={isLoading}
          data-testid="auth-magic-link-button"
        >
          Zaloguj się linkiem magicznym
        </button>
      </div>
    </form>
  );
}
