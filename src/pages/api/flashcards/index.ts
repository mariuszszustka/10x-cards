import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // Użyj klienta Supabase z middleware
    const supabase = locals.supabase;
    const user = locals.user;

    console.log("[API Flashcards] Użytkownik zalogowany:", user?.id || "brak ID");

    // Pobierz fiszki z bazy danych
    if (user) {
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("[API Flashcards] Błąd podczas pobierania fiszek:", error.message);
        return new Response(JSON.stringify({ error: "Błąd podczas pobierania fiszek" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }

      console.log("[API Flashcards] Pobrano fiszek:", data?.length || 0);
      return new Response(JSON.stringify({ data: data || [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Użytkownik niezalogowany lub brak dostępu - zwróć pustą tablicę
    return new Response(JSON.stringify({ data: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[API Flashcards] Błąd serwera:", error);
    return new Response(JSON.stringify({ error: "Błąd serwera" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
