import { test, expect } from '@playwright/test';

test('Najprostszy test formularza logowania', async ({ page, context }) => {
  // Wyczyść całą sesję i wszystkie ciasteczka
  await context.clearCookies();
  
  // Zaczynamy od czystej karty - żadnych nagłówków testowych jeszcze
  console.log('Test prosty: Otwieram stronę główną...');
  await page.goto('/', { timeout: 30000 });
  console.log('Test prosty: Strona główna otwarta, URL:', page.url());
  
  // Zapisz zrzut ekranu strony głównej
  await page.screenshot({ path: 'simple-test-homepage.png' });
  
  // Ręcznie przechodzimy na stronę logowania
  console.log('Test prosty: Przechodzę na stronę logowania...');
  await page.goto('/auth/login');
  console.log('Test prosty: Strona logowania otwarta, URL:', page.url());
  
  // Zapisz zrzut ekranu strony logowania
  await page.screenshot({ path: 'simple-test-login.png' });
  
  // Bardzo podstawowe sprawdzenie - czy jest formularz
  const formCount = await page.locator('form').count();
  console.log('Test prosty: Liczba formularzy na stronie:', formCount);
  
  // Bardzo podstawowe sprawdzenie - czy są pola formularza
  const emailInputCount = await page.locator('input[type="email"]').count();
  const passwordInputCount = await page.locator('input[type="password"]').count();
  const submitButtonCount = await page.locator('button[type="submit"]').count();
  
  console.log('Test prosty: Liczba elementów formularza:',
    'Email:', emailInputCount,
    'Hasło:', passwordInputCount,
    'Przycisk:', submitButtonCount
  );
  
  // Sprawdzamy, czy jesteśmy przekierowani na dashboard
  if (page.url().includes('/dashboard')) {
    console.log('Test prosty: Jesteśmy przekierowani na dashboard, co oznacza, że automatycznie zalogowani');
  }
  
  // Sprawdźmy, dlaczego formularza nie ma lub jest
  const htmlContent = await page.content();
  
  // Zapisz pełną treść HTML do pliku
  await require('fs').promises.writeFile('simple-test-html.txt', htmlContent);
  console.log('Test prosty: Zapisano pełny HTML strony do pliku simple-test-html.txt');
  
  // Jeśli formularza nie ma, to spróbujmy podejście z nagłówkami
  if (formCount === 0 || emailInputCount === 0) {
    console.log('Test prosty: Formularza nie znaleziono, próbuję z dodatkowymi nagłówkami...');
    
    // Ponownie wyczyść ciasteczka
    await context.clearCookies();
    
    // Ustaw nagłówki testowe
    await page.setExtraHTTPHeaders({
      'X-Test-E2E': 'true',
      'X-Test-Login-Form': 'true',
      'X-Test-Force-Show-Form': 'true' // Dodatkowy nagłówek
    });
    
    // Próbujemy ponownie otworzyć stronę logowania
    console.log('Test prosty: Ponowna próba otwarcia strony logowania z nagłówkami...');
    await page.goto('/auth/login');
    console.log('Test prosty: Strona logowania otwarta z nagłówkami, URL:', page.url());
    
    // Zapisz zrzut ekranu strony logowania z nagłówkami
    await page.screenshot({ path: 'simple-test-login-with-headers.png' });
    
    // Sprawdźmy teraz formularze
    const formCountWithHeaders = await page.locator('form').count();
    console.log('Test prosty: Liczba formularzy na stronie z nagłówkami:', formCountWithHeaders);
    
    // Sprawdźmy teraz pola formularza
    const emailInputCountWithHeaders = await page.locator('input[type="email"]').count();
    const passwordInputCountWithHeaders = await page.locator('input[type="password"]').count();
    const submitButtonCountWithHeaders = await page.locator('button[type="submit"]').count();
    
    console.log('Test prosty: Liczba elementów formularza z nagłówkami:',
      'Email:', emailInputCountWithHeaders,
      'Hasło:', passwordInputCountWithHeaders,
      'Przycisk:', submitButtonCountWithHeaders
    );
    
    // Zapisz HTML z nagłówkami
    const htmlContentWithHeaders = await page.content();
    await require('fs').promises.writeFile('simple-test-html-with-headers.txt', htmlContentWithHeaders);
    console.log('Test prosty: Zapisano pełny HTML strony z nagłówkami do pliku simple-test-html-with-headers.txt');
  }
  
  // Próbujemy zalogować się bezpośrednio przez API
  console.log('Test prosty: Próbuję zalogować się bezpośrednio przez API...');
  
  const loginResponse = await page.request.post('/api/auth/login', {
    data: {
      email: 'test-e2e@example.com',
      password: 'Test123!@#'
    }
  });
  
  console.log('Test prosty: Status odpowiedzi API logowania:', loginResponse.status());
  
  // Spróbujmy odczytać odpowiedź
  let loginResponseText = '';
  try {
    loginResponseText = await loginResponse.text();
    console.log('Test prosty: Treść odpowiedzi API logowania:', loginResponseText.substring(0, 200));
  } catch (e) {
    console.log('Test prosty: Nie można odczytać treści odpowiedzi API logowania:', e);
  }
  
  // Na końcu przejdźmy do dashboard
  console.log('Test prosty: Przechodzę na dashboard...');
  await page.goto('/dashboard');
  console.log('Test prosty: Dashboard otwarty, URL:', page.url());
  
  // Zapisz zrzut ekranu dashboard
  await page.screenshot({ path: 'simple-test-dashboard.png' });
}); 