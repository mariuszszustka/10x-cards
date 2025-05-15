import { generateFlashcards, splitTextIntoChunks, type GeneratedFlashcard } from "./ai-service";
import crypto from "crypto";

// Typy dla mechanizmu kolejki zadań
interface QueueTask {
  id: string;
  type: "generate_flashcards";
  data: GenerateFlashcardsTask;
  createdAt: Date;
  status: "pending" | "processing" | "completed" | "failed";
}

interface GenerateFlashcardsTask {
  generationId: number;
  userId: string;
  sourceText: string;
  model: string;
}

// Tymczasowa implementacja kolejki zadań w pamięci
// W rzeczywistej aplikacji należy użyć dedykowanego rozwiązania jak Redis, RabbitMQ, itp.
class InMemoryQueue {
  private tasks: QueueTask[] = [];
  private processing = false;

  constructor() {
    // Inicjalizacja kolejki
    console.log("Inicjalizacja kolejki zadań");
  }

  // Dodanie zadania do kolejki
  async enqueue(task: Omit<QueueTask, "id" | "createdAt" | "status">): Promise<string> {
    const id = crypto.randomUUID();

    this.tasks.push({
      ...task,
      id,
      createdAt: new Date(),
      status: "pending",
    });

    // Uruchomienie przetwarzania kolejki jeśli nie jest aktualnie uruchomione
    if (!this.processing) {
      this.processQueue();
    }

    return id;
  }

  // Pobieranie statusu zadania
  getTaskStatus(id: string): QueueTask | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  // Przetwarzanie kolejki zadań
  private async processQueue() {
    if (this.processing || this.tasks.length === 0) {
      return;
    }

    this.processing = true;

    try {
      // Pobranie pierwszego zadania z kolejki
      const task = this.tasks.find((t) => t.status === "pending");
      if (!task) {
        this.processing = false;
        return;
      }

      // Aktualizacja statusu zadania
      task.status = "processing";

      // Przetwarzanie zadania w zależności od typu
      if (task.type === "generate_flashcards") {
        await this.processGenerateFlashcardsTask(task.data);
      }

      // Oznaczenie zadania jako zakończone
      task.status = "completed";
    } catch (error) {
      console.error("Queue processing error:", error);
      // W przypadku błędu oznaczamy aktualne zadanie jako zakończone niepowodzeniem
      const currentTask = this.tasks.find((t) => t.status === "processing");
      if (currentTask) {
        currentTask.status = "failed";
      }
    } finally {
      this.processing = false;
      // Kontynuacja przetwarzania kolejki jeśli są jeszcze zadania
      if (this.tasks.some((t) => t.status === "pending")) {
        this.processQueue();
      }
    }
  }

  // Przetwarzanie zadania generowania fiszek
  private async processGenerateFlashcardsTask(task: GenerateFlashcardsTask) {
    console.log(`Rozpoczęcie generowania fiszek dla tekstu o długości ${task.sourceText.length} znaków`);

    try {
      // Podział na fragmenty, jeśli tekst jest zbyt długi
      const chunks = splitTextIntoChunks(task.sourceText);
      let generatedFlashcards: GeneratedFlashcard[] = [];

      // Generowanie fiszek dla każdego fragmentu
      for (const chunk of chunks) {
        const chunkFlashcards = await generateFlashcards(chunk, task.model);
        generatedFlashcards = [...generatedFlashcards, ...chunkFlashcards];
      }

      // Symulacja zapisania wygenerowanych fiszek w bazie danych
      // W rzeczywistej aplikacji należy zaimplementować komunikację z bazą danych
      console.log(`Wygenerowano ${generatedFlashcards.length} fiszek`);

      // Przygotowanie danych do zapisania w bazie
      const flashcardsToSave = generatedFlashcards.map((card) => ({
        generation_id: task.generationId,
        user_id: task.userId,
        front: card.front,
        back: card.back,
      }));

      // Symulacja aktualizacji statusu generacji
      console.log(`Aktualizacja statusu generacji ${task.generationId} na 'completed'`);
      // Aktualizacja statusu generacji
      // W rzeczywistej aplikacji należy zaktualizować rekord w bazie danych
      // db.from('generations')
      //   .update({
      //     status: 'completed',
      //     generated_count: flashcardsToSave.length,
      //     generation_duration: Date.now() - startTime,
      //     updated_at: new Date().toISOString()
      //   })
      //   .eq('id', task.generationId)

      // Zwróć wygenerowane fiszki
      return flashcardsToSave;
    } catch (error) {
      console.error("Błąd generowania fiszek:", error);
      // Aktualizacja statusu generacji na 'error'
      // W rzeczywistej aplikacji należy zaktualizować rekord w bazie danych
      // db.from('generations')
      //   .update({
      //     status: 'error',
      //     updated_at: new Date().toISOString()
      //   })
      //   .eq('id', task.generationId)
      throw error;
    }
  }
}

// Singleton instancja kolejki
export const taskQueue = new InMemoryQueue();

// Funkcja pomocnicza do dodawania zadania generowania fiszek
export const enqueueFlashcardGeneration = async (
  generationId: number,
  userId: string,
  sourceText: string,
  model: string
): Promise<string> => {
  return taskQueue.enqueue({
    type: "generate_flashcards",
    data: {
      generationId,
      userId,
      sourceText,
      model,
    },
  });
};
