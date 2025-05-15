# Specyfikacja architektury modułu autentykacji dla 10x-cards

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### 1.1. Struktura stron i komponentów

#### Strony publiczne (dostępne dla niezalogowanych użytkowników):

- **`/` (strona główna)** - Zachęcająca strona z informacjami o aplikacji i przyciskami do logowania/rejestracji
  - Zgodnie z PRD, strona główna dla niezalogowanych użytkowników powinna zawierać zachęcającą treść do założenia konta
  - Interfejs powinien jasno wskazywać, że dostęp do funkcjonalności fiszek wymaga logowania
  - Przyciski logowania/rejestracji powinny być wyraźnie widoczne
- **`/auth/login`** - Strona z formularzem logowania
- **`/auth/register`** - Strona z formularzem rejestracji
- **`/auth/reset-password`** - Strona do żądania resetowania hasła
- **`/auth/update-password`** - Strona do ustawienia nowego hasła (dostępna po kliknięciu w link z emaila)

#### Strony chronione (dostępne tylko dla zalogowanych użytkowników):

- **`/dashboard`** - Pulpit użytkownika (strona startowa po zalogowaniu)
- **`/generate`** - Generowanie fiszek
- **`/flashcards`** - Zarządzanie fiszkami
- **`/study`** - Sesja nauki z algorytmem powtórek
- **`/settings`** - Ustawienia konta użytkownika

#### Komponenty React:

- **`AuthLayout.tsx`** - Layout dla stron autoryzacyjnych z logo i stylizacją
- **`LoginForm.tsx`** - Interaktywny formularz logowania
- **`RegisterForm.tsx`** - Interaktywny formularz rejestracji
- **`ResetPasswordForm.tsx`** - Formularz do żądania resetowania hasła
- **`UpdatePasswordForm.tsx`** - Formularz do ustawienia nowego hasła
- **`UserMenu.tsx`** - Komponent menu użytkownika w prawym górnym rogu z opcją wylogowania
  - Zgodnie z PRD, przyciski logowania i wylogowania powinny być umieszczone w prawym górnym rogu interfejsu
  - Dla niezalogowanych użytkowników: wyświetlane są przyciski "Zaloguj się" i "Zarejestruj się"
  - Dla zalogowanych użytkowników: wyświetlane jest menu użytkownika z opcją wylogowania
- **`AuthGuard.tsx`** - Komponent wyższego rzędu do ochrony tras prywatnych

#### Komponenty Astro:

- **`BaseLayout.astro`** - Główny layout aplikacji
- **`AuthRedirect.astro`** - Komponent do przekierowania niezalogowanych użytkowników
- **`AuthStatus.astro`** - Komponent do renderowania stanu autoryzacji w layoutach

### 1.2. Przepływ interfejsu użytkownika

#### Rejestracja:

1. Użytkownik wchodzi na stronę `/auth/register`
2. Formularz `RegisterForm.tsx` zawiera pola:
   - Adres email (walidacja formatu email)
   - Hasło (minimum 8 znaków, co najmniej 1 wielka litera, 1 cyfra, 1 znak specjalny)
   - Potwierdzenie hasła (zgodność z polem hasła)
3. Po poprawnym wypełnieniu formularza i kliknięciu "Zarejestruj się", komponent wywołuje odpowiedni endpoint Supabase Auth
4. W przypadku sukcesu:
   - Użytkownik jest automatycznie zalogowany
   - Następuje przekierowanie do `/dashboard`
5. W przypadku błędu:
   - Wyświetlane są odpowiednie komunikaty (np. "Email jest już zajęty")

#### Logowanie:

1. Użytkownik wchodzi na stronę `/auth/login`
2. Formularz `LoginForm.tsx` zawiera pola:
   - Adres email
   - Hasło
   - Link "Zapomniałem hasła" kierujący do `/auth/reset-password`
3. Po wypełnieniu formularza i kliknięciu "Zaloguj się", komponent wywołuje odpowiedni endpoint Supabase Auth
4. W przypadku sukcesu:
   - Użytkownik jest zalogowany
   - Następuje przekierowanie do `/dashboard`
