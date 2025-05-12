# Test info

- Name: Testy sesji nauki >> Weryfikacja algorytmu Leitnera
- Location: C:\Users\Gutek\Documents\10x-cards\tests\e2e\study.spec.ts:48:3

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

    at loginUser (C:\Users\Gutek\Documents\10x-cards\tests\e2e\study.spec.ts:11:22)
    at C:\Users\Gutek\Documents\10x-cards\tests\e2e\study.spec.ts:17:5
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
- textbox "Hasło": Test123!@#
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
  14 | test.describe('Testy sesji nauki', () => {
  15 |   test.beforeEach(async ({ page }) => {
  16 |     // Zaloguj użytkownika przed każdym testem
  17 |     await loginUser(page);
  18 |   });
  19 |
  20 |   test('Przeprowadzenie sesji nauki', async ({ page }) => {
  21 |     // Przejście do sekcji "Sesja nauki"
  22 |     await page.goto('/study');
  23 |     await page.getByTestId('start-study-session-button').click();
  24 |     
  25 |     // Przejście przez 5 fiszek (lub mniej, jeśli nie ma tylu)
  26 |     for (let i = 0; i < 5; i++) {
  27 |       // Sprawdzenie, czy sesja się zakończyła
  28 |       const isSummary = await page.getByTestId('study-session-summary').isVisible();
  29 |       if (isSummary) break;
  30 |       
  31 |       // Weryfikacja wyświetlenia przodu fiszki
  32 |       await expect(page.getByTestId('flashcard-front')).toBeVisible();
  33 |       
  34 |       // Pokazanie odpowiedzi
  35 |       await page.getByTestId('show-answer-button').click();
  36 |       await expect(page.getByTestId('flashcard-back')).toBeVisible();
  37 |       
  38 |       // Wybór oceny (rotacja między różnymi poziomami)
  39 |       const difficultyOptions = ['difficult-button', 'medium-button', 'easy-button'];
  40 |       await page.getByTestId(difficultyOptions[i % 3]).click();
  41 |     }
  42 |     
  43 |     // Weryfikacja podsumowania sesji
  44 |     await expect(page.getByTestId('study-session-summary')).toBeVisible();
  45 |     await expect(page.getByTestId('session-stats')).toBeVisible();
  46 |   });
  47 |
  48 |   test('Weryfikacja algorytmu Leitnera', async ({ page }) => {
  49 |     // Przejście do statystyk przed sesją
  50 |     await page.goto('/stats');
  51 |     
  52 |     // Zapisanie początkowej dystrybucji fiszek
  53 |     const initialLevel1 = await page.getByTestId('leitner-level-1-count').textContent();
  54 |     const initialLevel2 = await page.getByTestId('leitner-level-2-count').textContent();
  55 |     const initialLevel3 = await page.getByTestId('leitner-level-3-count').textContent();
  56 |     
  57 |     // Przeprowadzenie sesji nauki
  58 |     await page.goto('/study');
  59 |     await page.getByTestId('start-study-session-button').click();
  60 |     
  61 |     // Ocenianie wszystkich fiszek jako "Łatwe"
  62 |     while (await page.getByTestId('flashcard-front').isVisible()) {
  63 |       await page.getByTestId('show-answer-button').click();
  64 |       await page.getByTestId('easy-button').click();
  65 |     }
  66 |     
  67 |     // Sprawdzenie zakończenia sesji
  68 |     await expect(page.getByTestId('study-session-summary')).toBeVisible();
  69 |     
  70 |     // Sprawdzenie dystrybucji fiszek po sesji
  71 |     await page.goto('/stats');
  72 |     
  73 |     // Weryfikacja zmiany poziomów Leitnera
  74 |     const finalLevel1 = await page.getByTestId('leitner-level-1-count').textContent();
  75 |     const finalLevel2 = await page.getByTestId('leitner-level-2-count').textContent();
  76 |     const finalLevel3 = await page.getByTestId('leitner-level-3-count').textContent();
  77 |     
  78 |     // Poziom 1 powinien zmaleć, a poziom 3 wzrosnąć
  79 |     expect(Number(finalLevel1)).toBeLessThan(Number(initialLevel1));
  80 |     expect(Number(finalLevel3)).toBeGreaterThan(Number(initialLevel3));
  81 |   });
  82 | }); 
```