import { createErrorResponse, type FlashcardDTO } from '@/types';
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
 * PUT /api/management-fc/{id} - Aktualizacja fiszki
 * Umożliwia modyfikację istniejącej fiszki
 */
export const PUT: APIRoute = async ({ request, params }) => {
  // TODO: Implementacja aktualizacji fiszki
  return new Response('TODO', { status: 501 });
};

/**
 * DELETE /api/management-fc/{id} - Usuwanie fiszki
 * Usuwa istniejącą fiszkę z bazy danych
 */
export const DELETE: APIRoute = async ({ request, params }) => {
  try {
    // 1. Ekstrakcja tokenu JWT z nagłówka i weryfikacja tożsamości użytkownika
    const user = await getUser(request);
    if (!user) {
      return new Response(
        JSON.stringify(createErrorResponse('unauthorized', 'Brak autoryzacji')),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Sprawdzenie czy podano prawidłowe ID fiszki
    const id = params.id;
    
    if (!id || isNaN(parseInt(id)) || parseInt(id) < 1) {
      return new Response(
        JSON.stringify(createErrorResponse('validation_error', 'Nieprawidłowe ID fiszki')),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const flashcardId = parseInt(id);

    // 3. Sprawdzenie czy fiszka istnieje i należy do użytkownika
    const { data: existingFlashcard, error: checkError } = await supabase
      .from('flashcards')
      .select('id')
      .eq('id', flashcardId)
      .eq('user_id', user.id)
      .single();

    if (checkError || !existingFlashcard) {
      return new Response(
        JSON.stringify(createErrorResponse('not_found', 'Fiszka nie znaleziona')),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Usunięcie fiszki
    const { error: deleteError } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', flashcardId)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('Błąd podczas usuwania fiszki:', deleteError);
      return new Response(
        JSON.stringify(createErrorResponse('server_error', 'Wystąpił błąd podczas usuwania fiszki')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 5. Zwrócenie odpowiedzi 204 No Content
    return new Response(null, { status: 204 });

  } catch (error) {
    console.error('Nieoczekiwany błąd:', error);
    return new Response(
      JSON.stringify(createErrorResponse('server_error', 'Wystąpił nieoczekiwany błąd')),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}; 