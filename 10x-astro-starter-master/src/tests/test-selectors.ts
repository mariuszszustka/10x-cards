/**
 * Test selectors for E2E testing
 * This file contains all data-testid values used in the application
 * to ensure consistent test selectors across the application.
 */

/**
 * Layout and navigation selectors
 */
export const LAYOUT = {
  HEADER: 'header',
  NAVIGATION: 'main-navigation',
  USER_MENU: 'user-menu',
  FOOTER: 'footer',
};

export const NAVIGATION = {
  HOME: 'nav-home',
  MY_FLASHCARDS: 'nav-my-flashcards',
  GENERATE: 'nav-generate-flashcards',
  STUDY_SESSION: 'nav-study-session',
  STATISTICS: 'nav-statistics',
};

export const USER_MENU = {
  DROPDOWN: 'user-menu-dropdown',
  PROFILE: 'user-menu-profile',
  LOGOUT: 'user-menu-logout',
};

export const AUTH_BUTTONS = {
  LOGIN: 'auth-login-button',
  REGISTER: 'auth-register-button',
};

/**
 * Authentication selectors
 */
export const AUTH = {
  LOGIN_FORM: 'login-form',
  REGISTER_FORM: 'register-form',
  RESET_PASSWORD_FORM: 'reset-password-form',
  EMAIL_INPUT: 'auth-email-input',
  PASSWORD_INPUT: 'auth-password-input',
  CONFIRM_PASSWORD_INPUT: 'auth-confirm-password-input',
  REMEMBER_ME: 'auth-remember-me',
  SUBMIT_BUTTON: 'auth-submit-button',
  FORGOT_PASSWORD_LINK: 'auth-forgot-password-link',
  TERMS_CHECKBOX: 'auth-terms-checkbox',
  WELCOME_MESSAGE: 'welcome-message',
};

/**
 * Flashcard management selectors
 */
export const FLASHCARDS = {
  TABS: {
    CONTAINER: 'flashcards-tabs',
    MY_FLASHCARDS: 'tab-my-flashcards',
    GENERATE: 'tab-generate-flashcards',
    ADD: 'tab-add-flashcard',
  },
  LIST: {
    CONTAINER: 'flashcards-list',
    ITEM: 'flashcard-item',
    FRONT: 'flashcard-front',
    BACK: 'flashcard-back',
    EDIT_BUTTON: 'flashcard-edit-button',
    DELETE_BUTTON: 'flashcard-delete-button',
  },
  FORM: {
    CONTAINER: 'flashcard-form',
    FRONT_INPUT: 'flashcard-front-input',
    BACK_INPUT: 'flashcard-back-input',
    SAVE_BUTTON: 'flashcard-save-button',
  },
  CONFIRMATION: {
    DIALOG: 'confirmation-dialog',
    CONFIRM_BUTTON: 'confirm-button',
    CANCEL_BUTTON: 'cancel-button',
  },
  SEARCH: {
    BAR: 'flashcards-search-bar',
    BUTTON: 'flashcards-search-button',
  },
  PAGINATION: {
    CONTAINER: 'flashcards-pagination',
    PREV: 'pagination-prev',
    NEXT: 'pagination-next',
    PAGE: 'pagination-page',
  },
};

/**
 * AI Generation selectors
 */
export const GENERATION = {
  FORM: {
    CONTAINER: 'generation-form',
    TEXT_INPUT: 'generation-text-input',
    MODEL_SELECTOR: 'generation-model-selector',
    GENERATE_BUTTON: 'generation-generate-button',
  },
  PROPOSALS: {
    CONTAINER: 'flashcard-proposals',
    ITEM: 'flashcard-proposal',
    PREVIEW: 'proposal-preview',
    APPROVE_BUTTON: 'proposal-approve-button',
    EDIT_BUTTON: 'proposal-edit-button',
    REJECT_BUTTON: 'proposal-reject-button',
    SAVE_APPROVED_BUTTON: 'save-approved-button',
  },
};

/**
 * Study session selectors
 */
export const STUDY = {
  START_BUTTON: 'start-study-session',
  SESSION: {
    CONTAINER: 'study-session',
    FLASHCARD: 'study-flashcard',
    FRONT: 'study-flashcard-front',
    BACK: 'study-flashcard-back',
    REVEAL_BUTTON: 'reveal-answer-button',
    DIFFICULTY: {
      CONTAINER: 'difficulty-buttons',
      HARD: 'difficulty-hard',
      MEDIUM: 'difficulty-medium',
      EASY: 'difficulty-easy',
    },
  },
  PROGRESS: {
    BAR: 'study-progress-bar',
    COUNTER: 'flashcard-counter',
    TIME: 'study-time-elapsed',
  },
  SUMMARY: {
    CONTAINER: 'study-summary',
    STATS: 'session-stats',
    LEVEL_1_COUNT: 'leitner-level-1-count',
    LEVEL_2_COUNT: 'leitner-level-2-count',
    LEVEL_3_COUNT: 'leitner-level-3-count',
    FINISH_BUTTON: 'finish-session-button',
  },
};

/**
 * Notification selectors
 */
export const NOTIFICATIONS = {
  SUCCESS: 'notification-success',
  ERROR: 'notification-error',
  WARNING: 'notification-warning',
  INFO: 'notification-info',
};

/**
 * Dashboard selectors
 */
export const DASHBOARD = {
  CONTAINER: 'dashboard',
  WELCOME: 'dashboard-welcome',
  STATS_WIDGET: 'dashboard-stats-widget',
  RECENT_FLASHCARDS: 'dashboard-recent-flashcards',
  QUICK_ACTIONS: 'dashboard-quick-actions',
}; 