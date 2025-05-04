import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StateCreator } from 'zustand';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  source: 'manual' | 'imported' | 'ai';
  createdAt: string;
  lastReviewedAt?: string;
  reviewCount: number;
  status: 'new' | 'learning' | 'review' | 'archived';
}

type FlashcardFormData = {
  front: string;
  back: string;
  source: 'manual' | 'imported' | 'ai';
}

interface FlashcardState {
  flashcards: Flashcard[];
  isLoading: boolean;
  error: string | null;
  
  // Akcje
  addFlashcard: (data: FlashcardFormData) => void;
  updateFlashcard: (id: string, data: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  reviewFlashcard: (id: string, status: Flashcard['status']) => void;
  archiveFlashcard: (id: string) => void;
  resetError: () => void;
}

export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set: (fn: (state: FlashcardState) => Partial<FlashcardState>) => void, get: () => FlashcardState) => ({
      flashcards: [],
      isLoading: false,
      error: null,
      
      // Dodawanie nowej fiszki
      addFlashcard: (data: FlashcardFormData) => {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        
        const newFlashcard: Flashcard = {
          id,
          front: data.front,
          back: data.back,
          source: data.source,
          createdAt: now,
          reviewCount: 0,
          status: 'new'
        };
        
        set((state: FlashcardState) => ({
          flashcards: [...state.flashcards, newFlashcard]
        }));
      },
      
      // Aktualizacja istniejącej fiszki
      updateFlashcard: (id: string, data: Partial<Flashcard>) => {
        set((state: FlashcardState) => ({
          flashcards: state.flashcards.map((f: Flashcard) => 
            f.id === id ? { ...f, ...data } : f
          )
        }));
      },
      
      // Usunięcie fiszki
      deleteFlashcard: (id: string) => {
        set((state: FlashcardState) => ({
          flashcards: state.flashcards.filter((f: Flashcard) => f.id !== id)
        }));
      },
      
      // Oznaczenie fiszki jako przejrzanej
      reviewFlashcard: (id: string, status: Flashcard['status']) => {
        const now = new Date().toISOString();
        
        set((state: FlashcardState) => ({
          flashcards: state.flashcards.map((f: Flashcard) => 
            f.id === id 
              ? { 
                  ...f, 
                  lastReviewedAt: now, 
                  reviewCount: f.reviewCount + 1,
                  status
                } 
              : f
          )
        }));
      },
      
      // Przeniesienie fiszki do archiwum
      archiveFlashcard: (id: string) => {
        set((state: FlashcardState) => ({
          flashcards: state.flashcards.map((f: Flashcard) => 
            f.id === id ? { ...f, status: 'archived' } : f
          )
        }));
      },
      
      // Reset błędu
      resetError: () => set((state: FlashcardState) => ({ error: null }))
    }),
    {
      name: 'flashcards-storage', // Nazwa w local storage
      partialize: (state: FlashcardState) => ({
        flashcards: state.flashcards, // Zapisujemy tylko dane fiszek
      })
    }
  )
); 