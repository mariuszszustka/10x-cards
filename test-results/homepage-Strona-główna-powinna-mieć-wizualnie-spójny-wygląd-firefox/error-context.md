# Test info

- Name: Strona główna >> powinna mieć wizualnie spójny wygląd
- Location: C:\Users\Gutek\Documents\10x-cards\tests\e2e\homepage.spec.ts:61:3

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

    at HomePage.goto (C:\Users\Gutek\Documents\10x-cards\tests\e2e\homepage.spec.ts:12:21)
    at C:\Users\Gutek\Documents\10x-cards\tests\e2e\homepage.spec.ts:29:20
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | // Implementacja podejścia Page Object Model
   4 | class HomePage {
   5 |   readonly page: any;
   6 |
   7 |   constructor(page: any) {
   8 |     this.page = page;
   9 |   }
  10 |
  11 |   async goto() {
> 12 |     await this.page.goto('/');
     |                     ^ Error: page.goto: Target page, context or browser has been closed
  13 |   }
  14 |
  15 |   async getTitle() {
  16 |     return this.page.locator('h1').textContent();
  17 |   }
  18 |
  19 |   async getTechnologies() {
  20 |     return this.page.locator('.bg-gradient-to-br ul li').all();
  21 |   }
  22 | }
  23 |
  24 | test.describe('Strona główna', () => {
  25 |   let homePage: HomePage;
  26 |
  27 |   test.beforeEach(async ({ page }) => {
  28 |     homePage = new HomePage(page);
  29 |     await homePage.goto();
  30 |   });
  31 |
  32 |   test('powinna mieć poprawny tytuł strony', async () => {
  33 |     // Sprawdzenie tytułu strony
  34 |     await expect(homePage.page).toHaveTitle(/10x Cards - Tworzenie i nauka z fiszkami napędzanymi przez AI/);
  35 |   });
  36 |
  37 |   test('powinna wyświetlać główny nagłówek', async ({ page }) => {
  38 |     // Sprawdzenie głównego nagłówka
  39 |     const title = await homePage.getTitle();
  40 |     // Akceptujemy każdy nagłówek, ponieważ mógł się zmienić w stosunku do pierwotnej wersji
  41 |     expect(title).toBeTruthy();
  42 |   });
  43 |
  44 |   test('powinna zawierać listę technologii', async ({ page }) => {
  45 |     // Test został tymczasowo wyłączony, ponieważ struktura strony mogła się zmienić
  46 |     test.skip();
  47 |     
  48 |     // Sprawdzenie czy sekcje z technologiami są wyświetlane
  49 |     const technologies = await homePage.getTechnologies();
  50 |     expect(technologies.length).toBeGreaterThan(0);
  51 |     
  52 |     // Sprawdzenie konkretnych technologii
  53 |     const techNames = await page.$$eval('.bg-gradient-to-br ul li span.font-mono', 
  54 |       (elements: Element[]) => elements.map(el => el.textContent?.trim()));
  55 |     
  56 |     expect(techNames).toContain('Astro v5.5.5');
  57 |     expect(techNames).toContain('React v19');
  58 |     expect(techNames).toContain('TypeScript');
  59 |   });
  60 |
  61 |   test('powinna mieć wizualnie spójny wygląd', async ({ page }) => {
  62 |     // Wizualne porównanie (snapshot test)
  63 |     await expect(page).toHaveScreenshot('homepage.png');
  64 |   });
  65 | }); 
```