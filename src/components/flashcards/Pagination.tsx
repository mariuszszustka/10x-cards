import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Komponent paginacji dla listy fiszek
 */
export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Generuj listę stron do wyświetlenia
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    // Jeśli mamy mniej stron niż maksymalnie wyświetlanych, pokaż wszystkie
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Zawsze pokazuj pierwszą i ostatnią stronę
    const alwaysShow = [1, totalPages];

    // Oblicz środkowe strony do pokazania
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Dostosuj, jeśli jesteśmy blisko początku lub końca
    if (currentPage <= 3) {
      endPage = Math.min(totalPages - 1, maxPagesToShow - 1);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - maxPagesToShow + 2);
    }

    // Dodaj środkowe strony
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Połącz i posortuj wszystkie numery stron
    return [...new Set([...alwaysShow, ...pages])].sort((a, b) => a - b);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-1">
      <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Poprzednia
      </Button>

      <div className="flex items-center space-x-1 mx-2">
        {pageNumbers.map((page, index) => {
          // Dodaj elipsis między stronami, jeśli są przerwy
          if (index > 0 && page - pageNumbers[index - 1] > 1) {
            return (
              <React.Fragment key={`ellipsis-${page}`}>
                <span className="px-2 text-muted-foreground">...</span>
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className="min-w-[32px]"
                >
                  {page}
                </Button>
              </React.Fragment>
            );
          }

          return (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className="min-w-[32px]"
            >
              {page}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Następna
      </Button>
    </div>
  );
}
