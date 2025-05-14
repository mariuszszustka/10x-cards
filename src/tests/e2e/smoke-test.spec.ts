import { test, expect } from '@playwright/test';
import { ensureArtifactsDir, saveScreenshot } from './helpers';
import * as fs from 'fs';

test('Strona główna ładuje się poprawnie', async ({ page }) => {
  ensureArtifactsDir();
  
  console.log('Rozpoczynam test strony głównej');
  
  // 1. Otwórz stronę główną
  await page.goto('/', { timeout: 30000 });
  console.log('Otwarto stronę główną:', page.url());
  
  // 2. Wykonaj zrzut ekranu
  await saveScreenshot(page, 'homepage', true);
  
  // 3. Sprawdź czy strona ma tytuł
  const title = await page.title();
  console.log('Tytuł strony:', title);
  expect(title.length).toBeGreaterThan(0);
  
  // 4. Sprawdź podstawowe elementy strony
  const html = await page.content();
  expect(html).toContain('</html>');
  expect(html.length).toBeGreaterThan(1000); // Strona nie powinna być pusta
  
  // 5. Zapisz HTML do analizy
  fs.writeFileSync('./test-artifacts/homepage.html', html);
  
  console.log('Test strony głównej zakończony pomyślnie');
});

// Smoke test - sprawdza czy podstawowe funkcje działają
test('Podstawowy smoke test aplikacji', async ({ page }) => {
  console.log('Rozpoczynam smoke test');
  
  // Sprawdzenie czy strona główna się ładuje
  await page.goto('/');
  console.log('Strona główna załadowana');
  
  // Sprawdzenie czy tytuł strony zawiera właściwy tekst
  const title = await page.title();
  expect(title).toContain('10x Cards'); // Poprawiony tytuł strony
  
  // Sprawdzenie czy menu główne jest dostępne
  const navbar = page.locator('nav');
  await expect(navbar).toBeVisible();
  
  // Sprawdzenie czy jest przycisk/link logowania
  const loginLink = page.getByRole('link', { name: /logowanie|login|zaloguj/i });
  await expect(loginLink).toBeVisible();
  
  // Przejście do strony logowania
  await loginLink.click();
  
  // Sprawdzenie czy jesteśmy na stronie logowania
  expect(page.url()).toContain('/auth/login');
  
  // Sprawdzenie czy formularz logowania jest widoczny
  const emailInput = page.locator('input[type="email"]');
  const passwordInput = page.locator('input[type="password"]');
  
  await expect(emailInput).toBeVisible();
  await expect(passwordInput).toBeVisible();
  
  console.log('Smoke test zakończony pomyślnie');
}); 