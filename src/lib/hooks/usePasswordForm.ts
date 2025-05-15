import { useState, useCallback } from "react";

interface PasswordValidationOptions {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecial?: boolean;
  currentPassword?: string;
}

export function usePasswordValidation(options: PasswordValidationOptions = {}) {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecial = true,
    currentPassword,
  } = options;

  // Funkcja weryfikująca siłę hasła
  const validatePasswordStrength = useCallback(
    (password: string): string => {
      if (!password) {
        return "Hasło jest wymagane";
      }

      if (password.length < minLength) {
        return `Hasło musi mieć minimum ${minLength} znaków`;
      }

      if (requireUppercase && !/[A-Z]/.test(password)) {
        return "Hasło musi zawierać co najmniej jedną wielką literę";
      }

      if (requireLowercase && !/[a-z]/.test(password)) {
        return "Hasło musi zawierać co najmniej jedną małą literę";
      }

      if (requireNumbers && !/[0-9]/.test(password)) {
        return "Hasło musi zawierać co najmniej jedną cyfrę";
      }

      if (requireSpecial && !/[^a-zA-Z0-9]/.test(password)) {
        return "Hasło musi zawierać co najmniej jeden znak specjalny";
      }

      return "";
    },
    [minLength, requireUppercase, requireLowercase, requireNumbers, requireSpecial]
  );

  // Funkcja porównująca dwa hasła
  const validatePasswordMatch = useCallback((password: string, confirmPassword: string): string => {
    if (!confirmPassword) {
      return "Potwierdzenie hasła jest wymagane";
    }

    if (password !== confirmPassword) {
      return "Hasła nie są zgodne";
    }

    return "";
  }, []);

  // Funkcja sprawdzająca, czy nowe hasło nie jest takie samo jak obecne
  const validateNewPassword = useCallback(
    (newPassword: string): string => {
      if (currentPassword && newPassword === currentPassword) {
        return "Nowe hasło nie może być takie samo jak obecne";
      }

      return "";
    },
    [currentPassword]
  );

  return {
    validatePasswordStrength,
    validatePasswordMatch,
    validateNewPassword,
  };
}

interface PasswordFormData {
  password: string;
  confirmPassword: string;
  currentPassword?: string;
  [key: string]: string | undefined;
}

interface PasswordFormOptions {
  initialValues?: PasswordFormData;
  onSubmit: (data: PasswordFormData) => void;
  onSuccess?: () => void;
  token?: string;
  validateCurrentPassword?: boolean;
  validationOptions?: PasswordValidationOptions;
}

export function usePasswordForm({
  initialValues = { password: "", confirmPassword: "", currentPassword: "" },
  onSubmit,
  onSuccess,
  token,
  validateCurrentPassword = false,
  validationOptions = {},
}: PasswordFormOptions) {
  const [formData, setFormData] = useState<PasswordFormData>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(token ? "" : "Brak tokenu resetowania hasła");

  const { validatePasswordStrength, validatePasswordMatch, validateNewPassword } =
    usePasswordValidation(validationOptions);

  // Obsługa zmiany pól formularza
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [errors]
  );

  // Walidacja formularza
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    // Walidacja bieżącego hasła jeśli wymagane
    if (validateCurrentPassword && !formData.currentPassword) {
      newErrors.currentPassword = "Obecne hasło jest wymagane";
    }

    // Walidacja siły nowego hasła
    const passwordError = validatePasswordStrength(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // Sprawdzenie, czy nowe hasło nie jest takie samo jak obecne
    if (formData.currentPassword) {
      const newPasswordError = validateNewPassword(formData.password);
      if (newPasswordError) {
        newErrors.password = newPasswordError;
      }
    }

    // Walidacja zgodności haseł
    const confirmError = validatePasswordMatch(formData.password, formData.confirmPassword);
    if (confirmError) {
      newErrors.confirmPassword = confirmError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validatePasswordStrength, validatePasswordMatch, validateNewPassword, validateCurrentPassword]);

  // Obsługa wysłania formularza
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm() || (!token && validateCurrentPassword === false)) {
        return;
      }

      setIsLoading(true);

      try {
        await onSubmit(formData);
        setIsSuccess(true);

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error("Błąd aktualizacji hasła:", error);
        setErrors({
          form: error instanceof Error ? error.message : "Wystąpił błąd podczas aktualizacji hasła",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [formData, validateForm, token, validateCurrentPassword, onSubmit, onSuccess]
  );

  return {
    formData,
    errors,
    isLoading,
    isSuccess,
    tokenError,
    handleChange,
    handleSubmit,
    setErrors,
    setTokenError,
  };
}
