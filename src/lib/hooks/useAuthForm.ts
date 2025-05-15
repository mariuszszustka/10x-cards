import { useState } from "react";

interface AuthFormState {
  email: string;
  password: string;
  confirmPassword?: string;
  acceptTerms?: boolean;
  [key: string]: string | boolean | undefined;
}

interface AuthFormOptions {
  initialState: AuthFormState;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  endpoint: string;
  redirect?: string;
}

export function useAuthForm({ initialState, onSuccess, onError, endpoint, redirect }: AuthFormOptions) {
  const [formData, setFormData] = useState<AuthFormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Aktualizuje dane formularza i usuwa błędy dla aktualizowanego pola
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Walidacja adresu email
  const validateEmail = (email: string) => {
    if (!email) {
      return "Email jest wymagany";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      return "Nieprawidłowy format adresu email";
    }
    return "";
  };

  // Walidacja hasła
  const validatePassword = (password: string, isRegistration = false) => {
    if (!password) {
      return "Hasło jest wymagane";
    }

    if (isRegistration) {
      if (password.length < 8) {
        return "Hasło musi mieć minimum 8 znaków";
      } else if (!/[A-Z]/.test(password)) {
        return "Hasło musi zawierać co najmniej jedną wielką literę";
      } else if (!/[0-9]/.test(password)) {
        return "Hasło musi zawierać co najmniej jedną cyfrę";
      } else if (!/[^a-zA-Z0-9]/.test(password)) {
        return "Hasło musi zawierać co najmniej jeden znak specjalny";
      }
    }

    return "";
  };

  // Walidacja potwierdzenia hasła
  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      return "Hasła nie są zgodne";
    }
    return "";
  };

  // Walidacja akceptacji warunków
  const validateTerms = (acceptTerms?: boolean) => {
    if (acceptTerms === false) {
      return "Musisz zaakceptować warunki użytkowania";
    }
    return "";
  };

  // Walidacja formularza
  const validateForm = (isRegistration = false) => {
    const newErrors: Record<string, string> = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password, isRegistration);
    if (passwordError) newErrors.password = passwordError;

    if (formData.confirmPassword !== undefined) {
      const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
      if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    }

    if (formData.acceptTerms !== undefined) {
      const termsError = validateTerms(formData.acceptTerms);
      if (termsError) newErrors.acceptTerms = termsError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Wysłanie formularza
  const submitForm = async (e: React.FormEvent, isRegistration = false) => {
    e.preventDefault();

    if (!validateForm(isRegistration)) {
      return;
    }

    setIsLoading(true);
    setDebugInfo(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      setDebugInfo({
        status: response.status,
        data: data,
      });

      if (!response.ok) {
        throw new Error(data.error || "Wystąpił błąd podczas przetwarzania żądania");
      }

      setStatus("success");

      if (data.success && data.session) {
        localStorage.setItem("authSession", JSON.stringify(data.session));

        if (data.session.expires_at) {
          localStorage.setItem("sessionExpiresAt", data.session.expires_at.toString());
        }

        localStorage.setItem("userId", data.session.user_id);
        localStorage.setItem("userEmail", data.session.email || "");
      }

      if (redirect) {
        window.location.href = redirect;
      }

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      console.error("Błąd:", error);
      setStatus("error");
      setErrors({
        form: error instanceof Error ? error.message : "Wystąpił nieznany błąd",
      });

      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Wysłanie magicznego linka
  const sendMagicLink = async () => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({
        email: "Podaj prawidłowy adres email, aby otrzymać link do logowania",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Nie udało się wysłać linku do logowania");
      }

      setStatus("success");

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      console.error("Błąd wysyłania magicznego linku:", error);
      setStatus("error");
      setErrors({
        form: error instanceof Error ? error.message : "Wystąpił nieznany błąd podczas wysyłania linku",
      });

      if (onError && error instanceof Error) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Reset formularza
  const resetForm = () => {
    setFormData(initialState);
    setErrors({});
    setStatus("idle");
    setDebugInfo(null);
  };

  return {
    formData,
    errors,
    isLoading,
    status,
    debugInfo,
    handleChange,
    validateForm,
    submitForm,
    sendMagicLink,
    resetForm,
    setFormData,
    setErrors,
    setStatus,
  };
}
