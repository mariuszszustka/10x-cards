import { useState, useEffect, useCallback } from 'react';
import type { 
  FlashcardDTO, 
  FlashcardListResponseDTO,
  FlashcardFilters,
  CreateFlashcardDTO,
  UpdateFlashcardDTO
} from '@/types';

export type SortField = 'created_at' | 'updated_at' | 'front';
export type SortDirection = 'asc' | 'desc';

export interface SortOptions {
  field: SortField;
  direction: SortDirection;
}

export interface SearchParams extends FlashcardFilters {
  sort_by?: SortField;
  sort_dir?: SortDirection;
}

interface FlashcardsState {
  flashcards: FlashcardDTO[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

const initialPagination = {
  total: 0,
  page: 1,
  per_page: 20,
  total_pages: 1
};

/**
 * Hook do zarządzania stanem fiszek, ich pobieraniem, tworzeniem, aktualizacją i usuwaniem
 */
export default function useFlashcards(initialParams: SearchParams) {
  const [state, setState] = useState<FlashcardsState>({
    flashcards: [],
    loading: true,
    error: null,
    pagination: initialPagination
  });

  const [params, setParams] = useState<SearchParams>(initialParams);

  /**
   * Pobieranie fiszek z API
   */
  const fetchFlashcards = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const queryParams = new URLSearchParams();
      
      // Dodanie parametrów do zapytania
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
      
      const response = await fetch(`/api/management-fc?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Problem z pobieraniem fiszek');
      }
      
      const data: FlashcardListResponseDTO = await response.json();
      
      setState({
        flashcards: data.items,
        loading: false,
        error: null,
        pagination: {
          total: data.total,
          page: data.page,
          per_page: data.per_page,
          total_pages: data.total_pages
        }
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Nieznany błąd podczas pobierania fiszek'
      }));
    }
  }, [params]);

  /**
   * Tworzenie nowej fiszki
   */
  const createFlashcard = async (newCard: Omit<CreateFlashcardDTO, 'front' | 'back'> & { front: string, back: string }) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch('/api/management-fc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCard)
      });
      
      if (!response.ok) {
        throw new Error('Problem z utworzeniem fiszki');
      }
      
      const data: FlashcardDTO = await response.json();
      
      // Odświeżenie listy fiszek po utworzeniu
      fetchFlashcards();
      
      return data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Nieznany błąd podczas tworzenia fiszki'
      }));
      throw error;
    }
  };

  /**
   * Aktualizacja fiszki
   */
  const updateFlashcard = async (id: number, updates: Omit<UpdateFlashcardDTO, 'front' | 'back'> & { front: string, back: string }) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`/api/management-fc/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error('Problem z aktualizacją fiszki');
      }
      
      const data: FlashcardDTO = await response.json();
      
      // Aktualizacja fiszki w stanie lokalnym
      setState(prev => ({
        ...prev,
        loading: false,
        flashcards: prev.flashcards.map(f => f.id === id ? data : f)
      }));
      
      return data;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Nieznany błąd podczas aktualizacji fiszki'
      }));
      throw error;
    }
  };

  /**
   * Usuwanie fiszki
   */
  const deleteFlashcard = async (id: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(`/api/management-fc/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Problem z usunięciem fiszki');
      }
      
      // Usunięcie fiszki ze stanu lokalnego
      setState(prev => ({
        ...prev,
        loading: false,
        flashcards: prev.flashcards.filter(f => f.id !== id),
        pagination: {
          ...prev.pagination,
          total: Math.max(0, prev.pagination.total - 1)
        }
      }));
      
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Nieznany błąd podczas usuwania fiszki'
      }));
      throw error;
    }
  };

  /**
   * Zmiana strony
   */
  const setPage = (page: number) => {
    setParams(prev => ({
      ...prev,
      page: Math.max(1, Math.min(page, state.pagination.total_pages))
    }));
  };

  /**
   * Ustawienie wyszukiwania
   */
  const setSearch = (search: string) => {
    setParams(prev => ({
      ...prev,
      search,
      page: 1 // Reset do pierwszej strony przy zmianie wyszukiwania
    }));
  };

  /**
   * Ustawienie filtrów
   */
  const setFilter = (filter: Partial<FlashcardFilters>) => {
    setParams(prev => ({
      ...prev,
      ...filter,
      page: 1 // Reset do pierwszej strony przy zmianie filtrów
    }));
  };

  /**
   * Ustawienie sortowania
   */
  const setSort = (sort: SortOptions) => {
    setParams(prev => ({
      ...prev,
      sort_by: sort.field,
      sort_dir: sort.direction,
      page: 1 // Reset do pierwszej strony przy zmianie sortowania
    }));
  };

  // Efekt pobierający dane przy pierwszym renderowaniu oraz zmianie parametrów
  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  return {
    ...state,
    params,
    setPage,
    setSearch,
    setFilter,
    setSort,
    fetchFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard
  };
} 