import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.client.ts";

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    // Inicjalizacja klienta Supabase dla SSR
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    // Pobierz sesję
    const { data: sessionData, error } = await supabase.auth.getSession();

    // Jeśli jest sesja, pobierz też dane użytkownika
    if (sessionData.session) {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userData.user && !userError) {
        return new Response(
          JSON.stringify({
            user: {
              id: userData.user.id,
              email: userData.user.email,
              role: userData.user.role,
              metadata: userData.user.user_metadata,
            },
            session: {
              expires_at: sessionData.session.expires_at,
            },
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    // Brak sesji lub błąd
    return new Response(
      JSON.stringify({
        user: null,
        error: error ? error.message : sessionData.session ? null : "Brak aktywnej sesji",
      }),
      {
        status: error ? 400 : 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Błąd podczas sprawdzania sesji:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Wystąpił nieoczekiwany błąd podczas sprawdzania sesji",
      }),
      { status: 500 }
    );
  }
};
