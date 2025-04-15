import { createErrorResponse, type CreateReviewSessionDTO, type UpdateReviewSessionDTO, type ReviewSessionDTO } from '@/types';
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
 * POST /api/leitner/sessions - Tworzenie nowej sesji nauki
 * Tworzy nową sesję nauki lub aktualizuje istniejącą, gdy użytkownik kontynuuje naukę
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
    let sessionData: CreateReviewSessionDTO;
    try {
      sessionData = await request.json();
    } catch (e) {
      return new Response(
        JSON.stringify(createErrorResponse('validation_error', 'Nieprawidłowy format JSON')),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let session: ReviewSessionDTO;

    // 3. Sprawdzenie, czy chcemy kontynuować istniejącą sesję
    if (sessionData.session_id) {
      // Pobranie istniejącej sesji
      const { data: existingSession, error: sessionError } = await supabase
        .from('review_sessions')
        .select('*')
        .eq('id', sessionData.session_id)
        .eq('user_id', user.id)
        .single();

      if (sessionError || !existingSession) {
        return new Response(
          JSON.stringify(createErrorResponse('not_found', 'Nie znaleziono sesji o podanym ID')),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Sprawdź, czy sesja nie jest już zakończona
      if (existingSession.completed_at) {
        return new Response(
          JSON.stringify(createErrorResponse('conflict', 'Sesja została już zakończona')),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        );
      }

      session = {
        id: existingSession.id,
        started_at: existingSession.started_at,
        completed_at: existingSession.completed_at,
        cards_reviewed: existingSession.cards_reviewed,
        correct_answers: existingSession.correct_answers,
        incorrect_answers: existingSession.incorrect_answers,
        total_review_time_ms: existingSession.total_review_time_ms,
        created_at: existingSession.created_at,
        updated_at: existingSession.updated_at
      };
    } else {
      // 4. Utworzenie nowej sesji nauki
      const { data: newSession, error: createError } = await supabase
        .from('review_sessions')
        .insert({
          user_id: user.id,
          started_at: new Date().toISOString(),
          cards_reviewed: 0,
          correct_answers: 0,
          incorrect_answers: 0
        })
        .select()
        .single();

      if (createError) {
        console.error('Błąd podczas tworzenia sesji nauki:', createError);
        return new Response(
          JSON.stringify(createErrorResponse('server_error', 'Wystąpił błąd podczas tworzenia sesji nauki')),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      session = {
        id: newSession.id,
        started_at: newSession.started_at,
        completed_at: newSession.completed_at,
        cards_reviewed: newSession.cards_reviewed,
        correct_answers: newSession.correct_answers,
        incorrect_answers: newSession.incorrect_answers,
        total_review_time_ms: newSession.total_review_time_ms,
        created_at: newSession.created_at,
        updated_at: newSession.updated_at
      };
    }

    // 5. Zwrócenie danych o sesji
    return new Response(JSON.stringify(session), {
      status: 201,
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

/**
 * PUT /api/leitner/sessions - Aktualizacja sesji nauki
 * Aktualizuje sesję nauki o nowe wyniki przeglądania fiszek lub oznacza ją jako zakończoną
 */
export const PUT: APIRoute = async ({ request }) => {
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
    let updateData: UpdateReviewSessionDTO;
    try {
      updateData = await request.json();
    } catch (e) {
      return new Response(
        JSON.stringify(createErrorResponse('validation_error', 'Nieprawidłowy format JSON')),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Sprawdzenie wymaganych pól
    if (!updateData.session_id) {
      return new Response(
        JSON.stringify(createErrorResponse('validation_error', 'Pole session_id jest wymagane')),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Pobranie istniejącej sesji
    const { data: existingSession, error: sessionError } = await supabase
      .from('review_sessions')
      .select('*')
      .eq('id', updateData.session_id)
      .eq('user_id', user.id)
      .single();

    if (sessionError || !existingSession) {
      return new Response(
        JSON.stringify(createErrorResponse('not_found', 'Nie znaleziono sesji o podanym ID')),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Sprawdź, czy sesja nie jest już zakończona
    if (existingSession.completed_at) {
      return new Response(
        JSON.stringify(createErrorResponse('conflict', 'Sesja została już zakończona')),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Rozpocznij transakcję do aktualizacji sesji i dodania wyników
    let totalCorrect = existingSession.correct_answers || 0;
    let totalIncorrect = existingSession.incorrect_answers || 0;
    let totalReviewed = existingSession.cards_reviewed || 0;

    // Aktualizacja liczników na podstawie wyników
    if (updateData.results && updateData.results.length > 0) {
      const correctCount = updateData.results.filter(r => r.is_correct).length;
      const incorrectCount = updateData.results.length - correctCount;
      
      totalCorrect += correctCount;
      totalIncorrect += incorrectCount;
      totalReviewed += updateData.results.length;
    }

    // Przygotowanie danych do aktualizacji
    const updateFields: any = {
      cards_reviewed: totalReviewed,
      correct_answers: totalCorrect,
      incorrect_answers: totalIncorrect
    };

    // Jeśli sesja ma być zakończona, dodaj timestamp zakończenia
    if (updateData.completed) {
      updateFields.completed_at = new Date().toISOString();
    }

    // 5. Aktualizacja sesji nauki
    const { data: updatedSession, error: updateError } = await supabase
      .from('review_sessions')
      .update(updateFields)
      .eq('id', updateData.session_id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Błąd podczas aktualizacji sesji nauki:', updateError);
      return new Response(
        JSON.stringify(createErrorResponse('server_error', 'Wystąpił błąd podczas aktualizacji sesji nauki')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 6. Zwrócenie zaktualizowanych danych o sesji
    const session: ReviewSessionDTO = {
      id: updatedSession.id,
      started_at: updatedSession.started_at,
      completed_at: updatedSession.completed_at,
      cards_reviewed: updatedSession.cards_reviewed,
      correct_answers: updatedSession.correct_answers,
      incorrect_answers: updatedSession.incorrect_answers,
      total_review_time_ms: updatedSession.total_review_time_ms,
      created_at: updatedSession.created_at,
      updated_at: updatedSession.updated_at
    };

    return new Response(JSON.stringify(session), {
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