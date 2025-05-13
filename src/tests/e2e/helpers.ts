// src/tests/e2e/helpers.ts
import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { SELECTORS, ALT_SELECTORS } from './selectors';
import * as fs from 'fs';
import * as path from 'path';

// Upewnij się, że katalog na artefakty testów istnieje
export function ensureArtifactsDir() {
  const dirPath = './test-artifacts';
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Upewnij się, że katalog na tymczasowe zrzuty ekranu testów istnieje
export function ensureTmpScreenshotsDir() {
  const dirPath = './tmp/test-screenshots';
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Zapisz zrzut ekranu
export async function saveScreenshot(page: Page, name: string, tmpOnly: boolean = false) {
  if (tmpOnly) {
    ensureTmpScreenshotsDir();
    await page.screenshot({ path: `./tmp/test-screenshots/${name}.png`, fullPage: true });
  } else {
    ensureArtifactsDir();
    await page.screenshot({ path: `./test-artifacts/${name}.png`, fullPage: true });
  }
}

// Sprawdź, czy użytkownik jest już zalogowany
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    // Sprawdź czy jest element użytkownika w headerze
    const userMenuVisible = await page.isVisible(SELECTORS.LAYOUT.USER_MENU, { timeout: 2000 })
      .catch(() => false);
      
    // Jeśli widoczny, użytkownik jest zalogowany
    return userMenuVisible;
  } catch (e) {
    return false;
  }
}

// Logowanie użytkownika - uproszczona wersja
export async function loginUser(page: Page): Promise<boolean> {
  console.log('Rozpoczynam logowanie użytkownika testowego...');
  
  try {
    // Otwórz stronę logowania
    await page.goto('/auth/login', { timeout: 10000 });
    console.log('Otwarto stronę logowania');
    
    // Znajdź pola formularza
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const loginButton = page.locator('button[type="submit"]');
    
    // Sprawdź czy formularz jest widoczny
    const emailVisible = await emailInput.isVisible();
    const passwordVisible = await passwordInput.isVisible();
    const buttonVisible = await loginButton.isVisible();
    
    if (!emailVisible || !passwordVisible || !buttonVisible) {
      console.error('Formularz logowania nie jest widoczny');
      return false;
    }
    
    // Wypełnij formularz
    await emailInput.fill('test-e2e@example.com');
    await passwordInput.fill('Test123!@#');
    
    // Kliknij przycisk logowania
    await loginButton.click();
    console.log('Kliknięto przycisk logowania');
    
    // Poczekaj na przekierowanie na dashboard
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    // Sprawdź czy jesteśmy na dashboard
    return page.url().includes('/dashboard');
  } catch (error) {
    console.error('Błąd podczas logowania:', error);
    return false;
  }
}

// Przejdź do strony fiszek
export async function goToFlashcards(page: Page): Promise<boolean> {
  try {
    // Przejdź do strony fiszek
    await page.goto('/flashcards', { timeout: 10000 });
    console.log('Przechodzę na stronę fiszek');
    
    // Sprawdź czy jesteśmy na stronie fiszek
    return page.url().includes('/flashcards');
  } catch (error) {
    console.error('Błąd podczas przechodzenia do fiszek:', error);
    return false;
  }
}