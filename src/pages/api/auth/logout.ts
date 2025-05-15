import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.client.ts";
import { getSessionCookieName } from "../../../utils/auth-helper.ts";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    // Pobieramy host z nagłówków żądania
    const requestHost = request.headers.get("host") || "";
    console.log("[Logout] Host żądania:", requestHost);

    // Dostosowana nazwa ciasteczka sesji
    const sessionCookieName = getSessionCookieName(requestHost);
    console.log("[Logout] Usuwanie ciasteczka:", sessionCookieName);

    // Inicjalizacja klienta Supabase dla SSR
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    // Wylogowanie użytkownika
    const { error } = await supabase.auth.signOut();

    // Ręcznie usuwamy wszystkie powiązane ciasteczka
    cookies.delete(sessionCookieName, { path: "/" });
    cookies.delete("auth-session", { path: "/" });
    cookies.delete("session", { path: "/" });
    cookies.delete("sb-auth-token", { path: "/" });

    if (error) {
      console.error("[Logout] Błąd wylogowania:", error.message);
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message || "Wystąpił błąd podczas wylogowania",
        }),
        { status: 400 }
      );
    }

    console.log("[Logout] Pomyślnie wylogowano użytkownika");

    // Zwróć stronę z kodem JS do wyczyszczenia localStorage
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Wylogowywanie...</title>
          <script>
            // Wyczyść localStorage
            localStorage.removeItem('authSession');
            localStorage.removeItem('sessionExpiresAt');
            localStorage.removeItem('userId');
            localStorage.removeItem('userEmail');
            
            // Wyczyść wszystkie ciasteczka związane z sesją
            document.cookie = 'sb-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'auth-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            
            // Przekieruj do strony logowania
            window.location.href = '/auth/login';
          </script>
        </head>
        <body>
          <p>Wylogowywanie...</p>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } catch (error) {
    console.error("Błąd podczas wylogowania:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Wystąpił nieoczekiwany błąd podczas wylogowania",
      }),
      { status: 500 }
    );
  }
};
