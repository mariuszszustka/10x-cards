/**
 * Selektory elementów dla testów E2E
 */

export const AUTH = {
  EMAIL_INPUT: '[data-testid="auth-email-input"]',
  PASSWORD_INPUT: '[data-testid="auth-password-input"]',
  CONFIRM_PASSWORD_INPUT: '[data-testid="auth-confirm-password-input"]',
  SUBMIT_BUTTON: '[data-testid="auth-submit-button"]',
  TERMS_CHECKBOX: '[data-testid="auth-terms-checkbox"]',
  RESET_PASSWORD_LINK: '[data-testid="auth-reset-password-link"]',
  REGISTER_LINK: '[data-testid="auth-register-link"]',
  LOGIN_LINK: '[data-testid="auth-login-link"]',
  LOGOUT_BUTTON: '[data-testid="auth-logout-button"]',
  LOGIN_FORM: '[data-testid="auth-login-form"]',
  REMEMBER_ME: '[data-testid="auth-remember-me"]',
  FORGOT_PASSWORD_LINK: '[data-testid="auth-forgot-password-link"]'
};

export const FLASHCARDS = {
  TABS: {
    MY_FLASHCARDS: '[data-testid="flashcards-tab-my-flashcards"]',
    ADD: '[data-testid="flashcards-tab-add"]',
    GENERATE: '[data-testid="flashcards-tab-generate"]'
  },
  FORM: {
    FRONT_INPUT: '[data-testid="flashcard-front-input"]',
    BACK_INPUT: '[data-testid="flashcard-back-input"]',
    SAVE_BUTTON: '[data-testid="flashcard-save-button"]'
  },
  CARD: {
    ITEM: '[data-testid="flashcard-item"]',
    FRONT: '[data-testid="flashcard-front"]',
    BACK: '[data-testid="flashcard-back"]',
    EDIT_BUTTON: '[data-testid="flashcard-edit-button"]',
    DELETE_BUTTON: '[data-testid="flashcard-delete-button"]'
  },
  LIST: {
    ITEM: '[data-testid="flashcard-list-item"]',
    FRONT: '[data-testid="flashcard-list-front"]',
    BACK: '[data-testid="flashcard-list-back"]',
    EDIT_BUTTON: '[data-testid="flashcard-list-edit-button"]',
    DELETE_BUTTON: '[data-testid="flashcard-list-delete-button"]'
  },
  PAGINATION: {
    NEXT_BUTTON: '[data-testid="pagination-next"]',
    PREV_BUTTON: '[data-testid="pagination-prev"]'
  }
};

export const GENERATION = {
  INPUT: '[data-testid="generation-input"]',
  GENERATE_BUTTON: '[data-testid="generation-button"]',
  RESULT_LIST: '[data-testid="generation-result-list"]',
  SAVE_ALL_BUTTON: '[data-testid="generation-save-all-button"]',
  FORM: {
    CONTAINER: '[data-testid="generation-form-container"]',
    TEXT_INPUT: '[data-testid="generation-form-text-input"]',
    MODEL_SELECTOR: '[data-testid="generation-form-model-selector"]',
    GENERATE_BUTTON: '[data-testid="generation-form-generate-button"]'
  },
  PROPOSALS: {
    ITEM: '[data-testid="generation-proposals-item"]',
    PREVIEW: '[data-testid="generation-proposals-preview"]',
    APPROVE_BUTTON: '[data-testid="generation-proposals-approve-button"]',
    EDIT_BUTTON: '[data-testid="generation-proposals-edit-button"]',
    REJECT_BUTTON: '[data-testid="generation-proposals-reject-button"]'
  }
};

export const STUDY = {
  START_BUTTON: '[data-testid="study-start-button"]',
  CARD_FRONT: '[data-testid="study-card-front"]',
  CARD_BACK: '[data-testid="study-card-back"]',
  FLIP_BUTTON: '[data-testid="study-flip-button"]',
  CORRECT_BUTTON: '[data-testid="study-correct-button"]',
  INCORRECT_BUTTON: '[data-testid="study-incorrect-button"]',
  END_SESSION_BUTTON: '[data-testid="study-end-session-button"]',
  SESSION: {
    CONTAINER: '[data-testid="study-session-container"]',
    FLASHCARD: '[data-testid="study-session-flashcard"]',
    FRONT: '[data-testid="study-session-front"]',
    BACK: '[data-testid="study-session-back"]',
    REVEAL_BUTTON: '[data-testid="study-session-reveal-button"]',
    DIFFICULTY: {
      CONTAINER: '[data-testid="study-session-difficulty-container"]',
      HARD: '[data-testid="study-session-difficulty-hard"]',
      MEDIUM: '[data-testid="study-session-difficulty-medium"]',
      EASY: '[data-testid="study-session-difficulty-easy"]'
    }
  },
  PROGRESS: {
    COUNTER: '[data-testid="study-progress-counter"]',
    BAR: '[data-testid="study-progress-bar"]'
  },
  SUMMARY: {
    CONTAINER: '[data-testid="study-summary-container"]',
    STATS: '[data-testid="study-summary-stats"]',
    LEVEL_1_COUNT: '[data-testid="study-summary-level-1-count"]',
    LEVEL_2_COUNT: '[data-testid="study-summary-level-2-count"]',
    LEVEL_3_COUNT: '[data-testid="study-summary-level-3-count"]',
    FINISH_BUTTON: '[data-testid="study-summary-finish-button"]'
  }
};

export const NOTIFICATIONS = {
  SUCCESS: '[data-testid="notification-success"]',
  ERROR: '[data-testid="notification-error"]',
  INFO: '[data-testid="notification-info"]'
};

export const DASHBOARD = {
  CARDS_COUNTER: '[data-testid="dashboard-cards-count"]',
  SESSIONS_COUNTER: '[data-testid="dashboard-sessions-count"]',
  LEVEL_STATS: {
    LEVEL_1: '[data-testid="leitner-level-1-count"]',
    LEVEL_2: '[data-testid="leitner-level-2-count"]',
    LEVEL_3: '[data-testid="leitner-level-3-count"]'
  }
};