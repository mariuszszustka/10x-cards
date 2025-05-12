import { useState } from "react";
import { Button } from "../ui/button";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    
    // Usuwanie błędu po rozpoczęciu edycji pola
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = "Email jest wymagany";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Nieprawidłowy format adresu email";
    }
    
    if (!formData.password) {
      newErrors.password = "Hasło jest wymagane";
    } else if (formData.password.length < 8) {
      newErrors.password = "Hasło musi mieć minimum 8 znaków";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Hasło musi zawierać co najmniej jedną wielką literę";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Hasło musi zawierać co najmniej jedną cyfrę";
    } else if (!/[^a-zA-Z0-9]/.test(formData.password)) {
      newErrors.password = "Hasło musi zawierać co najmniej jeden znak specjalny";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Hasła nie są zgodne";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Musisz zaakceptować warunki użytkowania";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Wywołanie endpointu API rejestracji
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        }),
        redirect: 'follow',
      });
      
      if (response.redirected) {
        // Jeśli serwer przekierował, podążamy za przekierowaniem
        window.location.href = response.url;
        return;
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        // Błąd rejestracji
        throw new Error(data.error || 'Wystąpił błąd podczas rejestracji');
      }
      
      // Jeśli nie było przekierowania, to pokazujemy sukces
      setRegistrationSuccess(true);
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false
      });
      
    } catch (error) {
      console.error("Błąd rejestracji:", error);
      setErrors({ 
        form: error instanceof Error ? error.message : "Wystąpił nieznany błąd podczas rejestracji" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-md text-center">
        <h3 className="text-xl font-semibold mb-2">Rejestracja zakończona pomyślnie!</h3>
        <p className="mb-4">Zostaniesz przekierowany do panelu głównego...</p>
        <a href="/dashboard" className="text-blue-400 hover:text-blue-300 font-medium">
          Przejdź do panelu
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-blue-100 mb-1"
          >
            Adres email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
            placeholder="twoj@email.com"
            data-testid="auth-email-input"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-300">{errors.email}</p>
          )}
        </div>

        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-blue-100 mb-1"
          >
            Hasło
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
            data-testid="auth-password-input"
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
            Potwierdź hasło
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
            data-testid="auth-confirm-password-input"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-300">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="w-4 h-4 bg-blue-800 border-blue-600 rounded focus:ring-blue-500"
              data-testid="auth-terms-checkbox"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="acceptTerms" className="text-blue-100">
              Akceptuję <a href="/terms" className="text-blue-300 hover:text-blue-200">warunki użytkowania</a> oraz <a href="/privacy" className="text-blue-300 hover:text-blue-200">politykę prywatności</a>
            </label>
            {errors.acceptTerms && (
              <p className="mt-1 text-sm text-red-300">{errors.acceptTerms}</p>
            )}
          </div>
        </div>
      </div>

      {errors.form && (
        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-md">
          <p className="text-sm text-red-300">{errors.form}</p>
        </div>
      )}

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