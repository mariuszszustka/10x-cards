# Plan implementacji widoku autoryzacji

## 1. Przegląd

Widok autoryzacji umożliwia użytkownikom rejestrację oraz logowanie do aplikacji 10x-cards. Dzięki niemu użytkownicy uzyskują dostęp do swoich spersonalizowanych zestawów fiszek i funkcji generowania fiszek przez AI. Widok składa się z przełączanych zakładek logowania i rejestracji, które zawierają odpowiednie formularze z walidacją.

## 2. Routing widoku

Widok dostępny jest pod ścieżką: `/auth`.

## 3. Struktura komponentów

```
AuthPageContainer
├── TabSelector
├── LoginForm (warunkowy)
│   ├── FormInput (email)
│   ├── FormInput (hasło)
│   ├── ErrorMessage
│   ├── Button
│   └── LoadingIndicator
└── RegisterForm (warunkowy)
    ├── FormInput (email)
    ├── FormInput (hasło)
    ├── ErrorMessage
    ├── Button
    └── LoadingIndicator
```

## 4. Szczegóły komponentów

### AuthPageContainer

- Opis komponentu: Główny kontener widoku autoryzacji, odpowiedzialny za przełączanie między formularzami logowania i rejestracji.
- Główne elementy: Kontener z logo aplikacji, TabSelector, LoginForm lub RegisterForm (w zależności od wybranej zakładki).
- Obsługiwane interakcje: Przełączanie zakładek.
- Obsługiwana walidacja: Brak.
- Typy: AuthTab
- Propsy: Brak.

### TabSelector

- Opis komponentu: Umożliwia przełączanie między zakładkami logowania i rejestracji.
- Główne elementy: Dwa przyciski zakładek z odpowiednimi etykietami.
- Obsługiwane interakcje: Kliknięcie zakładki.
- Obsługiwana walidacja: Brak.
- Typy: AuthTab
- Propsy:
  - currentTab: AuthTab
  - onTabChange: (tab: AuthTab) => void

### LoginForm

- Opis komponentu: Formularz logowania użytkownika do aplikacji.
- Główne elementy: Pola formularza email i hasło, przycisk logowania, komunikat błędu, wskaźnik ładowania.
- Obsługiwane interakcje: Wprowadzanie danych, wysyłanie formularza.
- Obsługiwana walidacja:
  - Email: format poprawnego adresu email
  - Hasło: niepuste pole
  - Walidacja odpowiedzi z API (401 - nieprawidłowe dane logowania)
- Typy: LoginFormData, LoginResponseDTO, ApiError
- Propsy: Brak.

### RegisterForm

- Opis komponentu: Formularz rejestracji nowego użytkownika.
- Główne elementy: Pola formularza email i hasło, przycisk rejestracji, komunikat błędu, wskaźnik ładowania.
- Obsługiwane interakcje: Wprowadzanie danych, wysyłanie formularza.
- Obsługiwana walidacja:
  - Email: format poprawnego adresu email
  - Hasło:
    - Minimum 8 znaków
    - Przynajmniej jedna wielka litera
    - Przynajmniej jedna cyfra
    - Przynajmniej jeden znak specjalny
  - Walidacja odpowiedzi z API (409 - adres email już istnieje)
- Typy: RegisterFormData, RegisterResponseDTO, ApiError
- Propsy: Brak.

### FormInput

- Opis komponentu: Komponent pola formularza z etykietą i obsługą błędów.
- Główne elementy: Etykieta, pole input, komunikat błędu.
- Obsługiwane interakcje: Wprowadzanie danych, focus, blur.
- Obsługiwana walidacja: Zgodnie z przekazanymi regułami walidacji.
- Typy: FormInputProps
- Propsy:
  - id: string
  - type: 'text' | 'email' | 'password'
  - label: string
  - value: string
  - onChange: (value: string) => void
  - error?: string
  - required?: boolean
  - validateFn?: (value: string) => string | null

### Button

- Opis komponentu: Przycisk do wykonywania akcji, np. logowania czy rejestracji.
- Główne elementy: Przycisk z etykietą, opcjonalny wskaźnik ładowania.
- Obsługiwane interakcje: Kliknięcie.
- Obsługiwana walidacja: Brak.
- Typy: ButtonProps
- Propsy:
  - type: 'button' | 'submit'
  - disabled?: boolean
  - isLoading?: boolean
  - onClick?: () => void
  - children: React.ReactNode

