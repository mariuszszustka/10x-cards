# Architektura interfejsu użytkownika dla 10x-cards

## 1. Analiza architektury UI

### 1.1 Komponenty dla modułu logowania i rejestracji

- Formularz rejestracyjny (pola: adres e-mail, hasło)
- Formularz logowania (pola: adres e-mail, hasło)
- Mechanizm odzyskiwania hasła
- Komponent powiadomień (potwierdzenia, błędy)
- Panel użytkownika z opcjami zarządzania kontem
- Widok główny dla niezalogowanych użytkowników
- Widok główny dla zalogowanych użytkowników
- Layout aplikacji z przyciskiem logowania/wylogowania

### 1.2 Główne strony i ich komponenty

- **Strona główna (niezalogowani użytkownicy)**:

  - Layout.astro z przyciskiem logowania
  - Komponent zachęcający do rejestracji

- **Strona główna (zalogowani użytkownicy)**:

  - Layout.astro z przyciskiem wylogowania
  - Panel dostępu do funkcji aplikacji (generowanie/zarządzanie fiszkami, sesje nauki)

- **Strona logowania**:

  - FormularzLogowania.jsx
  - KomponentBłędów.jsx
  - LinkOdzyskiwanieHasła.jsx

- **Strona rejestracji**:

  - FormularzRejestracji.jsx
  - KomponentBłędów.jsx

- **Strona odzyskiwania hasła**:

  - FormularzOdzyskiwaniaHasła.jsx
  - KomponentBłędów.jsx

- **Panel użytkownika**:
  - OpcjeKonta.jsx (edycja hasła, usunięcie konta)

### 1.3 Przepływ danych między komponentami

- Formularze logowania/rejestracji -> walidacja danych po stronie klienta -> żądania API -> aktualizacja stanu sesji
- Stan sesji użytkownika wpływa na routing i dostępne opcje UI
- Mechanizm autoryzacji przekazuje tokeny JWT do zabezpieczonych endpointów
- Panel użytkownika pobiera i aktualizuje dane konta przez API

### 1.4 Funkcjonalność komponentów

- **Layout.astro**: Główny layout aplikacji, zawiera nagłówek z przyciskami logowania/wylogowania
- **FormularzLogowania.jsx**: Odpowiedzialny za uwierzytelnianie użytkownika, walidację pól i komunikację z API
- **FormularzRejestracji.jsx**: Obsługuje proces tworzenia nowego konta, walidację pól i komunikację z API
- **FormularzOdzyskiwaniaHasła.jsx**: Umożliwia zresetowanie hasła, walidację adresu e-mail i komunikację z API
- **KomponentBłędów.jsx**: Wyświetla komunikaty o błędach formularzy i odpowiedzi z API
- **OpcjeKonta.jsx**: Pozwala na zarządzanie kontem użytkownika
- **StanSesji.js**: Zarządza stanem logowania użytkownika w aplikacji
- **KomponentAutoryzacji.jsx**: HOC (Higher Order Component) zapewniający dostęp tylko dla zalogowanych użytkowników

## 2. Diagram przepływu interfejsu użytkownika

