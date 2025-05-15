import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // Użyj klienta Supabase z middleware (locals) zamiast tworzyć nowy klient
    const supabase = locals.supabase;
    const session = locals.user ? { user: locals.user } : null;

    // Jeśli nie ma sesji, sprawdź nagłówki autoryzacji
    if (!session) {
      const authHeader = request.headers.get("Authorization");
      
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("[API Flashcards] Brak nagłówka autoryzacji lub tokenu");
        // Tymczasowo zwróć pusty wynik aby strona działała
        return new Response(JSON.stringify({ data: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    console.log("[API Flashcards] Użytkownik zalogowany:", locals.user?.id || "brak ID");

    // Tymczasowo zwróć pustą tablicę, aby strona działała
    return new Response(JSON.stringify({ data: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Błąd podczas pobierania fiszek:", error);
    return new Response(JSON.stringify({ error: "Błąd serwera" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
