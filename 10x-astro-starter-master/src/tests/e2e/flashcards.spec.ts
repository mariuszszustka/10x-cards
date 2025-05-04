import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { AUTH, GENERATION, FLASHCARDS, NOTIFICATIONS } from '../test-selectors';

// Funkcja pomocnicza do logowania
async function loginUser(page: Page) {
  await page.goto('/login');
  await page.getByTestId(AUTH.EMAIL_INPUT).fill('test-e2e@example.com');
  await page.getByTestId(AUTH.PASSWORD_INPUT).fill('Test123!@#');
  await page.getByTestId(AUTH.SUBMIT_BUTTON).click();
  await expect(page).toHaveURL('/dashboard');
}

test.describe('Scenariusze zarządzania fiszkami', () => {
  // Przed każdym testem zaloguj użytkownika
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('E2E-GEN-001: Generowanie fiszek przez AI', async ({ page }) => {
    // 1. Przejście do sekcji "Generuj fiszki"
    await page.getByTestId(FLASHCARDS.TABS.GENERATE).click();
    
    // 2. Wprowadzenie tekstu źródłowego
    const sourceText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(50); // min. 1000 znaków
    await page.getByTestId(GENERATION.FORM.TEXT_INPUT).fill(sourceText);
    
    // 3. Wybór modelu AI
    await page.getByTestId(GENERATION.FORM.MODEL_SELECTOR).selectOption('llama3.2:3b');
    
    // 4. Kliknięcie przycisku "Generuj fiszki"
    await page.getByTestId(GENERATION.FORM.GENERATE_BUTTON).click();
    
    // 5. Oczekiwanie na propozycje fiszek (z dłuższym timeoutem, bo generowanie może trwać dłużej)
    await expect(page.getByTestId(GENERATION.PROPOSALS.ITEM).first()).toBeVisible({ timeout: 30000 });
    
    // 6. Zatwierdzenie kilku wygenerowanych propozycji
    // Zakładamy, że mamy co najmniej 3 propozycje
    const proposals = page.getByTestId(GENERATION.PROPOSALS.ITEM);
    const count = await proposals.count();
    
    // Zatwierdzamy co najmniej 3 propozycje lub wszystkie, jeśli jest ich mniej
    const approveCount = Math.min(count, 3);
    for (let i = 0; i < approveCount; i++) {
      await proposals.nth(i).getByTestId(GENERATION.PROPOSALS.APPROVE_BUTTON).click();
    }
    
    // 7. Kliknięcie przycisku "Zapisz zatwierdzone"
    await page.getByTestId(GENERATION.PROPOSALS.SAVE_APPROVED_BUTTON).click();
    
    // Oczekiwany rezultat: komunikat o pomyślnym zapisaniu
    await expect(page.getByTestId(NOTIFICATIONS.SUCCESS)).toBeVisible();
    
    // Dodatkowa weryfikacja - fiszki pojawiły się w sekcji "Moje fiszki"
    await page.getByTestId(FLASHCARDS.TABS.MY_FLASHCARDS).click();
    await expect(page.getByTestId(FLASHCARDS.LIST.ITEM)).toHaveCount(approveCount);
  });

  test('E2E-CREATE-001: Ręczne tworzenie fiszki', async ({ page }) => {
    // 1. Przejście do sekcji "Moje fiszki" i dodawanie nowej
    await page.getByTestId(FLASHCARDS.TABS.MY_FLASHCARDS).click();
    await page.getByTestId(FLASHCARDS.TABS.ADD).click();
    
    // 3-4. Wprowadzenie treści fiszki
    await page.getByTestId(FLASHCARDS.FORM.FRONT_INPUT).fill('Pytanie testowe E2E');
    await page.getByTestId(FLASHCARDS.FORM.BACK_INPUT).fill('Odpowiedź testowa E2E');
    
    // 5. Kliknięcie przycisku "Zapisz"
    await page.getByTestId(FLASHCARDS.FORM.SAVE_BUTTON).click();
    
    // Oczekiwany rezultat: komunikat o pomyślnym dodaniu
    await expect(page.getByTestId(NOTIFICATIONS.SUCCESS)).toBeVisible();
    
    // Sprawdzenie, czy fiszka została dodana do listy
    await page.getByTestId(FLASHCARDS.TABS.MY_FLASHCARDS).click();
    const flashcardText = page.getByText('Pytanie testowe E2E');
    await expect(flashcardText).toBeVisible();
  });

  test('E2E-EDIT-001: Edycja istniejącej fiszki', async ({ page }) => {
    // 1. Przejście do sekcji "Moje fiszki"
    await page.getByTestId(FLASHCARDS.TABS.MY_FLASHCARDS).click();
    
    // Upewnij się, że mamy co najmniej jedną fiszkę
    await expect(page.getByTestId(FLASHCARDS.LIST.ITEM).first()).toBeVisible();
    
    // 2-3. Wybór pierwszej fiszki do edycji
    await page.getByTestId(FLASHCARDS.LIST.ITEM).first()
      .getByTestId(FLASHCARDS.LIST.EDIT_BUTTON).click();
    
    // 4-5. Zmiana treści fiszki
    await page.getByTestId(FLASHCARDS.FORM.FRONT_INPUT).fill('Zaktualizowane pytanie E2E');
    await page.getByTestId(FLASHCARDS.FORM.BACK_INPUT).fill('Zaktualizowana odpowiedź E2E');
    
    // 6. Kliknięcie przycisku "Zapisz zmiany"
    await page.getByTestId(FLASHCARDS.FORM.SAVE_BUTTON).click();
    
    // Oczekiwany rezultat: komunikat o pomyślnej aktualizacji
    await expect(page.getByTestId(NOTIFICATIONS.SUCCESS)).toBeVisible();
    
    // Weryfikacja aktualizacji
    const updatedFlashcard = page.getByText('Zaktualizowane pytanie E2E');
    await expect(updatedFlashcard).toBeVisible();
  });

  test('E2E-DELETE-001: Usuwanie fiszki', async ({ page }) => {
    // 1. Przejście do sekcji "Moje fiszki"
    await page.getByTestId(FLASHCARDS.TABS.MY_FLASHCARDS).click();
    
    // Upewnij się, że mamy co najmniej jedną fiszkę
    await expect(page.getByTestId(FLASHCARDS.LIST.ITEM).first()).toBeVisible();
    
    // Zapisanie liczby fiszek przed usunięciem
    const countBefore = await page.getByTestId(FLASHCARDS.LIST.ITEM).count();
    
    // 2-3. Wybór pierwszej fiszki do usunięcia
    await page.getByTestId(FLASHCARDS.LIST.ITEM).first()
      .getByTestId(FLASHCARDS.LIST.DELETE_BUTTON).click();
    
    // 4. Potwierdzenie chęci usunięcia fiszki
    await page.getByTestId(FLASHCARDS.CONFIRMATION.CONFIRM_BUTTON).click();
    
    // Oczekiwany rezultat: komunikat o pomyślnym usunięciu
    await expect(page.getByTestId(NOTIFICATIONS.SUCCESS)).toBeVisible();
    
    // Weryfikacja liczby fiszek po usunięciu
    const countAfter = await page.getByTestId(FLASHCARDS.LIST.ITEM).count();
    expect(countAfter).toBe(countBefore - 1);
  });
}); 