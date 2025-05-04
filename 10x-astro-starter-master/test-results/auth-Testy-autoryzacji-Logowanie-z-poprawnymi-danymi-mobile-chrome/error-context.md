# Test info

- Name: Testy autoryzacji >> Logowanie z poprawnymi danymi
- Location: /home/mariusz/Projekty/10x-cards/10x-astro-starter-master/tests/e2e/auth.spec.ts:5:3

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: getByTestId('auth-email-input')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByTestId('auth-email-input')

    at /home/mariusz/Projekty/10x-cards/10x-astro-starter-master/tests/e2e/auth.spec.ts:15:30
```

# Page snapshot

```yaml
- text: 10x
- heading "Zaloguj się" [level=1]
- text: Adres email
- textbox "Adres email"
- text: Hasło
- link "Zapomniałem hasła":
  - /url: /auth/reset-password
- textbox "Hasło"
- button "Zaloguj się"
- paragraph: Problemy z logowaniem?
- button "Zaloguj się przez link wysłany na email"
- paragraph:
  - text: Nie masz jeszcze konta?
  - link "Zarejestruj się":
    - /url: /auth/register
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import { AUTH, AUTH_BUTTONS, NOTIFICATIONS, DASHBOARD } from '../test-selectors';
   3 |
   4 | test.describe('Testy autoryzacji', () => {
   5 |   test('Logowanie z poprawnymi danymi', async ({ page }) => {
   6 |     // Otwórz stronę logowania
   7 |     await page.goto('/auth/login');
   8 |     
   9 |     // Znajdź elementy formularza
   10 |     const emailInput = page.getByTestId(AUTH.EMAIL_INPUT);
   11 |     const passwordInput = page.getByTestId(AUTH.PASSWORD_INPUT);
   12 |     const loginButton = page.getByTestId(AUTH.SUBMIT_BUTTON);
   13 |     
   14 |     // Upewnij się, że elementy istnieją
>  15 |     await expect(emailInput).toBeVisible();
      |                              ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
   16 |     await expect(passwordInput).toBeVisible();
   17 |     await expect(loginButton).toBeVisible();
   18 |     
   19 |     // Wypełnij formularz
   20 |     await emailInput.fill('test-e2e@example.com');
   21 |     await passwordInput.fill('Test123!@#');
   22 |     
   23 |     // Uruchom nasłuchiwanie na odpowiedź API
   24 |     const responsePromise = page.waitForResponse(response => 
   25 |       response.url().includes('/api/auth/login') && response.status() === 200
   26 |     );
   27 |     
   28 |     // Kliknij przycisk logowania
   29 |     await loginButton.click();
   30 |     
   31 |     // Poczekaj na odpowiedź API
   32 |     const response = await responsePromise;
   33 |     
   34 |     // Sprawdź, czy odpowiedź API jest poprawna
   35 |     const responseBody = await response.json();
   36 |     expect(responseBody.success).toBeTruthy();
   37 |     expect(responseBody.session).toBeTruthy();
   38 |     
   39 |     // Czekaj na skrypt przekierowujący (zamiast oczekiwania na URL)
   40 |     // Sprawdź localStorage po zalogowaniu, który powinien zawierać userId i authSession
   41 |     await page.waitForFunction(() => {
   42 |       return localStorage.getItem('userId') !== null && 
   43 |              localStorage.getItem('authSession') !== null;
   44 |     }, { timeout: 5000 });
   45 |     
   46 |     // Jeśli localStorage został zaktualizowany, to ręcznie przejdź na dashboard
   47 |     await page.goto('/dashboard');
   48 |     
   49 |     // Teraz oczekujemy, że jesteśmy na dashboardzie
   50 |     await expect(page).toHaveURL(/dashboard/);
   51 |     
   52 |     // Sprawdzenie, czy menu użytkownika jest widoczne
   53 |     await expect(page.getByTestId(DASHBOARD.USER_MENU)).toBeVisible();
   54 |   });
   55 |   
   56 |   test('Logowanie z nieprawidłowymi danymi', async ({ page }) => {
   57 |     // Otwórz stronę logowania
   58 |     await page.goto('/auth/login');
   59 |     
   60 |     // Znajdź elementy formularza
   61 |     const emailInput = page.getByTestId(AUTH.EMAIL_INPUT);
   62 |     const passwordInput = page.getByTestId(AUTH.PASSWORD_INPUT);
   63 |     const loginButton = page.getByTestId(AUTH.SUBMIT_BUTTON);
   64 |     
   65 |     // Wypełnij formularz nieprawidłowymi danymi
   66 |     await emailInput.fill('nieprawidlowy@email.com');
   67 |     await passwordInput.fill('NieprawidloweHaslo123!');
   68 |     
   69 |     // Uruchom nasłuchiwanie na odpowiedź API
   70 |     const responsePromise = page.waitForResponse(response => 
   71 |       response.url().includes('/api/auth/login')
   72 |     );
   73 |     
   74 |     // Kliknij przycisk logowania
   75 |     await loginButton.click();
   76 |     
   77 |     // Poczekaj na odpowiedź API
   78 |     const response = await responsePromise;
   79 |     
   80 |     // Sprawdź, czy pojawiła się informacja o błędzie
   81 |     const errorMessage = page.getByTestId(NOTIFICATIONS.ERROR);
   82 |     await expect(errorMessage).toBeVisible();
   83 |     
   84 |     // Sprawdź, czy nadal jesteśmy na stronie logowania
   85 |     await expect(page).toHaveURL(/login/);
   86 |   });
   87 |   
   88 |   test('Rejestracja nowego użytkownika', async ({ page }) => {
   89 |     // Generowanie unikalnego adresu email
   90 |     const uniqueEmail = `user-${Date.now()}@example.com`;
   91 |     
   92 |     // Otwarcie strony głównej aplikacji
   93 |     await page.goto('/');
   94 |     
   95 |     // Kliknięcie przycisku "Zarejestruj się"
   96 |     await page.getByTestId(AUTH_BUTTONS.REGISTER).click();
   97 |     
   98 |     // Wypełnienie formularza rejestracyjnego
   99 |     await page.getByTestId(AUTH.EMAIL_INPUT).fill(uniqueEmail);
  100 |     await page.getByTestId(AUTH.PASSWORD_INPUT).fill('NoweHaslo123!');
  101 |     await page.getByTestId(AUTH.CONFIRM_PASSWORD_INPUT).fill('NoweHaslo123!');
  102 |     
  103 |     // Akceptacja warunków jeśli istnieją
  104 |     const termsCheckbox = page.getByTestId(AUTH.TERMS_CHECKBOX);
  105 |     if (await termsCheckbox.isVisible()) {
  106 |       await termsCheckbox.check();
  107 |     }
  108 |     
  109 |     // Uruchom nasłuchiwanie na odpowiedź API
  110 |     const responsePromise = page.waitForResponse(response => 
  111 |       response.url().includes('/api/auth/register') && response.status() === 200
  112 |     );
  113 |     
  114 |     // Kliknięcie przycisku "Zarejestruj"
  115 |     await page.getByTestId(AUTH.SUBMIT_BUTTON).click();
```