# Scenariusze testów E2E dla aplikacji 10x-cards

## Wprowadzenie

Niniejszy dokument zawiera szczegółowe scenariusze testów E2E (End-to-End) dla aplikacji 10x-cards, które mają na celu weryfikację poprawności działania kluczowych funkcjonalności z perspektywy użytkownika końcowego. Testy zostały zaprojektowane z wykorzystaniem biblioteki Playwright i są zgodne z wymaganiami zawartymi w PRD.

## Konfiguracja środowiska testowego

### Wymagania wstępne

- Node.js (wersja 16 lub nowsza)
- Playwright zainstalowany jako zależność projektu
- Dostęp do środowiska testowego z uruchomioną aplikacją 10x-cards
- Izolowana baza danych Supabase do testów E2E

### Przygotowanie środowiska

```typescript
// global-setup.ts
import { FullConfig } from '@playwright/test';
import { chromium } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // Przygotowanie testowej bazy danych
  // Utworzenie testowego użytkownika
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Rejestracja testowego użytkownika do testów
  await page.goto('http://localhost:3000/register');
  await page.fill('input[name="email"]', 'test-e2e@example.com');
  await page.fill('input[name="password"]', 'Test123!@#');
  await page.fill('input[name="confirmPassword"]', 'Test123!@#');
  await page.click('button[type="submit"]');
  
  // Dodanie testowych fiszek do konta
  // ...

  await browser.close();
}

export default globalSetup;
```

## Scenariusze testowe

### 1. Dostęp do aplikacji

#### 1.1 Rejestracja nowego użytkownika

**ID**: E2E-REG-001  
**Opis**: Weryfikacja procesu rejestracji nowego użytkownika  
**Warunki wstępne**: Użytkownik nie jest zalogowany, adres email nie jest używany w systemie  

**Kroki**:
1. Otwarcie strony głównej aplikacji
2. Kliknięcie przycisku "Zarejestruj się"
3. Wypełnienie formularza rejestracyjnego:
   - Wprowadzenie adresu email: `nowy-uzytkownik@example.com`
   - Wprowadzenie hasła: `NoweHaslo123!`
   - Potwierdzenie hasła: `NoweHaslo123!`
4. Kliknięcie przycisku "Zarejestruj"

**Oczekiwany rezultat**:
- Użytkownik zostaje przekierowany do strony głównej (dashboard)
- Wyświetlana jest wiadomość powitalna z informacją o pomyślnej rejestracji
- W prawym górnym rogu widoczne są opcje zalogowanego użytkownika

**Implementacja testu**:
```typescript
test('Rejestracja nowego użytkownika', async ({ page }) => {
  // Generowanie unikalnego adresu email
  const uniqueEmail = `user-${Date.now()}@example.com`;
  
  await page.goto('/');
  await page.click('button:text("Zarejestruj się")');
  
  // Wypełnianie formularza
  await page.fill('input[name="email"]', uniqueEmail);
  await page.fill('input[name="password"]', 'NoweHaslo123!');
  await page.fill('input[name="confirmPassword"]', 'NoweHaslo123!');
  await page.click('button[type="submit"]');
  
  // Weryfikacja wyniku
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('.welcome-message')).toContainText('Witaj');
  await expect(page.locator('.user-menu')).toBeVisible();
});
```

#### 1.2 Logowanie istniejącego użytkownika

**ID**: E2E-LOG-001  
**Opis**: Weryfikacja procesu logowania istniejącego użytkownika  
**Warunki wstępne**: Użytkownik z adresem `test-e2e@example.com` istnieje w systemie  

**Kroki**:
1. Otwarcie strony logowania
2. Wprowadzenie adresu email: `test-e2e@example.com`
3. Wprowadzenie hasła: `Test123!@#`
4. Kliknięcie przycisku "Zaloguj"

**Oczekiwany rezultat**:
- Użytkownik zostaje przekierowany do strony głównej (dashboard)
- W prawym górnym rogu widoczne są opcje zalogowanego użytkownika

**Implementacja testu**:
```typescript
test('Logowanie istniejącego użytkownika', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test-e2e@example.com');
  await page.fill('input[name="password"]', 'Test123!@#');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('.user-menu')).toBeVisible();
});
```

#### 1.3 Odzyskiwanie hasła

