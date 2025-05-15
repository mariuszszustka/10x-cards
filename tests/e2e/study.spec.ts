import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { AUTH, NOTIFICATIONS, DASHBOARD } from "../test-selectors";

// Pomocnicza funkcja do logowania
async function loginUser(page: Page) {
  await page.goto("/auth/login");
  await page.getByTestId(AUTH.EMAIL_INPUT).fill("test-e2e@example.com");
  await page.getByTestId(AUTH.PASSWORD_INPUT).fill("Test123!@#");
  await page.getByTestId(AUTH.SUBMIT_BUTTON).click();
  await expect(page).toHaveURL("/dashboard");
}

test.describe("Testy sesji nauki", () => {
  test.beforeEach(async ({ page }) => {
    // Zaloguj użytkownika przed każdym testem
    await loginUser(page);
  });

  test("Przeprowadzenie sesji nauki", async ({ page }) => {
    // Przejście do sekcji "Sesja nauki"
    await page.goto("/study");
    await page.getByTestId("start-study-session-button").click();

    // Przejście przez 5 fiszek (lub mniej, jeśli nie ma tylu)
    for (let i = 0; i < 5; i++) {
      // Sprawdzenie, czy sesja się zakończyła
      const isSummary = await page.getByTestId("study-session-summary").isVisible();
      if (isSummary) break;

      // Weryfikacja wyświetlenia przodu fiszki
      await expect(page.getByTestId("flashcard-front")).toBeVisible();

      // Pokazanie odpowiedzi
      await page.getByTestId("show-answer-button").click();
      await expect(page.getByTestId("flashcard-back")).toBeVisible();

      // Wybór oceny (rotacja między różnymi poziomami)
      const difficultyOptions = ["difficult-button", "medium-button", "easy-button"];
      await page.getByTestId(difficultyOptions[i % 3]).click();
    }

    // Weryfikacja podsumowania sesji
    await expect(page.getByTestId("study-session-summary")).toBeVisible();
    await expect(page.getByTestId("session-stats")).toBeVisible();
  });

  test("Weryfikacja algorytmu Leitnera", async ({ page }) => {
    // Przejście do statystyk przed sesją
    await page.goto("/stats");

    // Zapisanie początkowej dystrybucji fiszek
    const initialLevel1 = await page.getByTestId("leitner-level-1-count").textContent();
    const initialLevel2 = await page.getByTestId("leitner-level-2-count").textContent();
    const initialLevel3 = await page.getByTestId("leitner-level-3-count").textContent();

    // Przeprowadzenie sesji nauki
    await page.goto("/study");
    await page.getByTestId("start-study-session-button").click();

    // Ocenianie wszystkich fiszek jako "Łatwe"
    while (await page.getByTestId("flashcard-front").isVisible()) {
      await page.getByTestId("show-answer-button").click();
      await page.getByTestId("easy-button").click();
    }

    // Sprawdzenie zakończenia sesji
    await expect(page.getByTestId("study-session-summary")).toBeVisible();

    // Sprawdzenie dystrybucji fiszek po sesji
    await page.goto("/stats");

    // Weryfikacja zmiany poziomów Leitnera
    const finalLevel1 = await page.getByTestId("leitner-level-1-count").textContent();
    const finalLevel2 = await page.getByTestId("leitner-level-2-count").textContent();
    const finalLevel3 = await page.getByTestId("leitner-level-3-count").textContent();

    // Poziom 1 powinien zmaleć, a poziom 3 wzrosnąć
    expect(Number(finalLevel1)).toBeLessThan(Number(initialLevel1));
    expect(Number(finalLevel3)).toBeGreaterThan(Number(initialLevel3));
  });
});
