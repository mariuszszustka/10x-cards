# Wzorzec Page Object Model (POM) w testach E2E z Playwright

Wzorzec Page Object Model (POM) to popularne podejście w automatyzacji testów, które pozwala na:

1. Enkapsulację logiki interakcji ze stronami w dedykowanych klasach
2. Oddzielenie logiki testów od szczegółów implementacyjnych UI
3. Zwiększenie czytelności i możliwości ponownego wykorzystania kodu
4. Łatwiejsze utrzymanie testów przy zmianach w interfejsie

Poniżej przedstawiono implementację wzorca POM dla kluczowych elementów aplikacji 10x-cards.

## Struktura plików

```
src/
  tests/
    test-selectors.ts      # Selektory dla elementów UI
    pom/                   # Klasy Page Object Model
      auth.ts              # Obiekty stron autoryzacji
      flashcards.ts        # Obiekty stron zarządzania fiszkami
      generation.ts        # Obiekty strony generowania fiszek przez AI
      study.ts             # Obiekty sesji nauki
      base-page.ts         # Klasa bazowa dla wszystkich stron
    e2e/                   # Testy E2E wykorzystujące POM
      auth.spec.ts
      flashcards.spec.ts
      study.spec.ts
```

## Klasa bazowa dla wszystkich obiektów stron

```typescript
// src/tests/pom/base-page.ts
import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  constructor(protected page: Page) {}
  
  /**
   * Nawiguje do określonego URL
   */
  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }
  
  /**
   * Pobiera element na podstawie data-testid
   */
  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }
  
  /**
   * Sprawdza, czy element jest widoczny
   */
  async expectToBeVisible(testId: string, options = {}): Promise<void> {
    await expect(this.getByTestId(testId)).toBeVisible(options);
  }
  
  /**
   * Sprawdza, czy URL zawiera określoną ścieżkę
   */
  async expectURL(path: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(path));
  }
  
  /**
   * Sprawdza, czy element zawiera określony tekst
   */
  async expectToContainText(testId: string, text: string): Promise<void> {
    await expect(this.getByTestId(testId)).toContainText(text);
  }
  
  /**
   * Oczekuje na określony czas
   */
  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }
}
```

## Obiekty stron autoryzacji

