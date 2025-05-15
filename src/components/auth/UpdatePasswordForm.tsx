import { Button } from "../ui/button";
import { usePasswordForm } from "@/lib/hooks/usePasswordForm";
import { FormError } from "./FormElements";

interface UpdatePasswordFormProps {
  token?: string;
}

export default function UpdatePasswordForm({ token }: UpdatePasswordFormProps) {
  const {
    formData,
    errors,
    isLoading,
    isSuccess,
    tokenError,
    handleChange,
    handleSubmit
  } = usePasswordForm({
    token,
    onSubmit: async (data) => {
      console.log("Aktualizacja hasła z użyciem tokenu:", token);
      // Symulacja opóźnienia - do usunięcia przy implementacji backendu
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    }
  });

  if (tokenError) {
    return (
      <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-md">
        <p className="text-sm text-red-300">{tokenError}</p>
        <a 
          href="/auth/reset-password" 
          className="block mt-4 text-sm font-medium text-blue-300 hover:text-blue-200"
        >
          Wróć do formularza resetowania hasła
        </a>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-md">
          <p className="text-sm text-green-300">
            Hasło zostało pomyślnie zaktualizowane.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => {
            window.location.href = "/auth/login";
          }}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-md"
        >
          Przejdź do logowania
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-blue-100 mb-1"
          >
            Nowe hasło
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-300">{errors.password}</p>
          )}
          <p className="mt-1 text-xs text-blue-100/70">
            Minimum 8 znaków, 1 wielka litera, 1 cyfra, 1 znak specjalny
          </p>
        </div>

        <div>
          <label 
            htmlFor="confirmPassword" 
            className="block text-sm font-medium text-blue-100 mb-1"
          >
            Potwierdź nowe hasło
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-300">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      <FormError error={errors.form} />

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-md"
        disabled={isLoading}
      >
        {isLoading ? "Aktualizowanie..." : "Ustaw nowe hasło"}
      </Button>
    </form>
  );
} 