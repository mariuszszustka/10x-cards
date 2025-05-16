# 10x-cards

Nowoczesna aplikacja webowa do tworzenia, zarządzania i przeglądania fiszek edukacyjnych ze wsparciem sztucznej inteligencji.

## Spis treści

- [Opis projektu](#opis-projektu)
- [Stack technologiczny](#stack-technologiczny)
- [Uruchomienie lokalne](#uruchomienie-lokalne)
- [Dostępne skrypty](#dostępne-skrypty)
- [Zakres projektu](#zakres-projektu)
- [Status projektu](#status-projektu)
- [Struktura projektu](#struktura-projektu)
- [Struktura bazy danych](#struktura-bazy-danych)
- [Uwierzytelnianie](#uwierzytelnianie)
- [Testy E2E](#testy-e2e)
- [Licencja](#licencja)

## Opis projektu

10x-cards to aplikacja webowa umożliwiająca tworzenie, zarządzanie oraz przeglądanie fiszek edukacyjnych. Aplikacja wykorzystuje modele LLM (poprzez API) do generowania sugestii fiszek na podstawie wprowadzonego tekstu oraz integruje się z algorytmem powtórek opartym na systemie Leitnera, co pozwala na efektywne zastosowanie metody spaced repetition.

### Główne funkcjonalności:

- **Generowanie fiszek wspierane przez AI**: Automatyczne tworzenie wysokiej jakości fiszek z wklejonego tekstu
- **Ręczne zarządzanie fiszkami**: Tworzenie, edycja i organizacja własnych fiszek
- **Uwierzytelnianie użytkowników**: Bezpieczny dostęp do spersonalizowanych zestawów fiszek
- **Integracja z systemem Leitnera**: Efektywna nauka dzięki pięciopoziomowemu algorytmowi powtórek, który automatycznie dostosowuje częstotliwość powtarzania fiszek w zależności od poziomu ich znajomości
- **Śledzenie postępów**: Monitorowanie postępów i efektywności nauki z analizą statystyk dla każdego poziomu systemu Leitnera

## Stack technologiczny

### Frontend

- [Astro](https://astro.build/) v5.5.5
- [React](https://react.dev/) v19.0.0
- [TypeScript](https://www.typescriptlang.org/) v5.8.3
- [Tailwind CSS](https://tailwindcss.com/) v4.0.17
- [Shadcn/UI](https://ui.shadcn.com/) - biblioteka komponentów UI

### Backend

- [Supabase](https://supabase.com/) - zarządzana baza danych i uwierzytelnianie
- [Node.js](https://nodejs.org/) adapter dla Astro

### Zarządzanie stanem aplikacji

- [Zustand](https://github.com/pmndrs/zustand) v5.0.3 - biblioteka do zarządzania stanem

### Integracja AI

- Ollama, OpenAI API oraz Openrouter.ai dla funkcjonalności LLM

### Testowanie

- **Testy jednostkowe:**

  - [Vitest](https://vitest.dev/) v1.3.1 - szybki framework do testów jednostkowych, dobrze integrujący się z Astro
  - [Testing Library](https://testing-library.com/) v15.0.0 - do testowania komponentów React
  - [jsdom](https://github.com/jsdom/jsdom) v24.0.0 - implementacja środowiska DOM dla testów w Node.js

- **Testy end-to-end:**

  - [Playwright](https://playwright.dev/) v1.43.1 - nowoczesny framework do testów E2E z przeglądarką Google Chrome
  - Testy E2E wykorzystują uproszczone podejście MVP - koncentracja na kluczowych funkcjonalnościach z testowaniem na jednej przeglądarce

- **Narzędzia CI/CD:**
  - GitHub Actions - automatyzacja testów i wdrażania
  - v8 coverage - raportowanie pokrycia kodu testami

### CI/CD i Hosting

- GitHub Actions
- Docker (lokalnie lub poprzez DigitalOcean)

## Uruchomienie lokalne

### Wymagania

- Node.js v22.14.0 (zgodnie z plikiem `.nvmrc`)
- npm (dostarczane z Node.js)

### Instalacja

1. Sklonuj repozytorium:

```bash
git clone https://github.com/yourusername/10x-cards.git
cd 10x-cards
```

2. Zainstaluj zależności:

```bash
npm install
```

3. Utwórz plik środowiskowy:

```bash
cp .env.example .env
```

4. Zaktualizuj zmienne środowiskowe w pliku `.env` dodając swoje klucze API i konfigurację.

5. Uruchom serwer deweloperski:

```bash
npm run dev
```

6. Otwórz przeglądarkę i przejdź do `http://localhost:3000`

## Dostępne skrypty

- `npm run dev` - Uruchomienie serwera deweloperskiego
- `npm run build` - Budowanie wersji produkcyjnej
- `npm run preview` - Podgląd wersji produkcyjnej
- `npm run astro` - Uruchamianie poleceń Astro CLI
- `npm run lint` - Uruchomienie ESLint
- `npm run lint:fix` - Naprawienie problemów ESLint
- `npm run format` - Formatowanie kodu przy użyciu Prettier
- `npm run auto-format` - Automatyczne formatowanie kodu przy użyciu Prettier i naprawa problemów ESLint
- `npm run test` - Uruchomienie testów jednostkowych z Vitest
- `npm run test:watch` - Uruchomienie testów w trybie obserwowania zmian
- `npm run test:ui` - Uruchomienie testów z interfejsem użytkownika
- `npm run test:coverage` - Generowanie raportu pokrycia testami
- `npm run test:e2e` - Uruchomienie testów E2E z Playwright na przeglądarce Google Chrome
- `npm run test:e2e:ui` - Uruchomienie testów E2E z interfejsem UI na przeglądarce Google Chrome
- `npm run test:e2e:debug` - Uruchomienie testów E2E w trybie debugowania na przeglądarce Google Chrome
- `npm run test:e2e:windows` - Uruchomienie testów E2E na platformie Windows
- `npm run test:e2e:setup` - Uruchomienie tylko fazy konfiguracyjnej testów E2E
- `npm run test:e2e:direct` - Bezpośrednie uruchomienie testów E2E
- `npm run test:e2e:smoke` - Uruchomienie testów smoke
- `npm run test:e2e:auth` - Uruchomienie testów uwierzytelniania
- `npm run test:e2e:flashcards` - Uruchomienie testów fiszek
- `npm run test:e2e:basic` - Uruchomienie podstawowych testów, w tym smoke, uwierzytelniania i fiszek
- `npm run clean:tmp` - Czyszczenie plików tymczasowych

## Zakres projektu

### MVP zawiera:

- Automatyczne generowanie fiszek z wklejonego tekstu (1000-10000 znaków)
- Ręczne tworzenie i zarządzanie fiszkami
- Uwierzytelnianie użytkowników i zarządzanie kontem
- Integracja z systemem Leitnera dla efektywnego planowania powtórek
- Śledzenie postępów użytkownika w ramach pięciu poziomów systemu Leitnera
- Statystyki użytkownika i logowanie generacji AI

### Poza zakresem MVP:

- Własny, zaawansowany algorytm powtórek wykraczający poza podstawowy system Leitnera
- Import dokumentów (PDF, DOCX) - obsługiwany jest jedynie tekst wklejany ręcznie
- Współdzielenie fiszek między użytkownikami
- Aplikacje mobilne (początkowo dostępna jest jedynie wersja web)
- Publiczne API
- Rozbudowane mechanizmy gamifikacji oraz zaawansowane funkcje powiadomień
- Zaawansowane wyszukiwanie fiszek po słowach kluczowych (standardowe pełnotekstowe wyszukiwanie z paginacją)

## Struktura projektu

Projekt jest oparty na standardowej strukturze Astro z rozszerzonym wsparciem TypeScript:

- `/src` - Kod źródłowy
  - `/auth` - Serwisy i narzędzia uwierzytelniania
  - `/components` - Komponenty Astro i React
    - `/ui` - Komponenty Shadcn UI
    - `/auth` - Komponenty uwierzytelniania
    - `/flashcards` - Komponenty związane z fiszkami
    - `/generate` - Komponenty do generacji AI
    - `/common` - Współdzielone komponenty
  - `/db` - Klient bazy danych i definicje typów
  - `/layouts` - Layouty Astro
  - `/lib` - Funkcje narzędziowe i serwisy
  - `/middleware` - Middleware Astro do uwierzytelniania i routingu
  - `/pages` - Strony Astro i endpointy API
    - `/api` - Endpointy API
    - `/auth` - Strony uwierzytelniania
  - `/stores` - Magazyny stanów Zustand
  - `/styles` - Globalne style CSS i narzędzia Tailwind
  - `/utils` - Funkcje pomocnicze
- `/supabase` - Konfiguracja Supabase i migracje
- `/tests` - Pliki testów i narzędzia
- `/public` - Statyczne zasoby

## Struktura bazy danych

Struktura bazy danych zawiera tabele dla:

- Użytkowników (zarządzanych przez Supabase Auth)
- Fiszek
- Kolekcji (do organizowania fiszek)
- Systemu Leitnera (do powtórek)
- Statystyk użytkownika i metryki wykorzystania

## Uwierzytelnianie

Uwierzytelnianie jest zaimplementowane przy użyciu Supabase Auth z:

- Logowaniem przez email/hasło
- Logowaniem przez magic link
- Funkcjonalnością resetowania hasła
- Zarządzaniem sesją opartym na JWT
- Ochroną bezpiecznych tras poprzez middleware po stronie serwera

## Testy E2E

### Problemy i rozwiązania

Podczas implementacji testów E2E napotkaliśmy na problemy z middleware i przekierowaniami automatycznymi, które uniemożliwiały prawidłowe działanie testów formularza logowania. Oto rozwiązania, które wdrożyliśmy:

1. **Nagłówki specjalne dla testów**:

   - `X-Test-E2E: true` - identyfikuje żądania pochodzące z testów E2E
   - `X-Test-Login-Form: true` - wymusza wyświetlenie formularza logowania

2. **Modyfikacja middleware**:

   - Wykrywanie testów przez nagłówki i User-Agent
   - Wyłączenie przekierowań dla żądań testowych
   - Usuwanie ciasteczek sesji dla testów formularza logowania
   - Specjalna obsługa dla testów na platformie Windows

3. **Zmiany w stronach i komponentach**:

   - Dodanie meta tagów dla stron w trybie testowym
   - Zapewnienie wszystkim elementom atrybutów `data-testid`
   - Dodanie skryptów diagnostycznych do śledzenia hydratacji komponentów
   - Dodanie wskaźnika gotowości formularza (`data-test-login-form-ready`)

4. **Usprawnienia testów**:
   - Czyszczenie ciasteczek i localStorage przed testami
   - Oczekiwanie na załadowanie formularza i jego gotowość
   - Dodanie testów diagnostycznych do sprawdzania stanu formularza

### Uruchamianie testów E2E

Aby uruchomić testy E2E:

```bash
# Wszystkie testy E2E
npm run test:e2e

# Tylko testy autoryzacji
npx playwright test tests/e2e/auth.spec.ts

# Testy w trybie debugowania
npx playwright test tests/e2e/auth.spec.ts --debug

# Testy specyficzne dla Windows
npm run test:e2e:windows
```

## Licencja

MIT