**ID**: E2E-PASS-001  
**Opis**: Weryfikacja procesu odzyskiwania hasła  
**Warunki wstępne**: Użytkownik z adresem `test-e2e@example.com` istnieje w systemie  

**Kroki**:
1. Otwarcie strony logowania
2. Kliknięcie linku "Zapomniałem hasła"
3. Wprowadzenie adresu email: `test-e2e@example.com`
4. Kliknięcie przycisku "Wyślij link resetujący"

**Oczekiwany rezultat**:
- Wyświetlany jest komunikat o wysłaniu linku resetującego

**Implementacja testu**:
```typescript
test('Odzyskiwanie hasła', async ({ page }) => {
  await page.goto('/login');
  await page.click('a:text("Zapomniałem hasła")');
  
  await expect(page).toHaveURL('/reset-password');
  await page.fill('input[name="email"]', 'test-e2e@example.com');
  await page.click('button[type="submit"]');
  
  await expect(page.locator('.notification-success')).toContainText('Link resetujący został wysłany');
});
```

### 2. Zarządzanie fiszkami

#### 2.1 Generowanie fiszek przez AI

**ID**: E2E-GEN-001  
**Opis**: Weryfikacja procesu generowania fiszek przy użyciu AI  
**Warunki wstępne**: Użytkownik jest zalogowany, ma dostęp do funkcji generowania  

**Kroki**:
1. Przejście do sekcji "Generuj fiszki"
2. Wprowadzenie tekstu źródłowego (min. 1000 znaków)
3. Wybór modelu AI (domyślnie llama3.2:3b)
4. Kliknięcie przycisku "Generuj fiszki"
5. Oczekiwanie na propozycje fiszek
6. Zatwierdzenie kilku wygenerowanych propozycji
7. Kliknięcie przycisku "Zapisz zatwierdzone"

**Oczekiwany rezultat**:
- System generuje listę propozycji fiszek
- Zatwierdzone fiszki są zapisywane w bazie danych
- Użytkownik widzi komunikat o pomyślnym zapisaniu fiszek

**Implementacja testu**:
```typescript
test('Generowanie fiszek przez AI', async ({ page }) => {
  // Logowanie użytkownika
  await loginUser(page);
  
  // Przejście do generowania fiszek
  await page.click('a:text("Generuj fiszki")');
  
  // Przygotowanie tekstu źródłowego (przykładowy tekst)
  const sourceText = 'Lorem ipsum dolor sit amet...'.repeat(50); // min. 1000 znaków
  await page.fill('textarea[name="sourceText"]', sourceText);
  
  // Wybór modelu AI
  await page.selectOption('select[name="model"]', 'llama3.2:3b');
  
  // Generowanie fiszek
  await page.click('button:text("Generuj fiszki")');
  
  // Oczekiwanie na wygenerowanie propozycji (z timeoutem)
  await expect(page.locator('.flashcard-proposal')).toBeVisible({ timeout: 30000 });
  
  // Zatwierdzenie pierwszych trzech propozycji
  for (let i = 0; i < 3; i++) {
    await page.click(`.flashcard-proposal:nth-child(${i + 1}) button:text("Zatwierdź")`);
  }
  
  // Zapisanie zatwierdzonych fiszek
  await page.click('button:text("Zapisz zatwierdzone")');
  await expect(page.locator('.notification-success')).toBeVisible();
  
  // Weryfikacja, czy fiszki pojawiły się w sekcji "Moje fiszki"
  await page.click('a:text("Moje fiszki")');
  await expect(page.locator('.flashcard-item')).toHaveCount(3);
});
```

#### 2.2 Ręczne tworzenie fiszki

**ID**: E2E-CREATE-001  
**Opis**: Weryfikacja procesu ręcznego tworzenia fiszki  
**Warunki wstępne**: Użytkownik jest zalogowany  

**Kroki**:
1. Przejście do sekcji "Moje fiszki"
2. Kliknięcie przycisku "Dodaj fiszkę"
3. Wprowadzenie treści przodu fiszki: "Pytanie testowe"
4. Wprowadzenie treści tyłu fiszki: "Odpowiedź testowa"
5. Kliknięcie przycisku "Zapisz"

**Oczekiwany rezultat**:
- Fiszka zostaje dodana do listy fiszek użytkownika
- Wyświetlany jest komunikat o pomyślnym dodaniu fiszki

