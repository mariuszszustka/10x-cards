# Test info

- Name: Podstawowy test logowania użytkownika
- Location: C:\Users\Gutek\Documents\10x-cards\src\tests\e2e\auth-basic.spec.ts:4:1

# Error details

```
TimeoutError: page.waitForURL: Timeout 40000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/dashboard" until "load"
============================================================
    at C:\Users\Gutek\Documents\10x-cards\src\tests\e2e\auth-basic.spec.ts:29:14
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
- button "Zaloguj się linkiem magicznym"
- paragraph:
  - text: Nie masz jeszcze konta?
  - link "Zarejestruj się":
    - /url: /auth/register
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | // Podstawowy test logowania użytkownika
   4 | test('Podstawowy test logowania użytkownika', async ({ page }) => {
   5 |   console.log('Rozpoczynam test podstawowego logowania');
   6 |   
   7 |   // Otwieramy stronę logowania
   8 |   await page.goto('/auth/login');
   9 |   console.log('Otwarto stronę logowania');
  10 |   
  11 |   // Sprawdzamy, czy formularz logowania jest widoczny
  12 |   const emailInput = page.locator('input[type="email"]');
  13 |   const passwordInput = page.locator('input[type="password"]');
  14 |   const loginButton = page.locator('button[type="submit"]');
  15 |
  16 |   // Sprawdzamy, czy pola formularza istnieją
  17 |   await expect(emailInput).toBeVisible();
  18 |   await expect(passwordInput).toBeVisible();
  19 |   await expect(loginButton).toBeVisible();
  20 |   
  21 |   // Wypełniamy formularz
  22 |   await emailInput.fill('test-e2e@example.com');
  23 |   await passwordInput.fill('Test123!@#');
  24 |   
  25 |   // Klikamy przycisk logowania
  26 |   await loginButton.click();
  27 |   
  28 |   // Czekamy na przekierowanie na dashboard
> 29 |   await page.waitForURL('**/dashboard');
     |              ^ TimeoutError: page.waitForURL: Timeout 40000ms exceeded.
  30 |   
  31 |   // Sprawdzamy, czy jesteśmy na stronie dashboard
  32 |   expect(page.url()).toContain('/dashboard');
  33 |   
  34 |   // Sprawdzamy, czy na dashboard jest link do fiszek
  35 |   const flashcardsLink = page.getByRole('link', { name: /fiszki/i });
  36 |   await expect(flashcardsLink).toBeVisible();
  37 |   
  38 |   // Klikamy w link do fiszek
  39 |   await flashcardsLink.click();
  40 |   
  41 |   // Sprawdzamy, czy jesteśmy na stronie fiszek
  42 |   await page.waitForURL('**/flashcards');
  43 |   expect(page.url()).toContain('/flashcards');
  44 |   
  45 |   console.log('Test logowania zakończony pomyślnie');
  46 | }); 
```