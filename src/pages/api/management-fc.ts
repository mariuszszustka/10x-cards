import { createErrorResponse, type FlashcardDTO, type FlashcardFilters, type FlashcardListResponseDTO, type CreateFlashcardDTO, validateBackText, validateFrontText } from '@/types';
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
  
  // Kod poniżej jest wyłączony tymczasowo dla celów testowych
  /*
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  const { data, error } = await supabase.auth.getUser(token);
  
  if (error || !data.user) {
    return null;
  }

  return data.user;
  */
}

/**
 * GET /api/flashcards - Lista fiszek użytkownika
 * Pobiera listę fiszek z opcjonalną filtracją i paginacją
 */
export const GET: APIRoute = async ({ request, url }) => {
  try {
    // 1. Ekstrakcja i weryfikacja tokenu JWT użytkownika
    const user = await getUser(request);
    if (!user) {
      return new Response(
        JSON.stringify(createErrorResponse('unauthorized', 'Brak autoryzacji')),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Walidacja parametrów zapytania
    const searchParams = url.searchParams;
    const filters: FlashcardFilters = {
      page: searchParams.has('page') ? parseInt(searchParams.get('page')!) : 1,
      per_page: searchParams.has('per_page') ? Math.min(parseInt(searchParams.get('per_page')!), 100) : 20,
      source: searchParams.get('source') as FlashcardFilters['source'] || undefined,
      search: searchParams.get('search') || undefined,
      generation_id: searchParams.has('generation_id') ? parseInt(searchParams.get('generation_id')!) : undefined
    };

    // Walidacja parametrów
    if (filters.page && (isNaN(filters.page) || filters.page < 1)) {
      return new Response(
        JSON.stringify(createErrorResponse('validation_error', 'Parametr page musi być liczbą większą niż 0')),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (filters.per_page && (isNaN(filters.per_page) || filters.per_page < 1)) {
      return new Response(
        JSON.stringify(createErrorResponse('validation_error', 'Parametr per_page musi być liczbą większą niż 0')),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (filters.source && !['ai-full', 'ai-edited', 'manual'].includes(filters.source)) {
      return new Response(
        JSON.stringify(createErrorResponse('validation_error', 'Parametr source musi mieć wartość: ai-full, ai-edited lub manual')),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (filters.generation_id && (isNaN(filters.generation_id) || filters.generation_id < 1)) {
      return new Response(
        JSON.stringify(createErrorResponse('validation_error', 'Parametr generation_id musi być liczbą większą niż 0')),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Budowa zapytania do bazy danych z uwzględnieniem filtrów i paginacji
    let query = supabase
      .from('flashcards')
      .select('id, front, back, source, generation_id, created_at, updated_at', { count: 'exact' })
      .eq('user_id', user.id);

    // Dodanie filtrów
    if (filters.source) {
      query = query.eq('source', filters.source);
    }

    if (filters.generation_id) {
      query = query.eq('generation_id', filters.generation_id);
    }

    if (filters.search) {
      query = query.or(`front.ilike.%${filters.search}%,back.ilike.%${filters.search}%`);
    }

    // Obliczenie offsetu dla paginacji
    const offset = ((filters.page || 1) - 1) * (filters.per_page || 20);
    
    // 4. Pobranie fiszek użytkownika z bazy danych z paginacją
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + (filters.per_page || 20) - 1);

    if (error) {
      console.error('Błąd podczas pobierania fiszek:', error);
      return new Response(
        JSON.stringify(createErrorResponse('server_error', 'Wystąpił błąd podczas pobierania fiszek')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 5. Mapowanie danych z bazy danych na DTO
    const flashcards: FlashcardDTO[] = data.map((card: any) => ({
      id: card.id,
      front: card.front,
      back: card.back,
      source: card.source,
      generation_id: card.generation_id,
      created_at: card.created_at,
      updated_at: card.updated_at
    }));

    // 6. Przygotowanie odpowiedzi z paginacją
    const totalPages = Math.ceil((count || 0) / (filters.per_page || 20));
    
    const response: FlashcardListResponseDTO = {
      items: flashcards,
      total: count || 0,
      page: filters.page || 1,
      per_page: filters.per_page || 20,
      total_pages: totalPages
    };

    // 7. Zwrócenie odpowiedzi z paginacją
    return new Response(JSON.stringify(response), {
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

/**
 * POST /api/flashcards - Tworzenie nowej fiszki
 * Umożliwia utworzenie nowej fiszki manualnie
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. Ekstrakcja tokenu JWT z nagłówka i weryfikacja tożsamości użytkownika
    const user = await getUser(request);
    if (!user) {
      return new Response(
        JSON.stringify(createErrorResponse('unauthorized', 'Brak autoryzacji')),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Walidacja danych wejściowych
    let bodyData;
    try {
      bodyData = await request.json();
    } catch (e) {
      return new Response(
        JSON.stringify(createErrorResponse('validation_error', 'Nieprawidłowy format JSON')),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Sprawdzenie czy zawiera wymagane pola
    if (!bodyData.front || !bodyData.back) {
      return new Response(
        JSON.stringify(createErrorResponse('validation_error', 'Pola front i back są wymagane')),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Walidacja długości tekstów
    let validatedFront, validatedBack;
    try {
      validatedFront = validateFrontText(bodyData.front);
      validatedBack = validateBackText(bodyData.back);
    } catch (error) {
      return new Response(
        JSON.stringify(createErrorResponse('validation_error', (error as Error).message)),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Tworzenie nowej fiszki w bazie danych
    const { data, error } = await supabase
      .from('flashcards')
      .insert({
        user_id: user.id,
        front: validatedFront,
        back: validatedBack,
        source: 'manual' // Dla ręcznie tworzonych fiszek
      })
      .select('id, front, back, source, created_at, updated_at')
      .single();

    if (error) {
      console.error('Błąd podczas tworzenia fiszki:', error);
      return new Response(
        JSON.stringify(createErrorResponse('server_error', 'Wystąpił błąd podczas tworzenia fiszki')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Zwrócenie danych utworzonej fiszki
    const flashcard: FlashcardDTO = {
      id: data.id,
      front: data.front,
      back: data.back,
      source: data.source,
      generation_id: null, // Manualnie tworzone fiszki nie mają generation_id
      created_at: data.created_at,
      updated_at: data.updated_at
    };

    return new Response(JSON.stringify(flashcard), {
      status: 201, // Created
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