```typescript
// src/tests/pom/auth.ts
import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { AUTH, AUTH_BUTTONS, NOTIFICATIONS, DASHBOARD, LAYOUT } from '../test-selectors';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  /**
   * Przechodzi do strony logowania
   */
  async goto(): Promise<void> {
    await super.goto('/login');
  }
  
  /**
   * Wypełnia formularz logowania i klika przycisk zaloguj
   */
  async login(email: string, password: string): Promise<void> {
    await this.getByTestId(AUTH.EMAIL_INPUT).fill(email);
    await this.getByTestId(AUTH.PASSWORD_INPUT).fill(password);
    await this.getByTestId(AUTH.SUBMIT_BUTTON).click();
  }
  
  /**
   * Klika link "Zapomniałem hasła"
   */
  async forgotPassword(): Promise<ResetPasswordPage> {
    await this.getByTestId(AUTH.FORGOT_PASSWORD_LINK).click();
    return new ResetPasswordPage(this.page);
  }
  
  /**
   * Sprawdza, czy strona logowania jest załadowana
   */
  async expectPageLoaded(): Promise<void> {
    await this.expectToBeVisible(AUTH.LOGIN_FORM);
    await this.expectToBeVisible(AUTH.EMAIL_INPUT);
    await this.expectToBeVisible(AUTH.PASSWORD_INPUT);
    await this.expectToBeVisible(AUTH.SUBMIT_BUTTON);
  }
}

export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  /**
   * Przechodzi do strony rejestracji
   */
  async goto(): Promise<void> {
    await super.goto('/register');
  }
  
  /**
   * Wypełnia formularz rejestracji i klika przycisk zarejestruj
   */
  async register(email: string, password: string, confirmPassword: string): Promise<void> {
    await this.getByTestId(AUTH.EMAIL_INPUT).fill(email);
    await this.getByTestId(AUTH.PASSWORD_INPUT).fill(password);
    await this.getByTestId(AUTH.CONFIRM_PASSWORD_INPUT).fill(confirmPassword);
    await this.getByTestId(AUTH.TERMS_CHECKBOX).check();
    await this.getByTestId(AUTH.SUBMIT_BUTTON).click();
  }
  
  /**
   * Sprawdza, czy strona rejestracji jest załadowana
   */
  async expectPageLoaded(): Promise<void> {
    await this.expectToBeVisible(AUTH.REGISTER_FORM);
    await this.expectToBeVisible(AUTH.EMAIL_INPUT);
    await this.expectToBeVisible(AUTH.PASSWORD_INPUT);
    await this.expectToBeVisible(AUTH.CONFIRM_PASSWORD_INPUT);
    await this.expectToBeVisible(AUTH.TERMS_CHECKBOX);
    await this.expectToBeVisible(AUTH.SUBMIT_BUTTON);
  }
}

export class ResetPasswordPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  /**
   * Przechodzi do strony resetowania hasła
   */
  async goto(): Promise<void> {
    await super.goto('/reset-password');
  }
  
  /**
   * Wypełnia formularz resetowania hasła i klika przycisk wyślij
   */
  async resetPassword(email: string): Promise<void> {
    await this.getByTestId(AUTH.EMAIL_INPUT).fill(email);
    await this.getByTestId(AUTH.SUBMIT_BUTTON).click();
  }
  
  /**
   * Sprawdza, czy strona resetowania hasła jest załadowana
   */
  async expectPageLoaded(): Promise<void> {
    await this.expectToBeVisible(AUTH.RESET_PASSWORD_FORM);
    await this.expectToBeVisible(AUTH.EMAIL_INPUT);
    await this.expectToBeVisible(AUTH.SUBMIT_BUTTON);
  }
  
  /**
   * Sprawdza, czy wiadomość o wysłaniu linku resetującego jest widoczna
   */
  async expectResetLinkSent(): Promise<void> {
    await this.expectToBeVisible(NOTIFICATIONS.SUCCESS);
    await this.expectToContainText(NOTIFICATIONS.SUCCESS, 'Link resetujący został wysłany');
  }
}

export class UserMenu extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  /**
   * Otwiera menu użytkownika
   */
  async open(): Promise<void> {
    await this.getByTestId(LAYOUT.USER_MENU).click();
  }
  
  /**
   * Wylogowuje użytkownika
   */
  async logout(): Promise<void> {
    await this.open();
    await this.getByTestId(USER_MENU.LOGOUT).click();
  }
  
  /**
   * Przechodzi do profilu użytkownika
   */
  async goToProfile(): Promise<void> {
    await this.open();
    await this.getByTestId(USER_MENU.PROFILE).click();
  }
}
```

## Obiekty stron zarządzania fiszkami

```typescript
// src/tests/pom/flashcards.ts
import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { FLASHCARDS, NOTIFICATIONS } from '../test-selectors';

export class FlashcardsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Przechodzi do strony zarządzania fiszkami
   */
  async goto(): Promise<void> {
    await super.goto('/flashcards');
  }

  /**
   * Przełącza na zakładkę "Moje fiszki"
   */
  async goToMyFlashcards(): Promise<void> {
    await this.getByTestId(FLASHCARDS.TABS.MY_FLASHCARDS).click();
  }

  /**
   * Przełącza na zakładkę "Generuj fiszki"
   */
  async goToGenerateFlashcards(): Promise<GenerateFlashcardsPage> {
    await this.getByTestId(FLASHCARDS.TABS.GENERATE).click();
    return new GenerateFlashcardsPage(this.page);
  }

  /**
   * Przełącza na zakładkę "Dodaj fiszkę"
   */
  async goToAddFlashcard(): Promise<FlashcardFormPage> {
    await this.getByTestId(FLASHCARDS.TABS.ADD).click();
    return new FlashcardFormPage(this.page);
  }
  
  /**
   * Liczy liczbę fiszek na liście
   */
  async countFlashcards(): Promise<number> {
    return await this.getByTestId(FLASHCARDS.LIST.ITEM).count();
  }

  /**
   * Wybiera fiszkę o podanym indeksie do edycji
   */
  async editFlashcard(index = 0): Promise<FlashcardFormPage> {
    await this.getByTestId(FLASHCARDS.LIST.ITEM)
      .nth(index)
      .getByTestId(FLASHCARDS.LIST.EDIT_BUTTON)
      .click();
    return new FlashcardFormPage(this.page);
  }

  /**
   * Usuwa fiszkę o podanym indeksie
   */
  async deleteFlashcard(index = 0): Promise<void> {
    await this.getByTestId(FLASHCARDS.LIST.ITEM)
      .nth(index)
      .getByTestId(FLASHCARDS.LIST.DELETE_BUTTON)
      .click();
    
    // Potwierdź usunięcie
    await this.getByTestId(FLASHCARDS.CONFIRMATION.CONFIRM_BUTTON).click();
  }
  
  /**
   * Sprawdza, czy komunikat o pomyślnej operacji jest widoczny
   */
  async expectSuccessNotification(): Promise<void> {
    await this.expectToBeVisible(NOTIFICATIONS.SUCCESS);
  }
  
  /**
   * Sprawdza, czy fiszka o określonej treści jest widoczna
   */
  async expectFlashcardWithText(text: string): Promise<void> {
    const flashcardText = this.page.getByText(text);
    await expect(flashcardText).toBeVisible();
  }
}

export class FlashcardFormPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  /**
   * Wypełnia formularz fiszki i zapisuje
   */
  async fillAndSave(front: string, back: string): Promise<void> {
    await this.getByTestId(FLASHCARDS.FORM.FRONT_INPUT).fill(front);
    await this.getByTestId(FLASHCARDS.FORM.BACK_INPUT).fill(back);
    await this.getByTestId(FLASHCARDS.FORM.SAVE_BUTTON).click();
  }
  
  /**
   * Sprawdza, czy formularz jest załadowany
   */
  async expectFormLoaded(): Promise<void> {
    await this.expectToBeVisible(FLASHCARDS.FORM.CONTAINER);
    await this.expectToBeVisible(FLASHCARDS.FORM.FRONT_INPUT);
    await this.expectToBeVisible(FLASHCARDS.FORM.BACK_INPUT);
    await this.expectToBeVisible(FLASHCARDS.FORM.SAVE_BUTTON);
  }
}
```

