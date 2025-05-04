# Test info

- Name: Testy autoryzacji >> Rejestracja nowego użytkownika
- Location: /home/mariusz/Projekty/10x-cards/10x-astro-starter-master/tests/e2e/auth.spec.ts:88:3

# Error details

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('header-register-button')

    at /home/mariusz/Projekty/10x-cards/10x-astro-starter-master/tests/e2e/auth.spec.ts:96:51
```

# Page snapshot

```yaml
- link "Zaloguj się":
  - /url: /auth/login
- link "Zarejestruj się":
  - /url: /auth/register
- heading "Witaj w 10xDevs Astro Starter!" [level=1]
- paragraph: "Ten projekt został zbudowany w oparciu o nowoczesny stack technologiczny:"
- heading "Core" [level=2]
- list:
  - listitem: Astro v5.5.5 - Metaframework do aplikacji webowych
  - listitem: React v19 - Biblioteka UI do komponentów interaktywnych
  - listitem: TypeScript - Typowanie statyczne
- heading "Stylowanie" [level=2]
- list:
  - listitem: Tailwind CSS v4 - Utility-first CSS framework
- heading "Statyczna analiza kodu" [level=2]
- list:
  - listitem: ESLint v9 - Lintowanie kodu
  - listitem: Prettier - Formatowanie kodu
  - listitem: Husky i Lint-staged - Automatyczna analiza kodu przed commitowaniem
- paragraph: Starter zawiera wszystko, czego potrzebujesz do rozpoczęcia tworzenia nowoczesnych aplikacji webowych!
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
   15 |     await expect(emailInput).toBeVisible();
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
>  96 |     await page.getByTestId(AUTH_BUTTONS.REGISTER).click();
      |                                                   ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  116 |     
  117 |     // Poczekaj na odpowiedź API
  118 |     const response = await responsePromise;
  119 |     
  120 |     // Oczekiwany rezultat: przekierowanie do dashboardu
  121 |     await expect(page).toHaveURL('/dashboard');
  122 |     
  123 |     // Weryfikacja wiadomości powitalnej jeśli istnieje
  124 |     const welcomeMessage = page.getByTestId(DASHBOARD.WELCOME);
  125 |     if (await welcomeMessage.isVisible()) {
  126 |       await expect(welcomeMessage).toContainText('Witaj');
  127 |     }
  128 |     
  129 |     // Sprawdzenie, czy menu użytkownika jest widoczne
  130 |     await expect(page.getByTestId(DASHBOARD.USER_MENU)).toBeVisible();
  131 |   });
  132 |   
  133 |   test('Wylogowanie użytkownika', async ({ page }) => {
  134 |     // Logowanie użytkownika
  135 |     await page.goto('/auth/login');
  136 |     await page.getByTestId(AUTH.EMAIL_INPUT).fill('test-e2e@example.com');
  137 |     await page.getByTestId(AUTH.PASSWORD_INPUT).fill('Test123!@#');
  138 |     await page.getByTestId(AUTH.SUBMIT_BUTTON).click();
  139 |     
  140 |     // Oczekiwane przekierowanie do dashboardu
  141 |     await expect(page).toHaveURL('/dashboard');
  142 |     
  143 |     // Wylogowanie
  144 |     await page.getByTestId(DASHBOARD.USER_MENU).click();
  145 |     await page.getByTestId(DASHBOARD.USER_MENU_LOGOUT).click();
  146 |     
  147 |     // Oczekiwany rezultat: przekierowanie na stronę główną dla niezalogowanych
  148 |     await expect(page).toHaveURL('/');
  149 |     
  150 |     // Sprawdzenie, czy przyciski dla niezalogowanych są widoczne
  151 |     await expect(page.getByTestId(AUTH_BUTTONS.LOGIN)).toBeVisible();
  152 |     await expect(page.getByTestId(AUTH_BUTTONS.REGISTER)).toBeVisible();
  153 |   });
  154 | }); 
```