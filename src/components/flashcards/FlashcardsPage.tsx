import { useState, useEffect } from "react";
import useFlashcards from "@/lib/hooks/useFlashcards";
import type { SearchParams, SortOptions } from "@/lib/hooks/useFlashcards";
import useToast from "@/lib/hooks/useToast";
import useModal from "@/lib/hooks/useModal";
import Header from "./Header";
import SearchAndFilterBar from "./SearchAndFilterBar";
import type { SourceType } from "./SearchAndFilterBar";
import FlashcardGrid from "./FlashcardGrid";
import Pagination from "./Pagination";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import ToastNotifications from "./ToastNotifications";
import FlashcardForm from "./FlashcardForm";
import type { FlashcardFormData } from "@/lib/hooks/useFlashcardForm";
import type { FlashcardDTO } from "@/types";

// Domyślne parametry wyszukiwania
const defaultSearchParams: SearchParams = {
  page: 1,
  per_page: 20,
  sort_by: "created_at",
  sort_dir: "desc",
};

/**
 * Komponent prezentacyjny dla widoku fiszek
 */
interface FlashcardsViewProps {
  flashcards: FlashcardDTO[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    total_pages: number;
  };
  params: SearchParams;
  editingCardId: number | null;
  isFormOpen: boolean;
  isSubmitting: boolean;
  onAddClick: () => void;
  onEditCard: (id: number) => void;
  onCancelEdit: () => void;
  onDeleteCard: (id: number, front: string) => void;
  onUpdateFlashcard: (id: number, data: { front: string; back: string }) => void;
  onSearchChange: (query: string) => void;
  onFilterChange: (filters: Partial<SearchParams>) => void;
  onSortChange: (sortOptions: SortOptions) => void;
  onPageChange: (page: number) => void;
  onSaveNewCard: (data: FlashcardFormData) => void;
  onCancelForm: () => void;
  onRetry: () => void;
}

function FlashcardsView({
  flashcards,
  loading,
  error,
  pagination,
  params,
  editingCardId,
  isFormOpen,
  isSubmitting,
  onAddClick,
  onEditCard,
  onCancelEdit,
  onDeleteCard,
  onUpdateFlashcard,
  onSearchChange,
  onFilterChange,
  onSortChange,
  onPageChange,
  onSaveNewCard,
  onCancelForm,
  onRetry,
}: FlashcardsViewProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Header onAddClick={onAddClick} />

      <div className="mb-6">
        <SearchAndFilterBar
          searchValue={params.search || ""}
          onSearch={onSearchChange}
          onFilterChange={onFilterChange}
          onSortChange={onSortChange}
          currentSort={{
            field: params.sort_by || "created_at",
            direction: params.sort_dir || "desc",
          }}
          currentSource={params.source as SourceType}
        />
      </div>

      {/* Wyświetlanie błędu */}
      {error && (
        <div className="bg-destructive/20 p-4 rounded-md mb-6">
          <p className="text-destructive">{error}</p>
          <button onClick={onRetry} className="mt-2 text-sm underline text-primary">
            Spróbuj ponownie
          </button>
        </div>
      )}

      <FlashcardGrid
        flashcards={flashcards}
        onEdit={onEditCard}
        onDelete={onDeleteCard}
        onUpdate={onUpdateFlashcard}
        onCancelEdit={onCancelEdit}
        editingCardId={editingCardId}
        isLoading={loading}
      />

      {pagination.total_pages > 1 && (
        <div className="mt-6">
          <Pagination currentPage={pagination.page} totalPages={pagination.total_pages} onPageChange={onPageChange} />
        </div>
      )}

      {/* Modal dodawania nowej fiszki */}
      {isFormOpen && <FlashcardForm onSubmit={onSaveNewCard} onCancel={onCancelForm} isSubmitting={isSubmitting} />}
    </div>
  );
}

/**
 * Główny kontener widoku fiszek
 */