## Obiekty strony generowania fiszek przez AI

```typescript
// src/tests/pom/generation.ts
import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { GENERATION, NOTIFICATIONS } from '../test-selectors';

export class GenerateFlashcardsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  /**
   * Przechodzi do strony generowania fiszek
   */
  async goto(): Promise<void> {
    await super.goto('/generate');
  }
  
  /**
   * Wypełnia formularz generowania i klika przycisk generuj
   */
  async generateFlashcards(text: string, model = 'llama3.2:3b'): Promise<void> {
    await this.getByTestId(GENERATION.FORM.TEXT_INPUT).fill(text);
    await this.getByTestId(GENERATION.FORM.MODEL_SELECTOR).selectOption(model);
    await this.getByTestId(GENERATION.FORM.GENERATE_BUTTON).click();
  }
  
  /**
   * Czeka na wygenerowanie propozycji fiszek
   */
  async waitForProposals(timeout = 30000): Promise<void> {
    await this.expectToBeVisible(GENERATION.PROPOSALS.ITEM, { timeout });
  }
  
  /**
   * Zatwierdza propozycje fiszek do określonego indeksu
   */
  async approveProposals(count: number): Promise<void> {
    const proposals = this.getByTestId(GENERATION.PROPOSALS.ITEM);
    const totalCount = await proposals.count();
    const approveCount = Math.min(totalCount, count);
    
    for (let i = 0; i < approveCount; i++) {
      await proposals.nth(i)
        .getByTestId(GENERATION.PROPOSALS.APPROVE_BUTTON)
        .click();
    }
  }
  
  /**
   * Zapisuje zatwierdzone propozycje
   */
  async saveApprovedProposals(): Promise<void> {
    await this.getByTestId(GENERATION.PROPOSALS.SAVE_APPROVED_BUTTON).click();
  }
  
  /**
   * Sprawdza, czy komunikat o pomyślnym zapisaniu jest widoczny
   */
  async expectSuccessNotification(): Promise<void> {
    await this.expectToBeVisible(NOTIFICATIONS.SUCCESS);
  }
  
  /**
   * Pełny proces generowania i zatwierdzania fiszek
   */
  async completeGenerationProcess(text: string, approveCount = 3, model = 'llama3.2:3b'): Promise<number> {
    await this.generateFlashcards(text, model);
    await this.waitForProposals();
    await this.approveProposals(approveCount);
    await this.saveApprovedProposals();
    await this.expectSuccessNotification();
    return approveCount;
  }
}
```

## Obiekty sesji nauki

