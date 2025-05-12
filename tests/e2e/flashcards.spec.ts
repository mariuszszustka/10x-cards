import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { AUTH, NOTIFICATIONS, DASHBOARD } from '../test-selectors';

// Pomocnicza funkcja do logowania
async function loginUser(page: Page) {
  console.log('Rozpoczynam procedurę logowania dla testów fiszek');
  
  // Podejście #1: Bezpośrednie logowanie przez API
  try {
    console.log('Próba logowania bezpośrednio przez API');
    const response = await page.request.post('/api/auth/login', {
      data: {
        email: 'test-e2e@example.com',
        password: 'Test123!@#'
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status odpowiedzi API:', response.status());
    
    if (response.ok()) {
      console.log('Udane logowanie przez API');
      const responseData = await response.json();
      console.log('Otrzymane dane:', JSON.stringify(responseData).substring(0, 100) + '...');
      
      // Przechodzimy na dowolną stronę aplikacji, aby móc ustawić localStorage
      await page.goto('/');
      
      // Ustawiamy dane sesji w localStorage
      await page.evaluate((data) => {
        if (data.success && data.session) {
          localStorage.setItem('authSession', JSON.stringify(data.session));
          localStorage.setItem('userId', data.session.user_id);
          if (data.session.user && data.session.user.email) {
            localStorage.setItem('userEmail', data.session.user.email);
          } else if (data.session.email) {
            localStorage.setItem('userEmail', data.session.email);
          }
          console.log('Ustawiono dane sesji w localStorage');
          return true;
        } else {
          console.error('Brak danych sesji w odpowiedzi API');
          return false;
        }
      }, responseData);
      
      // Teraz powinniśmy być zalogowani, przechodzimy na dashboard
      await page.goto('/dashboard');
      
      // Weryfikujemy, czy jesteśmy na dashboard
      if (page.url().includes('/dashboard')) {
        console.log('Logowanie udane - jesteśmy na dashboard');
        return;
      } else {
        console.warn('Nie udało się przejść na dashboard mimo udanego logowania przez API');
      }
    } else {
      console.warn('Logowanie przez API nie powiodło się, status:', response.status());
      const errorData = await response.json().catch(() => ({}));
      console.warn('Treść błędu:', JSON.stringify(errorData));
    }
  } catch (apiError) {
    console.error('Błąd podczas logowania przez API:', apiError);
  }
  
  // Podejście #2: Logowanie przez formularz HTML
  try {
    console.log('Próba logowania przez formularz HTML');
    await page.goto('/auth/login');
    
    // Znajdź elementy formularza
    const emailInput = page.getByTestId(AUTH.EMAIL_INPUT);
    const passwordInput = page.getByTestId(AUTH.PASSWORD_INPUT);
    const loginButton = page.getByTestId(AUTH.SUBMIT_BUTTON);
    
    // Upewnij się, że elementy istnieją
    await expect(emailInput).toBeVisible({ timeout: 5000 });
    await expect(passwordInput).toBeVisible({ timeout: 5000 });
    await expect(loginButton).toBeVisible({ timeout: 5000 });
    
    // Wypełnij formularz
    await emailInput.fill('test-e2e@example.com');
    await passwordInput.fill('Test123!@#');
    
    // Klikamy formularz i czekamy na ewentualne przekierowanie lub reakcję
    console.log('Klikam przycisk zaloguj');
    
    // Zwiększamy timeout oczekiwania na nawigację
    await Promise.all([
      page.waitForNavigation({ timeout: 10000 }).catch(() => 
        console.log('Brak automatycznego przekierowania po logowaniu')),
      loginButton.click()
    ]);
    
    // Czekamy chwilę, aby upewnić się, że localStorage zostanie zaktualizowany
    await page.waitForTimeout(1000);
    
    // Sprawdzamy czy jest powiadomienie o sukcesie
    const successNotification = page.getByTestId(NOTIFICATIONS.SUCCESS);
    const errorNotification = page.getByTestId(NOTIFICATIONS.ERROR);
    
    if (await successNotification.isVisible().catch(() => false)) {
      console.log('Widoczne powiadomienie o sukcesie');
    }
    
    if (await errorNotification.isVisible().catch(() => false)) {
      const errorText = await errorNotification.textContent();
      console.error('Błąd logowania:', errorText);
    }
    
    // Sprawdzamy czy jesteśmy na dashboard
    if (page.url().includes('/dashboard')) {
      console.log('Logowanie przez formularz udane - przekierowano na dashboard');
      return;
    }
    
    // Sprawdzamy czy logowanie się powiodło ale bez przekierowania (dane w localStorage)
    const hasAuthData = await page.evaluate(() => {
      const hasUserId = localStorage.getItem('userId') !== null;
      const hasAuthSession = localStorage.getItem('authSession') !== null;
      console.log(`LocalStorage: userId=${hasUserId}, authSession=${hasAuthSession}`);
      return hasUserId && hasAuthSession;
    });
    
    if (hasAuthData) {
      console.log('Dane autoryzacji znalezione w localStorage - ręcznie przechodzimy na dashboard');
      await page.goto('/dashboard');
      // Sprawdzamy, czy jesteśmy rzeczywiście na dashboardzie
      await page.waitForTimeout(1000);
      if (page.url().includes('/dashboard')) {
        console.log('Pomyślnie przekierowano na dashboard po ręcznym przejściu');
        const welcomeMessage = page.getByTestId(DASHBOARD.WELCOME);
        if (await welcomeMessage.isVisible().catch(() => false)) {
          console.log('Widoczny komunikat powitalny na dashboardzie');
          return;
        }
      }
    }
    
    console.warn('Logowanie przez formularz nie powiodło się lub przekierowanie nie działa');
  } catch (formError) {
    console.error('Błąd podczas logowania przez formularz:', formError);
  }
  
  // Podejście #3: Spróbujmy użyć magic linka jako ostatniej opcji
  try {
    console.log('Próba logowania przez magic link');
    await page.goto('/auth/login');
    
    // Znajdź pole email
    const emailInput = page.getByTestId(AUTH.EMAIL_INPUT);
    await expect(emailInput).toBeVisible({ timeout: 5000 });
    await emailInput.fill('test-e2e@example.com');
    
    // Kliknij w link do magic link
    const magicLinkButton = page.getByText('Zaloguj się przez link wysłany na email');
    if (await magicLinkButton.isVisible().catch(() => false)) {
      await magicLinkButton.click();
      console.log('Kliknięto przycisk do wysłania magic linka');
      
      // Poczekaj na potwierdzenie wysłania
      await page.waitForTimeout(2000);
      
      // Ponieważ w testach nie możemy kliknąć linka w emailu, dodajemy obejście:
      // Próbujemy bezpośrednio przejść na dashboard - w testach może to zadziałać
      await page.goto('/dashboard');
      
      if (page.url().includes('/dashboard')) {
        console.log('Przejście na dashboard po próbie magic link powiodło się');
        return;
      }
    } else {
      console.log('Przycisk do magic link nie jest widoczny');
    }
  } catch (magicLinkError) {
    console.error('Błąd podczas próby magic link:', magicLinkError);
  }
  
  // Podejście #4 (ostatnia szansa): Sprawdźmy, czy konto testowe istnieje i próbujmy je stworzyć
  try {
    console.log('Ostatnia próba - tworzenie testowego konta');
    await page.goto('/auth/register');
    
    // Znajdź elementy formularza
    const emailInput = await page.getByTestId('auth-email-input');
    const passwordInput = await page.getByTestId('auth-password-input');
    const confirmPasswordInput = await page.getByTestId('auth-confirm-password-input');
    const termsCheckbox = await page.getByTestId('auth-terms-checkbox');
    const registerButton = await page.getByTestId('auth-submit-button');
    
    // Wypełnij formularz
    await emailInput.fill('test-e2e@example.com');
    await passwordInput.fill('Test123!@#');
    await confirmPasswordInput.fill('Test123!@#');
    await termsCheckbox.check();
    
    // Kliknij przycisk rejestracji
    await Promise.all([
      page.waitForNavigation({ timeout: 10000 }).catch(() => 
        console.log('Brak automatycznego przekierowania po rejestracji')),
      registerButton.click()
    ]);
    
    // Sprawdź czy jesteśmy na dashboardzie
    if (page.url().includes('/dashboard')) {
      console.log('Rejestracja i automatyczne logowanie udane');
      return;
    }
    
    // Sprawdź, czy mamy teraz dane w localStorage
    const hasAuthDataAfterRegister = await page.evaluate(() => {
      return localStorage.getItem('userId') !== null && 
             localStorage.getItem('authSession') !== null;
    });
    
    if (hasAuthDataAfterRegister) {
      console.log('Dane autoryzacji znalezione po rejestracji - ręcznie przechodzimy na dashboard');
      await page.goto('/dashboard');
      return;
    }
  } catch (registerError) {
    console.error('Błąd podczas próby rejestracji testowego konta:', registerError);
  }
  
  // Jeśli dotarliśmy tutaj, to wszystkie metody logowania zawiodły
  console.error('Wszystkie metody logowania zawiodły - generuję zrzut ekranu dla diagnostyki');
  await page.screenshot({ path: 'login-failure.png' });
  throw new Error('Nie udało się zalogować żadną z dostępnych metod');
}

test.describe('Testy zarządzania fiszkami', () => {
  test.beforeEach(async ({ page }) => {
    // Zaloguj użytkownika przed każdym testem
    await loginUser(page);
  });

  test('Ręczne tworzenie fiszki', async ({ page }) => {
    // Przejście do sekcji "Moje fiszki"
    await page.goto('/flashcards');
    
    // Dodawanie nowej fiszki
    await page.getByTestId('add-flashcard-button').click();
    await page.getByTestId('flashcard-front-input').fill('Pytanie testowe E2E');
    await page.getByTestId('flashcard-back-input').fill('Odpowiedź testowa E2E');
    await page.getByTestId('save-flashcard-button').click();
    
    // Weryfikacja dodania fiszki
    await expect(page.getByTestId(NOTIFICATIONS.SUCCESS)).toBeVisible();
    await expect(page.getByText('Pytanie testowe E2E')).toBeVisible();
  });

  test('Edycja istniejącej fiszki', async ({ page }) => {
    // Przejście do sekcji "Moje fiszki"
    await page.goto('/flashcards');
    
    // Wybór pierwszej fiszki do edycji
    await page.getByTestId('edit-flashcard-button').first().click();
    
    // Edycja fiszki
    await page.getByTestId('flashcard-front-input').fill('Zaktualizowane pytanie E2E');
    await page.getByTestId('flashcard-back-input').fill('Zaktualizowana odpowiedź E2E');
    await page.getByTestId('save-flashcard-button').click();
    
    // Weryfikacja aktualizacji
    await expect(page.getByTestId(NOTIFICATIONS.SUCCESS)).toBeVisible();
    await expect(page.getByText('Zaktualizowane pytanie E2E')).toBeVisible();
  });

  test('Usuwanie fiszki', async ({ page }) => {
    // Przejście do sekcji "Moje fiszki"
    await page.goto('/flashcards');
    
    // Zapisanie liczby fiszek przed usunięciem
    const countBefore = await page.getByTestId('flashcard-item').count();
    
    // Usunięcie pierwszej fiszki
    await page.getByTestId('delete-flashcard-button').first().click();
    
    // Potwierdzenie usunięcia w oknie dialogowym
    await page.getByTestId('confirm-delete-button').click();
    
    // Weryfikacja usunięcia
    await expect(page.getByTestId(NOTIFICATIONS.SUCCESS)).toBeVisible();
    const countAfter = await page.getByTestId('flashcard-item').count();
    expect(countAfter).toBe(countBefore - 1);
  });
}); 