5. W przypadku błędu:
   - Wyświetlany jest komunikat "Nieprawidłowy email lub hasło"

#### Wylogowanie:

1. Zalogowany użytkownik klika przycisk "Wyloguj" w komponencie `UserMenu.tsx`
2. Komponent wywołuje odpowiedni endpoint Supabase Auth do wylogowania
3. Po wylogowaniu następuje przekierowanie na stronę główną `/`

#### Resetowanie hasła:

1. Użytkownik wchodzi na stronę `/auth/reset-password`
2. Formularz `ResetPasswordForm.tsx` zawiera pole na adres email
3. Po wysłaniu formularza, system generuje token i wysyła email z linkiem do resetowania hasła
   - **UWAGA dla MVP**: Zgodnie z PRD, w wersji MVP nie będzie faktycznej weryfikacji adresów email. System wygeneruje token resetowania, ale email nie będzie wysyłany. Link resetujący będzie generowany i pokazywany użytkownikowi bezpośrednio w interfejsie.
4. Link kieruje do `/auth/update-password?token=...`
5. Na stronie `/auth/update-password` wyświetlany jest formularz `UpdatePasswordForm.tsx` z polami:
   - Nowe hasło
   - Potwierdzenie nowego hasła
6. Po poprawnym ustawieniu nowego hasła:
   - Użytkownik jest automatycznie zalogowany
   - Następuje przekierowanie do `/dashboard`

### 1.3. Walidacja i komunikaty błędów

#### Walidacja formularzy:

- Wykorzystanie biblioteki `zod` do walidacji danych formularzy
- Schematy walidacyjne:

  ```typescript
  // Przykładowe schematy walidacyjne
  const loginSchema = z.object({
    email: z.string().email("Nieprawidłowy format adresu email"),
    password: z.string().min(1, "Hasło jest wymagane"),
  });

  const registerSchema = z
    .object({
      email: z.string().email("Nieprawidłowy format adresu email"),
      password: z
        .string()
        .min(8, "Hasło musi mieć minimum 8 znaków")
        // Poniższe wymagania mogą być opcjonalne w MVP
        // W pełnej wersji produktu należy rozważyć bardziej szczegółową walidację
        .regex(/[A-Z]/, "Hasło musi zawierać co najmniej jedną wielką literę")
        .regex(/[0-9]/, "Hasło musi zawierać co najmniej jedną cyfrę")
        .regex(/[^a-zA-Z0-9]/, "Hasło musi zawierać co najmniej jeden znak specjalny"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Hasła nie są zgodne",
      path: ["confirmPassword"],
    });
  ```

#### Komunikaty błędów:

- Błędy walidacji formularza wyświetlane pod odpowiednimi polami
- Błędy autentykacji z Supabase tłumaczone na przyjazne komunikaty:
  - "auth/user-not-found" → "Użytkownik o podanym adresie email nie istnieje"
  - "auth/wrong-password" → "Nieprawidłowe hasło"
  - "auth/email-already-in-use" → "Konto z tym adresem email już istnieje"
  - "auth/invalid-email" → "Nieprawidłowy format adresu email"
  - "auth/weak-password" → "Hasło jest za słabe"

### 1.4. Obsługa kluczowych scenariuszy

#### Próba dostępu do chronionych stron bez zalogowania:

1. Użytkownik próbuje wejść na chronioną stronę (np. `/dashboard`)
2. Komponent `AuthGuard.tsx` wykrywa brak sesji
3. Użytkownik zostaje przekierowany na stronę logowania `/auth/login`
4. Po zalogowaniu następuje przekierowanie do pierwotnie żądanej strony

#### Wygaśnięcie sesji:

1. Sesja użytkownika wygasa podczas korzystania z aplikacji
2. Przy następnym żądaniu API, system wykrywa wygaśnięcie sesji
3. Użytkownik zostaje automatycznie wylogowany
4. Wyświetlana jest informacja "Sesja wygasła, zaloguj się ponownie"
5. Następuje przekierowanie na stronę logowania