```typescript
// src/tests/pom/study.ts
import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { STUDY } from '../test-selectors';

export class StudySessionPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  /**
   * Przechodzi do strony sesji nauki
   */
  async goto(): Promise<void> {
    await super.goto('/study');
  }
  
  /**
   * Rozpoczyna sesję nauki
   */
  async startSession(): Promise<void> {
    await this.getByTestId(STUDY.START_BUTTON).click();
    await this.expectToBeVisible(STUDY.SESSION.CONTAINER);
  }
  
  /**
   * Sprawdza, czy sesja jest aktywna
   */
  async isSessionActive(): Promise<boolean> {
    return await this.getByTestId(STUDY.SESSION.CONTAINER).isVisible();
  }
  
  /**
   * Sprawdza, czy podsumowanie jest widoczne
   */
  async isSummaryVisible(): Promise<boolean> {
    return await this.getByTestId(STUDY.SUMMARY.CONTAINER).isVisible();
  }
  
  /**
   * Ujawnia odpowiedź na fiszkę
   */
  async revealAnswer(): Promise<void> {
    await this.getByTestId(STUDY.SESSION.REVEAL_BUTTON).click();
    await this.expectToBeVisible(STUDY.SESSION.BACK);
  }
  
  /**
   * Ocenia znajomość fiszki
   * @param difficulty "hard" | "medium" | "easy"
   */
  async rateDifficulty(difficulty: 'hard' | 'medium' | 'easy'): Promise<void> {
    const selectors = {
      'hard': STUDY.SESSION.DIFFICULTY.HARD,
      'medium': STUDY.SESSION.DIFFICULTY.MEDIUM,
      'easy': STUDY.SESSION.DIFFICULTY.EASY
    };
    
    await this.getByTestId(selectors[difficulty]).click();
  }
  
  /**
   * Kończy sesję nauki (z podsumowania)
   */
  async finishSession(): Promise<void> {
    await this.getByTestId(STUDY.SUMMARY.FINISH_BUTTON).click();
    await this.expectURL('/study');
  }
  
  /**
   * Przeprowadza pełną sesję nauki dla określonej liczby fiszek lub do końca
   * @param maxCards Maksymalna liczba fiszek do przejścia
   */
  async completeSession(maxCards = 5): Promise<void> {
    await this.startSession();
    
    for (let i = 0; i < maxCards; i++) {
      // Sprawdź, czy jesteśmy już na podsumowaniu
      const isSummary = await this.isSummaryVisible();
      if (isSummary) break;
      
      // Sprawdź, czy front fiszki jest widoczny
      await this.expectToBeVisible(STUDY.SESSION.FRONT);
      
      // Pokaż odpowiedź
      await this.revealAnswer();
      
      // Wybierz ocenę (rotacja między różnymi poziomami)
      const difficultyOptions = ['hard', 'medium', 'easy'] as const;
      await this.rateDifficulty(difficultyOptions[i % 3]);
    }
    
    // Sprawdź czy podsumowanie jest widoczne
    await this.expectToBeVisible(STUDY.SUMMARY.CONTAINER);
    await this.expectToBeVisible(STUDY.SUMMARY.STATS);
    
    // Zakończ sesję
    await this.finishSession();
  }
}

export class StatsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  /**
   * Przechodzi do strony statystyk
   */
  async goto(): Promise<void> {
    await super.goto('/stats');
  }
  
  /**
   * Sprawdza, czy statystyki poziomów są widoczne
   */
  async expectLevelStatsVisible(): Promise<void> {
    await this.expectToBeVisible(STUDY.SUMMARY.LEVEL_1_COUNT);
    await this.expectToBeVisible(STUDY.SUMMARY.LEVEL_2_COUNT);
    await this.expectToBeVisible(STUDY.SUMMARY.LEVEL_3_COUNT);
  }
  
  /**
   * Pobiera liczbę fiszek na poziomie 1
   */
  async getLevel1Count(): Promise<string> {
    return await this.getByTestId(STUDY.SUMMARY.LEVEL_1_COUNT).textContent() || '0';
  }
  
  /**
   * Pobiera liczbę fiszek na poziomie 2
   */
  async getLevel2Count(): Promise<string> {
    return await this.getByTestId(STUDY.SUMMARY.LEVEL_2_COUNT).textContent() || '0';
  }
  
  /**
   * Pobiera liczbę fiszek na poziomie 3
   */
  async getLevel3Count(): Promise<string> {
    return await this.getByTestId(STUDY.SUMMARY.LEVEL_3_COUNT).textContent() || '0';
  }
}
```

## Przykładowe testy E2E wykorzystujące POM

