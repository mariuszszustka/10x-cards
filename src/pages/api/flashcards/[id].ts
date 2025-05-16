import type { APIRoute } from "astro";
import { validateBackText, validateFrontText } from "@/types";

// Obsługa aktualizacji fiszek przez /:id
export const PUT: APIRoute = async ({ request, locals, params }) => {
  try {
    // Użyj klienta Supabase z middleware
    const supabase = locals.supabase;
    const user = locals.user;

    console.log("[API Flashcards/:id PUT] Użytkownik zalogowany:", user?.id || "brak ID");

    if (!user) {
      console.error("[API Flashcards/:id PUT] Użytkownik niezalogowany");
      return new Response(JSON.stringify({ error: "Brak autoryzacji" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Pobranie ID z parametrów ścieżki
    const id = params.id;
    if (!id) {
      console.error("[API Flashcards/:id PUT] Brak parametru ID");
      return new Response(JSON.stringify({ error: "Brak ID fiszki do aktualizacji" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Parsowanie danych z żądania
    let bodyData;
    try {
      bodyData = await request.json();
      console.log("[API Flashcards/:id PUT] Otrzymane dane:", bodyData);
    } catch (e) {
      console.error("[API Flashcards/:id PUT] Błąd parsowania JSON:", e);
      return new Response(JSON.stringify({ error: "Nieprawidłowy format JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Sprawdzenie wymaganych pól
    if ((!bodyData.front && !bodyData.back) || Object.keys(bodyData).length === 0) {
      console.error("[API Flashcards/:id PUT] Brak pól do aktualizacji");
      return new Response(JSON.stringify({ error: "Brak pól do aktualizacji" }), {
        status: 400, 
        headers: { "Content-Type": "application/json" }
      });
    }

    // Przygotowanie danych do aktualizacji
    const updateData: Record<string, any> = {};
    
    // Walidacja danych, jeśli zostały przesłane
    if (bodyData.front) {
      try {
        updateData.front = validateFrontText(bodyData.front);
      } catch (error) {
        console.error("[API Flashcards/:id PUT] Błąd walidacji front:", error);
        return new Response(JSON.stringify({ error: (error as Error).message }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    
    if (bodyData.back) {
      try {
        updateData.back = validateBackText(bodyData.back);
      } catch (error) {
        console.error("[API Flashcards/:id PUT] Błąd walidacji back:", error);
        return new Response(JSON.stringify({ error: (error as Error).message }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // Dodanie timestamp aktualizacji
    updateData.updated_at = new Date().toISOString();

    // Aktualizacja fiszki w bazie danych
    const { data, error } = await supabase
      .from("flashcards")
      .update(updateData)
      .eq("id", parseInt(id))
      .eq("user_id", user.id) // Ważne: Sprawdzamy czy fiszka należy do użytkownika
      .select("id, front, back, source, created_at, updated_at")
      .single();

    if (error) {
      console.error("[API Flashcards/:id PUT] Błąd podczas aktualizacji fiszki:", error);
      return new Response(JSON.stringify({ error: "Wystąpił błąd podczas aktualizacji fiszki" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log("[API Flashcards/:id PUT] Fiszka zaktualizowana pomyślnie:", data);

    // Zwrócenie zaktualizowanych danych fiszki
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[API Flashcards/:id PUT] Nieoczekiwany błąd:", error);
    return new Response(JSON.stringify({ error: "Wystąpił nieoczekiwany błąd" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

// Obsługa usuwania fiszek przez /:id
export const DELETE: APIRoute = async ({ request, locals, params }) => {
  try {
    // Użyj klienta Supabase z middleware
    const supabase = locals.supabase;
    const user = locals.user;

    console.log("[API Flashcards/:id DELETE] Użytkownik zalogowany:", user?.id || "brak ID");

    if (!user) {
      console.error("[API Flashcards/:id DELETE] Użytkownik niezalogowany");
      return new Response(JSON.stringify({ error: "Brak autoryzacji" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Pobranie ID z parametrów ścieżki
    const id = params.id;
    if (!id) {
      console.error("[API Flashcards/:id DELETE] Brak parametru ID");
      return new Response(JSON.stringify({ error: "Brak ID fiszki do usunięcia" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Usunięcie fiszki
    const { error } = await supabase
      .from("flashcards")
      .delete()
      .eq("id", parseInt(id))
      .eq("user_id", user.id); // Ważne: Sprawdzamy czy fiszka należy do użytkownika

    if (error) {
      console.error("[API Flashcards/:id DELETE] Błąd podczas usuwania fiszki:", error);
      return new Response(JSON.stringify({ error: "Wystąpił błąd podczas usuwania fiszki" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log("[API Flashcards/:id DELETE] Fiszka usunięta pomyślnie, ID:", id);

    // Zwracamy potwierdzenie usunięcia
    return new Response(JSON.stringify({ success: true, id }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[API Flashcards/:id DELETE] Nieoczekiwany błąd:", error);
    return new Response(JSON.stringify({ error: "Wystąpił nieoczekiwany błąd" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}; 