export default function FlashcardsPage() {
  // Stan dla edytowanej fiszki
  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  // Stan dla formularza tworzenia nowej fiszki
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Niestandardowe hooki do zarządzania stanem
  const {
    flashcards,
    loading,
    error,
    pagination,
    params,
    setPage,
    setSearch,
    setFilter,
    setSort,
    fetchFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
  } = useFlashcards(defaultSearchParams);

  const { toasts, success, error: showError, removeToast } = useToast();
  const { isOpen, flashcardId, flashcardFront, openModal, closeModal } = useModal();

  // Pobierz fiszki przy pierwszym renderowaniu
  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  /**
   * Obsługa dodawania nowej fiszki
   */
  const handleAddCard = () => {
    setIsFormOpen(true);
  };

  /**
   * Obsługa anulowania dodawania nowej fiszki
   */
  const handleCancelForm = () => {
    setIsFormOpen(false);
  };

  /**
   * Obsługa zapisywania nowej fiszki
   */
  const handleSaveNewCard = async (data: FlashcardFormData) => {
    setIsSubmitting(true);

    try {
      await createFlashcard(data);
      success("Fiszka została pomyślnie utworzona.");
      setIsFormOpen(false);
      // Odśwież listę fiszek po dodaniu nowej
      fetchFlashcards();
    } catch (error) {
      showError("Nie udało się utworzyć fiszki. Spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Obsługa zatwierdzenia usunięcia fiszki
   */
  const handleDeleteConfirm = async () => {
    try {
      if (flashcardId !== null) {
        await deleteFlashcard(flashcardId);
        success("Fiszka została pomyślnie usunięta.");
        closeModal();
      }
    } catch (error) {
      showError("Nie udało się usunąć fiszki. Spróbuj ponownie.");
    }
  };

  /**
   * Obsługa aktualizacji fiszki
   */
  const handleUpdateFlashcard = async (id: number, data: { front: string; back: string }) => {
    try {
      await updateFlashcard(id, data);
      success("Fiszka została pomyślnie zaktualizowana.");
      setEditingCardId(null);
    } catch (error) {
      showError("Nie udało się zaktualizować fiszki. Spróbuj ponownie.");
    }
  };

  /**
   * Obsługa edycji fiszki
   */
  const handleEditCard = (id: number) => {
    setEditingCardId(id);
  };

  /**
   * Obsługa anulowania edycji
   */
  const handleCancelEdit = () => {
    setEditingCardId(null);
  };

  /**
   * Obsługa zmiany sortowania
   */
  const handleSortChange = (sortOptions: SortOptions) => {
    setSort(sortOptions);
  };

  /**
   * Obsługuje zmianę filtrów
   */
  const handleFilterChange = (filters: Partial<SearchParams>) => {
    setFilter(filters);
  };

  /**
   * Obsługuje wyszukiwanie
   */
  const handleSearch = (query: string) => {
    setSearch(query);
  };

  /**
   * Obsługuje próbę usunięcia fiszki (otwarcie modala)
   */
  const handleDeleteCard = (id: number, front: string) => {
    openModal(id, front);
  };

  /**
   * Ponowne pobranie danych przy błędach
   */
  const handleRetry = () => {
    fetchFlashcards();
  };

  return (
    <>
      <FlashcardsView
        flashcards={flashcards}
        loading={loading}
        error={error}
        pagination={pagination}
        params={params}
        editingCardId={editingCardId}
        isFormOpen={isFormOpen}
        isSubmitting={isSubmitting}
        onAddClick={handleAddCard}
        onEditCard={handleEditCard}
        onCancelEdit={handleCancelEdit}
        onDeleteCard={handleDeleteCard}
        onUpdateFlashcard={handleUpdateFlashcard}
        onSearchChange={handleSearch}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onPageChange={setPage}
        onSaveNewCard={handleSaveNewCard}
        onCancelForm={handleCancelForm}
        onRetry={handleRetry}
      />

      {/* Modal potwierdzenia usunięcia */}
      <DeleteConfirmationModal
        isOpen={isOpen}
        flashcardId={flashcardId}
        flashcardFront={flashcardFront}
        onConfirm={handleDeleteConfirm}
        onCancel={closeModal}
      />

      <ToastNotifications toasts={toasts} removeToast={removeToast} />
    </>
  );
}
