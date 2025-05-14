// src/tests/e2e/browser-test.spec.ts
import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test('Diagnoza problemu z ładowaniem strony', async ({ page }) => {
  console.log('Otwieranie strony głównej...');
  
  // Utwórz katalog na artefakty testów, jeśli nie istnieje
  try {
    if (!fs.existsSync('./test-artifacts')) {
      fs.mkdirSync('./test-artifacts', { recursive: true });
    }
  } catch (error) {
    console.error('Błąd podczas tworzenia katalogu:', error);
  }
  
  // Ustawienie dłuższego timeoutu dla tej nawigacji
  const response = await page.goto('/', { timeout: 60000 });
  
  // Sprawdź status HTTP
  console.log('Status odpowiedzi:', response?.status());
  
  // Sprawdź zawartość strony
  const html = await page.content();
  console.log('Długość otrzymanej strony HTML:', html.length);
  
  // Zrzut ekranu
  await page.screenshot({ path: './test-artifacts/homepage-debug.png', fullPage: true });
  
  // Sprawdź konsolę przeglądarki
  const logs: string[] = [];
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  
  // Poczekaj chwilę i wypisz logi
  await page.waitForTimeout(5000);
  console.log('Logi z konsoli przeglądarki:', logs);
});