import { createErrorResponse, type FlashcardsToReviewDTO } from "@/types";
import { createClient } from "@supabase/supabase-js";
import type { APIRoute } from "astro";
import type { Database } from "@/db/database.types";

// Inicjalizacja klienta Supabase
const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;
const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Tymczasowe rozwiązanie dla uwierzytelniania podczas developmentu
const DEFAULT_USER_ID = "123e4567-e89b-12d3-a456-426614174000";

// Funkcja do uwierzytelniania użytkownika
async function getUser(request: Request) {
  // Tymczasowe uproszczone uwierzytelnianie dla developmentu
  return {
    id: DEFAULT_USER_ID,
    email: "test@example.com",
  };
}

/**
 * GET /api/leitner/review-cards - Pobieranie fiszek do nauki w systemie Leitnera
 * Zwraca fiszki, które powinny być powtórzone dzisiaj, na podstawie przypisanego pudełka Leitnera
 */
export const GET: APIRoute = async ({ request, url }) => {
  try {
    // 1. Ekstrakcja i weryfikacja tokenu użytkownika
    const user = await getUser(request);
    if (!user) {
      return new Response(JSON.stringify(createErrorResponse("unauthorized", "Brak autoryzacji")), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. Walidacja parametrów zapytania
    const searchParams = url.searchParams;
    const page = searchParams.has("page") ? parseInt(searchParams.get("page")!) : 1;
    const per_page = searchParams.has("per_page") ? Math.min(parseInt(searchParams.get("per_page")!), 100) : 20;

    // Walidacja parametrów
    if (isNaN(page) || page < 1) {
      return new Response(
        JSON.stringify(createErrorResponse("validation_error", "Parametr page musi być liczbą większą niż 0")),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (isNaN(per_page) || per_page < 1) {
      return new Response(
        JSON.stringify(createErrorResponse("validation_error", "Parametr per_page musi być liczbą większą niż 0")),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Obliczenie offsetu dla paginacji
    const offset = (page - 1) * per_page;

    // 4. Pobranie fiszek do powtórki (te, których next_review_at jest <= CURRENT_TIMESTAMP)
    const {
      data: flashcards,
      error,
      count,
    } = await supabase
      .from("flashcards")
      .select(
        `
        id, front, back, source, generation_id, created_at, updated_at,
        flashcard_learning_progress!inner(leitner_box, consecutive_correct_answers, next_review_at)
      `,
        { count: "exact" }
      )
      .eq("user_id", user.id)
      .lte("flashcard_learning_progress.next_review_at", new Date().toISOString())
      .order("flashcard_learning_progress.leitner_box", { ascending: true })
      .order("flashcard_learning_progress.next_review_at", { ascending: true })
      .range(offset, offset + per_page - 1);

    if (error) {
      console.error("Błąd podczas pobierania fiszek do powtórki:", error);
      return new Response(
        JSON.stringify(createErrorResponse("server_error", "Wystąpił błąd podczas pobierania fiszek do powtórki")),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 5. Mapowanie danych z bazy danych na DTO
    const formattedFlashcards = flashcards.map((card) => ({
      id: card.id,
      front: card.front,
      back: card.back,
      source: card.source,
      generation_id: card.generation_id,
      created_at: card.created_at,
      updated_at: card.updated_at,
      learning_progress: {
        leitner_box: card.flashcard_learning_progress.leitner_box,
        consecutive_correct_answers: card.flashcard_learning_progress.consecutive_correct_answers,
      },
    }));

    // 6. Przygotowanie odpowiedzi z paginacją
    const totalPages = Math.ceil((count || 0) / per_page);

    const response: FlashcardsToReviewDTO = {
      items: formattedFlashcards,
      total: count || 0,
      page: page,
      per_page: per_page,
      total_pages: totalPages,
    };

    // 7. Zwrócenie odpowiedzi z paginacją
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Nieoczekiwany błąd:", error);
    return new Response(JSON.stringify(createErrorResponse("server_error", "Wystąpił nieoczekiwany błąd")), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