**Implementacja testu**:
```typescript
test('Ręczne tworzenie fiszki', async ({ page }) => {
  // Logowanie użytkownika
  await loginUser(page);
  
  // Przejście do sekcji "Moje fiszki"
  await page.click('a:text("Moje fiszki")');
  
  // Dodawanie nowej fiszki
  await page.click('button:text("Dodaj fiszkę")');
  await page.fill('input[name="front"]', 'Pytanie testowe E2E');
  await page.fill('textarea[name="back"]', 'Odpowiedź testowa E2E');
  await page.click('button:text("Zapisz")');
  
  // Weryfikacja dodania fiszki
  await expect(page.locator('.notification-success')).toBeVisible();
  await expect(page.locator('.flashcard-item:has-text("Pytanie testowe E2E")')).toBeVisible();
});
```

#### 2.3 Edycja istniejącej fiszki

**ID**: E2E-EDIT-001  
**Opis**: Weryfikacja procesu edycji istniejącej fiszki  
**Warunki wstępne**: Użytkownik jest zalogowany, posiada co najmniej jedną fiszkę  

**Kroki**:
1. Przejście do sekcji "Moje fiszki"
2. Znalezienie fiszki do edycji
3. Kliknięcie przycisku "Edytuj" przy wybranej fiszce
4. Zmiana treści przodu fiszki na: "Zaktualizowane pytanie"
5. Zmiana treści tyłu fiszki na: "Zaktualizowana odpowiedź"
6. Kliknięcie przycisku "Zapisz zmiany"

**Oczekiwany rezultat**:
- Fiszka zostaje zaktualizowana
- Wyświetlany jest komunikat o pomyślnej aktualizacji

**Implementacja testu**:
```typescript
test('Edycja istniejącej fiszki', async ({ page }) => {
  // Logowanie użytkownika
  await loginUser(page);
  
  // Przejście do sekcji "Moje fiszki"
  await page.click('a:text("Moje fiszki")');
  
  // Wybór pierwszej fiszki do edycji
  await page.click('.flashcard-item:first-child button:text("Edytuj")');
  
  // Edycja fiszki
  await page.fill('input[name="front"]', 'Zaktualizowane pytanie E2E');
  await page.fill('textarea[name="back"]', 'Zaktualizowana odpowiedź E2E');
  await page.click('button:text("Zapisz zmiany")');
  
  // Weryfikacja aktualizacji
  await expect(page.locator('.notification-success')).toBeVisible();
  await expect(page.locator('.flashcard-item:has-text("Zaktualizowane pytanie E2E")')).toBeVisible();
});
```

#### 2.4 Usuwanie fiszki

**ID**: E2E-DELETE-001  
**Opis**: Weryfikacja procesu usuwania fiszki  
**Warunki wstępne**: Użytkownik jest zalogowany, posiada co najmniej jedną fiszkę  

**Kroki**:
1. Przejście do sekcji "Moje fiszki"
2. Znalezienie fiszki do usunięcia
3. Kliknięcie przycisku "Usuń" przy wybranej fiszce
4. Potwierdzenie chęci usunięcia fiszki

**Oczekiwany rezultat**:
- Fiszka zostaje usunięta z listy
- Wyświetlany jest komunikat o pomyślnym usunięciu

**Implementacja testu**:
```typescript
test('Usuwanie fiszki', async ({ page }) => {
  // Logowanie użytkownika
  await loginUser(page);
  
  // Przejście do sekcji "Moje fiszki"
  await page.click('a:text("Moje fiszki")');
  
  // Zapisanie liczby fiszek przed usunięciem
  const countBefore = await page.locator('.flashcard-item').count();
  
  // Usunięcie pierwszej fiszki
  await page.click('.flashcard-item:first-child button:text("Usuń")');
  
  // Potwierdzenie usunięcia w oknie dialogowym
  await page.click('button:text("Potwierdź")');
  
  // Weryfikacja usunięcia
  await expect(page.locator('.notification-success')).toBeVisible();
  const countAfter = await page.locator('.flashcard-item').count();
  expect(countAfter).toBe(countBefore - 1);
});
```

### 3. Sesja nauki

#### 3.1 Przeprowadzenie sesji nauki

