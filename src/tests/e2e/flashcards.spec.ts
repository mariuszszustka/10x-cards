import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { AUTH, GENERATION, FLASHCARDS, NOTIFICATIONS } from '../test-selectors';
import { SELECTORS } from '../selectors';
import { loginUser } from './helpers';

// Funkcja do tworzenia użytkownika testowego jeśli nie istnieje
export async function setupTestUser(page: Page) {
  // To wdrożymy później jako endpoint API do tworzenia użytkownika testowego
  // lub użyjemy bezpośredniego dostępu do Supabase
}

test.describe('Podstawowe operacje na fiszkach', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('Dodawanie nowej fiszki', async ({ page }) => {
    // Przejdź do sekcji fiszek
    await page.goto('/flashcards');
    
    // Kliknij przycisk dodawania
    await page.click(SELECTORS.FLASHCARDS.ADD_BUTTON);
    
    // Wypełnij formularz
    const frontText = `Pytanie testowe ${Date.now()}`;
    const backText = `Odpowiedź testowa ${Date.now()}`;
    
    await page.fill(SELECTORS.FLASHCARDS.FRONT_INPUT, frontText);
    await page.fill(SELECTORS.FLASHCARDS.BACK_INPUT, backText);
    await page.click(SELECTORS.FLASHCARDS.SAVE_BUTTON);
    
    // Sprawdź czy fiszka pojawiła się na liście
    await page.waitForSelector(`text=${frontText}`);
    
    // Dodatkowe sprawdzenie czy fiszka jest widoczna
    const flashcardVisible = await page.isVisible(`text=${frontText}`);
    expect(flashcardVisible).toBeTruthy();
  });
});

