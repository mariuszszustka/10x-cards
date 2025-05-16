import React, { useState } from "react";
import CreationModeToggle from "./CreationModeToggle";
import ManualFlashcardForm from "./ManualFlashcardForm";
import AIGenerationContainer from "./AIGenerationContainer";
import useToast from "@/lib/hooks/useToast";
import ToastNotifications from "@/components/flashcards/ToastNotifications";

// Interfejs dla danych z formularza tworzenia fiszki
interface FlashcardFormData {
  front: string;
  back: string;
}

/**
 * Enum dla trybów tworzenia fiszek
 */
export enum CreationMode {
  MANUAL = "manual",
  AI = "ai",
}

/**
 * Główny komponent widoku generowania fiszek
 */
export default function GenerateView() {
  // Stan dla aktualnego trybu tworzenia fiszek
  const [creationMode, setCreationMode] = useState<CreationMode>(CreationMode.MANUAL);
  // Stan do kontrolowania procesu zapisywania
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Hook do obsługi powiadomień
  const { toasts, success, error: showError, removeToast } = useToast();

  // Obsługa zmiany trybu
  const handleModeChange = (mode: CreationMode) => {
    setCreationMode(mode);
  };

  // Obsługa ręcznego tworzenia fiszki
  const handleManualSubmit = async (flashcard: FlashcardFormData): Promise<void> => {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flashcard),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Problem z zapisem fiszki");
      }

      await response.json();
      success("Fiszka została pomyślnie zapisana!");

      // Resetowanie formularza odbywa się w komponencie formularza
    } catch (error) {
      console.error("Błąd podczas zapisywania fiszki:", error);
      showError(error instanceof Error ? error.message : "Nie udało się zapisać fiszki. Spróbuj ponownie.");
      throw error; // Propagujemy błąd, aby formularz wiedział o niepowodzeniu
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Generowanie Fiszek</h1>

      {/* Przełącznik trybu tworzenia */}
      <div className="mb-8">
        <CreationModeToggle currentMode={creationMode} onChange={handleModeChange} />
      </div>

      {/* Renderowanie odpowiedniego formularza zależnie od trybu */}
      {creationMode === CreationMode.MANUAL ? (
        <ManualFlashcardForm onSubmit={handleManualSubmit} isSubmitting={isSubmitting} />
      ) : (
        <AIGenerationContainer />
      )}

      {/* Wyświetlanie powiadomień */}
      <ToastNotifications toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
