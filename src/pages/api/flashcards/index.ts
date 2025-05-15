import type { APIRoute } from "astro";
import { createClient } from "@/db";

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const supabase = createClient(request);
    const session = locals.session;

    if (!session) {
      return new Response(JSON.stringify({ error: "Nie zalogowano" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

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
