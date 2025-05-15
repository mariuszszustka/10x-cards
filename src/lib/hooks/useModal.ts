import { useState, useCallback } from "react";

/**
 * Hook do zarządzania stanem modala usuwania fiszki
 */
export default function useModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [flashcardId, setFlashcardId] = useState<number | null>(null);
  const [flashcardFront, setFlashcardFront] = useState<string>("");

  /**
   * Otwieranie modala z danymi fiszki
   */
  const openModal = useCallback((id: number, front: string) => {
    setFlashcardId(id);
    setFlashcardFront(front);
    setIsOpen(true);
  }, []);

  /**
   * Zamykanie modala
   */
  const closeModal = useCallback(() => {
    setIsOpen(false);

    // Resetowanie danych z opóźnieniem, żeby nie znikały podczas animacji zamykania
    setTimeout(() => {
      setFlashcardId(null);
      setFlashcardFront("");
    }, 300); // 300ms to typowy czas animacji zamykania modala
  }, []);

  return {
    isOpen,
    flashcardId,
    flashcardFront,
    openModal,
    closeModal,
  };
}