### ErrorMessage

- Opis komponentu: Wyświetla komunikaty o błędach w formularzu lub z API.
- Główne elementy: Tekst błędu.
- Obsługiwane interakcje: Brak.
- Obsługiwana walidacja: Brak.
- Typy: ErrorMessageProps
- Propsy:
  - message: string

### LoadingIndicator

- Opis komponentu: Wskaźnik ładowania wyświetlany podczas przetwarzania żądań.
- Główne elementy: Animowany wskaźnik.
- Obsługiwane interakcje: Brak.
- Obsługiwana walidacja: Brak.
- Typy: LoadingIndicatorProps
- Propsy:
  - size?: 'small' | 'medium' | 'large'

## 5. Typy

```typescript
// Enum definiujący dostępne zakładki
enum AuthTab {
  LOGIN = "login",
  REGISTER = "register",
}

// Dane formularza logowania
interface LoginFormData {
  email: string;
  password: string;
}

// Dane formularza rejestracji
interface RegisterFormData {
  email: string;
  password: string;
}

// DTO odpowiedzi z API dla logowania
interface LoginResponseDTO {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

// DTO odpowiedzi z API dla rejestracji
interface RegisterResponseDTO {
  id: string;
  email: string;
  created_at: string;
}

// Struktura błędu z API
interface ApiError {
  status: number;
  message: string;
}

// Właściwości komponentu FormInput
interface FormInputProps {
  id: string;
  type: "text" | "email" | "password";
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  validateFn?: (value: string) => string | null;
}

// Właściwości komponentu Button
interface ButtonProps {
  type: "button" | "submit";
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// Właściwości komponentu ErrorMessage
interface ErrorMessageProps {
  message: string;
}

// Właściwości komponentu LoadingIndicator
interface LoadingIndicatorProps {
  size?: "small" | "medium" | "large";
}
```

## 6. Zarządzanie stanem

Widok autoryzacji wykorzystuje dwa customowe hooki do zarządzania stanem:

### useAuthForm

Hook zarządzający stanem formularza, walidacją i obsługą błędów:

```typescript
function useAuthForm<T extends LoginFormData | RegisterFormData>(
  initialValues: T,
  submitFn: (data: T) => Promise<void>,
  validateFn: (data: T) => Record<keyof T, string | null>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string | null>>({} as Record<keyof T, string | null>);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Metoda aktualizująca wartość pola
  const handleChange = (field: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Walidacja podczas wpisywania
    const fieldError = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  };

  // Walidacja pojedynczego pola
  const validateField = (field: keyof T, value: string) => {
    const validationResult = validateFn({ ...values, [field]: value } as T);
    return validationResult[field];
  };

  // Walidacja całego formularza
  const validate = () => {
    const validationResult = validateFn(values);
    setErrors(validationResult);
    return !Object.values(validationResult).some(Boolean);
  };

  // Obsługa wysyłania formularza
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Walidacja przed wysłaniem
    if (!validate()) return;

    setIsLoading(true);
    setApiError(null);

    try {
      await submitFn(values);
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError("Wystąpił nieznany błąd");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Resetowanie formularza
  const resetForm = () => {
    setValues(initialValues);
    setErrors({} as Record<keyof T, string | null>);
    setApiError(null);
  };

  return {
    values,
    errors,
    isLoading,
    apiError,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
```

### useAuthState

Hook zarządzający globalnym stanem autoryzacji:

```typescript
function useAuthState() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Logowanie użytkownika
  const login = async (credentials: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          response.status === 401 ? "Nieprawidłowy email lub hasło" : errorData.message || "Błąd logowania"
        );
      }

      const data: LoginResponseDTO = await response.json();

      // Zapisanie tokenu i danych użytkownika
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setCurrentUser(data.user);

      // Przekierowanie do strony głównej
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Wystąpił nieznany błąd");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Rejestracja użytkownika
  const register = async (userData: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          response.status === 409 ? "Konto z tym adresem email już istnieje" : errorData.message || "Błąd rejestracji"
        );
      }

      // Po rejestracji automatycznie logujemy użytkownika
      await login(userData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Wystąpił nieznany błąd");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Wylogowanie użytkownika
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setCurrentUser(null);
    navigate("/auth");
  };

  // Inicjalizacja stanu z localStorage przy montowaniu komponentu
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      // Tutaj można dodać weryfikację tokenu i pobranie danych użytkownika
    }
  }, []);

  return {
    currentUser,
    token,
    isAuthenticated: !!token,
    isLoading,
    error,
    login,
    register,
    logout,
  };
}
```

