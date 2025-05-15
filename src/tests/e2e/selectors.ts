/**
 * Selektory elementów dla testów E2E
 *
 * Ten plik zawiera selektory do elementów interfejsu użytkownika
 * używane w testach E2E. Rozbudowana struktura selektorów zapewnia
 * łatwą identyfikację elementów podczas testów.
 */

export const SELECTORS = {
  AUTH: {
    EMAIL_INPUT: '[data-testid="auth-email-input"]',
    PASSWORD_INPUT: '[data-testid="auth-password-input"]',
    SUBMIT_BUTTON: '[data-testid="auth-submit-button"]',
    LOGOUT_BUTTON: '[data-testid="auth-logout-button"]',
    LOGIN_FORM: 'form[action="/auth/login"]',
    REGISTER_FORM: 'form[action="/auth/register"]',
  },
  FLASHCARDS: {
    TABS: {
      MY_FLASHCARDS: '[role="tab"][name="moje fiszki"], [data-testid="flashcards-tab-my-flashcards"]',
      ADD: '[role="tab"][name="dodaj"], [data-testid="flashcards-tab-add"]',
      GENERATE: '[role="tab"][name="generuj"], [data-testid="flashcards-tab-generate"]',
    },
    FORM: {
      FRONT_INPUT: 'textarea[name="front"], [data-testid="flashcard-front-input"]',
      BACK_INPUT: 'textarea[name="back"], [data-testid="flashcard-back-input"]',
      SAVE_BUTTON: 'button[type="submit"], [data-testid="flashcard-save-button"]',
    },
    LIST: {
      CONTAINER: '.flashcards-container, [data-testid="flashcards-container"]',
      ITEM: '.flashcard-item, [data-testid="flashcard-item"]',
      EMPTY_STATE: '.empty-state, [data-testid="flashcards-empty-state"]',
    },
  },
  STUDY: {
    START_BUTTON: '[data-testid="study-start-button"]',
    FLASHCARD: {
      CONTAINER: '.flashcard-container, [data-testid="study-flashcard-container"]',
      FRONT: '.flashcard-front, [data-testid="study-flashcard-front"]',
      BACK: '.flashcard-back, [data-testid="study-flashcard-back"]',
    },
    BUTTONS: {
      CORRECT: '[data-testid="study-correct-button"]',
      INCORRECT: '[data-testid="study-incorrect-button"]',
      FLIP: '[data-testid="study-flip-button"]',
    },
  },
  DASHBOARD: {
    STATS: {
      CARDS_COUNT: '[data-testid="dashboard-cards-count"]',
      BOXES_COUNT: '[data-testid="dashboard-boxes-stats"]',
    },
    NAVIGATION: {
      FLASHCARDS: '[href="/flashcards"], a:has-text("fiszki")',
      STUDY: '[href="/study"], a:has-text("nauka")',
      PROFILE: '[href="/profile"], a:has-text("profil")',
    },
  },
};

// Alternatywne selektory używane jako fallback, gdy główne selektory nie są dostępne
export const ALT_SELECTORS = {
  AUTH: {
    EMAIL_INPUT: ['input[type="email"]', "#email", 'input[name="email"]'],
    PASSWORD_INPUT: ['input[type="password"]', "#password", 'input[name="password"]'],
    SUBMIT_BUTTON: ['button[type="submit"]', 'input[type="submit"]', 'button:has-text("Zaloguj")'],
  },
  FLASHCARDS: {
    TABS: {
      MY_FLASHCARDS: ['[role="tab"]:has-text("Moje")', '.tab:has-text("Moje")'],
      ADD: ['[role="tab"]:has-text("Dodaj")', '.tab:has-text("Dodaj")'],
      GENERATE: ['[role="tab"]:has-text("Generuj")', '.tab:has-text("Generuj")'],
    },
  },
};
