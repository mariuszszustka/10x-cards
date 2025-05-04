import { test, expect } from '@playwright/test';
import { AUTH, AUTH_BUTTONS, NOTIFICATIONS, DASHBOARD } from '../test-selectors';

test.describe('Scenariusze autoryzacji', () => {
  test('E2E-REG-001: Rejestracja nowego użytkownika', async ({ page }) => {
    // Generowanie unikalnego adresu email
    const uniqueEmail = `user-${Date.now()}@example.com`;
    
    // 1. Otwarcie strony głównej aplikacji
    await page.goto('/');
    
    // 2. Kliknięcie przycisku "Zarejestruj się"
    await page.getByTestId(AUTH_BUTTONS.REGISTER).click();
    
    // 3. Wypełnienie formularza rejestracyjnego
    await page.getByTestId(AUTH.EMAIL_INPUT).fill(uniqueEmail);
    await page.getByTestId(AUTH.PASSWORD_INPUT).fill('NoweHaslo123!');
    await page.getByTestId(AUTH.CONFIRM_PASSWORD_INPUT).fill('NoweHaslo123!');
    
    // Akceptacja warunków
    await page.getByTestId(AUTH.TERMS_CHECKBOX).check();
    
    // 4. Kliknięcie przycisku "Zarejestruj"
    await page.getByTestId(AUTH.SUBMIT_BUTTON).click();
    
    // Oczekiwany rezultat: przekierowanie do dashboardu
    await expect(page).toHaveURL('/dashboard');
    
    // Weryfikacja wiadomości powitalnej
    await expect(page.getByTestId(DASHBOARD.WELCOME)).toBeVisible();
    
    // Sprawdzenie, czy menu użytkownika jest widoczne
    await expect(page.getByTestId('user-menu')).toBeVisible();
  });

  test('E2E-LOG-001: Logowanie istniejącego użytkownika', async ({ page }) => {
    // 1. Otwarcie strony logowania
    await page.goto('/login');
    
    // 2-3. Wprowadzenie danych logowania
    await page.getByTestId(AUTH.EMAIL_INPUT).fill('test-e2e@example.com');
    await page.getByTestId(AUTH.PASSWORD_INPUT).fill('Test123!@#');
    
    // 4. Kliknięcie przycisku "Zaloguj"
    await page.getByTestId(AUTH.SUBMIT_BUTTON).click();
    
    // Oczekiwany rezultat: przekierowanie do dashboardu
    await expect(page).toHaveURL('/dashboard');
    
    // Sprawdzenie, czy menu użytkownika jest widoczne
    await expect(page.getByTestId('user-menu')).toBeVisible();
  });

  test('E2E-PASS-001: Odzyskiwanie hasła', async ({ page }) => {
    // 1. Otwarcie strony logowania
    await page.goto('/login');
    
    // 2. Kliknięcie linku "Zapomniałem hasła"
    await page.getByTestId(AUTH.FORGOT_PASSWORD_LINK).click();
    
    // Oczekiwany rezultat: przekierowanie do strony resetowania hasła
    await expect(page).toHaveURL('/reset-password');
    
    // 3. Wprowadzenie adresu email
    await page.getByTestId(AUTH.EMAIL_INPUT).fill('test-e2e@example.com');
    
    // 4. Kliknięcie przycisku "Wyślij link resetujący"
    await page.getByTestId(AUTH.SUBMIT_BUTTON).click();
    
    // Oczekiwany rezultat: komunikat o wysłaniu linku
    await expect(page.getByTestId(NOTIFICATIONS.SUCCESS))
      .toContainText('Link resetujący został wysłany');
  });
  
  test('E2E-LOGOUT-001: Wylogowanie użytkownika', async ({ page }) => {
    // Logowanie użytkownika
    await page.goto('/login');
    await page.getByTestId(AUTH.EMAIL_INPUT).fill('test-e2e@example.com');
    await page.getByTestId(AUTH.PASSWORD_INPUT).fill('Test123!@#');
    await page.getByTestId(AUTH.SUBMIT_BUTTON).click();
    
    // Oczekiwane przekierowanie do dashboardu
    await expect(page).toHaveURL('/dashboard');
    
    // Wylogowanie
    await page.getByTestId('user-menu').click();
    await page.getByTestId('user-menu-logout').click();
    
    // Oczekiwany rezultat: przekierowanie na stronę główną dla niezalogowanych
    await expect(page).toHaveURL('/');
    
    // Sprawdzenie, czy przyciski dla niezalogowanych są widoczne
    await expect(page.getByTestId(AUTH_BUTTONS.LOGIN)).toBeVisible();
    await expect(page.getByTestId(AUTH_BUTTONS.REGISTER)).toBeVisible();
    
    // Próba dostępu do chronionej strony powinna przekierować na stronę logowania
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
  });
}); 