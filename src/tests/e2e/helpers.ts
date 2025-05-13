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

// Pomocnicza funkcja do znajdowania pierwszego działającego selektora
export async function findWorkingSelector(page: Page, selectors: string[]): Promise<string | null> {
  for (const selector of selectors) {
    try {
      if (await page.isVisible(selector, { timeout: 1000 })) {
        return selector;
      }
    } catch (e) {
      // Ignoruj błędy - selektor nie jest widoczny
    }
  }
  return null;
}

// Sprawdź, czy użytkownik jest już zalogowany
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    // Sprawdź czy jest element użytkownika w headerze lub inne elementy charakterystyczne dla zalogowanego stanu
    const userMenuVisible = await page.isVisible(SELECTORS.LAYOUT.USER_MENU, { timeout: 2000 })
      .catch(() => false);
      
    // Jeśli widoczny, użytkownik jest zalogowany
    return userMenuVisible;
  } catch (e) {
    return false;
  }
}

// Logowanie użytkownika
export async function loginUser(page: Page): Promise<boolean> {
  console.log('Rozpoczynam logowanie użytkownika testowego...');
  ensureArtifactsDir();
  
  try {
    // Najpierw sprawdź, czy użytkownik jest już zalogowany
    await page.goto('/dashboard', { timeout: 10000 }).catch(() => {});
    
    if (await isLoggedIn(page)) {
      console.log('Użytkownik już zalogowany');
      return true;
    }
    
    // Otwórz stronę logowania
    await page.goto('/auth/login', { timeout: 30000 });
    console.log('Otwarto stronę logowania:', page.url());
    
    // Zrób zrzut ekranu
    await page.screenshot({ path: './test-artifacts/login-page.png', fullPage: true });
    
    // Sprawdź, czy strona faktycznie jest stroną logowania
    if (!page.url().includes('login') && !page.url().includes('auth')) {
      console.log('Przekierowano na inną stronę niż logowanie:', page.url());
      
      // Sprawdź czy nie jesteśmy już zalogowani
      if (await isLoggedIn(page)) {
        console.log('Użytkownik już zalogowany po przekierowaniu');
        return true;
      }
      
      console.log('Próbuję bezpośrednio przejść do logowania...');
      await page.goto('/auth/login', { timeout: 30000 });
    }
    
    // Poczekaj 1 sekundę na pełne załadowanie strony
    await page.waitForTimeout(1000);
    
    // Znajdź działające selektory
    let emailSelector = await findWorkingSelector(page, [
      SELECTORS.AUTH.EMAIL_INPUT, 
      ...ALT_SELECTORS.AUTH.EMAIL_INPUT
    ]);
    
    let passwordSelector = await findWorkingSelector(page, [
      SELECTORS.AUTH.PASSWORD_INPUT,
      ...ALT_SELECTORS.AUTH.PASSWORD_INPUT
    ]);
    
    let submitSelector = await findWorkingSelector(page, [
      SELECTORS.AUTH.SUBMIT_BUTTON,
      SELECTORS.AUTH.LOGIN_BUTTON,
      ...ALT_SELECTORS.AUTH.SUBMIT_BUTTON
    ]);
    
    if (!emailSelector || !passwordSelector || !submitSelector) {
      console.error('Nie znaleziono pól formularza logowania:',
        { emailSelector, passwordSelector, submitSelector });
      
      // Sprawdź czy może już jesteśmy zalogowani
      if (await isLoggedIn(page)) {
        console.log('Użytkownik jest już zalogowany mimo braku formularza logowania');
        return true;
      }
      
      // Zapisz HTML strony do analizy
      const html = await page.content();
      fs.writeFileSync('./test-artifacts/login-page.html', html);
      
      // Spróbuj alternatywne selektory za pomocą JS Path
      console.log('Próbuję znaleźć pola formularza za pomocą alternatywnych metod...');
      
      try {
        // Znajdź wszystkie pola input
        const inputs = await page.$$eval('input', inputs => 
          inputs.map(i => ({ 
            id: i.id, 
            name: i.name, 
            type: i.type, 
            placeholder: i.placeholder 
          })));
          
        console.log('Znalezione pola input:', inputs);
        
        // Znajdź wszystkie przyciski
        const buttons = await page.$$eval('button', buttons => 
          buttons.map(b => ({ 
            id: b.id, 
            textContent: b.textContent?.trim(),
            type: b.type,
            className: b.className
          })));
          
        console.log('Znalezione przyciski:', buttons);
        
        // Próba wypełnienia formularza na podstawie typu pola
        const emailInput = await page.$('input[type="email"]');
        const passwordInput = await page.$('input[type="password"]');
        const submitButton = await page.$('button[type="submit"]');
        
        if (emailInput && passwordInput && submitButton) {
          console.log('Znaleziono pola formularza za pomocą typów HTML');
          await emailInput.fill('test-e2e@example.com');
          await passwordInput.fill('Test123!@#');
          await submitButton.click();
          
          // Poczekaj na możliwe przekierowanie
          await page.waitForTimeout(5000);
          
          // Sprawdź czy jesteśmy zalogowani
          if (await isLoggedIn(page)) {
            console.log('Zalogowano pomyślnie za pomocą alternatywnej metody');
            return true;
          }
        }
      } catch (e) {
        console.error('Błąd podczas próby alternatywnego logowania:', e);
      }
      
      return false;
    }
    
    // Wypełnij formularz
    await page.fill(emailSelector, 'test-e2e@example.com');
    await page.fill(passwordSelector, 'Test123!@#');
    
    // Zrób zrzut przed kliknięciem przycisku
    await page.screenshot({ path: './test-artifacts/before-login-click.png' });
    
    // Kliknij przycisk logowania
    await page.click(submitSelector);
    console.log('Kliknięto przycisk logowania');
    
    // Poczekaj na przekierowanie - sprawdź różne możliwe ścieżki
    const possibleUrls = ['/dashboard', '/home', '/'];
    let redirected = false;
    
    for (const url of possibleUrls) {
      try {
        await page.waitForURL(url, { timeout: 5000 });
        redirected = true;
        console.log(`Przekierowano na ${url}`);
        break;
      } catch (e) {
        // Próbuj następny URL
      }
    }
    
    if (!redirected) {
      console.log('Nie przekierowano na żadną ze znanych ścieżek, sprawdzam czy użytkownik jest zalogowany');
      
      // Sprawdź czy użytkownik został zalogowany
      if (await isLoggedIn(page)) {
        console.log('Użytkownik zalogowany mimo braku przekierowania na znaną ścieżkę');
        await page.screenshot({ path: './test-artifacts/after-login-success.png', fullPage: true });
        return true;
      } else {
        console.error('Użytkownik nie został zalogowany');
        await page.screenshot({ path: './test-artifacts/login-failed.png', fullPage: true });
        return false;
      }
    }
    
    // Zrób zrzut po zalogowaniu
    await page.screenshot({ path: './test-artifacts/after-login.png', fullPage: true });
    console.log('Zalogowano pomyślnie, aktualny URL:', page.url());
    return true;
    
  } catch (error) {
    console.error('Błąd podczas logowania:', error);
    await page.screenshot({ path: './test-artifacts/login-error.png', fullPage: true });
    return false;
  }
}