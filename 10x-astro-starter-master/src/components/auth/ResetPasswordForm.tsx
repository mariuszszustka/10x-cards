import { useState } from "react";
import { Button } from "../ui/button";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetLink, setResetLink] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({});
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = "Email jest wymagany";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Nieprawidłowy format adresu email";
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
      // Tutaj będzie implementacja logiki resetowania hasła
      console.log("Żądanie resetowania hasła dla:", email);
      
      // Symulacja opóźnienia - do usunięcia przy implementacji backendu
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Zgodnie z PRD, w wersji MVP link będzie pokazywany bezpośrednio w interfejsie
      // zamiast wysyłania emaila
      setResetLink(`/auth/update-password?token=example-token-for-${email}`);
      setIsSuccess(true);
      
    } catch (error) {
      console.error("Błąd resetowania hasła:", error);
      setErrors({ form: "Wystąpił błąd podczas wysyłania linku resetującego" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-md">
          <p className="text-sm text-green-300 mb-2">
            Instrukcje resetowania hasła zostały wysłane na adres email: <span className="font-semibold">{email}</span>
          </p>
          <p className="text-xs text-blue-100/70">
            Uwaga: W wersji MVP link resetujący jest wyświetlany bezpośrednio:
          </p>
          <a 
            href={resetLink}
            className="block mt-2 text-sm font-medium text-blue-300 hover:text-blue-200 break-all"
          >
            {resetLink}
          </a>
        </div>
        <Button
          type="button"
          onClick={() => {
            setIsSuccess(false);
            setEmail("");
            setResetLink("");
          }}
          className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-md"
        >
          Wyślij ponownie
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          value={email}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
          placeholder="twoj@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-300">{errors.email}</p>
        )}
        <p className="mt-2 text-sm text-blue-100/70">
          Wyślemy Ci link do zresetowania hasła na podany adres email.
        </p>
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
      >
        {isLoading ? "Wysyłanie..." : "Wyślij link resetujący"}
      </Button>
    </form>
  );
} 