**ID**: E2E-STUDY-001  
**Opis**: Weryfikacja procesu przeprowadzenia sesji nauki z algorytmem powtórek  
**Warunki wstępne**: Użytkownik jest zalogowany, posiada co najmniej 5 fiszek  

**Kroki**:
1. Przejście do sekcji "Sesja nauki"
2. Kliknięcie przycisku "Rozpocznij sesję"
3. Dla każdej fiszki:
   - Zapoznanie się z pytaniem (przód fiszki)
   - Kliknięcie przycisku "Pokaż odpowiedź"
   - Ocena znajomości (Trudna/Średnia/Łatwa)
4. Przejście przez wszystkie fiszki

**Oczekiwany rezultat**:
- Użytkownik widzi fiszki jedna po drugiej
- Po zakończeniu sesji wyświetlane jest podsumowanie
- Fiszki są przypisywane do odpowiednich poziomów w systemie Leitnera

**Implementacja testu**:
```typescript
test('Przeprowadzenie sesji nauki', async ({ page }) => {
  // Logowanie użytkownika
  await loginUser(page);
  
  // Przejście do sekcji "Sesja nauki"
  await page.click('a:text("Sesja nauki")');
  await page.click('button:text("Rozpocznij sesję")');
  
  // Przejście przez 5 fiszek (lub mniej, jeśli nie ma tylu)
  for (let i = 0; i < 5; i++) {
    // Sprawdzenie, czy sesja się zakończyła
    const isSummary = await page.locator('h2:text("Podsumowanie sesji")').isVisible();
    if (isSummary) break;
    
    // Weryfikacja wyświetlenia przodu fiszki
    await expect(page.locator('.flashcard-front')).toBeVisible();
    
    // Pokazanie odpowiedzi
    await page.click('button:text("Pokaż odpowiedź")');
    await expect(page.locator('.flashcard-back')).toBeVisible();
    
    // Wybór oceny (rotacja między różnymi poziomami)
    const difficultyOptions = ['Trudna', 'Średnia', 'Łatwa'];
    await page.click(`button:text("${difficultyOptions[i % 3]}")`);
  }
  
  // Weryfikacja podsumowania sesji
  await expect(page.locator('h2:text("Podsumowanie sesji")')).toBeVisible();
  await expect(page.locator('.session-stats')).toBeVisible();
});
```

#### 3.2 Weryfikacja działania algorytmu Leitnera

**ID**: E2E-LEITNER-001  
**Opis**: Weryfikacja poprawności działania systemu Leitnera przy kolejnych sesjach nauki  
**Warunki wstępne**: Użytkownik jest zalogowany, przeprowadził co najmniej jedną sesję nauki  

**Kroki**:
1. Przeprowadzenie pierwszej sesji nauki z określonym wzorcem ocen
2. Sprawdzenie dystrybucji fiszek po poziomach w podsumowaniu
3. Przejście do kolejnej sesji nauki
4. Weryfikacja, czy pojawiają się odpowiednie fiszki zgodnie z algorytmem Leitnera

**Oczekiwany rezultat**:
- Fiszki ocenione jako "Trudne" pojawiają się w następnej sesji
- Fiszki ocenione jako "Średnie" pojawiają się po 3 dniach
- Fiszki ocenione jako "Łatwe" pojawiają się po 7 dniach

**Implementacja testu**:
```typescript
test('Weryfikacja działania algorytmu Leitnera', async ({ page }) => {
  // To jest bardziej zaawansowany test, który wymaga manipulacji czasem
  // W środowisku testowym możemy to symulować przez bezpośrednią modyfikację
  // dat w bazie danych lub użycie mocków
  
  // Logowanie użytkownika
  await loginUser(page);
  
  // Symulacja ukończonej sesji nauki
  await simulateCompletedStudySession(page);
  
  // Sprawdzenie dystrybucji fiszek po poziomach
  await page.click('a:text("Statystyki")');
  await expect(page.locator('.leitner-level-1-count')).toBeVisible();
  await expect(page.locator('.leitner-level-2-count')).toBeVisible();
  await expect(page.locator('.leitner-level-3-count')).toBeVisible();
  
  // Symulacja upływu czasu (1 dzień) - tu potrzebna będzie dedykowana funkcja
  await simulateTimePassage(1);
  
  // Rozpoczęcie nowej sesji
  await page.click('a:text("Sesja nauki")');
  await page.click('button:text("Rozpocznij sesję")');
  
  // Sprawdzenie, czy fiszki z poziomu 1 (trudne) są obecne
  await expect(page.locator('.flashcard-front')).toBeVisible();
  
  // Dodatkowa weryfikacja na podstawie danych z API/bazy
  const sessionData = await getStudySessionData();
  expect(sessionData.flashcardsFromLevel1).toBeGreaterThan(0);
  expect(sessionData.flashcardsFromLevel2).toBe(0); // nie powinno być fiszek z poziomu 2 po 1 dniu
  expect(sessionData.flashcardsFromLevel3).toBe(0); // nie powinno być fiszek z poziomu 3 po 1 dniu
});
```

