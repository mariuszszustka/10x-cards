# Test info

- Name: Diagnoza problemu z przekierowaniem na about:blank
- Location: C:\Users\Gutek\Documents\10x-cards\tests\e2e\auth.spec.ts:5:1

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

    at C:\Users\Gutek\Documents\10x-cards\tests\e2e\auth.spec.ts:29:14
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import { AUTH, AUTH_BUTTONS, NOTIFICATIONS, DASHBOARD } from '../test-selectors';
   3 |
   4 | // Dodaję test do naprawy problemu z about:blank
   5 | test('Diagnoza problemu z przekierowaniem na about:blank', async ({ page }) => {
   6 |   // Dodaję nagłówek identyfikujący jako test E2E
   7 |   await page.setExtraHTTPHeaders({
   8 |     'X-Test-E2E': 'true'
   9 |   });
   10 |   
   11 |   // Włączamy przechwytywanie błędów strony
   12 |   page.on('pageerror', exception => {
   13 |     console.error(`Błąd strony: ${exception.message}`);
   14 |   });
   15 |   
   16 |   // Włączamy przechwytywanie błędów sieci
   17 |   page.on('requestfailed', request => {
   18 |     const failure = request.failure();
   19 |     console.error(`Błąd żądania: ${request.url()} - ${failure ? failure.errorText : 'nieznany błąd'}`);
   20 |   });
   21 |   
   22 |   // Włączamy logowanie konsoli
   23 |   page.on('console', msg => {
   24 |     console.log(`KONSOLA STRONY: ${msg.type()}: ${msg.text()}`);
   25 |   });
   26 |   
   27 |   // Najpierw otwieramy stronę główną, żeby sprawdzić, czy serwer działa
   28 |   console.log('Test naprawczy: Otwieranie strony głównej...');
>  29 |   await page.goto('/', { timeout: 30000 });
      |              ^ Error: page.goto: Target page, context or browser has been closed
   30 |   console.log('Test naprawczy: Strona główna otwarta, URL:', page.url());
   31 |   
   32 |   // Zrzut ekranu strony głównej
   33 |   await page.screenshot({ path: 'diagnostic-homepage.png' });
   34 |   
   35 |   // Czekamy chwilę
   36 |   await page.waitForTimeout(1000);
   37 |   
   38 |   // Teraz próbujemy otworzyć stronę logowania
   39 |   console.log('Test naprawczy: Przechodzę na stronę logowania...');
   40 |   await page.goto('/auth/login', { timeout: 30000 });
   41 |   console.log('Test naprawczy: Strona logowania otwarta, URL:', page.url());
   42 |   
   43 |   // Zapisujemy zrzut ekranu
   44 |   await page.screenshot({ path: 'diagnostic-login.png' });
   45 |   
   46 |   // Szukamy formularza logowania
   47 |   const emailInput = page.getByTestId(AUTH.EMAIL_INPUT);
   48 |   const passwordInput = page.getByTestId(AUTH.PASSWORD_INPUT);
   49 |   const loginButton = page.getByTestId(AUTH.SUBMIT_BUTTON);
   50 |   
   51 |   // Sprawdzamy, czy formularz jest widoczny
   52 |   const emailVisible = await emailInput.isVisible().catch(() => false);
   53 |   const passwordVisible = await passwordInput.isVisible().catch(() => false);
   54 |   const buttonVisible = await loginButton.isVisible().catch(() => false);
   55 |   
   56 |   console.log('Test naprawczy: Formularz widoczny?', 
   57 |     emailVisible ? 'Email: Tak' : 'Email: Nie',
   58 |     passwordVisible ? 'Hasło: Tak' : 'Hasło: Nie',
   59 |     buttonVisible ? 'Przycisk: Tak' : 'Przycisk: Nie'
   60 |   );
   61 |   
   62 |   // Jeśli formularz jest widoczny, wypełniamy go
   63 |   if (emailVisible && passwordVisible && buttonVisible) {
   64 |     await emailInput.fill('test-e2e@example.com');
   65 |     await passwordInput.fill('Test123!@#');
   66 |     
   67 |     // Zrzut ekranu po wypełnieniu
   68 |     await page.screenshot({ path: 'diagnostic-form-filled.png' });
   69 |     
   70 |     // Klikamy przycisk logowania
   71 |     console.log('Test naprawczy: Klikam przycisk logowania...');
   72 |     await loginButton.click();
   73 |     
   74 |     // Czekamy na przetworzenie
   75 |     await page.waitForTimeout(5000);
   76 |     
   77 |     // Dodajemy zrzut ekranu po kliknięciu
   78 |     await page.screenshot({ path: 'diagnostic-after-click.png' });
   79 |     console.log('Test naprawczy: Po kliknięciu, URL:', page.url());
   80 |     
   81 |     // Sprawdzamy localStorage
   82 |     const localStorage = await page.evaluate(() => {
   83 |       return {
   84 |         userId: window.localStorage.getItem('userId'),
   85 |         authSession: window.localStorage.getItem('authSession'),
   86 |         userEmail: window.localStorage.getItem('userEmail')
   87 |       };
   88 |     });
   89 |     
   90 |     console.log('Test naprawczy: Stan localStorage:', JSON.stringify(localStorage, null, 2));
   91 |     
   92 |     // Ręcznie próbujemy przejść na dashboard
   93 |     console.log('Test naprawczy: Próbuję przejść na dashboard...');
   94 |     await page.goto('/dashboard', { timeout: 30000 });
   95 |     console.log('Test naprawczy: Po próbie przejścia na dashboard, URL:', page.url());
   96 |     
   97 |     // Zrzut ekranu dashboard
   98 |     await page.screenshot({ path: 'diagnostic-dashboard.png' });
   99 |   }
  100 | });
  101 |
  102 | test.describe('Testy autoryzacji', () => {
  103 |   test('Logowanie z poprawnymi danymi', async ({ page }) => {
  104 |     // Dodaję nagłówek identyfikujący jako test E2E
  105 |     await page.setExtraHTTPHeaders({
  106 |       'X-Test-E2E': 'true'
  107 |     });
  108 |     
  109 |     // Otwórz stronę logowania
  110 |     console.log('Próba otwarcia strony logowania...');
  111 |     await page.goto('/auth/login', { timeout: 30000 });
  112 |     console.log('Strona logowania otwarta, URL:', page.url());
  113 |     
  114 |     // Znajdź elementy formularza
  115 |     const emailInput = page.getByTestId(AUTH.EMAIL_INPUT);
  116 |     const passwordInput = page.getByTestId(AUTH.PASSWORD_INPUT);
  117 |     const loginButton = page.getByTestId(AUTH.SUBMIT_BUTTON);
  118 |     
  119 |     // Upewnij się, że elementy istnieją
  120 |     console.log('Sprawdzam czy elementy formularza są widoczne...');
  121 |     await expect(emailInput).toBeVisible({ timeout: 10000 });
  122 |     await expect(passwordInput).toBeVisible({ timeout: 10000 });
  123 |     await expect(loginButton).toBeVisible({ timeout: 10000 });
  124 |     console.log('Elementy formularza są widoczne');
  125 |     
  126 |     // Wypełnij formularz
  127 |     await emailInput.fill('test-e2e@example.com');
  128 |     await passwordInput.fill('Test123!@#');
  129 |     console.log('Formularz wypełniony');
```