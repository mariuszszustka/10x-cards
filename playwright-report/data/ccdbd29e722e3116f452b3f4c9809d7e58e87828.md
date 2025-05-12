# Test info

- Name: Testy zarządzania fiszkami >> Edycja istniejącej fiszki
- Location: C:\Users\Gutek\Documents\10x-cards\tests\e2e\flashcards.spec.ts:35:3

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveURL(expected)

Locator: locator(':root')
Expected string: "http://localhost:3000/dashboard"
Received string: "http://localhost:3000/auth/login"
Call log:
  - expect.toHaveURL with timeout 5000ms
  - waiting for locator(':root')
    9 × locator resolved to <html lang="en" data-astro-cid-sckkx6r4="">…</html>
      - unexpected value "http://localhost:3000/auth/login"

    at loginUser (C:\Users\Gutek\Documents\10x-cards\tests\e2e\flashcards.spec.ts:11:22)
    at C:\Users\Gutek\Documents\10x-cards\tests\e2e\flashcards.spec.ts:17:5
```

# Page snapshot

```yaml
- text: 10x
- heading "Zaloguj się" [level=1]
- text: Adres email
- textbox "Adres email": test-e2e@example.com
- text: Hasło
- link "Zapomniałem hasła":
  - /url: /auth/reset-password
- textbox "Hasło": Test123!@#
- paragraph: Nie udało się zalogować. Spróbuj użyć magicznego linku wysłanego na Twój email.
- paragraph: "Informacje diagnostyczne:"
- text: "{ \"status\": 400, \"type\": \"basic\", \"data\": { \"success\": false, \"error\": \"Nie udało się zalogować. Spróbuj użyć magicznego linku wysłanego na Twój email.\" } }"
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
   3 | import { AUTH, NOTIFICATIONS, DASHBOARD } from '../test-selectors';
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
  14 | test.describe('Testy zarządzania fiszkami', () => {
  15 |   test.beforeEach(async ({ page }) => {
  16 |     // Zaloguj użytkownika przed każdym testem
  17 |     await loginUser(page);
  18 |   });
  19 |
  20 |   test('Ręczne tworzenie fiszki', async ({ page }) => {
  21 |     // Przejście do sekcji "Moje fiszki"
  22 |     await page.goto('/flashcards');
  23 |     
  24 |     // Dodawanie nowej fiszki
  25 |     await page.getByTestId('add-flashcard-button').click();
  26 |     await page.getByTestId('flashcard-front-input').fill('Pytanie testowe E2E');
  27 |     await page.getByTestId('flashcard-back-input').fill('Odpowiedź testowa E2E');
  28 |     await page.getByTestId('save-flashcard-button').click();
  29 |     
  30 |     // Weryfikacja dodania fiszki
  31 |     await expect(page.getByTestId(NOTIFICATIONS.SUCCESS)).toBeVisible();
  32 |     await expect(page.getByText('Pytanie testowe E2E')).toBeVisible();
  33 |   });
  34 |
  35 |   test('Edycja istniejącej fiszki', async ({ page }) => {
  36 |     // Przejście do sekcji "Moje fiszki"
  37 |     await page.goto('/flashcards');
  38 |     
  39 |     // Wybór pierwszej fiszki do edycji
  40 |     await page.getByTestId('edit-flashcard-button').first().click();
  41 |     
  42 |     // Edycja fiszki
  43 |     await page.getByTestId('flashcard-front-input').fill('Zaktualizowane pytanie E2E');
  44 |     await page.getByTestId('flashcard-back-input').fill('Zaktualizowana odpowiedź E2E');
  45 |     await page.getByTestId('save-flashcard-button').click();
  46 |     
  47 |     // Weryfikacja aktualizacji
  48 |     await expect(page.getByTestId(NOTIFICATIONS.SUCCESS)).toBeVisible();
  49 |     await expect(page.getByText('Zaktualizowane pytanie E2E')).toBeVisible();
  50 |   });
  51 |
  52 |   test('Usuwanie fiszki', async ({ page }) => {
  53 |     // Przejście do sekcji "Moje fiszki"
  54 |     await page.goto('/flashcards');
  55 |     
  56 |     // Zapisanie liczby fiszek przed usunięciem
  57 |     const countBefore = await page.getByTestId('flashcard-item').count();
  58 |     
  59 |     // Usunięcie pierwszej fiszki
  60 |     await page.getByTestId('delete-flashcard-button').first().click();
  61 |     
  62 |     // Potwierdzenie usunięcia w oknie dialogowym
  63 |     await page.getByTestId('confirm-delete-button').click();
  64 |     
  65 |     // Weryfikacja usunięcia
  66 |     await expect(page.getByTestId(NOTIFICATIONS.SUCCESS)).toBeVisible();
  67 |     const countAfter = await page.getByTestId('flashcard-item').count();
  68 |     expect(countAfter).toBe(countBefore - 1);
  69 |   });
  70 | }); 
```