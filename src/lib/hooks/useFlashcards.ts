import { useCallback } from "react";
import { useCrudOperations } from "./useCrudOperations";
import type { FlashcardDTO } from "@/types";

export interface SearchParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
  search?: string;
  source?: string;
  category?: string;
  created_after?: string;
  created_before?: string;
}

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

interface FlashcardFormData {
  front: string;
  back: string;
  source?: string;
}

export default function useFlashcards(defaultParams: SearchParams = {}) {
  const {
    items: flashcards,
    loading,
    error,
    pagination,
    params,
    fetchItems: fetchFlashcards,
    createItem,
    updateItem,
    deleteItem,
    setPage,
    setSearch,
    setFilter,
    setSort,
  } = useCrudOperations<FlashcardDTO, FlashcardFormData, FlashcardFormData>({
    fetchEndpoint: "/api/flashcards",
    createEndpoint: "/api/flashcards",
    updateEndpoint: "/api/flashcards",
    deleteEndpoint: "/api/flashcards",
    defaultQueryParams: {
      page: 1,
      per_page: 20,
      sort_by: "created_at",
      sort_dir: "desc",
      ...defaultParams,
    },
    getItemId: (flashcard) => flashcard.id,
  });

  // Tworzenie fiszki
  const createFlashcard = useCallback(
    async (data: FlashcardFormData) => {
      return await createItem(data);
    },
    [createItem]
  );

  // Aktualizacja fiszki
  const updateFlashcard = useCallback(
    async (id: number, data: { front: string; back: string }) => {
      return await updateItem(id, data);
    },
    [updateItem]
  );

  // Usuwanie fiszki
  const deleteFlashcard = useCallback(
    async (id: number) => {
      return await deleteItem(id);
    },
    [deleteItem]
  );

  return {
    flashcards,
    loading,
    error,
    pagination,
    params,
    fetchFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    setPage,
    setSearch,
    setFilter,
    setSort,
  };
}
