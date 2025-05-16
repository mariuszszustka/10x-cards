import { createSupabaseServerInstance } from "./supabase.client";
import type { AstroCookies } from "astro";

// Minimalna implementacja AstroCookies dla API
const createEmptyCookies = (): AstroCookies => {
  return {
    get: () => ({ value: "", json: () => null, number: () => null, boolean: () => null }),
    getAll: () => [],
    has: () => false,
    // Te metody są celowo puste, ponieważ w kontekście API nie potrzebujemy modyfikować ciasteczek
    // Implementacja jest minimalna wyłącznie dla kompatybilności z typem AstroCookies
    set: () => {
      // Pusta implementacja - w tym kontekście nie ustawiamy ciasteczek
      return;
    },
    delete: () => {
      // Pusta implementacja - w tym kontekście nie usuwamy ciasteczek
      return;
    }
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