#### Zmiana hasła przez zalogowanego użytkownika:

1. Zalogowany użytkownik przechodzi do `/settings`
2. W sekcji bezpieczeństwa znajduje się formularz zmiany hasła z polami:
   - Aktualne hasło
   - Nowe hasło
   - Potwierdzenie nowego hasła
3. Po poprawnym wypełnieniu i zatwierdzeniu formularza hasło zostaje zmienione
4. Wyświetlany jest komunikat potwierdzający zmianę

## 2. LOGIKA BACKENDOWA

### 2.1. Struktura endpointów API

#### Endpointy Supabase Auth:

- **`POST /auth/v1/signup`** - Rejestracja nowego użytkownika
- **`POST /auth/v1/token?grant_type=password`** - Logowanie użytkownika
- **`POST /auth/v1/logout`** - Wylogowanie użytkownika
- **`POST /auth/v1/recover`** - Żądanie resetowania hasła
- **`PUT /auth/v1/user`** - Aktualizacja danych użytkownika (w tym zmiana hasła)

#### Endpointy API Astro:

- **`POST /api/auth/register`** - Wrapper dla Supabase signup
- **`POST /api/auth/login`** - Wrapper dla Supabase token
- **`POST /api/auth/logout`** - Wrapper dla Supabase logout
- **`POST /api/auth/reset-password`** - Wrapper dla Supabase recover
- **`POST /api/auth/update-password`** - Wrapper dla Supabase update user
- **`GET /api/auth/session`** - Pobranie aktualnej sesji użytkownika

### 2.2. Modele danych

#### Model użytkownika w Supabase:

```typescript
interface User {
  id: string; // UUID generowany przez Supabase
  email: string; // Adres email użytkownika
  created_at: string; // Data utworzenia konta
  updated_at: string; // Data ostatniej aktualizacji
  last_sign_in_at: string | null; // Data ostatniego logowania
}
```

#### Model sesji:

```typescript
interface Session {
  access_token: string; // Token JWT do autoryzacji
  token_type: string; // Typ tokenu (bearer)
  expires_in: number; // Czas wygaśnięcia tokenu (w sekundach)
  refresh_token: string; // Token do odświeżenia sesji
  user: User; // Dane użytkownika
}
```

### 2.3. Walidacja danych wejściowych

#### Serwer-side walidacja z zod:

```typescript
// Przykładowa implementacja
import { z } from "zod";
import type { APIRoute } from "astro";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const post: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const validated = loginSchema.parse(data);

    // Logika logowania...

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          errors: error.format(),
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: "Wystąpił błąd podczas logowania",
      }),
      { status: 500 }
    );
  }
};
```

### 2.4. Obsługa wyjątków

#### Mapowanie błędów Supabase na przyjazne komunikaty:

```typescript
function mapSupabaseError(error: any): string {
  const errorCode = error?.code;
  const errorMessage = error?.message;

  switch (errorCode) {
    case "auth/invalid-email":
      return "Nieprawidłowy format adresu email";
    case "auth/user-not-found":
      return "Użytkownik o podanym adresie email nie istnieje";
    case "auth/wrong-password":
      return "Nieprawidłowe hasło";
    case "auth/email-already-in-use":
      return "Konto z tym adresem email już istnieje";
    case "auth/weak-password":
      return "Hasło jest za słabe";
    // Inne przypadki...
    default:
      return errorMessage || "Wystąpił nieznany błąd";
  }
}
```

### 2.5. Renderowanie server-side z uwzględnieniem autentykacji

#### Middleware Astro do sprawdzania sesji:

