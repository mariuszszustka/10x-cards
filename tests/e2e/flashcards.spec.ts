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
      
      // Przechodzimy na dowolną stronę aplikacji, aby móc ustawić localStorage
      await page.goto('/');
      
      // Ustawiamy dane sesji w localStorage
      await page.evaluate((data) => {
        if (data.success && data.session) {
          localStorage.setItem('authSession', JSON.stringify(data.session));
          localStorage.setItem('userId', data.session.user_id);
          if (data.session.user && data.session.user.email) {
            localStorage.setItem('userEmail', data.session.user.email);
          }
          console.log('Ustawiono dane sesji w localStorage');
        } else {
          console.error('Brak danych sesji w odpowiedzi API');
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
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();
    
    // Wypełnij formularz
    await emailInput.fill('test-e2e@example.com');
    await passwordInput.fill('Test123!@#');
    
    // Klikamy formularz i czekamy na ewentualne przekierowanie
    await Promise.all([
      page.waitForNavigation({ timeout: 5000 }).catch(() => 
        console.log('Brak automatycznego przekierowania po logowaniu')),
      loginButton.click()
    ]);
    
    // Sprawdzamy czy jesteśmy na dashboard
    if (page.url().includes('/dashboard')) {
      console.log('Logowanie przez formularz udane - przekierowano na dashboard');
      return;
    }
    
    // Sprawdzamy czy logowanie się powiodło ale bez przekierowania (dane w localStorage)
    const hasAuthData = await page.evaluate(() => {
      return localStorage.getItem('userId') !== null && 
             localStorage.getItem('authSession') !== null;
    });
    
    if (hasAuthData) {
      console.log('Dane autoryzacji znalezione w localStorage - ręcznie przechodzimy na dashboard');
      await page.goto('/dashboard');
      return;
    }
    
    console.warn('Logowanie przez formularz nie powiodło się');
  } catch (formError) {
    console.error('Błąd podczas logowania przez formularz:', formError);
  }
  
  // Podejście #3: Próbujemy bezpośrednio przejść na dashboard - może już jesteśmy zalogowani
  try {
    console.log('Ostatnia próba - bezpośrednie przejście na dashboard');
    await page.goto('/dashboard');
    
    // Jeśli nie przekierowano nas z powrotem na stronę logowania, to jesteśmy zalogowani
    if (page.url().includes('/dashboard')) {
      console.log('Już byliśmy zalogowani - jesteśmy na dashboard');
      return;
    }
  } catch (directError) {
    console.error('Błąd podczas bezpośredniego przejścia na dashboard:', directError);
  }
  
  // Jeśli dotarliśmy tutaj, to wszystkie metody logowania zawiodły
  console.error('Wszystkie metody logowania zawiodły');
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