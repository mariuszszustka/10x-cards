import { useState } from "react";
import { Button } from "../ui/button";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
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
    setDebugInfo(null);
    
    try {
      console.log("Próba logowania dla:", formData.email);
      
      // Wywołanie endpointu API logowania
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // Ważne dla otrzymania cookies sesji
      });
      
      console.log("Odpowiedź statusu:", response.status, response.type);
      
      // Odczytaj dane JSON z odpowiedzi
      const data = await response.json();
      
      // Rejestracja informacji dla debugowania
      setDebugInfo({
        status: response.status,
        type: response.type,
        data: data
      });
      
      // Jeśli logowanie się powiodło, zapisz sesję w localStorage
      if (data.success && data.session) {
        console.log("Zapisuję sesję w localStorage");
        
        // Zapisz sesję w localStorage
        localStorage.setItem('authSession', JSON.stringify(data.session));
        
        // Zapisz czas wygaśnięcia sesji
        if (data.session.expires_at) {
          localStorage.setItem('sessionExpiresAt', data.session.expires_at.toString());
        }
        
        // Zapisz podstawowe dane użytkownika
        localStorage.setItem('userId', data.session.user_id);
        localStorage.setItem('userEmail', data.session.email || '');
        
        // Spróbuj odczytać dane z ciasteczka session (jako weryfikacja)
        const sessionCookie = document.cookie
          .split(';')
          .find(cookie => cookie.trim().startsWith('session='));
        
        if (sessionCookie) {
          console.log("Znaleziono ciasteczko session - autoryzacja powinna być kompletna");
        } else {
          console.log("Nie znaleziono ciasteczka session - może być potrzebny dodatkowy plan odzyskiwania sesji");
        }
        
        // Przekieruj do dashboardu zamiast strony diagnostycznej
        window.location.href = '/dashboard';
        return;
      }
      
      if (!response.ok) {
        // Błąd logowania
        throw new Error(data.error || 'Wystąpił błąd podczas logowania');
      }

      // Sprawdź, czy został wysłany magic link
      if (data.message && data.message.includes("link do logowania")) {
        setMagicLinkSent(true);
        setErrors({});
        return;
      }
      
      // Na wszelki wypadek, gdyby nie było przekierowania
      console.log("Logowanie udane, przechodzę do strony diagnostycznej");
      window.location.href = '/auth/debug';
      
    } catch (error) {
      console.error("Błąd logowania:", error);
      setErrors({ 
        form: error instanceof Error ? error.message : "Wystąpił nieznany błąd podczas logowania" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMagicLink = async () => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({
        email: "Podaj prawidłowy adres email, aby otrzymać link do logowania"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Nie udało się wysłać linku do logowania');
      }

      setMagicLinkSent(true);
    } catch (error) {
      console.error("Błąd wysyłania magicznego linku:", error);
      setErrors({ 
        form: error instanceof Error ? error.message : "Wystąpił nieznany błąd podczas wysyłania linku" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (magicLinkSent) {
    return (
      <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-md text-center">
        <h3 className="text-xl font-semibold mb-2">Sprawdź swoją skrzynkę odbiorczą</h3>
        <p className="mb-4">
          Wysłaliśmy link do logowania na podany adres email. Kliknij w link, aby się zalogować.
        </p>
        <button 
          onClick={() => setMagicLinkSent(false)}
          className="text-blue-400 hover:text-blue-300 font-medium"
        >
          Powrót do formularza logowania
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="auth-login-form">
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
            style={{ caretColor: "transparent" }}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-300">{errors.email}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-blue-100 mb-1"
            >
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
          {errors.password && (
            <p className="mt-1 text-sm text-red-300">{errors.password}</p>
          )}
        </div>
      </div>

      {errors.form && (
        <div className="bg-red-500/20 border border-red-500/30 p-3 rounded-md">
          <p className="text-sm text-red-300">{errors.form}</p>
        </div>
      )}

      {debugInfo && (
        <div className="bg-gray-500/20 border border-gray-500/30 p-3 rounded-md text-xs">
          <p>Status: {debugInfo.status}</p>
          <p>Typ: {debugInfo.type}</p>
          <pre>{JSON.stringify(debugInfo.data, null, 2)}</pre>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          className="w-full py-2"
          disabled={isLoading}
          data-testid="auth-submit-button"
        >
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