```typescript
// src/middleware.ts
import { defineMiddleware } from "astro:middleware";
import { supabase } from "./lib/supabase";

export const onRequest = defineMiddleware(async ({ request, locals, redirect }, next) => {
  // Pobieranie i ustawienie sesji użytkownika
  const {
    data: { session },
  } = await supabase.auth.getSession();
  locals.session = session;
  locals.user = session?.user || null;

  // Sprawdzanie autoryzacji dla chronionych ścieżek
  const url = new URL(request.url);
  const isAuthRoute = url.pathname.startsWith("/auth/");
  const isApiRoute = url.pathname.startsWith("/api/");
  const isPublicRoute = url.pathname === "/" || isAuthRoute || isApiRoute;

  if (!isPublicRoute && !session) {
    return redirect("/auth/login");
  }

  if (isAuthRoute && session && !url.pathname.includes("logout")) {
    return redirect("/dashboard");
  }

  return next();
});
```

## 3. SYSTEM AUTENTYKACJI

### 3.1. Integracja Supabase Auth z Astro

#### Konfiguracja klienta Supabase:

```typescript
// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### Serwisy autentykacji:

```typescript
// src/lib/auth.ts
import { supabase } from "./supabase";

export const authService = {
  // Rejestracja nowego użytkownika
  async register(email: string, password: string) {
    return await supabase.auth.signUp({
      email,
      password,
    });
  },

  // Logowanie użytkownika
  async login(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  // Wylogowanie użytkownika
  async logout() {
    return await supabase.auth.signOut();
  },

  // Żądanie resetowania hasła
  async resetPassword(email: string) {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
  },

  // Aktualizacja hasła
  async updatePassword(password: string) {
    return await supabase.auth.updateUser({
      password,
    });
  },

  // Pobranie aktualnej sesji
  async getSession() {
    return await supabase.auth.getSession();
  },

  // Pobranie aktualnego użytkownika
  async getUser() {
    return await supabase.auth.getUser();
  },
};
```

### 3.2. Zarządzanie sesją

#### Hook React do zarządzania stanem autoryzacji:

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from "react";
import { authService } from "../lib/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pobierz aktualną sesję przy inicjalizacji
    const fetchSession = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await authService.getUser();
        setUser(user);
      } catch (error) {
        console.error("Błąd podczas pobierania sesji:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    // Nasłuchuj zmian sesji
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
```

#### Context Provider dla autentykacji:

```typescript
// src/contexts/AuthContext.tsx
import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../lib/auth';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login: authService.login,
      register: authService.register,
      logout: authService.logout,
      resetPassword: authService.resetPassword,
      updatePassword: authService.updatePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
```

### 3.3. Zabezpieczanie tras w Astro

#### Komponent AuthGuard do ochrony komponentów React:

```typescript
// src/components/AuthGuard.tsx
import React, { useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ children, redirectTo = '/auth/login' }: AuthGuardProps) {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate(redirectTo);
    }
  }, [user, loading, navigate, redirectTo]);

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  return user ? <>{children}</> : null;
}
```

#### Komponent Astro do obsługi sesji:

```typescript
// src/components/AuthStatus.astro
---
const { session } = Astro.locals;
const isLoggedIn = !!session;
---

{isLoggedIn ? (
  <slot name="authenticated" />
) : (
  <slot name="unauthenticated" />
)}
```

### 3.4. Zabezpieczenie REST API

#### Middleware do zabezpieczenia API:

```typescript
// src/middleware/api.ts
import { supabase } from "../lib/supabase";

export async function authenticateRequest(request: Request) {
  // Pobierz token z nagłówka Authorization
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { user: null, error: "Brak autoryzacji" };
  }

  const token = authHeader.substring(7);

  // Sprawdź token i pobierz użytkownika
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return { user: null, error: error?.message || "Nieprawidłowy token" };
  }

  return { user: data.user, error: null };
}
```

## 4. KONFIGURACJA I INTEGRACJA

### 4.1. Zmienne środowiskowe

```bash
# .env
PUBLIC_SUPABASE_URL=https://twoj-projekt.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4.2. Aktualizacja astro.config.mjs

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  output: "hybrid", // Umożliwia mieszanie stron SSR i statycznych
  adapter: node({
    mode: "standalone",
  }),
});
```

### 4.3. Rozszerzenie typów dla Astro.locals

```typescript
// src/env.d.ts
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    session: import("@supabase/supabase-js").Session | null;
    user: import("@supabase/supabase-js").User | null;
  }
}
```
