# Test info

- Name: Podstawowy test logowania użytkownika
- Location: C:\Users\Gutek\Documents\10x-cards\src\tests\e2e\auth-basic.spec.ts:4:1

# Error details

```
Error: expect.toBeVisible: Error: strict mode violation: getByRole('link', { name: /fiszki/i }) resolved to 2 elements:
    1) <a href="/generate" data-astro-source-loc="27:108" class="bg-blue-600 hover:bg-blue-700 p-6 rounded-lg shadow-md transition-colors" data-astro-source-file="C:/Users/Gutek/Documents/10x-cards/src/pages/dashboard.astro">…</a> aka getByRole('link', { name: 'Generuj fiszki z AI' })
    2) <a href="/flashcards" data-astro-source-loc="32:114" class="bg-purple-600 hover:bg-purple-700 p-6 rounded-lg shadow-md transition-colors" data-astro-source-file="C:/Users/Gutek/Documents/10x-cards/src/pages/dashboard.astro">…</a> aka getByRole('link', { name: 'Zarządzaj fiszkami Przeglądaj' })

Call log:
  - expect.toBeVisible with timeout 15000ms
  - waiting for getByRole('link', { name: /fiszki/i })

    at C:\Users\Gutek\Documents\10x-cards\src\tests\e2e\auth-basic.spec.ts:36:32
```

# Page snapshot

```yaml
- navigation:
  - link "10x Cards":
    - /url: /
  - link "Zaloguj się":
    - /url: /auth/login
  - link "Zarejestruj się":
    - /url: /auth/register
- main:
  - heading "Witaj w aplikacji 10x Cards!" [level=1]
  - paragraph: "Zalogowany jako: test-e2e@example.com"
  - paragraph: "User ID: test-e2e-user-id"
  - paragraph: "Uwaga: Sesja serwerowa nie została znaleziona. Niektóre funkcje mogą nie działać."
  - link "Generuj fiszki z AI Wykorzystaj sztuczną inteligencję do tworzenia fiszek na podstawie tekstów.":
    - /url: /generate
    - heading "Generuj fiszki z AI" [level=2]
    - paragraph: Wykorzystaj sztuczną inteligencję do tworzenia fiszek na podstawie tekstów.
  - link "Zarządzaj fiszkami Przeglądaj, edytuj i organizuj swoje fiszki.":
    - /url: /flashcards
    - heading "Zarządzaj fiszkami" [level=2]
    - paragraph: Przeglądaj, edytuj i organizuj swoje fiszki.
  - link "Nauka z systemem Leitnera Rozpocznij sesję nauki z wykorzystaniem systemu interwałów.":
    - /url: /leitner
    - heading "Nauka z systemem Leitnera" [level=2]
    - paragraph: Rozpocznij sesję nauki z wykorzystaniem systemu interwałów.
  - link "Statystyki Sprawdź swoje postępy i skuteczność nauki.":
    - /url: /stats
    - heading "Statystyki" [level=2]
    - paragraph: Sprawdź swoje postępy i skuteczność nauki.
  - link "Diagnostyka sesji":
    - /url: /auth/debug
- contentinfo:
  - paragraph: © 2025 10x Cards. Wszystkie prawa zastrzeżone.
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
  29 |   await page.waitForURL('**/dashboard');
  30 |   
  31 |   // Sprawdzamy, czy jesteśmy na stronie dashboard
  32 |   expect(page.url()).toContain('/dashboard');
  33 |   
  34 |   // Sprawdzamy, czy na dashboard jest link do fiszek
  35 |   const flashcardsLink = page.getByRole('link', { name: /fiszki/i });
> 36 |   await expect(flashcardsLink).toBeVisible();
     |                                ^ Error: expect.toBeVisible: Error: strict mode violation: getByRole('link', { name: /fiszki/i }) resolved to 2 elements:
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