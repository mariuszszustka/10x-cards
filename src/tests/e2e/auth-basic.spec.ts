import { test, expect } from '@playwright/test';

// Podstawowy test logowania użytkownika
test('Podstawowy test logowania użytkownika', async ({ page }) => {
  console.log('Rozpoczynam test podstawowego logowania');
  
  // Otwieramy stronę logowania
  await page.goto('/auth/login');
  console.log('Otwarto stronę logowania');
  
  // Sprawdzamy, czy formularz logowania jest widoczny
  const emailInput = page.locator('input[type="email"]');
  const passwordInput = page.locator('input[type="password"]');
  const loginButton = page.locator('button[type="submit"]');

  // Sprawdzamy, czy pola formularza istnieją
  await expect(emailInput).toBeVisible();
  await expect(passwordInput).toBeVisible();
  await expect(loginButton).toBeVisible();
  
  // Wypełniamy formularz
  await emailInput.fill('test-e2e@example.com');
  await passwordInput.fill('Test123!@#');
  
  // Klikamy przycisk logowania
  await loginButton.click();
  
  // Czekamy na przekierowanie na dashboard
  await page.waitForURL('**/dashboard');
  
  // Sprawdzamy, czy jesteśmy na stronie dashboard
  expect(page.url()).toContain('/dashboard');
  
  // Sprawdzamy, czy na dashboard jest link do fiszek
  const flashcardsLink = page.getByRole('link', { name: /fiszki/i });
  await expect(flashcardsLink).toBeVisible();
  
  // Klikamy w link do fiszek
  await flashcardsLink.click();
  
  // Sprawdzamy, czy jesteśmy na stronie fiszek
  await page.waitForURL('**/flashcards');
  expect(page.url()).toContain('/flashcards');
  
  console.log('Test logowania zakończony pomyślnie');
}); 