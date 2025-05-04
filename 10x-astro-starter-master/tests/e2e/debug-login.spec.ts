import { test, expect } from '@playwright/test';

test('Debug logowania - sprawdzenie co się dzieje po wypełnieniu formularza', async ({ page }) => {
  console.log('Zaczynam test debugujący logowania');
  
  // Otwórz stronę logowania
  await page.goto('/auth/login');
  console.log('Otwarto stronę logowania');
  
  // Zapisz aktualny HTML strony przed wypełnieniem formularza
  const htmlBeforeLogin = await page.content();
  console.log('HTML strony przed logowaniem:\n', htmlBeforeLogin.substring(0, 500) + '...');
  
  // Znajdź pola formularza i wypełnij je
  const emailInput = await page.locator('input[type="email"]');
  const passwordInput = await page.locator('input[type="password"]');
  const loginButton = await page.locator('button[type="submit"]');
  
  console.log('Znaleziono pola formularza?', 
    await emailInput.count() > 0 ? 'Email: Tak' : 'Email: Nie',
    await passwordInput.count() > 0 ? 'Hasło: Tak' : 'Hasło: Nie',
    await loginButton.count() > 0 ? 'Przycisk: Tak' : 'Przycisk: Nie'
  );
  
  // Wypełnij formularz
  await emailInput.fill('test-e2e@example.com');
  await passwordInput.fill('Test123!@#');
  console.log('Wypełniono formularz');
  
  // Zapisz screenshota przed kliknięciem
  await page.screenshot({ path: 'before-login.png' });
  
  // Włącz śledzenie requestów
  const requests = [];
  page.on('request', request => {
    requests.push(`${request.method()} ${request.url()}`);
  });
  
  // Włącz logowanie konsoli
  page.on('console', msg => {
    console.log(`KONSOLA STRONY: ${msg.type()}: ${msg.text()}`);
  });
  
  // Kliknij przycisk zaloguj i czekaj długo na przekierowanie
  console.log('Klikam przycisk logowania...');
  await loginButton.click();
  
  // Czekaj 5 sekund, aby zobaczyć, co się dzieje
  console.log('Czekam 5 sekund...');
  await page.waitForTimeout(5000);
  
  // Zapisz aktualny URL
  const currentUrl = page.url();
  console.log('Aktualny URL po czekaniu:', currentUrl);
  
  // Sprawdź localStorage
  const localStorage = await page.evaluate(() => {
    const items = {};
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      items[key] = window.localStorage.getItem(key);
    }
    return items;
  });
  
  console.log('Stan localStorage:', JSON.stringify(localStorage, null, 2));
  
  // Zapisz screenshota po zalogowaniu
  await page.screenshot({ path: 'after-login.png' });
  
  // Zapisz HTML strony po logowaniu
  const htmlAfterLogin = await page.content();
  console.log('HTML strony po logowaniu:\n', htmlAfterLogin.substring(0, 500) + '...');
  
  // Pokaż wszystkie żądania
  console.log('Wszystkie żądania:', requests);
  
  // Spróbuj ręcznie przejść na dashboard
  console.log('Próbuję ręcznie przejść na dashboard...');
  await page.goto('/dashboard');
  console.log('URL po próbie ręcznego przejścia:', page.url());
  
  // Zrzut ekranu po próbie ręcznego przejścia
  await page.screenshot({ path: 'manual-dashboard.png' });
}); 