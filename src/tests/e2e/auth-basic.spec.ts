import { test, expect } from '@playwright/test';
import { saveScreenshot } from './helpers';
import { SELECTORS, ALT_SELECTORS } from './selectors';

// Podstawowy test strony logowania
test('Podstawowy test strony logowania', async ({ page }) => {
  console.log('Rozpoczynam test strony logowania');
  
  // Otwieramy stronę logowania
  await page.goto('/auth/login');
  console.log('Otwarto stronę logowania');
  
  // Zapisz zrzut ekranu strony logowania
  await saveScreenshot(page, 'login-page', true);
  
  // Znajdujemy pola formularza używając wielu selektorów dla większej niezawodności
  const emailInput = page.locator([
    SELECTORS.AUTH.EMAIL_INPUT,
    ...ALT_SELECTORS.AUTH.EMAIL_INPUT
  ].join(', ')).first();
  
  const passwordInput = page.locator([
    SELECTORS.AUTH.PASSWORD_INPUT,
    ...ALT_SELECTORS.AUTH.PASSWORD_INPUT
  ].join(', ')).first();
  
  const loginButton = page.locator([
    SELECTORS.AUTH.SUBMIT_BUTTON,
    ...ALT_SELECTORS.AUTH.SUBMIT_BUTTON
  ].join(', ')).first();

  // Sprawdzamy, czy pola formularza istnieją
  await expect(emailInput).toBeVisible({ timeout: 5000 });
  await expect(passwordInput).toBeVisible({ timeout: 5000 });
  await expect(loginButton).toBeVisible({ timeout: 5000 });
  
  // Wypełniamy formularz
  await emailInput.fill('test-e2e@example.com');
  await passwordInput.fill('Test123!@#');
  
  // Zapisz zrzut ekranu wypełnionego formularza
  await saveScreenshot(page, 'login-filled', true);
  
  console.log('Test strony logowania zakończony pomyślnie');
});

// Test logowania i nawigacji do dashboardu
test('Logowanie i nawigacja do dashboardu', async ({ page }) => {
  console.log('Rozpoczynam test logowania i nawigacji do dashboardu');
  
  // Otwieramy stronę logowania
  await page.goto('/auth/login');
  console.log('Otwarto stronę logowania');
  
  // Znajdujemy pola formularza używając prostych selektorów
  const emailInput = page.locator('input[type="email"]').first();
  const passwordInput = page.locator('input[type="password"]').first();
  const loginButton = page.locator('button[type="submit"]').first();

  // Sprawdzamy, czy pola formularza istnieją
  await expect(emailInput).toBeVisible({ timeout: 5000 });
  await expect(passwordInput).toBeVisible({ timeout: 5000 });
  await expect(loginButton).toBeVisible({ timeout: 5000 });
  
  // Wypełniamy formularz
  await emailInput.fill('test-e2e@example.com');
  await passwordInput.fill('Test123!@#');
  
  // Klikamy przycisk logowania
  await loginButton.click();
  
  // Oczekujemy, że po logowaniu zostaniemy przekierowani na dashboard
  // Czekamy na załadowanie strony
  await page.waitForLoadState('networkidle', { timeout: 30000 });
  
  // Zapisz zrzut ekranu po logowaniu
  await saveScreenshot(page, 'after-login', true);
  
  // Sprawdzamy czy jesteśmy zalogowani i przekierowani na dashboard
  expect(page.url()).toContain('/dashboard');
  console.log('Przekierowano na dashboard po logowaniu');
  
  // Zapisujemy zrzut ekranu dashboardu
  await saveScreenshot(page, 'dashboard-page', true);
  
  // Sprawdzamy, czy na dashboard są widoczne jakieś elementy
  const headingElements = page.locator('h1, h2');
  const headingCount = await headingElements.count();
  
  console.log(`Znaleziono ${headingCount} nagłówków na dashboardzie`);
  expect(headingCount).toBeGreaterThan(0);
  
  // Sprawdzamy, czy są jakieś linki do innych stron
  const links = page.locator('a[href]');
  const linksCount = await links.count();
  
  console.log(`Znaleziono ${linksCount} linków na dashboardzie`);
  expect(linksCount).toBeGreaterThan(0);
  
  console.log('Test logowania i nawigacji do dashboardu zakończony pomyślnie');
}); 