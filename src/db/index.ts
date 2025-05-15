import { createSupabaseServerInstance } from "./supabase.client";
import type { AstroCookies } from "astro";

// Minimalna implementacja AstroCookies dla API
const createEmptyCookies = (): AstroCookies => {
  return {
    get: () => ({ value: "", json: () => null, number: () => null, boolean: () => null }),
    getAll: () => [],
    has: () => false,
    set: () => {},
    delete: () => {}
  } as unknown as AstroCookies;
};

/**
 * Funkcja pomocnicza do tworzenia klienta Supabase
 * Uproszczona wersja dla endpointów API
 */
export const createClient = (request: Request) => {
  return createSupabaseServerInstance({
    headers: request.headers,
    cookies: createEmptyCookies()
  });
};

// Re-eksportujemy wszystkie inne elementy z supabase.client
export * from "./supabase.client"; 