## 7. Integracja API

Widok autoryzacji integruje się z dwoma endpointami API:

### Endpoint rejestracji

- Metoda: POST
- Ścieżka: /api/auth/register
- Ciało żądania:
  ```typescript
  {
    email: string;
    password: string;
  }
  ```
- Odpowiedź sukcesu (201 Created):
  ```typescript
  {
    id: string;
    email: string;
    created_at: string;
  }
  ```
- Możliwe błędy:
  - 400 Bad Request (Nieprawidłowe dane wejściowe)
  - 409 Conflict (Email już istnieje)

### Endpoint logowania

- Metoda: POST
- Ścieżka: /api/auth/login
- Ciało żądania:
  ```typescript
  {
    email: string;
    password: string;
  }
  ```
- Odpowiedź sukcesu (200 OK):
  ```typescript
  {
    token: string;
    user: {
      id: string;
      email: string;
    }
  }
  ```
- Możliwe błędy:
  - 400 Bad Request (Nieprawidłowe dane wejściowe)
  - 401 Unauthorized (Nieprawidłowe dane logowania)

Integracja realizowana jest poprzez hook useAuthState, który wykonuje żądania do API i zarządza otrzymanymi odpowiedziami.

## 8. Interakcje użytkownika

### Przełączanie zakładek

1. Użytkownik klika zakładkę "Logowanie" lub "Rejestracja".
2. System wyświetla odpowiedni formularz, zachowując wcześniej wprowadzone dane.

### Logowanie

1. Użytkownik wprowadza adres email i hasło.
2. Użytkownik klika przycisk "Zaloguj się".
3. System waliduje wprowadzone dane:
   - Jeśli dane są niepoprawne, wyświetla komunikaty walidacyjne.
   - Jeśli dane są poprawne, wysyła żądanie do API i wyświetla wskaźnik ładowania.
4. Po otrzymaniu odpowiedzi z API:
   - W przypadku sukcesu, zapisuje token i dane użytkownika, a następnie przekierowuje do głównego widoku aplikacji.
   - W przypadku błędu, wyświetla odpowiedni komunikat.

### Rejestracja

1. Użytkownik wprowadza adres email i hasło.
2. Użytkownik klika przycisk "Zarejestruj się".
3. System waliduje wprowadzone dane:
   - Jeśli dane są niepoprawne, wyświetla komunikaty walidacyjne.
   - Jeśli dane są poprawne, wysyła żądanie do API i wyświetla wskaźnik ładowania.
4. Po otrzymaniu odpowiedzi z API:
   - W przypadku sukcesu, automatycznie loguje użytkownika i przekierowuje do głównego widoku aplikacji.
   - W przypadku błędu (np. email już istnieje), wyświetla odpowiedni komunikat.

## 9. Warunki i walidacja

### Walidacja adresu email

- Format: poprawny adres email (example@domain.com)
- Komponent: FormInput (email)
- Wpływ na interfejs:
  - Błędny format powoduje wyświetlenie komunikatu błędu
  - Przycisk logowania/rejestracji jest nieaktywny, dopóki email nie jest poprawny

### Walidacja hasła podczas logowania

- Warunek: pole nie może być puste
- Komponent: FormInput (password)
- Wpływ na interfejs:
  - Brak hasła powoduje wyświetlenie komunikatu błędu
  - Przycisk logowania jest nieaktywny, dopóki hasło nie jest wprowadzone

### Walidacja hasła podczas rejestracji

- Warunki:
  - Minimum 8 znaków
  - Przynajmniej jedna wielka litera
  - Przynajmniej jedna cyfra
  - Przynajmniej jeden znak specjalny
- Komponent: FormInput (password)
- Wpływ na interfejs:
  - Niespełnienie któregokolwiek warunku powoduje wyświetlenie odpowiedniego komunikatu
  - Przycisk rejestracji jest nieaktywny, dopóki wszystkie warunki nie są spełnione
  - Wskaźnik siły hasła zmienia kolor w zależności od spełnionych warunków

