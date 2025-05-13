// src/tests/e2e/selectors.ts
// Selektory używane w testach E2E

export const SELECTORS = {
  AUTH: {
    EMAIL_INPUT: '[data-testid="auth-email-input"]',
    PASSWORD_INPUT: '[data-testid="auth-password-input"]',
    LOGIN_BUTTON: '[data-testid="auth-submit-button"]',
    REGISTER_BUTTON: '[data-testid="auth-register-button"]',
    SUBMIT_BUTTON: '[data-testid="auth-submit-button"]',
    LOGIN_FORM: '[data-testid="auth-login-form"]',
    MAGIC_LINK_BUTTON: '[data-testid="auth-magic-link-button"]'
  },
  LAYOUT: {
    USER_MENU: '[data-testid="user-menu"]',
    LOGOUT_BUTTON: '[data-testid="logout-button"]',
    NAVBAR: 'nav',
    DASHBOARD_LINK: '[data-testid="dashboard-link"]',
    FLASHCARDS_LINK: '[data-testid="flashcards-link"]'
  },
  FLASHCARDS: {
    TABS: {
      MY_FLASHCARDS: '[role="tab"][name="moje fiszki"]',
      GENERATE: '[role="tab"][name="generuj"]',
      ADD: '[role="tab"][name="dodaj"]'
    },
    LIST: {
      ITEM: '.flashcard-item',
      EDIT_BUTTON: '[data-testid="edit-button"]',
      DELETE_BUTTON: '[data-testid="delete-button"]'
    },
    FORM: {
      FRONT_INPUT: 'textarea[name="front"]',
      BACK_INPUT: 'textarea[name="back"]',
      SAVE_BUTTON: 'button[type="submit"]'
    },
    CONFIRMATION: {
      CONFIRM_BUTTON: '[data-testid="confirm-button"]',
      CANCEL_BUTTON: '[data-testid="cancel-button"]'
    }
  },
  STUDY: {
    START_BUTTON: '[data-testid="start-study-button"]',
    SESSION: {
      CONTAINER: '[data-testid="study-session"]',
      FRONT: '[data-testid="card-front"]',
      BACK: '[data-testid="card-back"]',
      REVEAL_BUTTON: '[data-testid="reveal-button"]',
      DIFFICULTY: {
        EASY: '[data-testid="difficulty-easy"]',
        MEDIUM: '[data-testid="difficulty-medium"]',
        HARD: '[data-testid="difficulty-hard"]'
      }
    },
    SUMMARY: {
      CONTAINER: '[data-testid="summary-container"]',
      STATS: '[data-testid="summary-stats"]',
      FINISH_BUTTON: '[data-testid="finish-button"]',
      LEVEL_1_COUNT: '[data-testid="level-1-count"]',
      LEVEL_2_COUNT: '[data-testid="level-2-count"]',
      LEVEL_3_COUNT: '[data-testid="level-3-count"]'
    }
  },
  GENERATION: {
    FORM: {
      TEXT_INPUT: '[data-testid="generation-text-input"]',
      MODEL_SELECTOR: '[data-testid="model-selector"]',
      GENERATE_BUTTON: '[data-testid="generate-button"]'
    },
    PROPOSALS: {
      ITEM: '[data-testid="proposal-item"]',
      APPROVE_BUTTON: '[data-testid="approve-button"]',
      SAVE_APPROVED_BUTTON: '[data-testid="save-approved-button"]'
    }
  },
  NOTIFICATIONS: {
    SUCCESS: '[data-testid="notification-success"]',
    ERROR: '[data-testid="notification-error"]'
  }
};

// Alternatywne selektory, które mogą być używane jako fallback
export const ALT_SELECTORS = {
  AUTH: {
    EMAIL_INPUT: ['[name="email"]', 'input[type="email"]', '#email'],
    PASSWORD_INPUT: ['[name="password"]', 'input[type="password"]', '#password'],
    SUBMIT_BUTTON: ['button[type="submit"]', 'input[type="submit"]', 'button:has-text("Zaloguj")'],
  },
  FLASHCARDS: {
    TABS: {
      MY_FLASHCARDS: [
        '[role="tab"]:has-text("Moje fiszki")',
        'button:has-text("Moje fiszki")'
      ],
      ADD: [
        '[role="tab"]:has-text("Dodaj")',
        'button:has-text("Dodaj")'
      ]
    }
  }
}; 