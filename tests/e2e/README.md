# Testy E2E z Playwright dla aplikacji 10x-cards

## Uproszczone podejście do testów E2E

W celu ułatwienia procesu rozwoju i utrzymania testów, zdecydowaliśmy się na uproszczone podejście:

- Testy są uruchamiane tylko na przeglądarce **Google Chrome**
- Skupiamy się na testowaniu kluczowych funkcjonalności aplikacji
- Kierujemy się zasadą MVP (Minimum Viable Product) dla testów

## Struktura testów

Testy E2E dla aplikacji 10x-cards są zorganizowane według wzorca Page Object Model (POM):

```
tests/
  e2e/                   # Testy E2E
    auth.spec.ts         # Testy autoryzacji
    flashcards.spec.ts   # Testy zarządzania fiszkami
    study.spec.ts        # Testy sesji nauki
  pom/                   # Klasy Page Object Model
    auth.ts              # Obiekty stron autoryzacji
    flashcards.ts        # Obiekty stron zarządzania fiszkami
    generation.ts        # Obiekty strony generowania fiszek
    study.ts             # Obiekty sesji nauki
    base-page.ts         # Klasa bazowa dla wszystkich stron
  test-selectors.ts      # Selektory dla elementów UI
  global.setup.ts        # Konfiguracja przed uruchomieniem testów
  global.teardown.ts     # Czyszczenie po uruchomieniu testów
```

## Konfiguracja środowiska testowego

### 1. Stworzenie pliku .env.test

Utwórz plik `.env.test` w głównym katalogu projektu:

```
# Konfiguracja testów E2E
NODE_ENV=test
PUBLIC_URL=http://localhost:3000

# Konfiguracja Supabase dla środowiska testowego
SUPABASE_URL=https://your-test-supabase-project.supabase.co
SUPABASE_ANON_KEY=your-test-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-test-supabase-service-role-key

# Konfiguracja użytkownika testowego
TEST_USER_EMAIL=test-e2e@example.com
TEST_USER_PASSWORD=Test123!@#
TEST_USER_ID=00000000-0000-0000-0000-000000000000

# Konfiguracja Playwright
PLAYWRIGHT_BASE_URL=http://localhost:3000
```

### 2. Konfiguracja użytkownika testowego w Supabase

Aby testy działały poprawnie, musisz mieć konto użytkownika testowego w bazie Supabase. Możesz je utworzyć na dwa sposoby:

#### Opcja 1: Ręczne utworzenie użytkownika testowego

1. Zaloguj się do Supabase Dashboard
2. Przejdź do sekcji Authentication -> Users
3. Kliknij "Add user" i utwórz użytkownika z danymi podanymi w pliku `.env.test`:
   - Email: `test-e2e@example.com`
   - Password: `Test123!@#`
4. Po utworzeniu użytkownika, skopiuj jego UUID i umieść w zmiennej `TEST_USER_ID` w pliku `.env.test`

#### Opcja 2: Utworzenie użytkownika przez API

Możesz również użyć poniższego skryptu, aby utworzyć użytkownika testowego:

```typescript
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Wczytanie zmiennych środowiskowych
dotenv.config({ path: path.resolve(process.cwd(), ".env.test") });

async function createTestUser() {
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseUrl || !supabaseKey) {
    console.error("Brak zmiennych środowiskowych SUPABASE_URL lub SUPABASE_SERVICE_ROLE_KEY");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const email = process.env.TEST_USER_EMAIL || "test-e2e@example.com";
  const password = process.env.TEST_USER_PASSWORD || "Test123!@#";

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      console.error("Błąd podczas tworzenia użytkownika:", error.message);
      return;
    }

    console.log("Utworzono użytkownika testowego:", data.user);
    console.log("ID użytkownika (do .env.test):", data.user.id);
  } catch (err) {
    console.error("Nieoczekiwany błąd:", err);
  }
}

createTestUser();
```

### 3. Instalacja zależności

```bash
npm install
```

### 4. Uruchomienie testów

```bash
# Uruchomienie wszystkich testów na Google Chrome
npm run test:e2e

# Uruchomienie konkretnego testu
npm run test:e2e -- tests/e2e/auth.spec.ts

# Uruchomienie testów z raportem HTML
npm run test:e2e -- --reporter=html
```

## Obsługa danych testowych

### Przygotowanie środowiska

Przed uruchomieniem testów, plik `global.setup.ts` wykonuje następujące operacje:

1. Sprawdza, czy istnieje użytkownik testowy
2. Czyści wszystkie dane testowe związane z tym użytkownikiem
3. Ustawia zmienną środowiskową `TEST_USER_ID` dla testów

### Czyszczenie po testach

Po zakończeniu testów, plik `global.teardown.ts` czyści wszystkie dane testowe:

1. Usuwa wszystkie fiszki i związane z nimi dane użytkownika testowego
2. Usuwa historię nauki i inne dane związane z użytkownikiem testowym

## Rozszerzanie testów

### Dodawanie nowych testów

1. Utwórz nowy plik `.spec.ts` w katalogu `tests/e2e/`
2. Zaimportuj potrzebne klasy POM
3. Używaj wzorca Page Object Model do interakcji ze stronami

Przykład:

```typescript
import { test } from "@playwright/test";
import { LoginPage } from "../pom/auth";
import { FlashcardsPage } from "../pom/flashcards";

test("Użytkownik może utworzyć nową fiszkę", async ({ page }) => {
  // Logowanie
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login("test-e2e@example.com", "Test123!@#");

  // Tworzenie fiszki
  const flashcardsPage = new FlashcardsPage(page);
  await flashcardsPage.goto();
  const formPage = await flashcardsPage.goToAddFlashcard();
  await formPage.fillAndSave("Pytanie testowe", "Odpowiedź testowa");

  // Weryfikacja
  await flashcardsPage.expectSuccessNotification();
});
```

### Wskazówki dla początkujących

1. **Zacznij od prostych testów** - twórz testy od podstawowych funkcjonalności
2. **Unikaj skomplikowanych scenariuszy** - złożone testy są trudniejsze w utrzymaniu
3. **Izoluj testy** - każdy test powinien być niezależny od innych
4. **Używaj selektorów testowych** - zdefiniuj selektory w pliku `test-selectors.ts`
5. **Sprawdzaj logi** - w przypadku problemów, analiza raportów może pomóc zidentyfikować przyczynę
