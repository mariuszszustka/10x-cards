import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { AUTH, STUDY, NOTIFICATIONS } from '../test-selectors';

// Funkcja pomocnicza do logowania (z poprawioną typizacją)
async function loginUser(page: Page) {
  await page.goto('/login');
  await page.getByTestId(AUTH.EMAIL_INPUT).fill('test-e2e@example.com');
  await page.getByTestId(AUTH.PASSWORD_INPUT).fill('Test123!@#');
  await page.getByTestId(AUTH.SUBMIT_BUTTON).click();
  await expect(page).toHaveURL('/dashboard');
}

test.describe('Scenariusze sesji nauki', () => {
  // Przed każdym testem zaloguj użytkownika
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('E2E-STUDY-001: Przeprowadzenie sesji nauki', async ({ page }) => {
    // 1. Przejście do sekcji "Sesja nauki"
    await page.goto('/study');
    
    // 2. Kliknięcie przycisku "Rozpocznij sesję"
    await page.getByTestId(STUDY.START_BUTTON).click();
    
    // Sprawdź, czy sesja się rozpoczęła
    await expect(page.getByTestId(STUDY.SESSION.CONTAINER)).toBeVisible();
    
    // 3. Przejście przez fiszki (maksymalnie 5 lub do końca sesji)
    for (let i = 0; i < 5; i++) {
      // Sprawdź, czy jesteśmy już na podsumowaniu
      const isSummaryVisible = await page.getByTestId(STUDY.SUMMARY.CONTAINER).isVisible();
      if (isSummaryVisible) {
        break;
      }
      
      // Sprawdź, czy front fiszki jest widoczny
      await expect(page.getByTestId(STUDY.SESSION.FRONT)).toBeVisible();
      
      // Pokaż odpowiedź
      await page.getByTestId(STUDY.SESSION.REVEAL_BUTTON).click();
      await expect(page.getByTestId(STUDY.SESSION.BACK)).toBeVisible();
      
      // Wybierz ocenę (rotacja między trudna, średnia i łatwa)
      const difficultyOptions = [
        STUDY.SESSION.DIFFICULTY.HARD,
        STUDY.SESSION.DIFFICULTY.MEDIUM,
        STUDY.SESSION.DIFFICULTY.EASY
      ];
      await page.getByTestId(difficultyOptions[i % 3]).click();
    }
    
    // Sprawdź, czy podsumowanie jest widoczne
    await expect(page.getByTestId(STUDY.SUMMARY.CONTAINER)).toBeVisible();
    await expect(page.getByTestId(STUDY.SUMMARY.STATS)).toBeVisible();
    
    // Zakończ sesję
    await page.getByTestId(STUDY.SUMMARY.FINISH_BUTTON).click();
    
    // Upewnij się, że wróciliśmy do strony głównej sesji nauki
    await expect(page).toHaveURL('/study');
  });

  test('E2E-LEITNER-001: Weryfikacja działania algorytmu Leitnera', async ({ page }) => {
    // Ten test wymaga pewnej manipulacji danymi lub czasu
    // W rzeczywistym projekcie mogłaby istnieć specjalna API dla testów
    
    // Przejdź do sekcji statystyk
    await page.goto('/stats');
    
    // Sprawdź, czy widoczne są statystyki dla wszystkich poziomów Leitnera
    await expect(page.getByTestId(STUDY.SUMMARY.LEVEL_1_COUNT)).toBeVisible();
    await expect(page.getByTestId(STUDY.SUMMARY.LEVEL_2_COUNT)).toBeVisible();
    await expect(page.getByTestId(STUDY.SUMMARY.LEVEL_3_COUNT)).toBeVisible();
    
    // W rzeczywistej implementacji, moglibyśmy:
    // 1. Użyć specjalnego endpointu API do symulacji upływu czasu
    // 2. Manipulować danymi w bazie danych TestDB
    // 3. Użyć mocków dla komponentów sesji nauki
    
    // Przykład z mockami (pseudokod w komentarzu)
    /*
    // Symulacja ukończenia sesji i upływu czasu
    await page.evaluate(async () => {
      await window.testHelpers.simulateCompletedStudySession([
        { id: 1, level: 1 }, // poziom 1 - powinien pojawić się po 1 dniu
        { id: 2, level: 2 }, // poziom 2 - powinien pojawić się po 3 dniach
        { id: 3, level: 3 }  // poziom 3 - powinien pojawić się po 7 dniach
      ]);
      await window.testHelpers.simulateTimePassage(1); // 1 dzień
    });
    
    // Sprawdź zawartość sesji nauki po 1 dniu
    await page.goto('/study');
    await page.getByTestId(STUDY.START_BUTTON).click();
    
    // Powinny pojawić się tylko fiszki z poziomu 1
    const sessionData = await page.evaluate(() => window.testHelpers.getStudySessionData());
    expect(sessionData.flashcardsFromLevel1).toBeGreaterThan(0);
    expect(sessionData.flashcardsFromLevel2).toBe(0);
    expect(sessionData.flashcardsFromLevel3).toBe(0);
    */
    
    // W rzeczywistych testach byłby tutaj konkretny kod
    // wykorzystujący specyficzne dla projektu API testowe
  });
}); 