import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.client.ts";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const formData = await request.json();
    const { password, token } = formData;

    // Walidacja danych wejściowych
    if (!password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Hasło jest wymagane",
        }),
        { status: 400 }
      );
    }

    // Walidacja hasła
    if (password.length < 8) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Hasło musi mieć co najmniej 8 znaków",
        }),
        { status: 400 }
      );
    }

    // Inicjalizacja klienta Supabase dla SSR
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    // W normalnym przypadku, token byłby częścią URL w emailu, ale w MVP symulujemy ten proces
    // W produkcji użylibyśmy:
    // const { error } = await supabase.auth.updateUser({ password });

    // W MVP sprawdzamy token z URL
    if (!token || !token.startsWith("example-token-for-")) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Nieprawidłowy token resetowania hasła",
        }),
        { status: 400 }
      );
    }

    // Symulacja dla MVP
    // W rzeczywistości nie potrzebujemy tego symulacyjnego kodu, bo Supabase obsługuje token automatycznie
    const email = token.replace("example-token-for-", "").replace("-at-", "@");

    // Zwracamy sukces (w MVP nie aktualizujemy faktycznie hasła, to tylko symulacja)
    return new Response(
      JSON.stringify({
        success: true,
        message: "Hasło zostało zaktualizowane",
        email, // Tylko dla celów demonstracyjnych
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Błąd podczas aktualizacji hasła:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Wystąpił nieoczekiwany błąd podczas aktualizacji hasła",
      }),
      { status: 500 }
    );
  }
};
