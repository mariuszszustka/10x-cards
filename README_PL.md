# 10x-cards

Nowoczesna aplikacja webowa do tworzenia, zarządzania i przeglądania fiszek edukacyjnych ze wsparciem sztucznej inteligencji.

## Spis treści

- [Opis projektu](#opis-projektu)
- [Stack technologiczny](#stack-technologiczny)
- [Uruchomienie lokalne](#uruchomienie-lokalne)
- [Dostępne skrypty](#dostępne-skrypty)
- [Zakres projektu](#zakres-projektu)
- [Status projektu](#status-projektu)
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
- [TypeScript](https://www.typescriptlang.org/) v5
- [Tailwind CSS](https://tailwindcss.com/) v4.0.17
- [Shadcn/UI](https://ui.shadcn.com/) - biblioteka komponentów UI

### Backend

- [Supabase](https://supabase.com/) - zarządzana baza danych i uwierzytelnianie

### Integracja AI

- Ollama, OpenAI API oraz Openrouter.ai dla funkcjonalności LLM

### Testowanie

- **Testy jednostkowe:**

  - [Vitest](https://vitest.dev/) - szybki framework do testów jednostkowych, dobrze integrujący się z Astro
  - [Testing Library](https://testing-library.com/) - do testowania komponentów React
  - [jsdom](https://github.com/jsdom/jsdom) - implementacja środowiska DOM dla testów w Node.js
  - [SuperTest](https://github.com/visionmedia/supertest) - do testowania API

- **Testy end-to-end:**

  - [Playwright](https://playwright.dev/) - nowoczesny framework do testów E2E z przeglądarką Google Chrome
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

6. Otwórz przeglądarkę i przejdź do `http://localhost:4321`

## Dostępne skrypty

- `npm run dev` - Uruchomienie serwera deweloperskiego
- `npm run build` - Budowanie wersji produkcyjnej
- `npm run preview` - Podgląd wersji produkcyjnej
- `npm run astro` - Uruchamianie poleceń Astro CLI
- `npm run lint` - Uruchomienie ESLint
- `npm run lint:fix` - Naprawienie problemów ESLint
- `npm run format` - Formatowanie kodu przy użyciu Prettier
- `npm run test` - Uruchomienie testów jednostkowych z Vitest
- `npm run test:watch` - Uruchomienie testów w trybie obserwowania zmian
- `npm run test:ui` - Uruchomienie testów z interfejsem użytkownika
- `npm run test:coverage` - Generowanie raportu pokrycia testami
- `npm run test:e2e` - Uruchomienie testów E2E z Playwright na przeglądarce Google Chrome
- `npm run test:e2e:ui` - Uruchomienie testów E2E z interfejsem UI na przeglądarce Google Chrome
- `npm run test:e2e:debug` - Uruchomienie testów E2E w trybie debugowania na przeglądarce Google Chrome
- `npm run test:e2e:setup` - Uruchomienie tylko fazy konfiguracyjnej testów E2E

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

## Status projektu

Projekt jest obecnie w fazie rozwoju. MVP jest aktywnie budowane z naciskiem na podstawową funkcjonalność fiszek, integrację AI oraz implementację systemu Leitnera dla efektywnej nauki.

## Licencja

MIT
