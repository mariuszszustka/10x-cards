import type { APIRoute } from 'astro'
import { z } from 'zod'
import { createErrorResponse, type CreateGenerationDTO } from '@/types'
import * as crypto from 'crypto'
import { enqueueFlashcardGeneration } from '@/lib/queue'
import { AVAILABLE_OLLAMA_MODELS, getDefaultModel } from '@/lib/ai-service'

// Tymczasowe rozwiązanie dla uwierzytelniania podczas developmentu
const DEFAULT_USER_ID = '123e4567-e89b-12d3-a456-426614174000'

// Schematy walidacji Zod
const CreateGenerationSchema = z.object({
  source_text: z.string()
    .min(1000, 'Tekst źródłowy musi zawierać co najmniej 1000 znaków')
    .max(10000, 'Tekst źródłowy nie może przekraczać 10000 znaków'),
  model: z.string()
    .refine(val => AVAILABLE_OLLAMA_MODELS.includes(val), {
      message: 'Wybrany model AI jest niedostępny'
    })
    .default(getDefaultModel())
})

// Tymczasowa funkcja uwierzytelniająca dla developmentu
const getUser = async (request: Request) => {
  // W przyszłości rozszerzymy to o pełne uwierzytelnianie JWT
  return { id: DEFAULT_USER_ID }
}

// Funkcja pomocnicza do formatowania błędów Zod
const formatZodErrors = (error: z.ZodError) => {
  return Object.entries(error.format())
    .filter(([key]) => key !== '_errors')
    .map(([field, errorDetails]) => {
      // Poprawne typowanie dla formattedError
      const formattedError = errorDetails as unknown as { _errors: string[] }
      return {
        field,
        message: formattedError._errors?.join(', ') || 'Błąd walidacji'
      }
    })
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. Uwierzytelnianie (tymczasowo uproszczone)
    const user = await getUser(request)

    // 2. Walidacja danych wejściowych z użyciem Zod
    let rawBody
    try {
      rawBody = await request.json()
    } catch (error) {
      return new Response(
        JSON.stringify(createErrorResponse('validation_error', 'Nieprawidłowy format JSON')),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const result = CreateGenerationSchema.safeParse(rawBody)
    if (!result.success) {
      const details = formatZodErrors(result.error)
      return new Response(
        JSON.stringify(
          createErrorResponse('validation_error', 'Nieprawidłowe dane wejściowe', details)
        ),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    const body = result.data

    // 3. Obliczenie hasha tekstu źródłowego
    const source_text_hash = crypto
      .createHash('sha256')
      .update(body.source_text)
      .digest('hex')

    // 4. Symulacja utworzenia nowego rekordu w tabeli generations
    // W rzeczywistym DB kliencie należy zaimplementować te operacje
    const generation = {
      id: Math.floor(Math.random() * 1000),
      user_id: user.id,
      status: 'processing',
      source_text_hash,
      source_text_length: body.source_text.length,
      model: body.model,
      generated_count: 0,
      accepted_unedited_count: 0,
      accepted_edited_count: 0,
      created_at: new Date().toISOString()
    }

    // 5. Uruchomienie procesu generacji w tle
    try {
      await enqueueFlashcardGeneration(
        generation.id,
        user.id,
        body.source_text,
        body.model
      )
      console.log(`Zadanie generowania fiszek dla generacji ID ${generation.id} dodane do kolejki (model: ${body.model})`)
    } catch (error) {
      console.error('Błąd podczas dodawania zadania do kolejki:', error)
      // Kontynuujemy, nawet jeśli wystąpił błąd - w rzeczywistej aplikacji
      // należałoby obsłużyć ten błąd i zaktualizować status generacji
    }

    // 6. Zwrócenie odpowiedzi
    return new Response(
      JSON.stringify({
        id: generation.id,
        status: generation.status,
        generated_count: generation.generated_count,
        source_text_hash: generation.source_text_hash,
        source_text_length: generation.source_text_length,
        created_at: generation.created_at,
        model: generation.model
      }),
      { 
        status: 202, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify(createErrorResponse('server_error', 'Błąd wewnętrzny serwera')),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
