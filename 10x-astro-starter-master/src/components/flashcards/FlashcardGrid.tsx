import React from 'react';
import FlashcardItem from './FlashcardItem';
import EditableFlashcard from './EditableFlashcard';
import type { FlashcardDTO } from '@/types';

interface FlashcardGridProps {
  flashcards: FlashcardDTO[];
  onEdit: (id: number) => void;
  onDelete: (id: number, front: string) => void;
  onUpdate: (id: number, data: { front: string; back: string }) => void;
  onCancelEdit: () => void;
  editingCardId: number | null;
  isLoading: boolean;
}

/**
 * Komponent siatki fiszek
 */
export default function FlashcardGrid({
  flashcards,
  onEdit,
  onDelete,
  onUpdate,
  onCancelEdit,
  editingCardId,
  isLoading
}: FlashcardGridProps) {
  // Wyświetlanie informacji o ładowaniu
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Ładowanie fiszek...</p>
        </div>
      </div>
    );
  }
  
  // Wyświetlanie informacji o braku fiszek
  if (flashcards.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <h3 className="text-lg font-medium mb-2">Brak fiszek</h3>
        <p className="text-muted-foreground mb-6">
          Nie znaleziono żadnych fiszek spełniających kryteria.
        </p>
        <p className="text-sm text-muted-foreground">
          Spróbuj zmienić kryteria wyszukiwania lub dodaj nowe fiszki.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {flashcards.map(flashcard => (
        <div key={flashcard.id}>
          {editingCardId === flashcard.id ? (
            <EditableFlashcard
              flashcard={flashcard}
              onSave={(data: { front: string; back: string }) => onUpdate(flashcard.id, data)}
              onCancel={onCancelEdit}
            />
          ) : (
            <FlashcardItem
              flashcard={flashcard}
              onEdit={() => onEdit(flashcard.id)}
              onDelete={() => onDelete(flashcard.id, flashcard.front)}
            />
          )}
        </div>
      ))}
    </div>
  );
} 