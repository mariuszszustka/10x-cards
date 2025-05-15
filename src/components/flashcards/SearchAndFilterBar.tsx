import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import type { SearchParams, SortOptions } from "@/lib/hooks/useFlashcards";

export type SourceType = "ai-full" | "ai-edited" | "manual" | undefined;

interface SearchAndFilterBarProps {
  searchValue: string;
  onSearch: (query: string) => void;
  onFilterChange: (filters: Partial<SearchParams>) => void;
  onSortChange: (sort: SortOptions) => void;
  currentSort: SortOptions;
  currentSource?: SourceType;
}

/**
 * Komponent paska wyszukiwania i filtrowania
 */
export default function SearchAndFilterBar({
  searchValue,
  onSearch,
  onFilterChange,
  onSortChange,
  currentSort,
  currentSource,
}: SearchAndFilterBarProps) {
  const [searchInput, setSearchInput] = useState(searchValue);

  /**
   * Obsługa zmiany w polu wyszukiwania
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  /**
   * Obsługa zatwierdzenia wyszukiwania
   */
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  /**
   * Obsługa czyszczenia wyszukiwania
   */
  const handleClearSearch = () => {
    setSearchInput("");
    onSearch("");
  };

  /**
   * Obsługa zmiany filtra źródła
   */
  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFilterChange({
      source: value === "all" ? undefined : (value as SourceType),
    });
  };

  /**
   * Obsługa zmiany sortowania
   */
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, direction] = e.target.value.split("-") as [SortOptions["field"], SortOptions["direction"]];
    onSortChange({ field, direction });
  };

  // Aktualnie wybrane sortowanie jako wartość dla selecta
  const currentSortValue = `${currentSort.field}-${currentSort.direction}`;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Szukaj fiszek..."
            value={searchInput}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded-md pr-10 bg-card text-foreground"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <span className="sr-only">Wyczyść</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
        <Button type="submit">Szukaj</Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-auto">
          <label htmlFor="source-filter" className="block text-sm font-medium mb-1">
            Źródło
          </label>
          <select
            id="source-filter"
            value={currentSource || "all"}
            onChange={handleSourceChange}
            className="w-full p-2 border rounded-md bg-card text-foreground"
          >
            <option value="all">Wszystkie</option>
            <option value="manual">Ręcznie dodane</option>
            <option value="ai-full">AI (bez zmian)</option>
            <option value="ai-edited">AI (edytowane)</option>
          </select>
        </div>

        <div className="w-full sm:w-auto">
          <label htmlFor="sort-select" className="block text-sm font-medium mb-1">
            Sortowanie
          </label>
          <select
            id="sort-select"
            value={currentSortValue}
            onChange={handleSortChange}
            className="w-full p-2 border rounded-md bg-card text-foreground"
          >
            <option value="created_at-desc">Najnowsze</option>
            <option value="created_at-asc">Najstarsze</option>
            <option value="front-asc">Alfabetycznie (A-Z)</option>
            <option value="front-desc">Alfabetycznie (Z-A)</option>
            <option value="updated_at-desc">Ostatnio aktualizowane</option>
          </select>
        </div>
      </div>
    </div>
  );
}
