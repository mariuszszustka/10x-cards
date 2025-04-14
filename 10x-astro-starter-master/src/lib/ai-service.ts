/**
 * Serwis AI do generowania fiszek
 * 
 * Ten plik zawiera funkcje do komunikacji z modelami AI w celu generowania fiszek
 * na podstawie tekstu źródłowego.
 */

// Typy danych
export interface GeneratedFlashcard {
  front: string;
  back: string;
}

// Konfiguracja serwera Ollama
const OLLAMA_SERVER_URL = 'http://192.168.0.11:11434/api/generate'

// Dostępne modele Ollama
export const AVAILABLE_OLLAMA_MODELS = [
  'gemma3:27b',
  'llama3.2:3b',
  'deepseek-r1:32b',
  'llama3.3:latest'
]

// Funkcja do wyboru domyślnego modelu
export function getDefaultModel(): string {
  return 'llama3.2:3b' // Mniejszy model jako domyślny dla szybszego działania
}

// Instrukcja dla modelu AI do generowania fiszek
const FLASHCARD_GENERATION_PROMPT = `
Wygeneruj fiszki edukacyjne na podstawie podanego tekstu. 
Każda fiszka powinna zawierać pytanie (front) i odpowiedź (back).
Pytanie powinno być zwięzłe i skupiać się na kluczowych pojęciach lub informacjach z tekstu.
Odpowiedź powinna być dokładna, ale nie przekraczać 2-3 zdań.
Fiszki powinny pokrywać najważniejsze informacje z tekstu.

Wygeneruj maksymalnie 10 fiszek.

Format odpowiedzi musi być ściśle w formacie JSON:
[
  {
    "front": "Pytanie 1?",
    "back": "Odpowiedź 1"
  },
  {
    "front": "Pytanie 2?",
    "back": "Odpowiedź 2"
  }
]

Tekst źródłowy:
{{SOURCE_TEXT}}
`;

/**
 * Wywołuje API Ollama do generowania tekstu
 * 
 * @param prompt - Instrukcja dla modelu
 * @param model - Nazwa modelu Ollama do wykorzystania
 * @returns Odpowiedź modelu jako string
 */
async function callOllamaAPI(prompt: string, model: string): Promise<string> {
  try {
    const response = await fetch(OLLAMA_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          top_k: 40
        }
      }),
    })

    if (!response.ok) {
      throw new Error(`Błąd API Ollama: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.response
  } catch (error) {
    console.error('Błąd podczas wywoływania API Ollama:', error)
    throw error
  }
}

/**
 * Generuje fiszki na podstawie tekstu źródłowego
 * 
 * @param sourceText - Tekst źródłowy do analizy
 * @param model - Model Ollama do wykorzystania
 * @returns Tablica wygenerowanych fiszek
 */
export async function generateFlashcards(
  sourceText: string,
  model: string
): Promise<GeneratedFlashcard[]> {
  console.log(`Generowanie fiszek dla tekstu o długości ${sourceText.length} znaków przy użyciu modelu ${model}`)
  
  try {
    // Utwórz instrukcję ze źródłowym tekstem
    const prompt = FLASHCARD_GENERATION_PROMPT.replace('{{SOURCE_TEXT}}', sourceText)
    
    // Wywołaj API Ollama
    const responseText = await callOllamaAPI(prompt, model)
    
    // Wyodrębnij JSON z odpowiedzi
    const jsonMatch = responseText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.error('Nie udało się znaleźć prawidłowego JSON w odpowiedzi:', responseText)
      return parseDefaultFlashcards(sourceText)
    }
    
    // Parsowanie JSON do tablicy fiszek
    try {
      const rawFlashcards = JSON.parse(jsonMatch[0])
      const formattedFlashcards = formatFlashcards(rawFlashcards)
      console.log(`Wygenerowano ${formattedFlashcards.length} fiszek`)
      return formattedFlashcards
    } catch (parseError) {
      console.error('Błąd parsowania JSON:', parseError)
      return parseDefaultFlashcards(sourceText)
    }
  } catch (error) {
    console.error('Błąd generowania fiszek:', error)
    // W przypadku błędu generujemy podstawowe fiszki
    return parseDefaultFlashcards(sourceText)
  }
}

/**
 * Generuje domyślne fiszki w przypadku błędu
 */
function parseDefaultFlashcards(sourceText: string): GeneratedFlashcard[] {
  const numberOfFlashcards = Math.min(Math.ceil(sourceText.length / 500), 10)
  
  return Array.from({ length: numberOfFlashcards }, (_, i) => ({
    front: `Przykładowe pytanie ${i + 1} z tekstu?`,
    back: `Przykładowa odpowiedź ${i + 1} zawierająca informacje z tekstu źródłowego.`
  }))
}

/**
 * Formatuje wygenerowane fiszki do standardowego formatu
 * 
 * @param rawFlashcards - Surowe dane fiszek z API
 * @returns Sformatowane fiszki
 */
export function formatFlashcards(rawFlashcards: any[]): GeneratedFlashcard[] {
  if (!Array.isArray(rawFlashcards)) {
    console.error('Nieprawidłowy format danych fiszek:', rawFlashcards)
    return []
  }
  
  return rawFlashcards
    .filter(card => typeof card === 'object' && card !== null && 'front' in card && 'back' in card)
    .map(card => ({
      front: String(card.front || 'Brak pytania').trim(),
      back: String(card.back || 'Brak odpowiedzi').trim()
    }))
    .filter(card => card.front.length > 0 && card.back.length > 0)
}

/**
 * Dzieli długi tekst na mniejsze fragmenty dla lepszego przetwarzania przez API
 * 
 * @param text - Tekst do podziału
 * @param maxChunkSize - Maksymalny rozmiar fragmentu
 * @returns Tablica fragmentów tekstu
 */
export function splitTextIntoChunks(text: string, maxChunkSize: number = 4000): string[] {
  const chunks: string[] = []
  
  // Podział na akapity
  const paragraphs = text.split(/\n\s*\n/)
  let currentChunk = ''
  
  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length + 2 > maxChunkSize) {
      chunks.push(currentChunk)
      currentChunk = paragraph
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk)
  }
  
  return chunks
}

/**
 * Analizuje tekst i wyodrębnia kluczowe pojęcia do utworzenia fiszek
 * 
 * @param text - Tekst do analizy
 * @returns Tablica kluczowych pojęć
 */
export function extractKeyTerms(text: string): string[] {
  // W rzeczywistej implementacji, tutaj byłaby analiza tekstu
  // Dla uproszczenia zwracamy przykładowe pojęcia
  
  const terms = [
    'Przykładowe pojęcie 1',
    'Przykładowe pojęcie 2',
    'Przykładowe pojęcie 3'
  ];
  
  return terms;
} 