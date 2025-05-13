# Test info

- Name: Podstawowy smoke test aplikacji
- Location: C:\Users\Gutek\Documents\10x-cards\src\tests\e2e\smoke-test.spec.ts:34:1

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "10x-cards"
Received string:    "10x Cards - Tworzenie i nauka z fiszkami napędzanymi przez AI"
    at C:\Users\Gutek\Documents\10x-cards\src\tests\e2e\smoke-test.spec.ts:43:17
```

# Page snapshot

```yaml
- link "Zaloguj się":
  - /url: /auth/login
- link "Zarejestruj się":
  - /url: /auth/register
- heading "Witaj w 10xDevs Astro Starter!" [level=1]
- paragraph: "Ten projekt został zbudowany w oparciu o nowoczesny stack technologiczny:"
- heading "Core" [level=2]
- list:
  - listitem: Astro v5.5.5 - Metaframework do aplikacji webowych
  - listitem: React v19 - Biblioteka UI do komponentów interaktywnych
  - listitem: TypeScript - Typowanie statyczne
- heading "Stylowanie" [level=2]
- list:
  - listitem: Tailwind CSS v4 - Utility-first CSS framework
- heading "Statyczna analiza kodu" [level=2]
- list:
  - listitem: ESLint v9 - Lintowanie kodu
  - listitem: Prettier - Formatowanie kodu
  - listitem: Husky i Lint-staged - Automatyczna analiza kodu przed commitowaniem
- paragraph: Starter zawiera wszystko, czego potrzebujesz do rozpoczęcia tworzenia nowoczesnych aplikacji webowych!
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import { ensureArtifactsDir } from './helpers';
   3 | import * as fs from 'fs';
   4 |
   5 | test('Strona główna ładuje się poprawnie', async ({ page }) => {
   6 |   ensureArtifactsDir();
   7 |   
   8 |   console.log('Rozpoczynam test strony głównej');
   9 |   
  10 |   // 1. Otwórz stronę główną
  11 |   await page.goto('/', { timeout: 30000 });
  12 |   console.log('Otwarto stronę główną:', page.url());
  13 |   
  14 |   // 2. Wykonaj zrzut ekranu
  15 |   await page.screenshot({ path: './test-artifacts/homepage.png', fullPage: true });
  16 |   
  17 |   // 3. Sprawdź czy strona ma tytuł
  18 |   const title = await page.title();
  19 |   console.log('Tytuł strony:', title);
  20 |   expect(title.length).toBeGreaterThan(0);
  21 |   
  22 |   // 4. Sprawdź podstawowe elementy strony
  23 |   const html = await page.content();
  24 |   expect(html).toContain('</html>');
  25 |   expect(html.length).toBeGreaterThan(1000); // Strona nie powinna być pusta
  26 |   
  27 |   // 5. Zapisz HTML do analizy
  28 |   fs.writeFileSync('./test-artifacts/homepage.html', html);
  29 |   
  30 |   console.log('Test strony głównej zakończony pomyślnie');
  31 | });
  32 |
  33 | // Smoke test - sprawdza czy podstawowe funkcje działają
  34 | test('Podstawowy smoke test aplikacji', async ({ page }) => {
  35 |   console.log('Rozpoczynam smoke test');
  36 |   
  37 |   // Sprawdzenie czy strona główna się ładuje
  38 |   await page.goto('/');
  39 |   console.log('Strona główna załadowana');
  40 |   
  41 |   // Sprawdzenie czy tytuł strony zawiera właściwy tekst
  42 |   const title = await page.title();
> 43 |   expect(title).toContain('10x-cards'); // Dopasuj do rzeczywistego tytułu
     |                 ^ Error: expect(received).toContain(expected) // indexOf
  44 |   
  45 |   // Sprawdzenie czy menu główne jest dostępne
  46 |   const navbar = page.locator('nav');
  47 |   await expect(navbar).toBeVisible();
  48 |   
  49 |   // Sprawdzenie czy jest przycisk/link logowania
  50 |   const loginLink = page.getByRole('link', { name: /logowanie|login|zaloguj/i });
  51 |   await expect(loginLink).toBeVisible();
  52 |   
  53 |   // Przejście do strony logowania
  54 |   await loginLink.click();
  55 |   
  56 |   // Sprawdzenie czy jesteśmy na stronie logowania
  57 |   expect(page.url()).toContain('/auth/login');
  58 |   
  59 |   // Sprawdzenie czy formularz logowania jest widoczny
  60 |   const emailInput = page.locator('input[type="email"]');
  61 |   const passwordInput = page.locator('input[type="password"]');
  62 |   
  63 |   await expect(emailInput).toBeVisible();
  64 |   await expect(passwordInput).toBeVisible();
  65 |   
  66 |   console.log('Smoke test zakończony pomyślnie');
  67 | }); 
```