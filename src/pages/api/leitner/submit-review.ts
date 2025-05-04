import { createErrorResponse, type ReviewResultDTO } from '@/types';
import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';
import type { Database } from '@/db/database.types';

// Inicjalizacja klienta Supabase
const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;
const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Tymczasowe rozwiązanie dla uwierzytelniania podczas developmentu
const DEFAULT_USER_ID = '123e4567-e89b-12d3-a456-426614174000';

// Funkcja do uwierzytelniania użytkownika
async function getUser(request: Request) {
  // Tymczasowe uproszczone uwierzytelnianie dla developmentu
  return { 
    id: DEFAULT_USER_ID,
    email: 'test@example.com'
  };
}

/**
 * POST /api/leitner/submit-review - Przesyłanie wyniku powtórki fiszki
 * Aktualizuje stan nauki fiszki na podstawie wyniku (poprawna/niepoprawna odpowiedź)
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. Ekstrakcja i weryfikacja tokenu użytkownika
    const user = await getUser(request);
    if (!user) {
      return new Response(
        JSON.stringify(createErrorResponse('unauthorized', 'Brak autoryzacji')),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Walidacja danych wejściowych
    let reviewResult: ReviewResultDTO;
    try {
      reviewResult = await request.json();
    } catch (e) {
      return new Response(
        JSON.stringify(createErrorResponse('validation_error', 'Nieprawidłowy format JSON')),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Sprawdzenie wymaganych pól
    if (typeof reviewResult.flashcard_id !== 'number' || typeof reviewResult.is_correct !== 'boolean') {
      return new Response(
        JSON.stringify(createErrorResponse('validation_error', 'Pola flashcard_id (number) i is_correct (boolean) są wymagane')),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Pobranie aktualnego stanu nauki fiszki
    const { data: currentProgress, error: progressError } = await supabase
      .from('flashcard_learning_progress')
      .select('id, leitner_box, consecutive_correct_answers')
      .eq('user_id', user.id)
      .eq('flashcard_id', reviewResult.flashcard_id)
      .single();

    if (progressError) {
      return new Response(
        JSON.stringify(createErrorResponse('not_found', 'Nie znaleziono postępu nauki dla podanej fiszki')),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Obliczenie nowego pudełka Leitnera na podstawie wyniku
    let newBox: number;
    let newConsecutiveCorrectAnswers: number;

    if (reviewResult.is_correct) {
      // Jeśli odpowiedź była poprawna, przenieś fiszkę o jedno pudełko wyżej (max 5)
      newBox = Math.min(currentProgress.leitner_box + 1, 5);
      newConsecutiveCorrectAnswers = currentProgress.consecutive_correct_answers + 1;
    } else {
      // Jeśli odpowiedź była niepoprawna, przenieś fiszkę z powrotem do pudełka 1
      newBox = 1;
      newConsecutiveCorrectAnswers = 0;
    }

    // 5. Rozpoczęcie transakcji do aktualizacji stanu nauki i dodania wpisu w historii
    const { data, error } = await supabase.rpc('update_flashcard_review_result', {
      p_flashcard_id: reviewResult.flashcard_id,
      p_user_id: user.id,
      p_is_correct: reviewResult.is_correct,
      p_previous_box: currentProgress.leitner_box,
      p_new_box: newBox,
      p_review_time_ms: reviewResult.review_time_ms || null
    });

    if (error) {
      console.error('Błąd podczas aktualizacji stanu nauki:', error);
      return new Response(
        JSON.stringify(createErrorResponse('server_error', 'Wystąpił błąd podczas aktualizacji stanu nauki')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 6. Zwrócenie zaktualizowanego stanu nauki
    return new Response(JSON.stringify({
      flashcard_id: reviewResult.flashcard_id,
      is_correct: reviewResult.is_correct,
      previous_box: currentProgress.leitner_box,
      new_box: newBox,
      consecutive_correct_answers: newConsecutiveCorrectAnswers,
      next_review_at: data.next_review_at
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Nieoczekiwany błąd:', error);
    return new Response(
      JSON.stringify(createErrorResponse('server_error', 'Wystąpił nieoczekiwany błąd')),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 