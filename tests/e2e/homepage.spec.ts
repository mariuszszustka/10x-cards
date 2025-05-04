import { test, expect } from '@playwright/test';

// Implementacja podejścia Page Object Model
class HomePage {
  readonly page: any;

  constructor(page: any) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
  }

  async getTitle() {
    return this.page.locator('h1').textContent();
  }

  async getTechnologies() {
    return this.page.locator('.bg-gradient-to-br ul li').all();
  }
}

test.describe('Strona główna', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('powinna mieć poprawny tytuł strony', async () => {
    // Sprawdzenie tytułu strony
    await expect(homePage.page).toHaveTitle(/10xDevs Astro Starter/);
  });

  test('powinna wyświetlać główny nagłówek', async ({ page }) => {
    // Sprawdzenie głównego nagłówka
    const title = await homePage.getTitle();
    expect(title).toContain('Witaj w 10xDevs Astro Starter');
  });

  test('powinna zawierać listę technologii', async ({ page }) => {
    // Sprawdzenie czy sekcje z technologiami są wyświetlane
    const technologies = await homePage.getTechnologies();
    expect(technologies.length).toBeGreaterThan(0);
    
    // Sprawdzenie konkretnych technologii
    const techNames = await page.$$eval('.bg-gradient-to-br ul li span.font-mono', 
      (elements: Element[]) => elements.map(el => el.textContent?.trim()));
    
    expect(techNames).toContain('Astro v5.5.5');
    expect(techNames).toContain('React v19');
    expect(techNames).toContain('TypeScript');
  });

  test('powinna mieć wizualnie spójny wygląd', async ({ page }) => {
    // Wizualne porównanie (snapshot test)
    await expect(page).toHaveScreenshot('homepage.png');
  });
}); 