### 4. Wylogowanie

#### 4.1 Wylogowanie użytkownika

**ID**: E2E-LOGOUT-001  
**Opis**: Weryfikacja procesu wylogowania użytkownika  
**Warunki wstępne**: Użytkownik jest zalogowany  

**Kroki**:
1. Kliknięcie menu użytkownika w prawym górnym rogu
2. Kliknięcie opcji "Wyloguj"

**Oczekiwany rezultat**:
- Użytkownik zostaje wylogowany
- Następuje przekierowanie na stronę główną dla niezalogowanych
- Opcje dla zalogowanych użytkowników nie są dostępne

**Implementacja testu**:
```typescript
test('Wylogowanie użytkownika', async ({ page }) => {
  // Logowanie użytkownika
  await loginUser(page);
  
  // Wylogowanie
  await page.click('.user-menu');
  await page.click('button:text("Wyloguj")');
  
  // Weryfikacja wylogowania
  await expect(page).toHaveURL('/');
  await expect(page.locator('button:text("Zaloguj")')).toBeVisible();
  await expect(page.locator('button:text("Zarejestruj się")')).toBeVisible();
  
  // Próba dostępu do chronionej strony
  await page.goto('/dashboard');
  await expect(page).toHaveURL('/login'); // powinno przekierować na stronę logowania
});
```

## Funkcje pomocnicze

```typescript
// helpers.ts

// Logowanie użytkownika
async function loginUser(page) {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test-e2e@example.com');
  await page.fill('input[name="password"]', 'Test123!@#');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
}

// Symulacja ukończonej sesji nauki
async function simulateCompletedStudySession(page) {
  // Implementacja zależna od struktury aplikacji
  // Może wymagać bezpośredniego wywołania API lub manipulacji bazą danych
}

// Symulacja upływu czasu
async function simulateTimePassage(days) {
  // Implementacja zależna od struktury aplikacji
  // Możliwa manipulacja datami w bazie danych lub użycie mocków
}

// Pobieranie danych sesji nauki
async function getStudySessionData() {
  // Implementacja pobierania danych z API lub bazy
  // Zwraca informacje o fiszkach w sesji
}
```

## Podejście do raportowania błędów

Podczas wykonywania testów, każdy znaleziony błąd powinien być raportowany w następującym formacie:

1. **ID testu**: Identyfikator testu, który wykrył błąd
2. **Typ błędu**: Krytyczny / Ważny / Drobny
3. **Opis problemu**: Szczegółowy opis napotkanych trudności
4. **Kroki reprodukcji**: Dokładna sekwencja kroków prowadząca do błędu
5. **Oczekiwany rezultat**: Co powinno się wydarzyć
6. **Aktualny rezultat**: Co faktycznie się wydarzyło
7. **Załączniki**: Zrzuty ekranu, logi, nagrania wideo

Testy E2E z Playwright umożliwiają automatyczne generowanie zrzutów ekranu i nagrań wideo w przypadku niepowodzenia testu, co znacząco usprawnia proces debugowania i naprawiania błędów.

## Podsumowanie

Przedstawione scenariusze testowe E2E pokrywają kluczowe funkcjonalności aplikacji 10x-cards zgodnie z wymaganiami określonymi w PRD. Implementacja tych testów z wykorzystaniem Playwright zapewni kompleksową weryfikację działania aplikacji z perspektywy użytkownika końcowego.

Scenariusze należy regularnie aktualizować w miarę rozwoju aplikacji i dodawania nowych funkcjonalności.