test.describe('Scenariusze zarządzania fiszkami', () => {
  // Przed każdym testem zaloguj użytkownika
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('E2E-GEN-001: Generowanie fiszek przez AI', async ({ page }) => {
    // 1. Przejście do sekcji "Kreator fiszek"
    await page.getByTestId(FLASHCARDS.TABS.GENERATE).click();
    
    // 2. Wprowadzenie tekstu źródłowego
    const sourceText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(50); // min. 1000 znaków
    await page.getByTestId(GENERATION.FORM.TEXT_INPUT).fill(sourceText);
    
    // 3. Wybór modelu AI
    await page.getByTestId(GENERATION.FORM.MODEL_SELECTOR).selectOption('llama3.2:3b');
    
    // 4. Kliknięcie przycisku "Kreator fiszek"
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

test.describe('Podstawowa sesja nauki', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('Rozpoczęcie i zakończenie sesji nauki', async ({ page }) => {
    // Przejdź do sekcji nauki
    await page.goto('/study');
    
    // Rozpocznij sesję
    await page.click(SELECTORS.STUDY.START_BUTTON);
    
    // Poczekaj na wyświetlenie pierwszej fiszki
    await page.waitForSelector(SELECTORS.STUDY.CARD_FRONT);
    
    // Pokaż odpowiedź
    await page.click(SELECTORS.STUDY.REVEAL_BUTTON);
    await page.waitForSelector(SELECTORS.STUDY.CARD_BACK);
    
    // Oceń jako łatwą
    await page.click(SELECTORS.STUDY.EASY_BUTTON);
    
    // Zakończ sesję (jeśli przeszliśmy do ekranu podsumowania)
    try {
      await page.waitForSelector(SELECTORS.STUDY.FINISH_BUTTON, { timeout: 5000 });
      await page.click(SELECTORS.STUDY.FINISH_BUTTON);
      await expect(page).toHaveURL('/study');
    } catch (error) {
      // Może nie być podsumowania jeśli jest więcej fiszek,
      // wtedy po prostu kończymy test
      console.log('Sesja kontynuowana, pomijamy zakończenie');
    }
  });
});

test('Diagnoza problemu z ładowaniem strony', async ({ page }) => {
  console.log('Otwieranie strony głównej...');
  
  // Ustawienie dłuższego timeoutu dla tej nawigacji
  const response = await page.goto('/', { timeout: 60000 });
  
  // Sprawdź status HTTP
  console.log('Status odpowiedzi:', response?.status());
  
  // Sprawdź zawartość strony
  const html = await page.content();
  console.log('Długość otrzymanej strony HTML:', html.length);
  
  // Zrzut ekranu
  await page.screenshot({ path: 'homepage-debug.png', fullPage: true });
  
  // Sprawdź konsolę przeglądarki
  const logs = [];
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  
  // Poczekaj chwilę i wypisz logi
  await page.waitForTimeout(5000);
  console.log('Logi z konsoli przeglądarki:', logs);
});

test('Prosty test logowania bez pomocników', async ({ page }) => {
  // Otwórz stronę logowania
  await page.goto('/auth/login', { timeout: 30000 });
  console.log('Otwarto stronę logowania:', page.url());
  
  // Zrób zrzut ekranu
  await page.screenshot({ path: 'login-page.png' });
  
  // Zbadaj strukturę HTML
  const html = await page.content();
  console.log('Fragment HTML strony logowania:', html.substring(0, 500) + '...');
  
  // Sprawdź czy elementy formularza są widoczne
  const emailVisible = await page.isVisible(SELECTORS.AUTH.EMAIL_INPUT);
  const passwordVisible = await page.isVisible(SELECTORS.AUTH.PASSWORD_INPUT);
  const buttonVisible = await page.isVisible(SELECTORS.AUTH.LOGIN_BUTTON);
  
  console.log('Widoczność elementów formularza:', 
    emailVisible ? 'Email: Tak' : 'Email: Nie',
    passwordVisible ? 'Hasło: Tak' : 'Hasło: Nie',
    buttonVisible ? 'Przycisk: Tak' : 'Przycisk: Nie'
  );
  
  // Jeśli elementy są widoczne, wypełnij formularz
  if (emailVisible && passwordVisible && buttonVisible) {
    await page.fill(SELECTORS.AUTH.EMAIL_INPUT, 'test-e2e@example.com');
    await page.fill(SELECTORS.AUTH.PASSWORD_INPUT, 'Test123!@#');
    
    // Zrób zrzut przed kliknięciem
    await page.screenshot({ path: 'before-login-click-simple.png' });
    
    // Kliknij przycisk logowania
    await page.click(SELECTORS.AUTH.LOGIN_BUTTON);
    
    // Poczekaj chwilę
    await page.waitForTimeout(5000);
    
    // Zrób zrzut po kliknięciu
    await page.screenshot({ path: 'after-login-click-simple.png' });
    
    // Sprawdź URL po logowaniu
    console.log('URL po kliknięciu:', page.url());
  } else {
    console.log('Nie znaleziono wszystkich elementów formularza logowania!');
  }
});

test('Dostęp do strony fiszek', async ({ page }) => {
  // Najpierw zaloguj się
  await page.goto('/auth/login', { timeout: 30000 });
  
  // Sprawdź czy elementy formularza są widoczne
  if (await page.isVisible(SELECTORS.AUTH.EMAIL_INPUT)) {
    await page.fill(SELECTORS.AUTH.EMAIL_INPUT, 'test-e2e@example.com');
    await page.fill(SELECTORS.AUTH.PASSWORD_INPUT, 'Test123!@#');
    await page.click(SELECTORS.AUTH.LOGIN_BUTTON);
    
    // Poczekaj na przekierowanie
    await page.waitForTimeout(5000);
  }
  
  // Przejdź do strony fiszek
  await page.goto('/flashcards', { timeout: 30000 });
  console.log('Otwarto stronę fiszek:', page.url());
  
  // Zrób zrzut ekranu
  await page.screenshot({ path: 'flashcards-page.png' });
  
  // Sprawdź tytuł strony
  const title = await page.title();
  console.log('Tytuł strony fiszek:', title);
  
  // Wypisz główne elementy strony
  const elementsHTML = await page.evaluate(() => document.body.innerHTML);
  console.log('Fragment HTML strony fiszek:', elementsHTML.substring(0, 500) + '...');
}); 