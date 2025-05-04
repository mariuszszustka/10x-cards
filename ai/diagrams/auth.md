# Diagram procesu autentykacji dla 10x-cards

<authentication_analysis>
## Analiza procesów autentykacji

### Przepływy autentykacji
1. Rejestracja nowego użytkownika
2. Logowanie użytkownika
3. Automatyczne logowanie po rejestracji
4. Wylogowanie użytkownika
5. Odzyskiwanie hasła
6. Dostęp do chronionych zasobów (fiszki)
7. Wygaśnięcie sesji i odświeżenie tokenu

### Główni aktorzy
1. Przeglądarka (klient)
2. Middleware (weryfikacja tokenów i autoryzacja)
3. Astro API (logika biznesowa)
4. Supabase Auth (usługa uwierzytelniania)

### Procesy weryfikacji i odświeżania tokenów
1. Weryfikacja tokenu JWT przy każdym żądaniu do chronionych zasobów
2. Automatyczne odświeżanie tokenu przy wygaśnięciu
3. Przechowywanie tokenu w bezpieczny sposób po stronie klienta
4. Unieważnianie tokenu przy wylogowaniu

### Opis kroków autentykacji
1. **Rejestracja**: Użytkownik podaje email i hasło, system tworzy konto w Supabase Auth, użytkownik zostaje automatycznie zalogowany.
2. **Logowanie**: Użytkownik podaje dane logowania, Supabase Auth weryfikuje je i zwraca token JWT.
3. **Autoryzacja**: Token JWT jest przesyłany w nagłówku Authorization przy każdym żądaniu do API.
4. **Middleware**: Przed dostępem do chronionych zasobów Middleware weryfikuje token JWT.
5. **Odświeżanie**: Gdy token wygasa, system próbuje automatycznie odświeżyć go używając refresh tokenu.
6. **Wylogowanie**: Token zostaje unieważniony po stronie serwera i usunięty z lokalnego przechowywania.
</authentication_analysis>

<mermaid_diagram>
```mermaid
sequenceDiagram
    autonumber
    participant Przeglądarka
    participant Middleware
    participant AstroAPI
    participant SupabaseAuth

    Note over Przeglądarka,SupabaseAuth: Proces rejestracji

    Przeglądarka->>AstroAPI: Formularz rejestracji (email, hasło)
    AstroAPI->>SupabaseAuth: Rejestracja użytkownika
    activate SupabaseAuth
    SupabaseAuth-->>AstroAPI: Utworzono konto + token JWT
    deactivate SupabaseAuth
    AstroAPI-->>Przeglądarka: Przekierowanie + zapis tokenu

    Note over Przeglądarka,SupabaseAuth: Proces logowania

    Przeglądarka->>AstroAPI: Formularz logowania (email, hasło)
    AstroAPI->>SupabaseAuth: Weryfikacja poświadczeń
    activate SupabaseAuth
    alt Poprawne dane
        SupabaseAuth-->>AstroAPI: Token JWT + refresh token
        AstroAPI-->>Przeglądarka: Zapisanie tokenów + przekierowanie
    else Błędne dane
        SupabaseAuth-->>AstroAPI: Błąd uwierzytelniania
        AstroAPI-->>Przeglądarka: Komunikat o błędzie
    end
    deactivate SupabaseAuth

    Note over Przeglądarka,SupabaseAuth: Dostęp do chronionych zasobów

    Przeglądarka->>Middleware: Żądanie dostępu do fiszek
    activate Middleware
    Middleware->>Middleware: Weryfikacja tokenu JWT
    alt Token ważny
        Middleware->>AstroAPI: Przekazanie żądania
        AstroAPI-->>Przeglądarka: Dane fiszek
    else Token wygasł
        Middleware-->>Przeglądarka: Błąd 401 Unauthorized
        Przeglądarka->>SupabaseAuth: Żądanie odświeżenia tokenu
        activate SupabaseAuth
        alt Refresh token ważny
            SupabaseAuth-->>Przeglądarka: Nowy token JWT
            Przeglądarka->>Middleware: Ponowne żądanie z nowym tokenem
            Middleware->>AstroAPI: Przekazanie żądania
            AstroAPI-->>Przeglądarka: Dane fiszek
        else Refresh token wygasł
            SupabaseAuth-->>Przeglądarka: Błąd odświeżania
            Przeglądarka->>Przeglądarka: Przekierowanie do logowania
        end
        deactivate SupabaseAuth
    end
    deactivate Middleware

    Note over Przeglądarka,SupabaseAuth: Proces wylogowania

    Przeglądarka->>AstroAPI: Żądanie wylogowania
    AstroAPI->>SupabaseAuth: Unieważnienie tokenu
    SupabaseAuth-->>AstroAPI: Potwierdzenie wylogowania
    AstroAPI-->>Przeglądarka: Usunięcie tokenów + przekierowanie
    
    Note over Przeglądarka,SupabaseAuth: Odzyskiwanie hasła

    Przeglądarka->>AstroAPI: Żądanie resetowania hasła (email)
    AstroAPI->>SupabaseAuth: Generowanie linku resetowania
    alt Email istnieje
        SupabaseAuth-->>AstroAPI: Potwierdzenie wysłania
        AstroAPI-->>Przeglądarka: Komunikat o wysłaniu instrukcji
        Note right of Przeglądarka: W MVP bez weryfikacji email
    else Email nie istnieje
        SupabaseAuth-->>AstroAPI: Użytkownik nie istnieje
        AstroAPI-->>Przeglądarka: Komunikat o błędzie
    end
```
</mermaid_diagram> 