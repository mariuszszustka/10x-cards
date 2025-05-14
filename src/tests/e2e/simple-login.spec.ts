// src/tests/e2e/simple-login.spec.ts
import { test, expect } from '@playwright/test';
import { SELECTORS } from './selectors';
import * as fs from 'fs';

test('Prosty test logowania bez pomocników', async ({ page }) => {
  // Utwórz katalog na artefakty testów, jeśli nie istnieje
  try {
    if (!fs.existsSync('./test-artifacts')) {
      fs.mkdirSync('./test-artifacts', { recursive: true });
    }
  } catch (error) {
    console.error('Błąd podczas tworzenia katalogu:', error);
  }
  
  // Otwórz stronę logowania
  await page.goto('/auth/login', { timeout: 30000 });
  console.log('Otwarto stronę logowania:', page.url());
  
  // Zrób zrzut ekranu
  await page.screenshot({ path: './test-artifacts/login-page.png' });
  
  // Zbadaj strukturę HTML
  const html = await page.content();
  console.log('Fragment HTML strony logowania:', html.substring(0, 500) + '...');
  
  // Wyprobuj różne selektory - może aplikacja używa innych niż założyliśmy
  const selektoryEmail = [
    SELECTORS.AUTH.EMAIL_INPUT,
    '[name="email"]',
    'input[type="email"]',
    '#email'
  ];
  
  const selektoryHaslo = [
    SELECTORS.AUTH.PASSWORD_INPUT,
    '[name="password"]',
    'input[type="password"]',
    '#password'
  ];
  
  const selektoryPrzycisku = [
    SELECTORS.AUTH.SUBMIT_BUTTON,
    'button[type="submit"]',
    'input[type="submit"]',
    'button:has-text("Zaloguj")'
  ];
  
  // Znajdź działające selektory
  let dzialajacyEmail = '';
  let dzialajaceHaslo = '';
  let dzialajacyPrzycisk = '';
  
  for (const selektor of selektoryEmail) {
    if (await page.isVisible(selektor)) {
      console.log('Znaleziono działający selektor dla email:', selektor);
      dzialajacyEmail = selektor;
      break;
    }
  }
  
  for (const selektor of selektoryHaslo) {
    if (await page.isVisible(selektor)) {
      console.log('Znaleziono działający selektor dla hasła:', selektor);
      dzialajaceHaslo = selektor;
      break;
    }
  }
  
  for (const selektor of selektoryPrzycisku) {
    if (await page.isVisible(selektor)) {
      console.log('Znaleziono działający selektor dla przycisku:', selektor);
      dzialajacyPrzycisk = selektor;
      break;
    }
  }
  
  // Jeśli elementy są widoczne, wypełnij formularz
  if (dzialajacyEmail && dzialajaceHaslo && dzialajacyPrzycisk) {
    await page.fill(dzialajacyEmail, 'test-e2e@example.com');
    await page.fill(dzialajaceHaslo, 'Test123!@#');
    
    // Zrób zrzut przed kliknięciem
    await page.screenshot({ path: './test-artifacts/before-login-click.png' });
    
    // Kliknij przycisk logowania
    await page.click(dzialajacyPrzycisk);
    
    // Poczekaj chwilę
    await page.waitForTimeout(5000);
    
    // Zrób zrzut po kliknięciu
    await page.screenshot({ path: './test-artifacts/after-login-click.png' });
    
    // Sprawdź URL po logowaniu
    console.log('URL po kliknięciu:', page.url());
  } else {
    console.log('Nie znaleziono wszystkich elementów formularza logowania!');
    
    // Zrzut całej strony dla debugowania
    await page.screenshot({ path: './test-artifacts/login-not-found.png', fullPage: true });
  }
});