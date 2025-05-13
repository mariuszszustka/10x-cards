// src/tests/e2e/minimal-flashcards.spec.ts
import { test, expect } from '@playwright/test';
import { SELECTORS } from '../selectors';

test('Dostęp do strony fiszek - test diagnoza', async ({ page }) => {
  // Utwórz katalog na artefakty testów, jeśli nie istnieje
  try {
    const fs = require('fs');
    if (!fs.existsSync('./test-artifacts')) {
      fs.mkdirSync('./test-artifacts', { recursive: true });
    }
  } catch (error) {
    console.error('Błąd podczas tworzenia katalogu:', error);
  }
  
  // Najpierw zaloguj się
  await page.goto('/auth/login', { timeout: 30000 });
  console.log('Otwarto stronę logowania:', page.url());
  
  // Wyprobuj różne selektory
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
    SELECTORS.AUTH.LOGIN_BUTTON,
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
  
  // Zaloguj się jeśli wszystkie elementy są dostępne
  if (dzialajacyEmail && dzialajaceHaslo && dzialajacyPrzycisk) {
    await page.fill(dzialajacyEmail, 'test-e2e@example.com');
    await page.fill(dzialajaceHaslo, 'Test123!@#');
    await page.click(dzialajacyPrzycisk);
    await page.waitForTimeout(5000);
  } else {
    console.log('Nie udało się znaleźć elementów formularza logowania');
    await page.screenshot({ path: './test-artifacts/login-form-not-found.png', fullPage: true });
    return;
  }
  
  // Przejdź do strony fiszek - spróbujmy różne URLe
  const urleFiszek = [
    '/flashcards',
    '/fiszki',
    '/dashboard/flashcards',
    '/dashboard/fiszki'
  ];
  
  for (const url of urleFiszek) {
    console.log(`Próba otwarcia strony fiszek pod adresem: ${url}`);
    await page.goto(url, { timeout: 15000 });
    await page.screenshot({ path: `./test-artifacts/flashcards-page-${url.replace(/\//g, '-')}.png` });
    
    // Sprawdź tytuł strony
    const title = await page.title();
    console.log(`Tytuł strony pod adresem ${url}:`, title);
    
    // Wypisz strukture HTML, aby zobaczyć co faktycznie jest na stronie
    console.log(`HTML dla ${url}:`);
    console.log(await page.content());
  }
});