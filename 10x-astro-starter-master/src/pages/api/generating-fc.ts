import type { APIRoute } from 'astro'
import { createClient } from '@/db/client'
import { verifyJWT } from '@/lib/auth'
import { 
  createErrorResponse, 
  type CreateGenerationDTO, 
  type GenerationStatusDTO, 
  type AcceptGeneratedFlashcardsDTO,
  type AcceptGeneratedFlashcardsResponseDTO,
  validateFrontText,
  validateBackText
} from '@/types'
import crypto from 'crypto'

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    // 1. Ekstrakcja i weryfikacja tokenu JWT
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify(createErrorResponse('unauthorized', 'Brak autoryzacji')),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    const token = authHeader.split(' ')[1]
    const user = await verifyJWT(token)
    if (!user) {
      return new Response(
        JSON.stringify(createErrorResponse('unauthorized', 'Nieprawidłowy token')),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 2. Pobranie parametru id z URL
    const id = params.id
    if (!id || isNaN(Number(id))) {
      return new Response(
        JSON.stringify(createErrorResponse('validation_error', 'Nieprawidłowy identyfikator generacji')),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 3. Sprawdzenie czy generacja istnieje i należy do użytkownika
    const db = createClient()
    const { data: generation, error: generationError } = await db
      .from('generations')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (generationError || !generation) {
      return new Response(
        JSON.stringify(createErrorResponse('not_found', 'Generacja nie została znaleziona')),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 4. Walidacja danych wejściowych
    let body: AcceptGeneratedFlashcardsDTO
    try {
      body = await request.json()
    } catch (error) {
      return new Response(
        JSON.stringify(createErrorResponse('validation_error', 'Nieprawidłowy format JSON')),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Sprawdzenie czy flashcards jest tablicą i nie jest pusta
    if (!body.flashcards || !Array.isArray(body.flashcards) || body.flashcards.length === 0) {
      return new Response(
        JSON.stringify(
          createErrorResponse('validation_error', 'Lista fiszek jest wymagana i nie może być pusta')
        ),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 5. Walidacja tekstów fiszek
    const validationErrors = []
    const validatedFlashcards = []

    for (let i = 0; i < body.flashcards.length; i++) {
      const flashcard = body.flashcards[i]
      try {
        // Walidacja frontu
        const validatedFront = validateFrontText(flashcard.front)
        // Walidacja tyłu
        const validatedBack = validateBackText(flashcard.back)
        
        validatedFlashcards.push({
          ...flashcard,
          front: validatedFront,
          back: validatedBack
        })
      } catch (error) {
        validationErrors.push({
          field: `flashcards[${i}]`,
          message: error instanceof Error ? error.message : 'Błąd walidacji'
        })
      }
    }

    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify(
          createErrorResponse('validation_error', 'Walidacja fiszek nie powiodła się', validationErrors)
        ),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 6. Zapisanie zaakceptowanych fiszek
    const flashcardsToInsert = validatedFlashcards.map(flashcard => ({
      user_id: user.id,
      front: flashcard.front,
      back: flashcard.back,
      source: flashcard.edited ? 'ai-edited' : 'ai-full',
      generation_id: Number(id)
    }))

    const { data: insertedFlashcards, error: insertError } = await db
      .from('flashcards')
      .insert(flashcardsToInsert)
      .select('id, front, back, source')

    if (insertError) {
      console.error('Database error:', insertError)
      return new Response(
        JSON.stringify(createErrorResponse('server_error', 'Błąd podczas zapisywania fiszek')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 7. Aktualizacja liczników w tabeli generations
    const editedCount = validatedFlashcards.filter(f => f.edited).length
    const uneditedCount = validatedFlashcards.length - editedCount

    const { error: updateError } = await db
      .from('generations')
      .update({
        accepted_edited_count: generation.accepted_edited_count + editedCount,
        accepted_unedited_count: generation.accepted_unedited_count + uneditedCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (updateError) {
      console.error('Database error:', updateError)
      // Kontynuujemy, mimo błędu aktualizacji liczników
    }

    // 8. Przygotowanie odpowiedzi
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
    // 1. Ekstrakcja i weryfikacja tokenu JWT
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify(createErrorResponse('unauthorized', 'Brak autoryzacji')),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    const token = authHeader.split(' ')[1]
    const user = await verifyJWT(token)
    if (!user) {
      return new Response(
        JSON.stringify(createErrorResponse('unauthorized', 'Nieprawidłowy token')),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 2. Pobranie parametru id z URL
    const id = params.id
    if (!id || isNaN(Number(id))) {
      return new Response(
        JSON.stringify(createErrorResponse('validation_error', 'Nieprawidłowy identyfikator generacji')),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 3. Sprawdzenie czy generacja istnieje i należy do użytkownika
    const db = createClient()
    const { data: generation, error: generationError } = await db
      .from('generations')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (generationError || !generation) {
      return new Response(
        JSON.stringify(createErrorResponse('not_found', 'Generacja nie została znaleziona')),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 4. Pobranie wygenerowanych fiszek
    const { data: flashcards, error: flashcardsError } = await db
      .from('generated_flashcards')
      .select('id, front, back')
      .eq('generation_id', id)
      .order('id', { ascending: true })

    if (flashcardsError) {
      console.error('Database error:', flashcardsError)
      return new Response(
        JSON.stringify(createErrorResponse('server_error', 'Błąd podczas pobierania fiszek')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 5. Przygotowanie odpowiedzi
    const response: GenerationStatusDTO = {
      id: generation.id,
      status: generation.status as 'processing' | 'completed' | 'error',
      generated_count: generation.generated_count,
      accepted_unedited_count: generation.accepted_unedited_count,
      accepted_edited_count: generation.accepted_edited_count,
      source_text_hash: generation.source_text_hash,
      source_text_length: generation.source_text_length,
      created_at: generation.created_at,
      updated_at: generation.updated_at,
      generation_duration: generation.generation_duration,
      model: generation.model,
      flashcards: flashcards.map(card => ({
        id: card.id,
        front: card.front,
        back: card.back,
        source: 'ai-full'
      }))
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
    // 1. Ekstrakcja i weryfikacja tokenu JWT
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify(createErrorResponse('unauthorized', 'Brak autoryzacji')),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    const token = authHeader.split(' ')[1]
    const user = await verifyJWT(token)
    if (!user) {
      return new Response(
        JSON.stringify(createErrorResponse('unauthorized', 'Nieprawidłowy token')),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 2. Walidacja danych wejściowych
    let body: CreateGenerationDTO
    try {
      body = await request.json()
    } catch (error) {
      return new Response(
        JSON.stringify(createErrorResponse('validation_error', 'Nieprawidłowy format JSON')),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { source_text, model } = body
    
    // Walidacja długości tekstu źródłowego
    if (!source_text || source_text.length < 1000 || source_text.length > 10000) {
      return new Response(
        JSON.stringify(
          createErrorResponse('validation_error', 'Tekst źródłowy musi zawierać od 1000 do 10000 znaków')
        ),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Walidacja dostępności modelu (tutaj przykładowa implementacja)
    const availableModels = ['gpt-4', 'gpt-3.5-turbo']
    if (!model || !availableModels.includes(model)) {
      return new Response(
        JSON.stringify(
          createErrorResponse('validation_error', 'Wybrany model AI jest niedostępny')
        ),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 3. Obliczenie hasha tekstu źródłowego
    const source_text_hash = crypto
      .createHash('sha256')
      .update(source_text)
      .digest('hex')

    // 4. Utworzenie nowego rekordu w tabeli generations
    const db = createClient()
    const { data: generation, error } = await db
      .from('generations')
      .insert({
        user_id: user.id,
        status: 'processing',
        source_text_hash,
        source_text_length: source_text.length,
        model,
        generated_count: 0,
        accepted_unedited_count: 0,
        accepted_edited_count: 0
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify(createErrorResponse('server_error', 'Błąd podczas tworzenia generacji')),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 5. Uruchomienie procesu generacji w tle (to będzie zaimplementowane później)
    // TODO: Dodać implementację kolejki zadań dla asynchronicznego przetwarzania

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
