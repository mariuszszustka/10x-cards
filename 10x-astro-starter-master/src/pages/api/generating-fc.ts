import type { APIRoute } from 'astro'
import { z } from 'zod'
import { createErrorResponse, type CreateGenerationDTO, type GenerationStatusDTO, type AcceptGeneratedFlashcardsDTO, type AcceptGeneratedFlashcardsResponseDTO } from '@/types'
import crypto from 'crypto'
import { enqueueFlashcardGeneration } from '@/lib/queue'

// Tymczasowe rozwiązanie dla uwierzytelniania podczas developmentu
const DEFAULT_USER_ID = '123e4567-e89b-12d3-a456-426614174000'

// Schematy walidacji Zod
const CreateGenerationSchema = z.object({
  source_text: z.string()
    .min(1000, 'Tekst źródłowy musi zawierać co najmniej 1000 znaków')
    .max(10000, 'Tekst źródłowy nie może przekraczać 10000 znaków'),
  model: z.enum(['gpt-4', 'gpt-3.5-turbo'], {
    errorMap: () => ({ message: 'Wybrany model AI jest niedostępny' })
  })
})

const AcceptFlashcardSchema = z.object({
  id: z.number(),
  front: z.string().max(200, 'Tekst przedni nie może przekraczać 200 znaków'),
  back: z.string().max(500, 'Tekst tylny nie może przekraczać 500 znaków'),
  edited: z.boolean()
})

const AcceptFlashcardsSchema = z.object({
  flashcards: z.array(AcceptFlashcardSchema)
    .min(1, 'Lista fiszek nie może być pusta')
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
      const formattedError = errorDetails as z.ZodFormattedError<any>;
      return {
        field,
        message: formattedError._errors?.join(', ') || 'Błąd walidacji'
      }
    })
}

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    // 1. Uwierzytelnianie (tymczasowo uproszczone)
    const user = await getUser(request)
    
    // 2. Pobranie parametru id z URL
    const id = params.id
    if (!id || isNaN(Number(id))) {
      return new Response(
        JSON.stringify(createErrorResponse('validation_error', 'Nieprawidłowy identyfikator generacji')),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 3. Sprawdzenie czy generacja istnieje i należy do użytkownika
    // W rzeczywistym DB kliencie należy zaimplementować te operacje
    // const db = createClient()
    // Symulacja odpowiedzi bazy danych dla etapu rozwoju
    const generation = {
      id: Number(id),
      user_id: user.id,
      status: 'completed',
      generated_count: 10,
      accepted_unedited_count: 0,
      accepted_edited_count: 0,
      source_text_hash: 'sample_hash',
      source_text_length: 2000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      generation_duration: 120,
      model: 'gpt-4'
    }

    // 4. Walidacja danych wejściowych z użyciem Zod
    let rawBody
    try {
      rawBody = await request.json()
    } catch (error) {
      return new Response(
        JSON.stringify(createErrorResponse('validation_error', 'Nieprawidłowy format JSON')),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const result = AcceptFlashcardsSchema.safeParse(rawBody)
    if (!result.success) {
      const details = formatZodErrors(result.error)
      return new Response(
        JSON.stringify(
          createErrorResponse('validation_error', 'Walidacja fiszek nie powiodła się', details)
        ),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Traktuję zwalidowane dane jako dane walidacyjne - w rzeczywistej aplikacji
    // trzeba by dodatkowo przekształcić zwykłe stringi na ValidatedFrontText i ValidatedBackText
    const body = result.data as unknown as AcceptGeneratedFlashcardsDTO

    // 5. Symulacja zapisania zaakceptowanych fiszek
    const flashcardsToInsert = body.flashcards.map(flashcard => ({
      user_id: user.id,
      front: flashcard.front,
      back: flashcard.back,
      source: flashcard.edited ? 'ai-edited' : 'ai-full',
      generation_id: Number(id)
    }))

    // Symulacja odpowiedzi z bazy danych
    const insertedFlashcards = flashcardsToInsert.map((f, index) => ({
      id: 1000 + index,
      front: f.front,
      back: f.back,
      source: f.source as 'ai-edited' | 'ai-full'
    }))

    // 6. Aktualizacja liczników w tabeli generations
    const editedCount = body.flashcards.filter(f => f.edited).length
    const uneditedCount = body.flashcards.length - editedCount

    // 7. Przygotowanie odpowiedzi
    const response: AcceptGeneratedFlashcardsResponseDTO = {
      accepted_count: insertedFlashcards.length,
      flashcards: insertedFlashcards
    }

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify(createErrorResponse('server_error', 'Błąd wewnętrzny serwera')),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export const GET: APIRoute = async ({ params, request }) => {
  try {
    // 1. Uwierzytelnianie (tymczasowo uproszczone)
    const user = await getUser(request)
    
    // 2. Pobranie parametru id z URL
    const id = params.id
    if (!id || isNaN(Number(id))) {
      return new Response(
        JSON.stringify(createErrorResponse('validation_error', 'Nieprawidłowy identyfikator generacji')),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 3. Symulacja sprawdzenia czy generacja istnieje i należy do użytkownika
    // W rzeczywistym DB kliencie należy zaimplementować te operacje
    // Symulacja odpowiedzi bazy danych dla etapu rozwoju
    const generation = {
      id: Number(id),
      user_id: user.id,
      status: 'completed' as const,
      generated_count: 10,
      accepted_unedited_count: 0,
      accepted_edited_count: 0,
      source_text_hash: 'sample_hash',
      source_text_length: 2000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      generation_duration: 120,
      model: 'gpt-4'
    }

    // 4. Symulacja pobrania wygenerowanych fiszek
    const flashcards = Array.from({ length: 10 }, (_, i) => ({
      id: 1000 + i,
      front: `Przykładowa fiszka ${i + 1} - przód`,
      back: `Przykładowa fiszka ${i + 1} - tył`
    }))

    // 5. Przygotowanie odpowiedzi
    const response: GenerationStatusDTO = {
      id: generation.id,
      status: generation.status,
      generated_count: generation.generated_count,
      accepted_unedited_count: generation.accepted_unedited_count,
      accepted_edited_count: generation.accepted_edited_count,
      source_text_hash: generation.source_text_hash,
      source_text_length: generation.source_text_length,
      created_at: generation.created_at,
      updated_at: generation.updated_at,
      generation_duration: generation.generation_duration,
      model: generation.model,
      flashcards: flashcards.map((card) => ({
        id: card.id,
        front: card.front,
        back: card.back,
        source: 'ai-full'
      })) as any // Uproszczenie ze względu na etap dev - w rzeczywistej aplikacji należy poprawnie typować
    }

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify(createErrorResponse('server_error', 'Błąd wewnętrzny serwera')),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
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
      console.log(`Zadanie generowania fiszek dla generacji ID ${generation.id} dodane do kolejki`)
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
        created_at: generation.created_at
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
