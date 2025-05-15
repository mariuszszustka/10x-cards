import type { APIRoute } from "astro";

/**
 * Prosty endpoint do sprawdzania, czy API jest dostępne
 * Używany głównie w testach E2E
 */
export const GET: APIRoute = async ({ request }) => {
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "API is running",
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
