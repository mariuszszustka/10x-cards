# Test info

- Name: Testy generowania fiszek >> Anulowanie generowania
- Location: C:\Users\Gutek\Documents\10x-cards\tests\e2e\generation.spec.ts:51:3

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveURL(expected)

Locator: locator(':root')
Expected string: "http://localhost:3000/dashboard"
Received string: "http://localhost:3000/auth/login?email=test-e2e%40example.com&password=Test123%21%40%23"
Call log:
  - expect.toHaveURL with timeout 5000ms
  - waiting for locator(':root')
    9 × locator resolved to <html lang="en" data-astro-cid-sckkx6r4="">…</html>
      - unexpected value "http://localhost:3000/auth/login?email=test-e2e%40example.com&password=Test123%21%40%23"

    at loginUser (C:\Users\Gutek\Documents\10x-cards\tests\e2e\generation.spec.ts:11:22)
    at C:\Users\Gutek\Documents\10x-cards\tests\e2e\generation.spec.ts:17:5
```

# Page snapshot

```yaml
- text: 10x
- heading "Zaloguj się" [level=1]
- text: Adres email
- textbox "Adres email"
- text: Hasło
- link "Zapomniałem hasła":
  - /url: /auth/reset-password
- textbox "Hasło"
- button "Zaloguj się"
- paragraph: Problemy z logowaniem?
- button "Zaloguj się przez link wysłany na email"
- paragraph:
  - text: Nie masz jeszcze konta?
  - link "Zarejestruj się":
    - /url: /auth/register
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import type { Page } from '@playwright/test';
   3 | import { AUTH, NOTIFICATIONS } from '../test-selectors';
   4 |
   5 | // Pomocnicza funkcja do logowania
   6 | async function loginUser(page: Page) {
   7 |   await page.goto('/auth/login');
   8 |   await page.getByTestId(AUTH.EMAIL_INPUT).fill('test-e2e@example.com');
   9 |   await page.getByTestId(AUTH.PASSWORD_INPUT).fill('Test123!@#');
  10 |   await page.getByTestId(AUTH.SUBMIT_BUTTON).click();
> 11 |   await expect(page).toHaveURL('/dashboard');
     |                      ^ Error: Timed out 5000ms waiting for expect(locator).toHaveURL(expected)
  12 | }
  13 |
  14 | test.describe('Testy generowania fiszek', () => {
  15 |   test.beforeEach(async ({ page }) => {
  16 |     // Zaloguj użytkownika przed każdym testem
  17 |     await loginUser(page);
  18 |   });
  19 |
  20 |   test('Generowanie fiszek z tekstu źródłowego', async ({ page }) => {
  21 |     // Przejście do strony generowania fiszek
  22 |     await page.goto('/generate');
  23 |     
  24 |     // Przygotowanie tekstu źródłowego (min. 1000 znaków)
  25 |     const sourceText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(25);
  26 |     await page.getByTestId('source-text-input').fill(sourceText);
  27 |     
  28 |     // Wybór modelu AI
  29 |     await page.getByTestId('ai-model-selector').selectOption('llama3.2:3b');
  30 |     
  31 |     // Generowanie fiszek
  32 |     await page.getByTestId('generate-button').click();
  33 |     
  34 |     // Oczekiwanie na wygenerowanie propozycji (z timeoutem)
  35 |     await expect(page.getByTestId('flashcard-proposal')).toBeVisible({ timeout: 30000 });
  36 |     
  37 |     // Zatwierdzenie pierwszych trzech propozycji
  38 |     for (let i = 0; i < 3; i++) {
  39 |       await page.getByTestId('approve-button').nth(i).click();
  40 |     }
  41 |     
  42 |     // Zapisanie zatwierdzonych fiszek
  43 |     await page.getByTestId('save-approved-button').click();
  44 |     await expect(page.getByTestId(NOTIFICATIONS.SUCCESS)).toBeVisible();
  45 |     
  46 |     // Weryfikacja, czy fiszki pojawiły się w sekcji "Moje fiszki"
  47 |     await page.goto('/flashcards');
  48 |     await expect(page.getByTestId('flashcard-item')).toHaveCount(3);
  49 |   });
  50 |
  51 |   test('Anulowanie generowania', async ({ page }) => {
  52 |     // Przejście do strony generowania fiszek
  53 |     await page.goto('/generate');
  54 |     
  55 |     // Wprowadzenie fragmentu tekstu
  56 |     await page.getByTestId('source-text-input').fill('Fragment tekstu');
  57 |     
  58 |     // Kliknięcie przycisku generowania
  59 |     await page.getByTestId('generate-button').click();
  60 |     
  61 |     // Anulowanie procesu
  62 |     await page.getByTestId('cancel-button').click();
  63 |     
  64 |     // Weryfikacja powrotu do stanu początkowego
  65 |     await expect(page.getByTestId('generate-button')).toBeVisible();
  66 |     await expect(page.getByTestId('source-text-input')).toBeEmpty();
  67 |   });
  68 |
  69 |   test('Błąd przy generowaniu - za krótki tekst', async ({ page }) => {
  70 |     // Przejście do strony generowania fiszek
  71 |     await page.goto('/generate');
  72 |     
  73 |     // Wprowadzenie zbyt krótkiego tekstu
  74 |     await page.getByTestId('source-text-input').fill('Za krótki tekst');
  75 |     
  76 |     // Kliknięcie przycisku generowania
  77 |     await page.getByTestId('generate-button').click();
  78 |     
  79 |     // Weryfikacja komunikatu o błędzie
  80 |     await expect(page.getByTestId(NOTIFICATIONS.ERROR)).toBeVisible();
  81 |     await expect(page.getByTestId(NOTIFICATIONS.ERROR)).toContainText('za krótki');
  82 |   });
  83 | }); 
```