```typescript
// src/tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage, RegisterPage, ResetPasswordPage, UserMenu } from '../pom/auth';
import { LAYOUT } from '../test-selectors';

test.describe('Scenariusze autoryzacji', () => {
  test('E2E-REG-001: Rejestracja nowego użytkownika', async ({ page }) => {
    // Generowanie unikalnego adresu email
    const uniqueEmail = `user-${Date.now()}@example.com`;
    
    // Przejście do strony rejestracji
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.expectPageLoaded();
    
    // Wypełnienie formularza i rejestracja
    await registerPage.register(uniqueEmail, 'NoweHaslo123!', 'NoweHaslo123!');
    
    // Weryfikacja przekierowania do dashboardu
    await registerPage.expectURL('/dashboard');
    await registerPage.expectToBeVisible(LAYOUT.USER_MENU);
  });

  test('E2E-LOG-001: Logowanie istniejącego użytkownika', async ({ page }) => {
    // Przejście do strony logowania
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.expectPageLoaded();
    
    // Wypełnienie formularza i logowanie
    await loginPage.login('test-e2e@example.com', 'Test123!@#');
    
    // Weryfikacja przekierowania do dashboardu
    await loginPage.expectURL('/dashboard');
    await loginPage.expectToBeVisible(LAYOUT.USER_MENU);
  });

  test('E2E-PASS-001: Odzyskiwanie hasła', async ({ page }) => {
    // Przejście do strony logowania
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    
    // Kliknięcie linku "Zapomniałem hasła"
    const resetPage = await loginPage.forgotPassword();
    await resetPage.expectPageLoaded();
    
    // Wypełnienie formularza resetowania hasła
    await resetPage.resetPassword('test-e2e@example.com');
    
    // Weryfikacja komunikatu o wysłaniu linku
    await resetPage.expectResetLinkSent();
  });
  
  test('E2E-LOGOUT-001: Wylogowanie użytkownika', async ({ page }) => {
    // Przejście do strony logowania i zalogowanie
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('test-e2e@example.com', 'Test123!@#');
    
    // Weryfikacja przekierowania do dashboardu
    await loginPage.expectURL('/dashboard');
    
    // Wylogowanie
    const userMenu = new UserMenu(page);
    await userMenu.logout();
    
    // Weryfikacja przekierowania na stronę główną
    await loginPage.expectURL('/');
    
    // Próba dostępu do chronionej strony
    await page.goto('/dashboard');
    await loginPage.expectURL('/login');
  });
});
```

```typescript
// src/tests/e2e/flashcards.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pom/auth';
import { FlashcardsPage, FlashcardFormPage } from '../pom/flashcards';
import { GenerateFlashcardsPage } from '../pom/generation';

// Funkcja pomocnicza do logowania
async function loginUser(page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('test-e2e@example.com', 'Test123!@#');
  await loginPage.expectURL('/dashboard');
}

test.describe('Scenariusze zarządzania fiszkami', () => {
  // Przed każdym testem zaloguj użytkownika
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('E2E-GEN-001: Generowanie fiszek przez AI', async ({ page }) => {
    // Przejście do strony generowania fiszek
    const generatePage = new GenerateFlashcardsPage(page);
    await generatePage.goto();
    
    // Przygotowanie tekstu źródłowego
    const sourceText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(50);
    
    // Przeprowadzenie pełnego procesu generowania fiszek
    const approvedCount = await generatePage.completeGenerationProcess(sourceText, 3);
    
    // Sprawdzenie, czy fiszki zostały dodane do listy
    const flashcardsPage = new FlashcardsPage(page);
    await flashcardsPage.goto();
    await flashcardsPage.goToMyFlashcards();
    const count = await flashcardsPage.countFlashcards();
    expect(count).toBeGreaterThanOrEqual(approvedCount);
  });

  test('E2E-CREATE-001: Ręczne tworzenie fiszki', async ({ page }) => {
    // Przejście do strony fiszek
    const flashcardsPage = new FlashcardsPage(page);
    await flashcardsPage.goto();
    
    // Przejście do formularza dodawania fiszki
    const formPage = await flashcardsPage.goToAddFlashcard();
    
    // Wypełnienie i zapisanie fiszki
    await formPage.fillAndSave('Pytanie testowe E2E', 'Odpowiedź testowa E2E');
    
    // Sprawdzenie powiadomienia o sukcesie
    await flashcardsPage.expectSuccessNotification();
    
    // Sprawdzenie, czy fiszka została dodana
    await flashcardsPage.goToMyFlashcards();
    await flashcardsPage.expectFlashcardWithText('Pytanie testowe E2E');
  });

  test('E2E-EDIT-001: Edycja istniejącej fiszki', async ({ page }) => {
    // Przejście do strony fiszek
    const flashcardsPage = new FlashcardsPage(page);
    await flashcardsPage.goto();
    await flashcardsPage.goToMyFlashcards();
    
    // Edycja pierwszej fiszki
    const formPage = await flashcardsPage.editFlashcard(0);
    await formPage.fillAndSave('Zaktualizowane pytanie E2E', 'Zaktualizowana odpowiedź E2E');
    
    // Sprawdzenie powiadomienia o sukcesie
    await flashcardsPage.expectSuccessNotification();
    
    // Sprawdzenie, czy fiszka została zaktualizowana
    await flashcardsPage.expectFlashcardWithText('Zaktualizowane pytanie E2E');
  });

  test('E2E-DELETE-001: Usuwanie fiszki', async ({ page }) => {
    // Przejście do strony fiszek
    const flashcardsPage = new FlashcardsPage(page);
    await flashcardsPage.goto();
    await flashcardsPage.goToMyFlashcards();
    
    // Zapisanie liczby fiszek przed usunięciem
    const countBefore = await flashcardsPage.countFlashcards();
    
    // Usunięcie pierwszej fiszki
    await flashcardsPage.deleteFlashcard(0);
    
    // Sprawdzenie powiadomienia o sukcesie
    await flashcardsPage.expectSuccessNotification();
    
    // Sprawdzenie, czy liczba fiszek zmniejszyła się o 1
    const countAfter = await flashcardsPage.countFlashcards();
    expect(countAfter).toBe(countBefore - 1);
  });
});
```

