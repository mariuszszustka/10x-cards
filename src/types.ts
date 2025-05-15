import type { Database } from "@/db/database.types";

type DBTables = Database["public"]["Tables"];

/**
 * Utility type dla odpowiedzi z paginacją
 * @template T Typ elementów w kolekcji
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Utility types dla walidacji długości tekstu
type ValidatedFrontText = string & { __brand: "ValidatedFrontText" };
type ValidatedBackText = string & { __brand: "ValidatedBackText" };

/**
 * DTO dla rejestracji użytkownika
 * @see api-plan.md - /api/auth/register
 */
export type RegisterUserDTO = {
  email: string;
  password: string;
};

/**
 * DTO dla odpowiedzi po rejestracji użytkownika
 * @see api-plan.md - /api/auth/register response
 */
export type RegisterUserResponseDTO = Pick<DBTables["users"]["Row"], "id" | "email" | "created_at">;

/**
 * DTO dla logowania użytkownika
 * @see api-plan.md - /api/auth/login
 */
export type LoginDTO = RegisterUserDTO;

/**
 * DTO dla odpowiedzi po zalogowaniu
 * @see api-plan.md - /api/auth/login response
 */
export interface LoginResponseDTO {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

/**
 * DTO reprezentujące fiszkę
 * @see api-plan.md - /api/flashcards response
 */
export type FlashcardDTO = Omit<DBTables["flashcards"]["Row"], "user_id">;

/**
 * DTO dla tworzenia nowej fiszki
 * Przód: max 200 znaków
 * Tył: max 500 znaków
 * @see api-plan.md - /api/flashcards POST
 */
export type CreateFlashcardDTO = {
  front: ValidatedFrontText;
  back: ValidatedBackText;
};

/**
 * DTO dla aktualizacji fiszki
 * @see api-plan.md - /api/flashcards/{id} PUT
 */
export type UpdateFlashcardDTO = CreateFlashcardDTO;

/**
 * DTO dla listy fiszek z paginacją
 * @see api-plan.md - /api/flashcards GET
 */
export type FlashcardListResponseDTO = PaginatedResponse<FlashcardDTO>;

/**
 * DTO dla rozpoczęcia generowania fiszek
 * @see api-plan.md - /api/generations POST
 */
export interface CreateGenerationDTO {
  /** Tekst źródłowy (1000-10000 znaków) */
  source_text: string;
  /** Identyfikator modelu AI */
  model: string;
}

/**
 * DTO dla statusu generowania fiszek
 * @see api-plan.md - /api/generations/{id} GET
 */
export interface GenerationStatusDTO extends Omit<DBTables["generations"]["Row"], "user_id"> {
  status: "processing" | "completed" | "error";
  flashcards: Array<{
    id: number;
    front: ValidatedFrontText;
    back: ValidatedBackText;
    source: "ai-full";
  }>;
}

/**
 * DTO dla akceptacji wygenerowanych fiszek
 * @see api-plan.md - /api/generations/{id}/accept PUT
 */
export interface AcceptGeneratedFlashcardsDTO {
  flashcards: Array<{
    id: number;
    front: ValidatedFrontText;
    back: ValidatedBackText;
    edited: boolean;
  }>;
}

/**
 * DTO dla odpowiedzi po akceptacji fiszek
 * @see api-plan.md - /api/generations/{id}/accept response
 */
export interface AcceptGeneratedFlashcardsResponseDTO {
  accepted_count: number;
  flashcards: Array<{
    id: number;
    front: string;
    back: string;
    source: "ai-full" | "ai-edited" | "manual";
  }>;
}

/**
 * Parametry filtrowania dla listy fiszek
 * @see api-plan.md - /api/flashcards query parameters
 */
export interface FlashcardFilters {
  page?: number;
  per_page?: number;
  source?: "ai-full" | "ai-edited" | "manual";
  search?: string;
  generation_id?: number;
}

/**
 * Poziomy systemu Leitnera
 */
export enum LeitnerBox {
  /** Poziom 1: Fiszki nowe lub często niepoprawnie odpowiadane (powtarzane codziennie) */
  BOX_1 = 1,
  /** Poziom 2: Fiszki z podstawową znajomością (powtarzane co 2 dni) */
  BOX_2 = 2,
  /** Poziom 3: Fiszki dobrze znane (powtarzane co 5 dni) */
  BOX_3 = 3,
  /** Poziom 4: Fiszki bardzo dobrze znane (powtarzane co 8 dni) */
  BOX_4 = 4,
  /** Poziom 5: Fiszki opanowane (powtarzane co 14 dni) */
  BOX_5 = 5,
}

/**
 * DTO reprezentujące postęp nauki fiszki w systemie Leitnera
 */
export type FlashcardLearningProgressDTO = Omit<DBTables["flashcard_learning_progress"]["Row"], "user_id">;

/**
 * DTO dla listy fiszek do nauki z paginacją
 */
export type FlashcardsToReviewDTO = PaginatedResponse<
  FlashcardDTO & {
    learning_progress: Pick<FlashcardLearningProgressDTO, "leitner_box" | "consecutive_correct_answers">;
  }
>;

/**
 * DTO dla zapisania wyniku przeglądu fiszki
 */
export interface ReviewResultDTO {
  flashcard_id: number;
  is_correct: boolean;
  review_time_ms?: number;
}

/**
 * DTO dla utworzenia nowej sesji nauki
 */
export interface CreateReviewSessionDTO {
  session_id?: number; // opcjonalne, jeśli kontynuujemy istniejącą sesję
}

/**
 * DTO dla aktualizacji sesji nauki
 */
export interface UpdateReviewSessionDTO {
  session_id: number;
  completed?: boolean;
  results: ReviewResultDTO[];
}

/**
 * DTO reprezentujące sesję nauki
 */
export type ReviewSessionDTO = Omit<DBTables["review_sessions"]["Row"], "user_id">;

/**
 * DTO dla historii przeglądów fiszek
 */
export type ReviewHistoryDTO = Omit<DBTables["review_history"]["Row"], "user_id">;

/**
 * DTO dla statystyk nauki użytkownika
 */
export interface LearningStatsDTO {
  total_cards: number;
  cards_by_box: Record<LeitnerBox, number>;
  cards_to_review_today: number;
  review_success_rate: number;
  avg_cards_per_session: number;
  total_review_sessions: number;
  total_reviews: number;
}

// Funkcje pomocnicze do walidacji tekstu
export const validateFrontText = (text: string): ValidatedFrontText => {
  if (text.length > 200) throw new Error("Front text cannot be longer than 200 characters");
  return text as ValidatedFrontText;
};

export const validateBackText = (text: string): ValidatedBackText => {
  if (text.length > 500) throw new Error("Back text cannot be longer than 500 characters");
  return text as ValidatedBackText;
};

/**
 * Typ dla standardowej odpowiedzi błędu
 */
export interface ErrorResponse {
  error: {
    code: "validation_error" | "not_found" | "unauthorized" | "forbidden" | "conflict" | "server_error";
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}

/**
 * Pomocnicza funkcja do tworzenia standardowych odpowiedzi błędów
 */
export const createErrorResponse = (
  code: ErrorResponse["error"]["code"],
  message: string,
  details?: ErrorResponse["error"]["details"]
): ErrorResponse => ({
  error: {
    code,
    message,
    ...(details && { details }),
  },
});
