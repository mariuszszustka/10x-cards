import { test, expect } from '@playwright/test';
import { loginUser, ensureArtifactsDir } from './helpers';

test('Podstawowy test logowania użytkownika', async ({ page }) => {
  ensureArtifactsDir();
  
  console.log('Rozpoczynam test logowania');
  
  // Spróbuj zalogować użytkownika
  const loggedIn = await loginUser(page);
  
  // Sprawdź czy logowanie się powiodło
  expect(loggedIn).toBeTruthy();
  
  // Dodatkowe sprawdzenia po zalogowaniu (przykładowe)
  if (loggedIn) {
    // Sprawdź czy jesteśmy na stronie po zalogowaniu
    const currentUrl = page.url();
    console.log('URL po zalogowaniu:', currentUrl);
    
    // Wykonaj zrzut ekranu jako potwierdzenie
    await page.screenshot({ path: './test-artifacts/logged-in.png', fullPage: true });
  }
  
  console.log('Test logowania zakończony');
}); 