```typescript
// src/tests/e2e/study.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pom/auth';
import { StudySessionPage, StatsPage } from '../pom/study';

// Funkcja pomocnicza do logowania
async function loginUser(page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('test-e2e@example.com', 'Test123!@#');
  await loginPage.expectURL('/dashboard');
}

test.describe('Scenariusze sesji nauki', () => {
  // Przed każdym testem zaloguj użytkownika
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('E2E-STUDY-001: Przeprowadzenie sesji nauki', async ({ page }) => {
    // Przejście do strony sesji nauki
    const studyPage = new StudySessionPage(page);
    await studyPage.goto();
    
    // Przeprowadzenie sesji nauki
    await studyPage.completeSession(5);
  });

  test('E2E-LEITNER-001: Weryfikacja działania algorytmu Leitnera', async ({ page }) => {
    // Przejście do strony statystyk
    const statsPage = new StatsPage(page);
    await statsPage.goto();
    
    // Sprawdzenie, czy statystyki poziomów są widoczne
    await statsPage.expectLevelStatsVisible();
    
    // W rzeczywistej implementacji, moglibyśmy również:
    // 1. Pobierać liczby fiszek na poszczególnych poziomach
    // 2. Symulować upływ czasu
    // 3. Weryfikować, które fiszki pojawiają się w kolejnej sesji
    // 
    // Na potrzeby tego przykładu, ograniczamy się do sprawdzenia
    // widoczności statystyk
  });
});
```

## Korzyści z zastosowania wzorca POM

1. **Łatwiejsze utrzymanie** - Zmiany w interfejsie wymagają modyfikacji tylko w jednym miejscu (klasy POM), a nie we wszystkich testach.
2. **Lepsza czytelność** - Operacje na stronach są opisane w sposób bardziej deklaratywny i zrozumiały.
3. **Ponowne użycie kodu** - Te same metody mogą być używane w wielu testach.
4. **Łatwiejsze debugowanie** - Problemy są łatwiejsze do zlokalizowania i naprawy.
5. **Szybsze wdrażanie zmian** - Dodanie nowego scenariusza testowego jest prostsze dzięki gotowym komponentom.

## Dobre praktyki

1. **Enkapsulacja selektorów** - Klasy POM powinny ukrywać szczegóły implementacyjne selektorów.
2. **Jasne nazewnictwo metod** - Nazwy metod powinny odzwierciedlać operacje biznesowe, a nie techniczne.
3. **Ograniczona odpowiedzialność** - Każda klasa POM powinna obsługiwać tylko jeden obszar funkcjonalny.
4. **Hierarchia klas** - Użycie klasy bazowej dla wspólnej funkcjonalności.
5. **Asercje w klasach POM** - Zamiast asercji w testach, lepiej umieścić je w metodach klas POM (np. `expectPageLoaded()`).

Implementując wzorzec POM w testach E2E z Playwright, uzyskujemy znacznie lepiej zorganizowany, łatwiejszy w utrzymaniu i bardziej skalowalny kod testowy. 
