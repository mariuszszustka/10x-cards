import type { APIRoute } from "astro";
import { validateBackText, validateFrontText } from "@/types";

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // Użyj klienta Supabase z middleware
    const supabase = locals.supabase;
    const user = locals.user;

    console.log("[API Flashcards] Użytkownik zalogowany:", user?.id || "brak ID");
    
    // Sprawdź wszystkie nagłówki żądania (dla debugowania)
    console.log("[API Flashcards] Nagłówki żądania:", Object.fromEntries([...request.headers.entries()]));

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
      
      // Zwróć dane w formacie oczekiwanym przez useCrudOperations
      return new Response(JSON.stringify({ 
        items: data || [],
        pagination: {
          page: 1,
          per_page: data?.length || 0,
          total_items: data?.length || 0,
          total_pages: 1
        }
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Użytkownik niezalogowany lub brak dostępu - zwróć pustą tablicę
    return new Response(JSON.stringify({ 
      items: [],
      pagination: {
        page: 1,
        per_page: 0,
        total_items: 0,
        total_pages: 1
      }
    }), {
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

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Użyj klienta Supabase z middleware
    const supabase = locals.supabase;
    const user = locals.user;

    console.log("[API Flashcards POST] Użytkownik zalogowany:", user?.id || "brak ID");

    if (!user) {
      console.error("[API Flashcards POST] Użytkownik niezalogowany");
      return new Response(JSON.stringify({ error: "Brak autoryzacji" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Parsowanie danych z żądania
    let bodyData;
    try {
      bodyData = await request.json();
      console.log("[API Flashcards POST] Otrzymane dane:", bodyData);
    } catch (e) {
      console.error("[API Flashcards POST] Błąd parsowania JSON:", e);
      return new Response(JSON.stringify({ error: "Nieprawidłowy format JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Sprawdzenie wymaganych pól
    if (!bodyData.front || !bodyData.back) {
      console.error("[API Flashcards POST] Brak wymaganych pól front/back");
      return new Response(JSON.stringify({ error: "Pola front i back są wymagane" }), {
        status: 400, 
        headers: { "Content-Type": "application/json" }
      });
    }

    // Walidacja danych
    let validatedFront, validatedBack;
    try {
      validatedFront = validateFrontText(bodyData.front);
      validatedBack = validateBackText(bodyData.back);
    } catch (error) {
      console.error("[API Flashcards POST] Błąd walidacji:", error);
      return new Response(JSON.stringify({ error: (error as Error).message }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Zapis do bazy danych
    const { data, error } = await supabase
      .from("flashcards")
      .insert({
        user_id: user.id,
        front: validatedFront,
        back: validatedBack,
        source: "manual" // Dla ręcznie tworzonych fiszek
      })
      .select("id, front, back, source, created_at, updated_at")
      .single();

    if (error) {
      console.error("[API Flashcards POST] Błąd podczas tworzenia fiszki:", error);
      return new Response(JSON.stringify({ error: "Wystąpił błąd podczas tworzenia fiszki" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log("[API Flashcards POST] Fiszka utworzona pomyślnie:", data);

    // Zwrócenie danych utworzonej fiszki
    return new Response(JSON.stringify(data), {
      status: 201, // Created
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[API Flashcards POST] Nieoczekiwany błąd:", error);
    return new Response(JSON.stringify({ error: "Wystąpił nieoczekiwany błąd" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

// Obsługa aktualizacji fiszek
export const PUT: APIRoute = async ({ request, locals, url }) => {
  try {
    // Użyj klienta Supabase z middleware
    const supabase = locals.supabase;
    const user = locals.user;

    console.log("[API Flashcards PUT] Użytkownik zalogowany:", user?.id || "brak ID");

    if (!user) {
      console.error("[API Flashcards PUT] Użytkownik niezalogowany");
      return new Response(JSON.stringify({ error: "Brak autoryzacji" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Pobranie ID z ścieżki URL
    const id = url.searchParams.get('id');
    if (!id) {
      console.error("[API Flashcards PUT] Brak parametru ID");
      return new Response(JSON.stringify({ error: "Brak ID fiszki do aktualizacji" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Parsowanie danych z żądania
    let bodyData;
    try {
      bodyData = await request.json();
      console.log("[API Flashcards PUT] Otrzymane dane:", bodyData);
    } catch (e) {
      console.error("[API Flashcards PUT] Błąd parsowania JSON:", e);
      return new Response(JSON.stringify({ error: "Nieprawidłowy format JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Sprawdzenie wymaganych pól
    if ((!bodyData.front && !bodyData.back) || Object.keys(bodyData).length === 0) {
      console.error("[API Flashcards PUT] Brak pól do aktualizacji");
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
        console.error("[API Flashcards PUT] Błąd walidacji front:", error);
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
        console.error("[API Flashcards PUT] Błąd walidacji back:", error);
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
      console.error("[API Flashcards PUT] Błąd podczas aktualizacji fiszki:", error);
      return new Response(JSON.stringify({ error: "Wystąpił błąd podczas aktualizacji fiszki" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log("[API Flashcards PUT] Fiszka zaktualizowana pomyślnie:", data);

    // Zwrócenie zaktualizowanych danych fiszki
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[API Flashcards PUT] Nieoczekiwany błąd:", error);
    return new Response(JSON.stringify({ error: "Wystąpił nieoczekiwany błąd" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

// Obsługa usuwania fiszek - rozwiązanie z parametrem w URL
export const DELETE: APIRoute = async ({ request, locals, params, url }) => {
  try {
    // Użyj klienta Supabase z middleware
    const supabase = locals.supabase;
    const user = locals.user;

    console.log("[API Flashcards DELETE] Użytkownik zalogowany:", user?.id || "brak ID");

    if (!user) {
      console.error("[API Flashcards DELETE] Użytkownik niezalogowany");
      return new Response(JSON.stringify({ error: "Brak autoryzacji" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Pobranie ID z ścieżki URL
    const id = url.searchParams.get('id');
    if (!id) {
      console.error("[API Flashcards DELETE] Brak parametru ID");
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
      console.error("[API Flashcards DELETE] Błąd podczas usuwania fiszki:", error);
      return new Response(JSON.stringify({ error: "Wystąpił błąd podczas usuwania fiszki" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    console.log("[API Flashcards DELETE] Fiszka usunięta pomyślnie, ID:", id);

    // Zwracamy potwierdzenie usunięcia
    return new Response(JSON.stringify({ success: true, id }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("[API Flashcards DELETE] Nieoczekiwany błąd:", error);
    return new Response(JSON.stringify({ error: "Wystąpił nieoczekiwany błąd" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
