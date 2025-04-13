import { Database } from '@/db/database.types'

type DBTables = Database['public']['Tables']

/**
 * Utility type dla odpowiedzi z paginacją
 * @template T Typ elementów w kolekcji
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

// Utility types dla walidacji długości tekstu
type ValidatedFrontText = string & { __brand: 'ValidatedFrontText' }
type ValidatedBackText = string & { __brand: 'ValidatedBackText' }

/**
 * DTO dla rejestracji użytkownika
 * @see api-plan.md - /api/auth/register
 */
export type RegisterUserDTO = {
  email: string
  password: string
}

/**
 * DTO dla odpowiedzi po rejestracji użytkownika
 * @see api-plan.md - /api/auth/register response
 */
export type RegisterUserResponseDTO = Pick<DBTables['users']['Row'], 'id' | 'email' | 'created_at'>

/**
 * DTO dla logowania użytkownika
 * @see api-plan.md - /api/auth/login
 */
export type LoginDTO = RegisterUserDTO

/**
 * DTO dla odpowiedzi po zalogowaniu
 * @see api-plan.md - /api/auth/login response
 */
export interface LoginResponseDTO {
  token: string
  user: {
    id: string
    email: string
  }
}

/**
 * DTO reprezentujące fiszkę
 * @see api-plan.md - /api/flashcards response
 */
export type FlashcardDTO = Omit<DBTables['flashcards']['Row'], 'user_id'>

/**
 * DTO dla tworzenia nowej fiszki
 * Przód: max 200 znaków
 * Tył: max 500 znaków
 * @see api-plan.md - /api/flashcards POST
 */
export type CreateFlashcardDTO = {
  front: ValidatedFrontText
  back: ValidatedBackText
}

/**
 * DTO dla aktualizacji fiszki
 * @see api-plan.md - /api/flashcards/{id} PUT
 */
export type UpdateFlashcardDTO = CreateFlashcardDTO

/**
 * DTO dla listy fiszek z paginacją
 * @see api-plan.md - /api/flashcards GET
 */
export type FlashcardListResponseDTO = PaginatedResponse<FlashcardDTO>

/**
 * DTO dla rozpoczęcia generowania fiszek
 * @see api-plan.md - /api/generations POST
 */
export interface CreateGenerationDTO {
  /** Tekst źródłowy (1000-10000 znaków) */
  source_text: string
  /** Identyfikator modelu AI */
  model: string
}

/**
 * DTO dla statusu generowania fiszek
 * @see api-plan.md - /api/generations/{id} GET
 */
export interface GenerationStatusDTO extends Omit<DBTables['generations']['Row'], 'user_id'> {
  status: 'processing' | 'completed' | 'error'
  flashcards: Array<{
    id: number
    front: ValidatedFrontText
    back: ValidatedBackText
    source: 'ai-full'
  }>
}

/**
 * DTO dla akceptacji wygenerowanych fiszek
 * @see api-plan.md - /api/generations/{id}/accept PUT
 */
export interface AcceptGeneratedFlashcardsDTO {
  flashcards: Array<{
    id: number
    front: ValidatedFrontText
    back: ValidatedBackText
    edited: boolean
  }>
}

/**
 * DTO dla odpowiedzi po akceptacji fiszek
 * @see api-plan.md - /api/generations/{id}/accept response
 */
export interface AcceptGeneratedFlashcardsResponseDTO {
  accepted_count: number
  flashcards: Array<{
    id: number
    front: string
    back: string
    source: 'ai-full' | 'ai-edited' | 'manual'
  }>
}

/**
 * Parametry filtrowania dla listy fiszek
 * @see api-plan.md - /api/flashcards query parameters
 */
export interface FlashcardFilters {
  page?: number
  per_page?: number
  source?: 'ai-full' | 'ai-edited' | 'manual'
  search?: string
  generation_id?: number
}

// Funkcje pomocnicze do walidacji tekstu
export const validateFrontText = (text: string): ValidatedFrontText => {
  if (text.length > 200) throw new Error('Front text cannot be longer than 200 characters')
  return text as ValidatedFrontText
}

export const validateBackText = (text: string): ValidatedBackText => {
  if (text.length > 500) throw new Error('Back text cannot be longer than 500 characters')
  return text as ValidatedBackText
} 