/**
 * Serwis AI do generowania fiszek
 * 
 * Ten plik zawiera funkcje do komunikacji z modelami AI w celu generowania fiszek
 * na podstawie tekstu źródłowego.
 */

// Typy danych
interface GeneratedFlashcard {
  front: string;
  back: string;
}

// Przykładowa instrukcja dla modelu AI
const FLASHCARD_GENERATION_PROMPT = `
Wygeneruj fiszki edukacyjne na podstawie podanego tekstu. 
Każda fiszka powinna zawierać pytanie (front) i odpowiedź (back).
Pytanie powinno być zwięzłe i skupiać się na kluczowych pojęciach lub informacjach z tekstu.
Odpowiedź powinna być dokładna, ale nie przekraczać 2-3 zdań.
Fiszki powinny pokrywać najważniejsze informacje z tekstu.

Format odpowiedzi:
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
 * Generuje fiszki na podstawie tekstu źródłowego
 * 
 * @param sourceText - Tekst źródłowy do analizy
 * @param model - Model AI do wykorzystania (np. 'gpt-4', 'gpt-3.5-turbo')
 * @returns Tablica wygenerowanych fiszek
 */
export async function generateFlashcards(
  sourceText: string,
  model: string
): Promise<GeneratedFlashcard[]> {
  // W rzeczywistej implementacji, tutaj byłoby wywołanie API OpenAI lub innego serwisu AI
  
  console.log(`Generowanie fiszek dla tekstu o długości ${sourceText.length} znaków przy użyciu modelu ${model}`);
  
  // Symulacja czasu przetwarzania
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // W rzeczywistej implementacji, zwrócone dane pochodziłyby z odpowiedzi API
  // Tu dla uproszczenia generujemy przykładowe fiszki
  const numberOfFlashcards = Math.min(Math.ceil(sourceText.length / 500), 20);
  
  const generatedFlashcards: GeneratedFlashcard[] = [];
  
  for (let i = 0; i < numberOfFlashcards; i++) {
    generatedFlashcards.push({
      front: `Przykładowe pytanie ${i + 1} z tekstu?`,
      back: `Przykładowa odpowiedź ${i + 1} zawierająca informacje z tekstu źródłowego.`
    });
  }
  
  console.log(`Wygenerowano ${generatedFlashcards.length} fiszek`);
  
  return generatedFlashcards;
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

/**
 * Formatuje wygenerowane fiszki do standardowego formatu
 * 
 * @param rawFlashcards - Surowe dane fiszek z API
 * @returns Sformatowane fiszki
 */
export function formatFlashcards(rawFlashcards: any[]): GeneratedFlashcard[] {
  // W rzeczywistej implementacji, tutaj byłoby formatowanie odpowiedzi z API
  // Dla uproszczenia, zakładamy że dane są już w odpowiednim formacie
  
  return rawFlashcards.map(card => ({
    front: card.front || 'Brak pytania',
    back: card.back || 'Brak odpowiedzi'
  }));
}

/**
 * Dzieli długi tekst na mniejsze fragmenty dla lepszego przetwarzania przez API
 * 
 * @param text - Tekst do podziału
 * @param maxChunkSize - Maksymalny rozmiar fragmentu
 * @returns Tablica fragmentów tekstu
 */
export function splitTextIntoChunks(text: string, maxChunkSize: number = 4000): string[] {
  const chunks: string[] = [];
  
  // Podział na akapity
  const paragraphs = text.split(/\n\s*\n/);
  let currentChunk = '';
  
  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length + 2 > maxChunkSize) {
      chunks.push(currentChunk);
      currentChunk = paragraph;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk);
  }
  
  return chunks;
} 