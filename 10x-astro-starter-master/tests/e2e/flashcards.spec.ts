import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { AUTH, NOTIFICATIONS, DASHBOARD } from '../test-selectors';

// Pomocnicza funkcja do logowania
async function loginUser(page: Page) {
  await page.goto('/auth/login');
  await page.getByTestId(AUTH.EMAIL_INPUT).fill('test-e2e@example.com');
  await page.getByTestId(AUTH.PASSWORD_INPUT).fill('Test123!@#');
  await page.getByTestId(AUTH.SUBMIT_BUTTON).click();
  await expect(page).toHaveURL('/dashboard');
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