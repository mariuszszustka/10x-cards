import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { AUTH, NOTIFICATIONS } from '../test-selectors';

// Pomocnicza funkcja do logowania
async function loginUser(page: Page) {
  await page.goto('/auth/login');
  await page.getByTestId(AUTH.EMAIL_INPUT).fill('test-e2e@example.com');
  await page.getByTestId(AUTH.PASSWORD_INPUT).fill('Test123!@#');
  await page.getByTestId(AUTH.SUBMIT_BUTTON).click();
  await expect(page).toHaveURL('/dashboard');
}

test.describe('Testy generowania fiszek', () => {
  test.beforeEach(async ({ page }) => {
    // Zaloguj użytkownika przed każdym testem
    await loginUser(page);
  });

  test('Generowanie fiszek z tekstu źródłowego', async ({ page }) => {
    // Przejście do strony generowania fiszek
    await page.goto('/generate');
    
    // Przygotowanie tekstu źródłowego (min. 1000 znaków)
    const sourceText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(25);
    await page.getByTestId('source-text-input').fill(sourceText);
    
    // Wybór modelu AI
    await page.getByTestId('ai-model-selector').selectOption('llama3.2:3b');
    
    // Generowanie fiszek
    await page.getByTestId('generate-button').click();
    
    // Oczekiwanie na wygenerowanie propozycji (z timeoutem)
    await expect(page.getByTestId('flashcard-proposal')).toBeVisible({ timeout: 30000 });
    
    // Zatwierdzenie pierwszych trzech propozycji
    for (let i = 0; i < 3; i++) {
      await page.getByTestId('approve-button').nth(i).click();
    }
    
    // Zapisanie zatwierdzonych fiszek
    await page.getByTestId('save-approved-button').click();
    await expect(page.getByTestId(NOTIFICATIONS.SUCCESS)).toBeVisible();
    
    // Weryfikacja, czy fiszki pojawiły się w sekcji "Moje fiszki"
    await page.goto('/flashcards');
    await expect(page.getByTestId('flashcard-item')).toHaveCount(3);
  });

  test('Anulowanie generowania', async ({ page }) => {
    // Przejście do strony generowania fiszek
    await page.goto('/generate');
    
    // Wprowadzenie fragmentu tekstu
    await page.getByTestId('source-text-input').fill('Fragment tekstu');
    
    // Kliknięcie przycisku generowania
    await page.getByTestId('generate-button').click();
    
    // Anulowanie procesu
    await page.getByTestId('cancel-button').click();
    
    // Weryfikacja powrotu do stanu początkowego
    await expect(page.getByTestId('generate-button')).toBeVisible();
    await expect(page.getByTestId('source-text-input')).toBeEmpty();
  });

  test('Błąd przy generowaniu - za krótki tekst', async ({ page }) => {
    // Przejście do strony generowania fiszek
    await page.goto('/generate');
    
    // Wprowadzenie zbyt krótkiego tekstu
    await page.getByTestId('source-text-input').fill('Za krótki tekst');
    
    // Kliknięcie przycisku generowania
    await page.getByTestId('generate-button').click();
    
    // Weryfikacja komunikatu o błędzie
    await expect(page.getByTestId(NOTIFICATIONS.ERROR)).toBeVisible();
    await expect(page.getByTestId(NOTIFICATIONS.ERROR)).toContainText('za krótki');
  });
}); 