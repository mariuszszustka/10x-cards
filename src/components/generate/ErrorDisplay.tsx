import React from "react";
import { Button } from "@/components/ui/button";

interface ErrorDto {
  message: string;
  code?: string;
  field?: string;
}

interface ErrorDisplayProps {
  error: ErrorDto | null;
  onClose: () => void;
  onRetry?: () => void;
}

/**
 * Komponent do wyświetlania komunikatów o błędach
 */
export default function ErrorDisplay({ error, onClose, onRetry }: ErrorDisplayProps) {
  if (!error) {
    return null;
  }

  return (
    <div className="rounded-md bg-destructive/20 p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-destructive"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-destructive">
            Błąd
            {error.code && <span className="ml-2 text-xs">({error.code})</span>}
          </h3>
          <div className="mt-2 text-sm text-destructive/90">
            <p>{error.message}</p>
          </div>
          <div className="mt-4 flex gap-3">
            {onRetry && (
              <Button size="sm" variant="outline" onClick={onRetry}>
                Spróbuj ponownie
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={onClose}>
              Zamknij
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