### Walidacja podczas wysyłania formularza

- Wszystkie pola muszą być poprawnie wypełnione
- Komponenty: LoginForm, RegisterForm
- Wpływ na interfejs:
  - Próba wysłania formularza z błędnymi danymi powoduje wyświetlenie wszystkich komunikatów błędów
  - Podczas przetwarzania żądania wyświetlany jest wskaźnik ładowania, a formularz jest nieaktywny

## 10. Obsługa błędów

### Błędy walidacji formularza

- Każde pole ma własny komunikat błędu wyświetlany pod polem
- Błędy są wyświetlane na bieżąco podczas wprowadzania danych
- Komunikaty są jasne i instruktażowe

### Błędy API

1. Nieprawidłowe dane logowania (401)

   - Komunikat: "Nieprawidłowy email lub hasło"
   - Obsługa: wyświetlenie komunikatu pod formularzem

2. Email już istnieje podczas rejestracji (409)

   - Komunikat: "Konto z tym adresem email już istnieje"
   - Obsługa: wyświetlenie komunikatu pod formularzem

3. Błędy serwera (5xx)

   - Komunikat: "Wystąpił problem z serwerem, spróbuj ponownie później"
   - Obsługa: wyświetlenie komunikatu pod formularzem

4. Brak połączenia
   - Komunikat: "Brak połączenia z serwerem, sprawdź swoje połączenie internetowe"
   - Obsługa: wyświetlenie komunikatu pod formularzem

### Zabezpieczenie przed atakami brute force

- Po 5 nieudanych próbach logowania system wprowadza opóźnienie między kolejnymi próbami
- Komunikat: "Zbyt wiele nieudanych prób logowania, spróbuj ponownie za X sekund"

## 11. Kroki implementacji

1. Utworzenie szkieletu widoku:

   - Utwórz plik `/src/pages/auth.astro` zawierający podstawową strukturę strony
   - Zdefiniuj podstawowe typy w osobnym pliku `/src/types/auth.ts`

2. Implementacja komponentów pomocniczych:

   - Zaimplementuj komponenty FormInput, Button, ErrorMessage i LoadingIndicator
   - Umieść je w folderze `/src/components/ui/`

3. Implementacja hooków zarządzania stanem:

   - Utwórz hook useAuthForm do zarządzania stanem formularzy
   - Utwórz hook useAuthState do zarządzania globalnym stanem autoryzacji
   - Umieść je w folderze `/src/hooks/`

4. Implementacja głównych komponentów widoku:

   - Zaimplementuj TabSelector do przełączania zakładek
   - Zaimplementuj LoginForm do obsługi logowania
   - Zaimplementuj RegisterForm do obsługi rejestracji
   - Zaimplementuj AuthPageContainer jako główny kontener
   - Umieść je w folderze `/src/components/auth/`

5. Integracja z API:

   - Utwórz funkcje pomocnicze do komunikacji z API w pliku `/src/api/auth.ts`
   - Zintegruj je z hookiem useAuthState

6. Implementacja walidacji:

   - Zdefiniuj reguły walidacji dla formularzy
   - Zaimplementuj funkcje pomocnicze walidacji w pliku `/src/utils/validation.ts`
   - Zintegruj walidację z odpowiednimi formularzami

7. Obsługa błędów:

   - Zaimplementuj mapowanie kodów błędów API na przyjazne komunikaty
   - Dodaj obsługę błędów sieciowych
   - Zaimplementuj mechanizm zabezpieczający przed atakami brute force

8. Dodanie zabezpieczeń:

   - Zaimplementuj redirection guard dla zalogowanych użytkowników
   - Dodaj mechanizm odświeżania tokena JWT

9. Testy:

   - Napisz testy jednostkowe dla komponentów i hooków
   - Przeprowadź testy integracyjne dla całego widoku
   - Przetestuj dostępność i wsparcie dla czytników ekranu

10. Optymalizacja i finalizacja:
    - Przeprowadź audyt wydajności
    - Dopracuj wygląd i styl komponentów
    - Upewnij się, że widok działa poprawnie na różnych urządzeniach