```mermaid
flowchart TD
    %% Główny layout aplikacji
    Layout["Layout.astro"] --> NavBar["NavBar.jsx"]
    NavBar --> AuthButton["PrzyciskAutoryzacji.jsx"]

    %% Definicje stylów
    classDef astroPage fill:#f9d77e,stroke:#333,stroke-width:1px
    classDef reactComponent fill:#a2d2ff,stroke:#333,stroke-width:1px
    classDef authComponents fill:#ffc8dd,stroke:#333,stroke-width:1px
    classDef stateManagement fill:#b9fbc0,stroke:#333,stroke-width:1px
    classDef dataFlow fill:#ffffff,stroke:#333,stroke-dasharray: 5 5

    %% Strony Astro
    IndexPage["index.astro (Strona Główna)"]:::astroPage
    LoginPage["login.astro"]:::astroPage
    RegisterPage["register.astro"]:::astroPage
    ResetPasswordPage["reset-password.astro"]:::astroPage
    UserPanelPage["user-panel.astro"]:::astroPage

    %% Struktura stron
    Layout --> IndexPage
    Layout --> LoginPage
    Layout --> RegisterPage
    Layout --> ResetPasswordPage
    Layout --> UserPanelPage

    %% Komponenty logowania i rejestracji
    subgraph "Moduł Autentykacji"
        %% Komponenty formularzy
        LoginForm["FormularzLogowania.jsx"]:::authComponents
        RegisterForm["FormularzRejestracji.jsx"]:::authComponents
        ResetPasswordForm["FormularzOdzyskiwaniaHasła.jsx"]:::authComponents

        %% Komponenty pomocnicze autentykacji
        ValidationUtils["WalidacjaDanych.js"]:::authComponents
        ErrorDisplay["KomponentBłędów.jsx"]:::authComponents
        AuthButtons["PrzyciskiAutoryzacji.jsx"]:::authComponents

        %% Przepływ w module autentykacji
        LoginForm --> ValidationUtils
        RegisterForm --> ValidationUtils
        ResetPasswordForm --> ValidationUtils

        LoginForm --> ErrorDisplay
        RegisterForm --> ErrorDisplay
        ResetPasswordForm --> ErrorDisplay

        LoginForm -.-> AuthService
        RegisterForm -.-> AuthService
        ResetPasswordForm -.-> AuthService
    end

    %% Zarządzanie stanem sesji
    subgraph "Zarządzanie Stanem"
        AuthService["SerwisAutoryzacji.js"]:::stateManagement
        SessionState["StanSesji.js"]:::stateManagement
        JWTHandler["ObsługaJWT.js"]:::stateManagement

        AuthService --> SessionState
        AuthService --> JWTHandler
    end

    %% Przepływ danych i zależności
    LoginPage --> LoginForm
    RegisterPage --> RegisterForm
    ResetPasswordPage --> ResetPasswordForm

    %% Panel użytkownika
    subgraph "Panel Użytkownika"
        UserOptions["OpcjeKonta.jsx"]:::reactComponent
        PasswordChange["ZmianaHasła.jsx"]:::reactComponent
        AccountDeletion["UsuwanieKonta.jsx"]:::reactComponent

        UserOptions --> PasswordChange
        UserOptions --> AccountDeletion

        PasswordChange -.-> AuthService
        AccountDeletion -.-> AuthService
    end

    UserPanelPage --> UserOptions

    %% Komponenty widoku głównego
    subgraph "Widok Główny"
        LoggedOutView["WidokNiezalogowany.jsx"]:::reactComponent
        LoggedInView["WidokZalogowany.jsx"]:::reactComponent

        %% Komponenty dla zalogowanych
        UserDashboard["PanelUżytkownika.jsx"]:::reactComponent
        AppFeatures["FunkcjeAplikacji.jsx"]:::reactComponent

        LoggedInView --> UserDashboard
        LoggedInView --> AppFeatures
    end

    %% Widok warunkowy w zależności od stanu logowania
    IndexPage --> ConditionalView{{"Warunek: Zalogowany?"}}:::dataFlow
    ConditionalView -->|"Nie"| LoggedOutView
    ConditionalView -->|"Tak"| LoggedInView

    %% Komponent autoryzacji do ochrony stron
    AuthGuard["KomponentAutoryzacji.jsx"]:::authComponents
    AuthGuard -.-> SessionState
    UserPanelPage -.-> AuthGuard

    %% Przepływ stanu logowania
    SessionState -.-> AuthButton
    SessionState -.-> ConditionalView
```

## 3. Moduły funkcjonalne interfejsu

### 3.1 Moduł autentykacji

- **Cele**: Zarządzanie dostępem, autoryzacja, bezpieczne przechowywanie danych użytkownika
- **Główne komponenty**: Formularze logowania/rejestracji, obsługa resetowania hasła, zarządzanie tokenami JWT
- **Integracja**: Supabase Auth, middleware Astro

### 3.2 Moduł zarządzania fiszkami

- **Cele**: Tworzenie, edycja, usuwanie fiszek, obsługa generowania przez AI
- **Główne komponenty**: FormularzFiszki, ListaFiszek, KomponentGenerowaniaAI
- **Integracja**: API fiszek, zewnętrzne API AI

### 3.3 Moduł nauki

- **Cele**: Sesje nauki z wykorzystaniem algorytmu Leitnera, śledzenie postępów
- **Główne komponenty**: WidokFiszki, PrzycizkiOceny, PostępSesji, PodsumowanieSesji
- **Integracja**: API systemu Leitnera, przechowywanie historii nauki

### 3.4 Moduł interfejsu administracyjnego

- **Cele**: Zarządzanie kontem, ustawienia użytkownika
- **Główne komponenty**: OpcjeKonta, ZmianaHasła, UsuwanieKonta
- **Integracja**: API zarządzania kontem

## 4. Responsywność i dostępność

### 4.1 Zasady projektowania responsywnego

- Podejście Mobile-First - projektowanie zaczynające się od najmniejszych ekranów
- Wykorzystanie Tailwind CSS do responsywnych layoutów
- Breakpointy: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Dostosowywanie układu do różnych rozmiarów ekranu przez modyfikacje siatki i wielkości komponentów

### 4.2 Zasady dostępności (WCAG)

- Odpowiedni kontrast kolorów (minimum AA)
- Obsługa klawiaturą wszystkich funkcji
- Poprawna struktura nagłówków
- Alternatywne opisy dla elementów graficznych
- Poprawna semantyka HTML
- Komunikaty błędów dostępne dla czytników ekranu
- Testowanie z pomocą narzędzi takich jak Lighthouse i axe-core
